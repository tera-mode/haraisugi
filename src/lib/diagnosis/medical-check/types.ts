export type MedicalCheckInput = {
  annualIncome: number;           // 年収（万円）
  totalMedicalExpenses: number;   // 年間医療費合計（円）
  otcDrugExpenses: number;        // 年間OTC医薬品購入額（円）
  hasHealthCheckup: boolean;      // 特定の取組み（健診・予防接種等）を実施したか
  familySize: number;             // 家族の人数（医療費合算対象）
  insuranceReimbursement: number; // 保険金等で補填される金額（円）
};

export type MedicalCheckResult = {
  recommendation: 'medical' | 'self_medication' | 'neither';
  medicalDeduction: number;       // 医療費控除の控除額（円）
  medicalRefund: number;          // 医療費控除の還付額（円）
  selfMedDeduction: number;       // セルフメディケーション控除額（円）
  selfMedRefund: number;          // セルフメディケーション還付額（円）
  difference: number;             // 差額（有利な方 - 不利な方、円）
  taxRate: number;                // 適用される所得税率（小数: 0.05 〜 0.45）
  tips: MedicalTip[];             // 裏技・アドバイス
};

export type MedicalTip = {
  id: string;
  title: string;
  body: string;
  source: string;
  sourceUrl: string;
};
