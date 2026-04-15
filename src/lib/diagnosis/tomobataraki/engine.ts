import type {
  DualIncomeInput,
  DualIncomeResult,
  ChildAge,
  ParentSide,
  Recommendation,
  UnusedDeduction,
  DualIncomeTip,
} from './types';
import { DUAL_INCOME_TIPS } from './data';

// ---- 給与所得控除（万円） ----
function calcSalaryDeduction(income: number): number {
  if (income <= 162.5) return 55;
  if (income <= 180)   return income * 0.4 - 10;
  if (income <= 360)   return income * 0.3 + 8;
  if (income <= 660)   return income * 0.2 + 44;
  if (income <= 850)   return income * 0.1 + 110;
  return 195;
}

// ---- 概算課税所得（万円） ----
function calcTaxableIncome(income: number): number {
  const gross = Math.max(0, income - calcSalaryDeduction(income));
  const social = income * 0.15;
  const basic = 48;
  return Math.max(0, gross - social - basic);
}

// ---- 限界税率 ----
function getTaxRate(taxableIncome: number): number {
  if (taxableIncome <= 195)  return 0.05;
  if (taxableIncome <= 330)  return 0.10;
  if (taxableIncome <= 695)  return 0.20;
  if (taxableIncome <= 900)  return 0.23;
  if (taxableIncome <= 1800) return 0.33;
  if (taxableIncome <= 4000) return 0.40;
  return 0.45;
}

// ---- 扶養控除額（所得税・万円） ----
function getChildDeductionIT(age: ChildAge): number {
  switch (age) {
    case 'under16': return 0;
    case '16to18':  return 38;
    case '19to22':  return 63; // 特定扶養控除
    case '23plus':  return 38;
  }
}

// ---- 扶養控除額（住民税・万円） ----
function getChildDeductionRT(age: ChildAge): number {
  switch (age) {
    case 'under16': return 0;
    case '16to18':  return 33;
    case '19to22':  return 45;
    case '23plus':  return 33;
  }
}

// ---- 老人扶養控除額（所得税・万円） ----
function getElderlyDeductionIT(livingTogether: boolean): number {
  return livingTogether ? 58 : 48; // 同居老親等 or 老人扶養
}

// ---- 老人扶養控除額（住民税・万円） ----
function getElderlyDeductionRT(livingTogether: boolean): number {
  return livingTogether ? 45 : 38;
}

// ---- 扶養1件あたりの節税額（円） ----
function calcDependentSaving(deductionIT: number, deductionRT: number, taxRate: number): number {
  return Math.round(deductionIT * 10000 * taxRate + deductionRT * 10000 * 0.10);
}

// ---- 保険料控除1枠あたりの節税額（円） ----
function calcInsuranceSaving(taxRate: number): number {
  // 新制度: 所得税控除額上限4万円、住民税控除額上限2.8万円
  return Math.round(40000 * taxRate + 28000 * 0.10);
}

const SIDE_LABEL: Record<ParentSide, string> = {
  husband: '夫',
  wife: '妻',
  none: '未申告',
};

const CHILD_AGE_LABEL: Record<ChildAge, string> = {
  under16: '16歳未満',
  '16to18': '16〜18歳',
  '19to22': '19〜22歳（大学生等）',
  '23plus': '23歳以上',
};

