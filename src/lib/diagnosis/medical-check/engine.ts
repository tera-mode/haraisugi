import type { MedicalCheckInput, MedicalCheckResult, MedicalTip } from './types';
import { ALL_MEDICAL_TIPS } from './data';

// ---- 給与所得控除の計算（2025年分） ----
export function calcSalaryDeduction(income: number): number {
  // income: 万円
  if (income <= 162.5) return 55;
  if (income <= 180)   return income * 0.4 - 10;
  if (income <= 360)   return income * 0.3 + 8;
  if (income <= 660)   return income * 0.2 + 44;
  if (income <= 850)   return income * 0.1 + 110;
  return 195; // 上限
}

// ---- 総所得金額（給与所得）の計算 ----
export function calcGrossIncome(annualIncome: number): number {
  // 給与所得 = 年収 - 給与所得控除
  return Math.max(0, annualIncome - calcSalaryDeduction(annualIncome));
}

// ---- 課税所得の計算 ----
export function calcTaxableIncome(annualIncome: number): number {
  const grossIncome = calcGrossIncome(annualIncome);
  const socialInsurance = annualIncome * 0.15;  // 社会保険料控除（概算15%）
  const basicDeduction = 48;                     // 基礎控除 48万円
  return Math.max(0, grossIncome - socialInsurance - basicDeduction);
}

// ---- 所得税率（限界税率）の取得 ----
export function getTaxRate(taxableIncome: number): number {
  // taxableIncome: 万円
  if (taxableIncome <= 195)  return 0.05;
  if (taxableIncome <= 330)  return 0.10;
  if (taxableIncome <= 695)  return 0.20;
  if (taxableIncome <= 900)  return 0.23;
  if (taxableIncome <= 1800) return 0.33;
  if (taxableIncome <= 4000) return 0.40;
  return 0.45;
}

// ---- 医療費控除の計算 ----
export function calcMedicalDeduction(
  grossIncome: number,       // 万円（総所得金額）
  totalMedical: number,      // 円
  insuranceReimbursement: number, // 円
): number {
  // 足切り額: 総所得が200万円未満なら5%、それ以外は10万円
  const threshold =
    grossIncome < 200 ? grossIncome * 10000 * 0.05 : 100_000;

  const deduction = totalMedical - insuranceReimbursement - threshold;
  if (deduction <= 0) return 0;
  return Math.min(deduction, 2_000_000); // 上限200万円
}

// ---- セルフメディケーション税制の控除額計算 ----
export function calcSelfMedDeduction(
  otcDrugExpenses: number, // 円
  hasHealthCheckup: boolean,
): number {
  if (!hasHealthCheckup) return 0;
  const deduction = otcDrugExpenses - 12_000;
  if (deduction <= 0) return 0;
  return Math.min(deduction, 88_000); // 上限88,000円
}

// ---- 還付額の計算（所得税 + 住民税） ----
function calcRefund(deductionAmount: number, taxRate: number): number {
  // 所得税: deduction × taxRate
  // 住民税: deduction × 10%
  return Math.round(deductionAmount * (taxRate + 0.1));
}

// ---- 裏技のマッチング ----
function matchTips(
  input: MedicalCheckInput,
  recommendation: 'medical' | 'self_medication' | 'neither',
  grossIncome: number,
): MedicalTip[] {
  const result: MedicalTip[] = [];

  // 通院交通費: 常に有用
  result.push(ALL_MEDICAL_TIPS.find(t => t.id === 'transport')!);

  // デンタルローン: 常に有用
  result.push(ALL_MEDICAL_TIPS.find(t => t.id === 'dental_loan')!);

  // 家族合算: 家族が2人以上の場合
  if (input.familySize >= 2) {
    result.push(ALL_MEDICAL_TIPS.find(t => t.id === 'family_total')!);
  }

  // OTC対象薬: セルフメディケーション有利またはOTC薬あり
  if (recommendation === 'self_medication' || input.otcDrugExpenses > 0) {
    result.push(ALL_MEDICAL_TIPS.find(t => t.id === 'otc_generic')!);
  }

  // 5%ルール: 総所得200万円未満
  if (grossIncome < 200) {
    result.push(ALL_MEDICAL_TIPS.find(t => t.id === 'low_income_5pct')!);
  }

  // 年末タイミング: 医療費控除が有利な場合
  if (recommendation === 'medical') {
    result.push(ALL_MEDICAL_TIPS.find(t => t.id === 'year_end_timing')!);
  }

  return result;
}

// ---- メインエンジン ----
export function runMedicalCheck(input: MedicalCheckInput): MedicalCheckResult {
  const grossIncome = calcGrossIncome(input.annualIncome);
  const taxableIncome = calcTaxableIncome(input.annualIncome);
  const taxRate = getTaxRate(taxableIncome);

  const medicalDeduction = calcMedicalDeduction(
    grossIncome,
    input.totalMedicalExpenses,
    input.insuranceReimbursement,
  );
  const selfMedDeduction = calcSelfMedDeduction(
    input.otcDrugExpenses,
    input.hasHealthCheckup,
  );

  const medicalRefund = calcRefund(medicalDeduction, taxRate);
  const selfMedRefund = calcRefund(selfMedDeduction, taxRate);

  let recommendation: 'medical' | 'self_medication' | 'neither';
  if (medicalRefund === 0 && selfMedRefund === 0) {
    recommendation = 'neither';
  } else if (medicalRefund >= selfMedRefund) {
    recommendation = 'medical';
  } else {
    recommendation = 'self_medication';
  }

  const maxRefund = Math.max(medicalRefund, selfMedRefund);
  const minRefund = Math.min(medicalRefund, selfMedRefund);
  const difference = maxRefund - minRefund;

  const tips = matchTips(input, recommendation, grossIncome);

  return {
    recommendation,
    medicalDeduction,
    medicalRefund,
    selfMedDeduction,
    selfMedRefund,
    difference,
    taxRate,
    tips,
  };
}
