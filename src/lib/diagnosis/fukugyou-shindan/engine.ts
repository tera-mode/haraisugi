import type {
  SideJobInput,
  SideJobResult,
  IncomeCategory,
  FilingType,
} from './types';
import { SIDE_JOB_TIPS } from './data';

// 給与所得控除（2025年〜）
function calcSalaryDeduction(income: number): number {
  if (income <= 162.5) return 55;
  if (income <= 180)   return income * 0.4 - 10;
  if (income <= 360)   return income * 0.3 + 8;
  if (income <= 660)   return income * 0.2 + 44;
  if (income <= 850)   return income * 0.1 + 110;
  return 195;
}

// 課税所得を算出（本業のみ）
function calcTaxableIncome(income: number): number {
  const salaryDeduction = calcSalaryDeduction(income);
  const socialInsurance = income * 0.15;
  const basicDeduction = 48;
  const taxable = income - salaryDeduction - socialInsurance - basicDeduction;
  return Math.max(0, taxable);
}

// 限界税率（所得税）
function getMarginalRate(taxableIncome: number): number {
  if (taxableIncome <= 195)  return 0.05;
  if (taxableIncome <= 330)  return 0.10;
  if (taxableIncome <= 695)  return 0.20;
  if (taxableIncome <= 900)  return 0.23;
  if (taxableIncome <= 1800) return 0.33;
  if (taxableIncome <= 4000) return 0.40;
  return 0.45;
}

// 事業所得 vs 雑所得の判定
function determineIncomeCategory(
  revenue: number,
  hasBookkeeping: boolean,
  isContinuous: boolean,
  hasOpeningNotification: boolean,
  sideJobType: string,
): IncomeCategory {
  // 株式・暗号資産は特殊ルール
  if (sideJobType === 'stocks' || sideJobType === 'crypto') {
    return 'miscellaneous';
  }

  // 不動産賃貸は特殊ルール（不動産所得）→ 雑所得として近似
  if (sideJobType === 'rental_income') {
    return 'miscellaneous';
  }

  // 2022年国税庁改正: 収入300万円超 + 帳簿 → 事業所得
  if (revenue >= 300 && hasBookkeeping && isContinuous) {
    return 'business';
  }

  // 収入300万円以下でも、開業届 + 帳簿 + 継続性があれば事業所得として認められる可能性
  if (hasOpeningNotification && hasBookkeeping && isContinuous) {
    return 'business';
  }

  // 帳簿あり + 継続的 → 判断が分かれる
  if (hasBookkeeping && isContinuous) {
    return 'unclear';
  }

  return 'miscellaneous';
}

// 推奨申告方法の決定
function determineFilingType(
  netIncome: number,
  incomeCategory: IncomeCategory,
  hasBookkeeping: boolean,
  hasOpeningNotification: boolean,
): FilingType {
  if (netIncome <= 0 && incomeCategory !== 'business') return 'not_needed';
  if (netIncome <= 20 && incomeCategory === 'miscellaneous') return 'not_needed';

  if (incomeCategory === 'business' || incomeCategory === 'unclear') {
    if (hasBookkeeping && hasOpeningNotification) return 'blue_65';
    if (hasBookkeeping) return 'blue_10';
    return 'white';
  }

  return 'white';
}

// 副業の追加税額を推定（万円）
function calcEstimatedTax(netIncome: number, mainTaxableIncome: number): number {
  if (netIncome <= 0) return 0;
  const marginalRate = getMarginalRate(mainTaxableIncome);
  const incomeTax = netIncome * marginalRate * 1.021; // 復興特別所得税込み
  const residentTax = netIncome * 0.10;
  return Math.round((incomeTax + residentTax) * 10) / 10;
}

// 損益通算による還付額（万円）
function calcLossOffsetRefund(netIncome: number, mainTaxableIncome: number): number {
  if (netIncome >= 0) return 0;
  const marginalRate = getMarginalRate(mainTaxableIncome);
  const refund = Math.abs(netIncome) * (marginalRate + 0.10);
  return Math.round(refund * 10) / 10;
}

