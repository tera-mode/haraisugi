export type PropertyType = 'my_home' | 'investment' | 'inherited';
export type ResidencyStatus = 'living' | 'moved_out_within_3years' | 'vacant' | 'rented';

export type RealEstateInput = {
  propertyType: PropertyType;
  salePrice: number;           // 売却価格（万円）
  acquisitionCost: number;     // 取得費（万円）。0なら概算取得費（売却価格×5%）を使用
  acquisitionCostUnknown: boolean; // 取得費不明
  saleExpenses: number;        // 譲渡費用（仲介手数料等、万円）
  ownershipYears: number;      // 所有期間（年）
  residencyStatus: ResidencyStatus;  // 居住状況
  inheritedWithinYear: boolean; // 相続した年から3年以内
};

export type SpecialDeduction = {
  id: string;
  name: string;
  amount: number;        // 控除額（万円）
  applicable: boolean;
  reason: string;
};

export type RealEstateResult = {
  transferIncome: number;       // 譲渡所得（万円）
  effectiveAcquisitionCost: number; // 実際に使用した取得費（万円）
  usedEstimatedCost: boolean;   // 概算取得費（5%）を使用したか
  isLongTerm: boolean;          // 長期譲渡（5年超）か
  taxRate: number;              // 適用税率（合計）
  taxBeforeDeduction: number;   // 特別控除前の税額（万円）
  taxAfterDeduction: number;    // 特別控除後の税額（万円）
  deductions: SpecialDeduction[];
  canCarryLoss: boolean;        // 損失の損益通算・繰越控除が可能か
  tips: RealEstateTip[];
  warnings: string[];
};

export type RealEstateTip = {
  id: string;
  title: string;
  body: string;
  source?: string;
  sourceUrl?: string;
};
