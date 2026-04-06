import type { Deduction, UserInput } from './types';

// 収入帯の中央値（推定節税額計算用）
function getIncomeCenter(input: UserInput): number {
  switch (input.income) {
    case 'under300': return 250;
    case '300to500': return 400;
    case '500to700': return 600;
    case '700to1000': return 850;
    case '1000to1500': return 1250;
    case 'over1500': return 2000;
  }
}

// 所得税率（概算）
function getTaxRate(income: number): number {
  if (income < 195) return 0.05;
  if (income < 330) return 0.10;
  if (income < 695) return 0.20;
  if (income < 900) return 0.23;
  if (income < 1800) return 0.33;
  if (income < 4000) return 0.40;
  return 0.45;
}

export const ALL_DEDUCTIONS: Deduction[] = [
  {
    id: 'furusato',
    name: 'ふるさと納税',
    match: (input: UserInput) => !input.currentDeductions.includes('furusato'),
    savings: (input: UserInput) => {
      const income = getIncomeCenter(input);
      // 簡易計算：年収の約1〜2%が控除上限目安
      const limit = Math.round(income * 0.015);
      // 返礼品価値は寄付額の約30%（自己負担2,000円を除く実質メリット）
      const returnValue = Math.round(limit * 0.3 * 10) / 10;
      return `年間 約${returnValue}万円相当の返礼品（寄付上限目安 ${limit}万円）`;
    },
    urgency: 'high',
    description: '年収・家族構成に応じた上限額まで寄付でき、返礼品を受け取りながら税金が控除される制度。利用しないと完全に損です。',
    action: 'さとふる・楽天ふるさと納税で上限額を確認して申し込む',
    deadline: '毎年12月31日（ワンストップ特例は1月10日必着）',
    difficulty: 'かんたん',
    affiliateKey: 'furusato_satofuru',
  },
  {
    id: 'ideco',
    name: 'iDeCo（個人型確定拠出年金）',
    match: (input: UserInput) =>
      !input.currentDeductions.includes('ideco') &&
      input.workStyle !== 'freelance',
    savings: (input: UserInput) => {
      const income = getIncomeCenter(input);
      const rate = getTaxRate(income);
      // 会社員の掛金上限：月2.3万（年27.6万）
      const maxContrib = input.workStyle === 'employee' || input.workStyle === 'employee_side' ? 27.6 : 27.6;
      const saving = Math.round(maxContrib * rate * 10) / 10;
      return `年間 約${saving}万円の節税（所得税＋住民税）`;
    },
    urgency: 'high',
    description: '掛金が全額所得控除。運用益も非課税。老後資産を作りながら今の税金を減らせる最強の節税手段のひとつ。',
    action: '楽天証券またはSBI証券でiDeCo口座を開設する',
    deadline: '年内に開設すれば当年分から控除可能',
    difficulty: 'ふつう',
    affiliateKey: 'ideco_rakuten',
  },
  {
    id: 'small_biz_mutual',
    name: '小規模企業共済',
    match: (input: UserInput) =>
      (input.workStyle === 'freelance' || input.workStyle === 'executive') &&
      !input.currentDeductions.includes('small_biz_mutual'),
    savings: (input: UserInput) => {
      const income = getIncomeCenter(input);
      const rate = getTaxRate(income);
      // 月7万まで（年84万）
      const saving = Math.round(84 * rate * 10) / 10;
      return `年間 最大約${saving}万円の節税`;
    },
    urgency: 'high',
    description: 'フリーランス・会社役員向けの退職金積立制度。掛金が全額所得控除になり、節税効果が非常に大きい。',
    action: '中小機構の公式サイトから申込書を入手し、取扱金融機関で手続き',
    deadline: '随時（早いほど節税額が大きい）',
    difficulty: 'ふつう',
  },
  {
    id: 'disability_care',
    name: '障害者控除（要介護認定）',
    match: (input: UserInput) =>
      input.family.includes('care_needed'),
    savings: (input: UserInput) => {
      const income = getIncomeCenter(input);
      const rate = getTaxRate(income);
      // 障害者控除27万（特別障害者75万）、住民税もあわせ
      const saving = Math.round(27 * (rate + 0.10) * 10) / 10;
      return `年間 約${saving}万円の節税（障害者控除27万〜75万）`;
    },
    urgency: 'high',
    description: '要介護1〜5の認定を受けた家族がいる場合、市区町村で「障害者控除対象者認定書」を取得すれば障害者控除が適用可能。多くの人が見逃している控除です。',
    action: '親が住む市区町村の窓口で「障害者控除対象者認定書」を申請する',
    deadline: '確定申告期限（翌年3月15日）。5年前まで遡れる',
    difficulty: 'ふつう',
  },
  {
    id: 'specific_expense',
    name: '特定支出控除',
    match: (input: UserInput) =>
      input.workStyle !== 'freelance' &&
      (input.life.includes('qualification') ||
        input.life.includes('work_books') ||
        input.life.includes('work_clothes')),
    savings: () => '数万〜数十万円（支出額・収入による）',
    urgency: 'medium',
    description: '会社員が業務のために自腹で払った費用（資格取得・書籍・スーツ・在宅勤務費用等）を給与所得控除の半額を超えた分だけ控除できる制度。年間1,700人ほどしか使っていない穴場。',
    action: '会社から「特定支出に関する証明書」を発行してもらい確定申告する',
    deadline: '翌年3月15日（確定申告）',
    difficulty: 'やや手間',
  },
  {
    id: 'self_medication',
    name: 'セルフメディケーション税制',
    match: (input: UserInput) =>
      input.life.includes('otc_medicine') &&
      !input.life.includes('medical_over100k'),
    savings: () => '年間 数千〜数万円',
    urgency: 'medium',
    description: '健康診断等を受けた上で、市販薬（OTC医薬品）の年間購入額が1.2万円を超えた分を所得控除できる。医療費控除との選択適用。',
    action: 'ドラッグストアのレシートを保管し、対象医薬品の合計額を計算して確定申告',
    deadline: '翌年3月15日（確定申告）',
    difficulty: 'ふつう',
  },
  {
    id: 'medical_expense',
    name: '医療費控除',
    match: (input: UserInput) =>
      input.life.includes('medical_over100k') &&
      !input.currentDeductions.includes('medical_deduction'),
    savings: (input: UserInput) => {
      const income = getIncomeCenter(input);
      const rate = getTaxRate(income);
      const saving = Math.round(10 * (rate + 0.10) * 10) / 10;
      return `年間 約${saving}万円〜（医療費超過分×税率）`;
    },
    urgency: 'high',
    description: '年間医療費が10万円（または所得の5%）を超えた分を所得控除。家族全員分を合算できる。通院交通費も対象。',
    action: '領収書・交通費メモをまとめて確定申告。e-Taxなら書類不要',
    deadline: '翌年3月15日（確定申告）。5年前まで遡れる',
    difficulty: 'ふつう',
  },
  {
    id: 'life_insurance',
    name: '生命保険料控除（3枠の活用）',
    match: (input: UserInput) =>
      input.life.includes('life_insurance') &&
      !input.currentDeductions.includes('life_insurance_deduction'),
    savings: (input: UserInput) => {
      const income = getIncomeCenter(input);
      const rate = getTaxRate(income);
      // 最大12万控除
      const saving = Math.round(12 * (rate + 0.10) * 10) / 10;
      return `年間 最大約${saving}万円（3枠合計12万円控除）`;
    },
    urgency: 'medium',
    description: '一般・介護医療・個人年金の3枠で最大12万円の所得控除。枠が埋まっていない場合は保険を見直すと節税になる。',
    action: '現在の保険証券で3枠の利用状況を確認する',
    deadline: '年末調整（10〜11月）または確定申告',
    difficulty: 'ふつう',
    affiliateKey: 'insurance_review',
  },
  {
    id: 'earthquake_insurance',
    name: '地震保険料控除',
    match: (input: UserInput) =>
      input.life.includes('earthquake_insurance') &&
      !input.currentDeductions.includes('earthquake_deduction'),
    savings: (input: UserInput) => {
      const income = getIncomeCenter(input);
      const rate = getTaxRate(income);
      const saving = Math.round(5 * (rate + 0.10) * 10) / 10;
      return `年間 約${saving}万円（最大5万円控除）`;
    },
    urgency: 'low',
    description: '地震保険料を支払っている場合、年間5万円を上限に所得控除。申告を忘れているケースが多い。',
    action: '保険会社から届く「控除証明書」を年末調整または確定申告で提出',
    deadline: '年末調整または翌年3月15日',
    difficulty: 'かんたん',
  },
  {
    id: 'specific_dependent',
    name: '特定扶養控除',
    match: (input: UserInput) =>
      input.family.includes('child_19to22'),
    savings: (input: UserInput) => {
      const income = getIncomeCenter(input);
      const rate = getTaxRate(income);
      // 特定扶養控除63万
      const saving = Math.round(63 * (rate + 0.10) * 10) / 10;
      return `年間 約${saving}万円（特定扶養控除63万円）`;
    },
    urgency: 'high',
    description: '19〜22歳の子（特定扶養親族）は通常の扶養控除38万円ではなく63万円の控除が受けられる。申告漏れが多い。',
    action: '年末調整の扶養控除等申告書に19〜22歳の子を正しく記入する',
    deadline: '年末調整（10〜11月）',
    difficulty: 'かんたん',
  },
  {
    id: 'single_parent',
    name: 'ひとり親控除',
    match: (input: UserInput) =>
      input.family.includes('single_parent'),
    savings: (input: UserInput) => {
      const income = getIncomeCenter(input);
      const rate = getTaxRate(income);
      // ひとり親控除35万
      const saving = Math.round(35 * (rate + 0.10) * 10) / 10;
      return `年間 約${saving}万円（ひとり親控除35万円）`;
    },
    urgency: 'high',
    description: '婚姻歴を問わず、生計を一にする子（所得48万円以下）がいるひとり親に35万円の控除。2020年度改正で要件が緩和された。',
    action: '年末調整の扶養控除等申告書の「ひとり親」欄にチェックを入れる',
    deadline: '年末調整（10〜11月）',
    difficulty: 'かんたん',
  },
  {
    id: 'casualty_loss',
    name: '雑損控除・災害減免法',
    match: (input: UserInput) => input.life.includes('disaster_theft'),
    savings: () => '損害額の一部〜全部（被害額による）',
    urgency: 'high',
    description: '災害・盗難・横領による損失は「雑損控除」または「災害減免法」で税金が大幅に減額。どちらか有利な方を選べる。',
    action: '被害額を証明する書類（罹災証明書・警察の受理番号等）を用意して確定申告',
    deadline: '翌年3月15日（確定申告）',
    difficulty: 'やや手間',
  },
  {
    id: 'donation',
    name: '寄附金控除（税額控除の選択）',
    match: (input: UserInput) =>
      input.life.includes('donation') &&
      (input.workStyle === 'freelance' || input.workStyle === 'executive'),
    savings: () => '寄付額×40%（税額控除選択時）',
    urgency: 'medium',
    description: '認定NPO法人等への寄付は、所得控除と税額控除を選択できる。高所得者は税額控除（寄付額×40%）の方が有利なケースが多い。',
    action: '確定申告で税額控除を選択し、寄附金受領証を添付',
    deadline: '翌年3月15日（確定申告）',
    difficulty: 'ふつう',
  },
  {
    id: 'stock_loss',
    name: '上場株式等の損益通算・繰越控除',
    match: (input: UserInput) => input.life.includes('stock_loss'),
    savings: () => '損失額×20.315%（最大3年間繰越可能）',
    urgency: 'high',
    description: '株式・投信の損失は同年の利益や配当と相殺でき、さらに最大3年間繰り越せる。源泉徴収あり口座でも確定申告で取り戻せる場合がある。',
    action: '証券会社の「年間取引報告書」を取得し確定申告',
    deadline: '翌年3月15日（3年間繰越可能）',
    difficulty: 'ふつう',
  },
  {
    id: 'spouse_deduction',
    name: '配偶者（特別）控除',
    match: (input: UserInput) =>
      input.family.includes('spouse_low') &&
      !input.currentDeductions.includes('spouse_deduction'),
    savings: (input: UserInput) => {
      const income = getIncomeCenter(input);
      const rate = getTaxRate(income);
      // 配偶者特別控除38万（2025年改正：収入160万円まで満額）
      const saving = Math.round(38 * (rate + 0.10) * 10) / 10;
      return `年間 約${saving}万円（配偶者特別控除38万円）`;
    },
    urgency: 'high',
    description: '配偶者の年収が160万円以下（令和7年度改正で150万→160万に引き上げ）なら、配偶者（特別）控除38万円が適用。申告し忘れているケースが非常に多い控除です。',
    action: '年末調整の「配偶者控除等申告書」に配偶者の所得見積もりを記入する',
    deadline: '年末調整（10〜11月）',
    difficulty: 'かんたん',
  },
  {
    id: 'parent_over70_deduction',
    name: '老人扶養控除（70歳以上の親）',
    match: (input: UserInput) =>
      input.family.includes('parent_over70') &&
      !input.currentDeductions.includes('dependent_deduction'),
    savings: (input: UserInput) => {
      const income = getIncomeCenter(input);
      const rate = getTaxRate(income);
      // 同居老親等は58万円（別居老人は48万円）
      const saving = Math.round(58 * (rate + 0.10) * 10) / 10;
      return `年間 約${saving}万円（老人扶養控除58万円）`;
    },
    urgency: 'high',
    description: '70歳以上の親と同居している場合、通常の扶養控除38万円ではなく老人扶養控除58万円が適用される。見落としがちで、過去5年分の遡及申告も可能。',
    action: '年末調整の「扶養控除等申告書」に親を「老人扶養親族（同居老親等）」として記入する',
    deadline: '年末調整（10〜11月）。5年前まで遡れる',
    difficulty: 'かんたん',
  },
  {
    id: 'remote_work_expense',
    name: '在宅勤務の特定支出控除（通信費・電気代）',
    match: (input: UserInput) =>
      input.life.includes('remote_work') &&
      input.workStyle !== 'freelance',
    savings: () => '年間数万〜十数万円（実費按分で計算）',
    urgency: 'low',
    description: '会社員の在宅勤務に係る通信費・電気代は、業務使用割合分を特定支出控除に含められる可能性がある。会社の証明書が必要。',
    action: '会社に「特定支出に関する証明書」の発行を依頼し、通信費・電気代の按分計算をする',
    deadline: '翌年3月15日（確定申告）',
    difficulty: 'やや手間',
  },
];
