export type SideJobType =
  | 'freelance_writing'
  | 'programming'
  | 'design'
  | 'consulting'
  | 'ecommerce'
  | 'rental_income'
  | 'stocks'
  | 'crypto'
  | 'rideshare_delivery'
  | 'other';

export type SideJobInput = {
  mainJobIncome: number;           // 本業の年収（万円）
  sideJobType: SideJobType;        // 副業の種類
  sideJobRevenue: number;          // 副業の収入（万円）
  sideJobExpenses: number;         // 副業の経費（万円）
  hasBookkeeping: boolean;         // 帳簿をつけているか
  isContinuous: boolean;           // 継続的に行っているか
  hasOpeningNotification: boolean; // 開業届を出しているか
};

export type IncomeCategory = 'business' | 'miscellaneous' | 'unclear';
export type FilingType = 'blue_65' | 'blue_10' | 'white' | 'not_needed';

export type SideJobResult = {
  needsTaxReturn: boolean;          // 確定申告の要否（所得税）
  needsResidentTaxReturn: boolean;  // 住民税の申告要否
  incomeCategory: IncomeCategory;   // 所得区分
  recommendedFiling: FilingType;    // 推奨申告方法
  netIncome: number;                // 副業の純利益（万円）
  estimatedTax: number;             // 推定追加税額（万円）
  estimatedRefund: number;          // 損益通算した場合の還付額（万円）
  canLossOffset: boolean;           // 損益通算の可否
  recommendations: string[];
  risks: string[];
  tips: SideJobTip[];
};

export type SideJobTip = {
  id: string;
  title: string;
  body: string;
  source: string;
  sourceUrl: string;
};
