import type { InheritanceInput, InheritanceResult, Exemption } from './types';
import { INHERITANCE_TIPS, INHERITANCE_TAX_BRACKETS } from './data';

// 1人あたりの相続税額計算（法定相続分に基づく速算表）
function calcTaxForAmount(amount: number): number {
  for (const bracket of INHERITANCE_TAX_BRACKETS) {
    if (amount <= bracket.limit) {
      return Math.max(0, amount * bracket.rate - bracket.deduction);
    }
  }
  return 0;
}

// 法定相続分の計算
function getLegalShares(hasSpouse: boolean, numChildren: number): { spouse: number; child: number } {
  if (!hasSpouse) {
    return { spouse: 0, child: numChildren > 0 ? 1 / numChildren : 1 };
  }
  if (numChildren === 0) {
    return { spouse: 1, child: 0 };
  }
  return {
    spouse: 0.5,
    child: 0.5 / numChildren,
  };
}

export function runSouzokuShindan(input: InheritanceInput): InheritanceResult {
  const {
    totalAssets,
    realEstateValue,
    hasSpouse,
    numChildren,
    hasLiveInHeir,
    lifeInsuranceAmount,
    priorGifts,
  } = input;

  // 法定相続人数
  const legalHeirs = (hasSpouse ? 1 : 0) + numChildren;
  const heirsForCalc = Math.max(legalHeirs, 1);

  // 生命保険非課税枠
  const lifeInsuranceExemption = Math.min(
    lifeInsuranceAmount,
    500 * heirsForCalc,
  );

  // 小規模宅地特例（居住用330㎡・80%減額を最大適用）
  // 不動産評価額の最大80%まで減額（簡易計算）
  const smallScaleLandApplicable = hasLiveInHeir && realEstateValue > 0;
  const smallScaleLandReduction = smallScaleLandApplicable
    ? Math.round(Math.min(realEstateValue, realEstateValue) * 0.8) // 330㎡の面積制限は無視して概算
    : 0;

  // 基礎控除
  const basicDeduction = 3000 + 600 * heirsForCalc;

  // 課税対象財産（非課税控除後）
  const taxableAssets = Math.max(
    0,
    totalAssets
      - lifeInsuranceExemption               // 生命保険非課税枠
      - smallScaleLandReduction              // 小規模宅地特例
      + Math.max(0, priorGifts - 110 * 7),  // 7年内贈与持ち戻し（110万×7年=770万超の分）
  );

  // 課税遺産総額
  const taxableInheritance = Math.max(0, taxableAssets - basicDeduction);

  // 相続税が発生しない場合
  if (taxableInheritance <= 0) {
    const exemptions = buildExemptions(hasSpouse, smallScaleLandApplicable, smallScaleLandReduction, lifeInsuranceExemption, heirsForCalc);
    return {
      totalAssets,
      legalHeirs: heirsForCalc,
      basicDeduction,
      lifeInsuranceExemption,
      taxableAssets,
      taxableInheritance: 0,
      estimatedTax: 0,
      spouseReduction: 0,
      smallScaleLandReduction,
      exemptions,
      tips: INHERITANCE_TIPS.filter(t => t.id !== 'consult_specialist'),
      warnings: [],
      isSubjectToTax: false,
    };
  }

  // 法定相続分に応じた各人の税額計算
  const shares = getLegalShares(hasSpouse, numChildren);
  let totalTax = 0;

  if (hasSpouse) {
    const spouseShare = taxableInheritance * shares.spouse;
    totalTax += calcTaxForAmount(spouseShare);
  }
  for (let i = 0; i < numChildren; i++) {
    const childShare = taxableInheritance * shares.child;
    totalTax += calcTaxForAmount(childShare);
  }
  if (!hasSpouse && numChildren === 0) {
    totalTax = calcTaxForAmount(taxableInheritance);
  }

  // 配偶者の税額軽減（配偶者分の税額を除く）
  let spouseReduction = 0;
  if (hasSpouse) {
    // 配偶者が法定相続分または1億6,000万円まで無税
    const spouseShare = taxableInheritance * shares.spouse;
    const spouseMaxExempt = Math.max(16000, spouseShare);
    if (spouseShare <= spouseMaxExempt) {
      // 配偶者の税額は0（法定相続分以下）
      spouseReduction = calcTaxForAmount(spouseShare);
    }
  }

  const estimatedTax = Math.max(0, Math.round(totalTax - spouseReduction));

  const exemptions = buildExemptions(hasSpouse, smallScaleLandApplicable, smallScaleLandReduction, lifeInsuranceExemption, heirsForCalc);

  // 警告
  const warnings: string[] = [];
  if (hasSpouse) {
    warnings.push('配偶者が先に亡くなった場合の二次相続では配偶者控除が使えないため、分割方法の検討が重要です。');
  }
  if (priorGifts > 0) {
    warnings.push('2024年改正により、相続開始前7年以内の贈与は相続財産に持ち戻されます。贈与の時期によっては相続税の計算に影響します。');
  }
  if (estimatedTax > 500) {
    warnings.push('推定相続税額が500万円を超えています。相続専門の税理士に早めにご相談ください（申告期限は相続開始後10ヶ月以内）。');
  }

  // tips選出
  const selectedTips = INHERITANCE_TIPS.filter(tip => {
    if (tip.id === 'life_insurance_exemption') return lifeInsuranceAmount < 500 * heirsForCalc;
    if (tip.id === 'small_scale_land') return realEstateValue > 0 && !smallScaleLandApplicable;
    if (tip.id === 'annual_gift') return true;
    if (tip.id === 'spouse_deduction') return hasSpouse;
    if (tip.id === 'consult_specialist') return estimatedTax > 200;
    return false;
  });

  return {
    totalAssets,
    legalHeirs: heirsForCalc,
    basicDeduction,
    lifeInsuranceExemption,
    taxableAssets,
    taxableInheritance,
    estimatedTax,
    spouseReduction,
    smallScaleLandReduction,
    exemptions,
    tips: selectedTips,
    warnings,
    isSubjectToTax: true,
  };
}

function buildExemptions(
  hasSpouse: boolean,
  smallScaleLandApplicable: boolean,
  smallScaleLandReduction: number,
  lifeInsuranceExemption: number,
  heirsForCalc: number,
): Exemption[] {
  return [
    {
      name: '配偶者の税額軽減',
      description: '配偶者が取得する財産が1億6,000万円以下または法定相続分以下なら相続税が0円',
      reductionAmount: 0,
      condition: '配偶者がいる場合',
      applicable: hasSpouse,
    },
    {
      name: '小規模宅地等の特例',
      description: `居住用土地（330㎡以内）の評価額を80%減額。軽減額: 約${smallScaleLandReduction}万円`,
      reductionAmount: smallScaleLandReduction,
      condition: '同居の相続人が居住用不動産を引き継ぐ場合',
      applicable: smallScaleLandApplicable,
    },
    {
      name: '生命保険金の非課税枠',
      description: `500万円×法定相続人数（${heirsForCalc}人）= ${500 * heirsForCalc}万円が非課税。軽減額: ${lifeInsuranceExemption}万円`,
      reductionAmount: lifeInsuranceExemption,
      condition: '相続人が受け取る死亡保険金がある場合',
      applicable: lifeInsuranceExemption > 0,
    },
  ];
}
