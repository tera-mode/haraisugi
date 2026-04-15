import type { FurusatoLimitInput, FurusatoLimitResult } from './types';
import { FURUSATO_TIPS } from './data';

/** 給与所得控除（万円） */
function calcSalaryDeduction(income: number): number {
  if (income <= 162.5) return Math.max(income * 0.4, 55);
  if (income <= 180) return income * 0.4 - 10;
  if (income <= 360) return income * 0.3 + 8;
  if (income <= 660) return income * 0.2 + 44;
  if (income <= 850) return income * 0.1 + 110;
  return 195;
}

/** 社会保険料概算（万円）: 給与収入の約14.2% */
function estimateSocialInsurance(income: number): number {
  return Math.round(income * 0.142);
}

/** 所得税の限界税率（超過累進） */
function getIncomeTaxRate(taxableIncome: number): number {
  if (taxableIncome <= 195) return 0.05;
  if (taxableIncome <= 330) return 0.10;
  if (taxableIncome <= 695) return 0.20;
  if (taxableIncome <= 900) return 0.23;
  if (taxableIncome <= 1800) return 0.33;
  if (taxableIncome <= 4000) return 0.40;
  return 0.45;
}

/** 生命保険料控除額（所得税ベース、万円）: 保険料から控除額を計算 */
function calcLifeInsDeductionIT(premium: number): number {
  // 一般生命保険料控除の計算（2012年以降の契約）
  if (premium <= 2) return premium;
  if (premium <= 4) return premium * 0.5 + 1;
  if (premium <= 8) return premium * 0.25 + 2;
  return Math.min(4, premium * 0.125 + 2.5); // 上限4万円
}

/** 生命保険料控除額（住民税ベース、万円）: 上限2.8万円 */
function calcLifeInsDeductionRT(premium: number): number {
  if (premium <= 1.2) return premium;
  if (premium <= 3.2) return premium * 0.5 + 0.6;
  if (premium <= 5.6) return premium * 0.25 + 1.4;
  return Math.min(2.8, premium * 0.125 + 1.8);
}

/** 医療費控除（万円）: 10万円 or 所得の5%のいずれか低い方を超えた分 */
function calcMedicalDeduction(medicalExpenses: number, income: number): number {
  const threshold = Math.min(income * 0.05, 10);
  return Math.max(0, medicalExpenses - threshold);
}

/**
 * ふるさと納税上限額の計算
 *
 * 上限式: X = 2000 + 住民税所得割 × 0.20 / (0.90 - 所得税率×1.021)
 * ただし denominator ≤ 0 の場合（最高税率近辺）は別扱い
 */
function calcLimit(residentTax: number, incomeTaxRate: number): number {
  const r = incomeTaxRate * 1.021;
  const denominator = 0.90 - r;
  if (denominator <= 0.01) {
    // 最高税率帯: 特例分がほぼゼロなので基本分のみ
    return Math.round(0.2 + residentTax * 0.20 / 0.10);
  }
  return Math.round(0.2 + (residentTax * 0.20) / denominator);
}