export function runFukugyouShindan(input: SideJobInput): SideJobResult {
  const {
    mainJobIncome,
    sideJobType,
    sideJobRevenue,
    sideJobExpenses,
    hasBookkeeping,
    isContinuous,
    hasOpeningNotification,
  } = input;

  const netIncome = sideJobRevenue - sideJobExpenses;
  const mainTaxableIncome = calcTaxableIncome(mainJobIncome);

  const incomeCategory = determineIncomeCategory(
    sideJobRevenue,
    hasBookkeeping,
    isContinuous,
    hasOpeningNotification,
    sideJobType,
  );

  const canLossOffset = incomeCategory === 'business' && netIncome < 0;
  const recommendedFiling = determineFilingType(netIncome, incomeCategory, hasBookkeeping, hasOpeningNotification);

  // 確定申告の要否（所得税）
  const isSpecialType = sideJobType === 'stocks' || sideJobType === 'crypto';
  const needsTaxReturn =
    isSpecialType ||                         // 株式・暗号資産は金額に関わらず申告要
    netIncome > 20 ||                        // 20万円超
    canLossOffset ||                          // 損益通算したい場合
    recommendedFiling === 'blue_65' || recommendedFiling === 'blue_10'; // 青色申告する場合

  // 住民税は1円でも所得があれば申告義務
  const needsResidentTaxReturn = netIncome > 0 || isSpecialType;

  const estimatedTax = needsTaxReturn && netIncome > 0
    ? calcEstimatedTax(netIncome, mainTaxableIncome)
    : 0;

  const estimatedRefund = canLossOffset
    ? calcLossOffsetRefund(netIncome, mainTaxableIncome)
    : 0;

  // 推奨事項
  const recommendations: string[] = [];
  if (!needsTaxReturn) {
    recommendations.push('所得税の確定申告は不要ですが、住民税の申告は市区町村で必要です。');
  }
  if (incomeCategory === 'business' || incomeCategory === 'unclear') {
    if (!hasOpeningNotification) {
      recommendations.push('開業届を税務署に提出すると青色申告が使えるようになります（費用0円・15分で手続き完了）。');
    }
    if (!hasBookkeeping) {
      recommendations.push('会計ソフト（freee・マネーフォワード）で帳簿をつけると青色申告特別控除（最大65万円）が適用できます。');
    }
    if (hasOpeningNotification && hasBookkeeping) {
      recommendations.push('青色申告65万円控除を適用するには複式簿記＋e-Taxでの申告が必要です。');
    }
  }
  if (netIncome > 20 && recommendedFiling !== 'blue_65') {
    recommendations.push('副業収入が20万円を超えているため確定申告が必要です。期限（翌年3月15日）までに申告してください。');
  }
  if (!hasBookkeeping && netIncome > 0) {
    recommendations.push('領収書・経費の記録を始めると、来年から経費計上で課税所得を減らせます。');
  }

  // リスク
  const risks: string[] = [];
  if (!needsTaxReturn && isSpecialType) {
    risks.push('株式・暗号資産は特定口座（源泉徴収なし）や一般口座の場合、少額でも申告が必要なことがあります。証券会社のレポートを確認してください。');
  }
  if (needsTaxReturn && netIncome > 0) {
    risks.push(`確定申告をしないと、税務調査で追徴課税（税額の${netIncome > 50 ? '35' : '15'}%）と延滞税が発生するリスクがあります。`);
  }
  if (needsResidentTaxReturn && !needsTaxReturn) {
    risks.push('住民税の申告を怠ると、市区町村から調査が入る場合があります。お住まいの市区町村窓口で申告してください。');
  }

  // 適切なtipsを選出
  const selectedTips = SIDE_JOB_TIPS.filter(tip => {
    if (tip.id === 'twenty_man_resident_tax') return netIncome <= 20 && netIncome > 0;
    if (tip.id === 'business_vs_misc') return incomeCategory !== 'miscellaneous';
    if (tip.id === 'blue_return_65') return incomeCategory === 'business' || incomeCategory === 'unclear';
    if (tip.id === 'resident_tax_ordinary') return needsTaxReturn && netIncome > 0;
    if (tip.id === 'expense_recording') return netIncome > 0 && sideJobExpenses < sideJobRevenue * 0.3;
    if (tip.id === 'stocks_crypto_special') return isSpecialType;
    return false;
  });

  return {
    needsTaxReturn,
    needsResidentTaxReturn,
    incomeCategory,
    recommendedFiling,
    netIncome,
    estimatedTax,
    estimatedRefund,
    canLossOffset,
    recommendations,
    risks,
    tips: selectedTips,
  };
}
