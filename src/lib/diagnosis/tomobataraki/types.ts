export type DualIncomeInput = {
  husbandIncome: number;           // 夫の年収（万円）
  wifeIncome: number;              // 妻の年収（万円）
  children: ChildInfo[];
  elderlyParent: ElderlyParentInfo | null;
  housingLoan: HousingLoanInfo | null;
  insuranceHusband: InsuranceInfo;
  insuranceWife: InsuranceInfo;
};

export type ChildAge = 'under16' | '16to18' | '19to22' | '23plus';
export type ParentSide = 'husband' | 'wife' | 'none';

export type ChildInfo = {
  age: ChildAge;
  currentParent: ParentSide;
};

export type ElderlyParentInfo = {
  livingTogether: boolean;         // 同居か否か
  currentParent: ParentSide;
};

export type HousingLoanInfo = {
  type: 'single_husband' | 'single_wife' | 'pair_loan' | 'joint' | 'none';
  remainingBalance: number;        // 残高（万円）
  husbandShare: number;            // 夫の持分割合（%）: pair_loanの場合
};

export type InsuranceInfo = {
  lifeInsurance: boolean;
  medicalInsurance: boolean;
  pensionInsurance: boolean;
  earthquakeInsurance: boolean;
};

export type DualIncomeResult = {
  husbandTaxRate: number;
  wifeTaxRate: number;
  totalSavings: number;             // 最適化による年間節税額（円）
  recommendations: Recommendation[];
  unusedDeductions: UnusedDeduction[];
  tips: DualIncomeTip[];
};

export type Recommendation = {
  item: string;
  current: string;
  optimal: string;
  effect: number;                   // 節税効果（円）
  reason: string;
};

export type UnusedDeduction = {
  person: '夫' | '妻';
  name: string;
  description: string;
  potentialSavings: string;
  affiliateKey?: string;
};

export type DualIncomeTip = {
  id: string;
  title: string;
  body: string;
  source: string;
  sourceUrl: string;
};