// ---- メインエンジン ----
export function runTomobataraki(input: DualIncomeInput): DualIncomeResult {
  const hTaxable = calcTaxableIncome(input.husbandIncome);
  const wTaxable = calcTaxableIncome(input.wifeIncome);
  const hTaxRate = getTaxRate(hTaxable);
  const wTaxRate = getTaxRate(wTaxable);

  const recommendations: Recommendation[] = [];
  let totalSavings = 0;

  // ---- 子どもの扶養控除最適化 ----
  input.children.forEach((child, i) => {
    const deductionIT = getChildDeductionIT(child.age);
    const deductionRT = getChildDeductionRT(child.age);

    if (deductionIT === 0 && deductionRT === 0) return; // under16 はスキップ（所得税なし）

    const hSaving = calcDependentSaving(deductionIT, deductionRT, hTaxRate);
    const wSaving = calcDependentSaving(deductionIT, deductionRT, wTaxRate);
    const optimalSide: ParentSide = hSaving >= wSaving ? 'husband' : 'wife';

    if (child.currentParent === 'none') {
      // 未申告 → 有利な方に追加
      const saving = Math.max(hSaving, wSaving);
      recommendations.push({
        item: `子ども${i + 1}（${CHILD_AGE_LABEL[child.age]}）の扶養控除`,
        current: '未申告',
        optimal: SIDE_LABEL[optimalSide],
        effect: saving,
        reason: `${SIDE_LABEL[optimalSide]}側（税率${(optimalSide === 'husband' ? hTaxRate : wTaxRate) * 100}%）に申告すると年間約${(saving / 10000).toFixed(1)}万円の節税`,
      });
      totalSavings += saving;
    } else if (child.currentParent !== optimalSide) {
      const currentSaving = calcDependentSaving(deductionIT, deductionRT,
        child.currentParent === 'husband' ? hTaxRate : wTaxRate);
      const saving = Math.max(hSaving, wSaving) - currentSaving;
      if (saving > 0) {
        recommendations.push({
          item: `子ども${i + 1}（${CHILD_AGE_LABEL[child.age]}）の扶養控除`,
          current: SIDE_LABEL[child.currentParent],
          optimal: SIDE_LABEL[optimalSide],
          effect: saving,
          reason: `${SIDE_LABEL[optimalSide]}側（税率${(optimalSide === 'husband' ? hTaxRate : wTaxRate) * 100}%）に移すと年間約${(saving / 10000).toFixed(1)}万円追加節税`,
        });
        totalSavings += saving;
      }
    }
  });

  // ---- 高齢の親の扶養控除最適化 ----
  if (input.elderlyParent) {
    const deductionIT = getElderlyDeductionIT(input.elderlyParent.livingTogether);
    const deductionRT = getElderlyDeductionRT(input.elderlyParent.livingTogether);
    const hSaving = calcDependentSaving(deductionIT, deductionRT, hTaxRate);
    const wSaving = calcDependentSaving(deductionIT, deductionRT, wTaxRate);
    const optimalSide: ParentSide = hSaving >= wSaving ? 'husband' : 'wife';

    if (input.elderlyParent.currentParent === 'none') {
      const saving = Math.max(hSaving, wSaving);
      recommendations.push({
        item: `高齢の親の扶養控除（${input.elderlyParent.livingTogether ? '同居老親等58万円' : '老人扶養48万円'}）`,
        current: '未申告',
        optimal: SIDE_LABEL[optimalSide],
        effect: saving,
        reason: `${SIDE_LABEL[optimalSide]}側に申告すると年間約${(saving / 10000).toFixed(1)}万円の節税`,
      });
      totalSavings += saving;
    } else if (input.elderlyParent.currentParent !== optimalSide) {
      const currentSaving = calcDependentSaving(deductionIT, deductionRT,
        input.elderlyParent.currentParent === 'husband' ? hTaxRate : wTaxRate);
      const saving = Math.max(hSaving, wSaving) - currentSaving;
      if (saving > 0) {
        recommendations.push({
          item: `高齢の親の扶養控除`,
          current: SIDE_LABEL[input.elderlyParent.currentParent],
          optimal: SIDE_LABEL[optimalSide],
          effect: saving,
          reason: `${SIDE_LABEL[optimalSide]}側に移すと年間約${(saving / 10000).toFixed(1)}万円追加節税`,
        });
        totalSavings += saving;
      }
    }
  }

  // ---- 保険料控除の空き枠 ----
  const unusedDeductions: UnusedDeduction[] = [];
  const insuranceNames: { key: keyof typeof input.insuranceHusband; label: string }[] = [
    { key: 'lifeInsurance',    label: '一般生命保険料控除（新規保険加入で最大4万円控除）' },
    { key: 'medicalInsurance', label: '介護医療保険料控除（医療保険・がん保険等で最大4万円控除）' },
    { key: 'pensionInsurance', label: '個人年金保険料控除（個人年金保険で最大4万円控除）' },
  ];

  for (const { key, label } of insuranceNames) {
    if (!input.insuranceHusband[key]) {
      const saving = calcInsuranceSaving(hTaxRate);
      unusedDeductions.push({
        person: '夫',
        name: label,
        description: '空き枠があります。対象保険に加入することで控除を受けられます。',
        potentialSavings: `年間約${Math.round(saving / 100) * 100}円`,
        affiliateKey: 'insurance_review',
      });
    }
    if (!input.insuranceWife[key]) {
      const saving = calcInsuranceSaving(wTaxRate);
      unusedDeductions.push({
        person: '妻',
        name: label,
        description: '空き枠があります。対象保険に加入することで控除を受けられます。',
        potentialSavings: `年間約${Math.round(saving / 100) * 100}円`,
        affiliateKey: 'insurance_review',
      });
    }
  }

  // ---- tips のマッチング ----
  const tips: DualIncomeTip[] = [];
  // 特定扶養の子がいる場合
  if (input.children.some(c => c.age === '19to22')) {
    tips.push(DUAL_INCOME_TIPS.find(t => t.id === 'specific_dependent_63')!);
  }
  // 保険空き枠がある場合
  if (unusedDeductions.length > 0) {
    tips.push(DUAL_INCOME_TIPS.find(t => t.id === 'insurance_3slots')!);
  }
  // 扶養控除に関する基本tip
  tips.push(DUAL_INCOME_TIPS.find(t => t.id === 'dependent_high_income')!);
  // under16の子がいる場合
  if (input.children.some(c => c.age === 'under16')) {
    tips.push(DUAL_INCOME_TIPS.find(t => t.id === 'under16_resident_tax')!);
  }
  // 高齢親がいる場合
  if (input.elderlyParent) {
    tips.push(DUAL_INCOME_TIPS.find(t => t.id === 'elderly_parent_same_household')!);
  }

  return {
    husbandTaxRate: hTaxRate,
    wifeTaxRate: wTaxRate,
    totalSavings,
    recommendations,
    unusedDeductions,
    tips: tips.filter(Boolean).slice(0, 4),
  };
}