export function runFurusatoShindan(input: FurusatoLimitInput): FurusatoLimitResult {
  const {
    annualIncome,
    hasSpouse,
    numDependents,
    iDeCoMonthly,
    mortgageDeduction,
    medicalExpenses,
    lifeInsurancePremium,
    socialInsurancePremium,
  } = input;

  const iDeCoAnnual = iDeCoMonthly * 12;
  const salaryDeduction = calcSalaryDeduction(annualIncome);
  const income = annualIncome - salaryDeduction;

  const socialInsurance =
    socialInsurancePremium > 0 ? socialInsurancePremium : estimateSocialInsurance(annualIncome);

  const lifeInsDeductionIT = calcLifeInsDeductionIT(lifeInsurancePremium);
  const lifeInsDeductionRT = calcLifeInsDeductionRT(lifeInsurancePremium);
  const medicalDeduction = calcMedicalDeduction(medicalExpenses, income);

  // --- 所得税側の課税所得 ---
  const basicDeductionIT = income <= 2400 ? 48 : income <= 2450 ? 32 : income <= 2500 ? 16 : 0;
  const spouseDeductionIT = hasSpouse ? 38 : 0;
  const dependentDeductionIT = numDependents * 38;

  const taxableIncome = Math.max(
    0,
    income -
      socialInsurance -
      basicDeductionIT -
      spouseDeductionIT -
      dependentDeductionIT -
      iDeCoAnnual -
      lifeInsDeductionIT -
      medicalDeduction,
  );
  const incomeTaxRate = getIncomeTaxRate(taxableIncome);

  // --- 住民税側の課税所得 ---
  const basicDeductionRT = 43;
  const spouseDeductionRT = hasSpouse ? 33 : 0;
  const dependentDeductionRT = numDependents * 33;

  const residentTaxIncome = Math.max(
    0,
    income -
      socialInsurance -
      basicDeductionRT -
      spouseDeductionRT -
      dependentDeductionRT -
      iDeCoAnnual -
      lifeInsDeductionRT -
      medicalDeduction,
  );
  const residentTaxAmount = Math.round(residentTaxIncome * 0.1 * 10) / 10;

  // 住宅ローン控除が住民税から差し引かれる額（上限: 住民税所得割×5% かつ 9.75万円）
  const mortgageFromResidentTax =
    mortgageDeduction > 0
      ? Math.min(mortgageDeduction, Math.min(residentTaxAmount * 0.05, 9.75))
      : 0;
  const effectiveResidentTax = Math.max(0, residentTaxAmount - mortgageFromResidentTax);

  // --- ふるさと納税上限 ---
  const limit = calcLimit(effectiveResidentTax, incomeTaxRate);

  // --- 各控除の影響額（iDeCo） ---
  let iDeCoEffect = 0;
  if (iDeCoAnnual > 0) {
    const taxableIncomeNoIdeco = Math.max(0, taxableIncome + iDeCoAnnual);
    const rateNoIdeco = getIncomeTaxRate(taxableIncomeNoIdeco);
    const residentTaxNoIdeco = Math.round((residentTaxIncome + iDeCoAnnual) * 0.1 * 10) / 10;
    const effectiveRTNoIdeco = Math.max(
      0,
      residentTaxNoIdeco - Math.min(mortgageDeduction, Math.min(residentTaxNoIdeco * 0.05, 9.75)),
    );
    const limitNoIdeco = calcLimit(effectiveRTNoIdeco, rateNoIdeco);
    iDeCoEffect = limit - limitNoIdeco; // negative
  }

  // --- 住宅ローン控除の影響額 ---
  let mortgageEffect = 0;
  if (mortgageDeduction > 0) {
    const limitNoMortgage = calcLimit(residentTaxAmount, incomeTaxRate);
    mortgageEffect = limit - limitNoMortgage; // negative
  }

  // --- 医療費控除の影響額 ---
  let medicalEffect = 0;
  if (medicalDeduction > 0) {
    const taxableIncomeNoMedical = Math.max(0, taxableIncome + medicalDeduction);
    const rateNoMedical = getIncomeTaxRate(taxableIncomeNoMedical);
    const residentTaxNoMedical =
      Math.round((residentTaxIncome + medicalDeduction) * 0.1 * 10) / 10;
    const effectiveRTNoMedical = Math.max(
      0,
      residentTaxNoMedical -
        Math.min(mortgageDeduction, Math.min(residentTaxNoMedical * 0.05, 9.75)),
    );
    const limitNoMedical = calcLimit(effectiveRTNoMedical, rateNoMedical);
    medicalEffect = limit - limitNoMedical; // negative
  }

  return {
    limit,
    salaryDeduction,
    income,
    taxableIncome,
    incomeTaxRate,
    residentTaxIncome,
    residentTaxAmount,
    effectiveResidentTax,
    iDeCoEffect,
    mortgageEffect,
    medicalEffect,
    tips: FURUSATO_TIPS,
  };
}
