export type IncomeRange =
  | 'under300'
  | '300to500'
  | '500to700'
  | '700to1000'
  | '1000to1500'
  | 'over1500';

export type WorkStyle =
  | 'employee'
  | 'employee_side'
  | 'freelance'
  | 'executive';

export type FamilyOption =
  | 'spouse_low'       // 配偶者（収入150万以下）
  | 'spouse_high'      // 配偶者（収入150万超）
  | 'child_under16'    // 16歳未満の子
  | 'child_16to18'     // 16-18歳の子
  | 'child_19to22'     // 19-22歳の子（特定扶養）
  | 'parent_over70'    // 70歳以上の親（同居）
  | 'care_needed'      // 要介護認定の家族
  | 'disability'       // 障害者手帳を持つ家族
  | 'single_parent'    // ひとり親
  | 'child_away';      // 下宿中の子ども

export type LifeOption =
  // 医療
  | 'medical_over100k'     // 医療費10万超
  | 'otc_medicine'         // 市販薬購入
  | 'dental_orthodontics'  // 歯科矯正
  | 'dental_loan'          // デンタルローン
  | 'commute_to_hospital'  // 通院交通費
  // 住宅
  | 'housing_loan'         // 住宅ローン
  | 'eco_renovation'       // 省エネ改修
  // 保険
  | 'earthquake_insurance' // 地震保険
  | 'life_insurance'       // 生命保険
  // 寄付
  | 'donation'             // 寄付（NPO等）
  // 災害
  | 'disaster_theft'       // 災害・盗難
  // 自己投資
  | 'qualification'        // 資格取得費
  | 'work_books'           // 仕事の書籍
  | 'work_clothes'         // 制服・スーツ自費購入
  | 'remote_work'          // 在宅勤務
  // 投資
  | 'stock_loss'           // 株損失
  | 'crypto'               // 暗号資産
  // 投資（追加）
  | 'angel_investment'     // エンジェル投資（スタートアップ出資）
  | 'stock_dividend'       // 上場株式の配当収入あり
  // 医療（追加）
  | 'implant_lasik'        // インプラント・レーシック
  | 'infertility_treatment'; // 不妊治療

export type CurrentDeduction =
  | 'furusato'
  | 'ideco'
  | 'nisa'
  | 'small_biz_mutual'  // 小規模企業共済
  | 'medical_deduction'
  | 'life_insurance_deduction'
  | 'earthquake_deduction'
  | 'spouse_deduction'
  | 'dependent_deduction'
  | 'housing_loan_deduction'
  | 'none';

export type UserInput = {
  income: IncomeRange;
  workStyle: WorkStyle;
  family: FamilyOption[];
  life: LifeOption[];
  currentDeductions: CurrentDeduction[];
};

export type Deduction = {
  id: string;
  name: string;
  match: (input: UserInput) => boolean;
  savings: (input: UserInput) => string;
  urgency: 'high' | 'medium' | 'low';
  description: string;
  action: string;
  deadline: string;
  difficulty: 'かんたん' | 'ふつう' | 'やや手間';
  affiliateKey?: string;
};

export type Trick = {
  id: string;
  category: string;
  title: string;
  match: (input: UserInput) => boolean;
  body: string;
  source: string;
  sourceUrl?: string;
  surprise: '★★★' | '★★☆' | '★☆☆';
};

export type DiagnosisResult = {
  deductions: Deduction[];
  tricks: Trick[];
  totalSavings: number;
};
