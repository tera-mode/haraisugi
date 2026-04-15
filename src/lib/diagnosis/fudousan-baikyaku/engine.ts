import type { RealEstateInput, RealEstateResult, SpecialDeduction } from './types';
import { REAL_ESTATE_TIPS } from './data';

/**
 * 所有期間の判定: 取得から売却年の1月1日時点で5年超かどうか
 * 入力は所有年数（年）で簡易判定
 */
function isLongTermOwnership(years: number): boolean {
  return years > 5;
}

/**
 * 譲渡所得の計算
 * 譲渡所得 = 売却価格 - (取得費 + 譲渡費用)
 */
function calcTransferIncome(
  salePrice: number,
  acquisitionCost: number,
  saleExpenses: number,
): number {
  return salePrice - acquisitionCost - saleExpenses;
}

/**
 * 税率（長期/短期）
 * 長期: 20.315% (所得税15.315% + 住民税5%)
 * 短期: 39.63% (所得税30.63% + 住民税9%)
 */
function getTaxRate(isLongTerm: boolean): number {
  return isLongTerm ? 0.20315 : 0.3963;
}

export function runFudousanShindan(input: RealEstateInput): RealEstateResult {
  const {
    propertyType,
    salePrice,
    acquisitionCost,
    acquisitionCostUnknown,
    saleExpenses,
    ownershipYears,
    residencyStatus,
    inheritedWithinYear,
  } = input;

  // 取得費の確定（不明の場合は概算取得費：売却価格×5%）
  const estimatedCost = Math.round(salePrice * 0.05);
  const usedEstimatedCost = acquisitionCostUnknown || acquisitionCost === 0;
  const effectiveAcquisitionCost = usedEstimatedCost
    ? estimatedCost
    : acquisitionCost;

  // 譲渡所得
  const transferIncome = calcTransferIncome(salePrice, effectiveAcquisitionCost, saleExpenses);

  // 長期/短期の判定
  const isLongTerm = isLongTermOwnership(ownershipYears);
  const taxRate = getTaxRate(isLongTerm);

  // 特別控除の判定
  const deductions: SpecialDeduction[] = [];

  // 1. 居住用財産の3,000万円特別控除
  const canUse3000 =
    (propertyType === 'my_home') &&
    (residencyStatus === 'living' || residencyStatus === 'moved_out_within_3years');
  deductions.push({
    id: 'special_3000man',
    name: '居住用財産の3,000万円特別控除',
    amount: 3000,
    applicable: canUse3000,
    reason: canUse3000
      ? '居住用財産で居住中または転居後3年以内の売却'
      : propertyType !== 'my_home'
      ? '居住用財産ではないため対象外'
      : '転居後3年を超えているため原則対象外',
  });

  // 2. 10年超所有の軽減税率特例（6,000万円以下の部分: 14.21%）
  const canUseLowRate =
    ownershipYears > 10 && canUse3000;
  deductions.push({
    id: 'low_tax_rate',
    name: '10年超所有の軽減税率特例（6,000万円以下: 14.21%）',
    amount: 0, // 税率軽減なので金額は別途計算
    applicable: canUseLowRate,
    reason: canUseLowRate
      ? '10年超の居住用財産で3,000万円控除と併用可'
      : ownershipYears <= 10
      ? '所有期間が10年以下のため対象外'
      : '居住用財産の3,000万円控除の適用条件を満たしていないため対象外',
  });

  // 3. 相続不動産の取得費加算の特例
  const canUseInheritedCost =
    propertyType === 'inherited' && inheritedWithinYear;
  deductions.push({
    id: 'inherited_cost_addition',
    name: '相続不動産の取得費加算の特例',
    amount: 0,
    applicable: canUseInheritedCost,
    reason: canUseInheritedCost
      ? '相続開始後3年10ヶ月以内の売却で支払い相続税の一部を取得費に加算可'
      : propertyType !== 'inherited'
      ? '相続不動産ではないため対象外'
      : '相続後3年10ヶ月を超えているため対象外',
  });

  // 税額計算
  const taxBeforeDeduction = transferIncome > 0
    ? Math.round(transferIncome * taxRate)
    : 0;

  let taxAfterDeduction = taxBeforeDeduction;
  if (transferIncome > 0 && canUse3000) {
    const taxableAfter3000 = Math.max(0, transferIncome - 3000);
    if (canUseLowRate) {
      // 10年超軽減税率: 6,000万円以下14.21%、超過分20.315%
      const under6000 = Math.min(taxableAfter3000, 6000);
      const over6000 = Math.max(0, taxableAfter3000 - 6000);
      taxAfterDeduction = Math.round(under6000 * 0.1421 + over6000 * 0.20315);
    } else {
      taxAfterDeduction = Math.round(taxableAfter3000 * taxRate);
    }
  }

  // 損益通算の可否
  const canCarryLoss =
    transferIncome < 0 &&
    (propertyType === 'my_home') &&
    (residencyStatus === 'living' || residencyStatus === 'moved_out_within_3years');

  // 警告
  const warnings: string[] = [];
  if (usedEstimatedCost && !acquisitionCostUnknown) {
    warnings.push('取得費が0円で入力されたため、概算取得費（売却価格×5%）を使用しています。実際の取得費が判明している場合は入力してください。');
  }
  if (canUse3000 && transferIncome > 3000) {
    warnings.push('3,000万円控除適用後も課税譲渡所得が残ります。税理士への相談を検討してください。');
  }
  if (propertyType === 'inherited' && !inheritedWithinYear) {
    warnings.push('相続後3年10ヶ月を超えているため「取得費加算の特例」は使えませんが、被相続人の取得費を引き継ぎます。確認してください。');
  }
  if (!isLongTerm) {
    warnings.push('所有期間5年以下のため短期譲渡として税率が約2倍（39.63%）になります。可能であれば5年超になってから売却することをご検討ください。');
  }

  // 適切なtipsを選択
  const tips = REAL_ESTATE_TIPS.filter(t => {
    if (t.id === 'special_3000man') return canUse3000;
    if (t.id === 'long_term_rate') return true;
    if (t.id === 'acquisition_cost') return usedEstimatedCost;
    if (t.id === 'inherited_property') return propertyType === 'inherited';
    if (t.id === 'loss_deduction') return transferIncome < 0 && propertyType === 'my_home';
    return true;
  });

  return {
    transferIncome,
    effectiveAcquisitionCost,
    usedEstimatedCost,
    isLongTerm,
    taxRate,
    taxBeforeDeduction,
    taxAfterDeduction,
    deductions,
    canCarryLoss,
    tips,
    warnings,
  };
}
