export type FurusatoLimitInput = {
  annualIncome: number;           // 年収（万円）
  hasSpouse: boolean;             // 配偶者控除あり（配偶者年収 ≤ 201万）
  numDependents: number;          // 16歳以上の扶養控除対象者数
  iDeCoMonthly: number;           // iDeCo月額掛金（万円）
  mortgageDeduction: number;      // 住宅ローン控除額（年間、万円）
  medicalExpenses: number;        // 医療費控除見込み額（万円）
  lifeInsurancePremium: number;   // 生命保険料年払い（万円、控除額計算のために使用）
  socialInsurancePremium: number; // 社会保険料（万円、0なら概算）
};

export type FurusatoLimitResult = {
  limit: number;              // ふるさと納税上限額（万円）
  salaryDeduction: number;    // 給与所得控除（万円）
  income: number;             // 給与所得（万円）
  taxableIncome: number;      // 課税所得・所得税ベース（万円）
  incomeTaxRate: number;      // 適用所得税率
  residentTaxIncome: number;  // 住民税課税所得（万円）
  residentTaxAmount: number;  // 住民税所得割額（万円）
  effectiveResidentTax: number; // 住宅ローン控除後の実質住民税所得割（万円）
  iDeCoEffect: number;        // iDeCoによる上限変化（万円、通常マイナス）
  mortgageEffect: number;     // 住宅ローン控除による上限変化（万円、通常マイナス）
  medicalEffect: number;      // 医療費控除による上限変化（万円、通常マイナス）
  tips: FurusatoTip[];
};

export type FurusatoTip = {
  id: string;
  title: string;
  body: string;
  source?: string;
  sourceUrl?: string;
};
