export type RetirementInput = {
  yearsOfService: number;         // 勤続年数
  retirementBenefit: number;      // 退職金（万円）
  idecoBalance: number;           // iDeCo残高（万円, 0ならiDeCoなし）
  idecoContributionYears: number; // iDeCo加入年数
  age: number;                    // 退職予定年齢
  hasDisability: boolean;         // 障害者加算（＋100万円）
};

export type RetirementPattern = {
  id: 'simultaneous' | 'ideco_annuity' | 'time_shifted';
  label: string;
  description: string;
  totalTax: number;               // 合計税負担（万円）
  netReceive: number;             // 手取り概算（万円）
  retirementDeduction: number;    // 退職所得控除額（万円）
  idecoDeduction: number;         // iDeCo側の控除額（万円）
  incomeTax: number;              // 所得税（万円）
  residentTax: number;            // 住民税（万円）
  notes: string[];
};

export type RetirementResult = {
  patterns: RetirementPattern[];
  bestPatternId: string;
  maxSavings: number;             // 最良と最悪の差（万円）
  fiveYearRuleAvailable: boolean; // 5年ルール活用余地あり
  tips: RetirementTip[];
  warnings: string[];
};

export type RetirementTip = {
  id: string;
  title: string;
  body: string;
  source: string;
  sourceUrl: string;
};
