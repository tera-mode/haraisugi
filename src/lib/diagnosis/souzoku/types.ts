export type InheritanceInput = {
  totalAssets: number;           // 財産総額（万円）
  realEstateValue: number;       // うち不動産評価額（万円）
  hasSpouse: boolean;            // 配偶者の有無
  numChildren: number;           // 子の人数（0〜10）
  hasLiveInHeir: boolean;        // 居住用不動産に同居の相続人がいるか（小規模宅地特例）
  lifeInsuranceAmount: number;   // 生命保険金額（万円）
  priorGifts: number;            // 過去7年の暦年贈与累計（万円）
};

export type Exemption = {
  name: string;
  description: string;
  reductionAmount: number;       // 軽減額（万円）
  condition: string;
  applicable: boolean;
};

export type InheritanceResult = {
  totalAssets: number;           // 財産総額（万円）
  legalHeirs: number;            // 法定相続人数
  basicDeduction: number;        // 基礎控除（万円）
  lifeInsuranceExemption: number;// 生命保険非課税枠（万円）
  taxableAssets: number;         // 課税対象財産（万円）
  taxableInheritance: number;    // 課税遺産総額（万円）
  estimatedTax: number;          // 推定相続税額（万円）
  spouseReduction: number;       // 配偶者軽減額（万円）
  smallScaleLandReduction: number; // 小規模宅地特例（万円）
  exemptions: Exemption[];
  tips: InheritanceTip[];
  warnings: string[];
  isSubjectToTax: boolean;       // 相続税が発生するか
};

export type InheritanceTip = {
  id: string;
  title: string;
  body: string;
  source: string;
  sourceUrl: string;
};
