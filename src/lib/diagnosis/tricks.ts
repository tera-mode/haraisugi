import type { Trick, UserInput } from './types';

export const ALL_TRICKS: Trick[] = [
  {
    id: 'hospital_transport',
    category: '医療費',
    title: '通院交通費はメモだけで控除OK',
    match: (input: UserInput) =>
      input.life.includes('medical_over100k') ||
      input.life.includes('commute_to_hospital'),
    body: '電車・バスの通院交通費は領収書がなくてもOK。日付・経路・金額をメモしておくだけで医療費控除に含められます。タクシーは「歩行困難」など医療上の理由がある場合のみ対象。自家用車のガソリン代は対象外。',
    source: '国税庁タックスアンサー No.1122',
    surprise: '★★★',
  },
  {
    id: 'dental_orthodontics',
    category: '医療費',
    title: '子どもの歯科矯正は医療費控除対象',
    match: (input: UserInput) =>
      input.life.includes('dental_orthodontics') ||
      input.family.includes('child_under16') ||
      input.family.includes('child_16to18'),
    body: '子どもの歯科矯正（機能回復目的）は医療費控除の対象。審美目的の大人の矯正は原則対象外ですが、噛み合わせや発音の改善目的なら認められるケースも。歯科医の診断書があると確実。',
    source: '国税庁タックスアンサー No.1128',
    surprise: '★★☆',
  },
  {
    id: 'dental_loan',
    category: '医療費',
    title: 'デンタルローンは契約年に全額控除できる',
    match: (input: UserInput) => input.life.includes('dental_loan'),
    body: 'デンタルローンを使った歯科治療費は、ローンを組んだ年（治療費を支払った年）に全額を医療費控除に計上できます。実際の返済年には計上できないため、ローン契約年の確定申告が重要。',
    source: '国税庁タックスアンサー No.1127',
    surprise: '★★★',
  },
  {
    id: 'child_medical_escort',
    category: '医療費',
    title: '子どもの通院への付き添い交通費もOK',
    match: (input: UserInput) =>
      (input.family.includes('child_under16') || input.family.includes('child_16to18')) &&
      (input.life.includes('medical_over100k') || input.life.includes('commute_to_hospital')),
    body: '子どもが一人で通院できない年齢の場合、付き添う親の交通費も医療費控除に含められます。子どもの分と合わせてメモを残しておきましょう。',
    source: '国税庁タックスアンサー No.1122',
    surprise: '★★★',
  },
  {
    id: 'medical_family_aggregate',
    category: '医療費',
    title: '医療費控除は家族で一番稼ぐ人が申告すると得',
    match: (input: UserInput) =>
      input.life.includes('medical_over100k') &&
      (input.family.includes('spouse_low') || input.family.includes('child_under16')),
    body: '生計を一にする家族の医療費は合算できます。所得税率が高い人（一番稼いでいる人）が申告すると、控除額は同じでも還付額が大きくなります。',
    source: '国税庁タックスアンサー No.1120',
    surprise: '★★☆',
  },
  {
    id: 'child_away_medical',
    category: '医療費',
    title: '下宿中の子どもの医療費も合算OK',
    match: (input: UserInput) => input.family.includes('child_away'),
    body: '大学等で別居している子どもへの生活費仕送りをしている場合、「生計を一にする」とみなされます。その子どもの医療費も親の確定申告に合算できます。',
    source: '国税庁タックスアンサー No.1120',
    surprise: '★★★',
  },
  {
    id: 'dependent_split',
    category: '家族最適化',
    title: '扶養を夫婦で分けると得なケースがある',
    match: (input: UserInput) =>
      (input.family.includes('child_under16') || input.family.includes('child_16to18') || input.family.includes('child_19to22')) &&
      (input.family.includes('spouse_low') || input.family.includes('spouse_high')),
    body: '複数の子どもがいる場合、全員を一方の扶養にするより夫婦で分散させた方が、住民税の非課税限度額や社会保険の扶養判定に有利なケースがあります。特に夫婦の収入差が小さい場合に要検討。',
    source: '国税庁タックスアンサー No.1191',
    surprise: '★★☆',
  },
  {
    id: 'furusato_ideco_interaction',
    category: '制度の相互影響',
    title: '医療費控除・iDeCoでふるさと納税上限が下がる',
    match: (input: UserInput) =>
      (input.life.includes('medical_over100k') || input.currentDeductions.includes('ideco')) &&
      input.currentDeductions.includes('furusato'),
    body: 'iDeCoや医療費控除を使うと課税所得が下がり、ふるさと納税の控除上限額も連動して下がります。ふるさと納税の上限計算には「控除後の所得」が使われるため、iDeCo加入後や医療費控除申告後に上限を再計算しましょう。',
    source: '総務省ふるさと納税ポータル',
    surprise: '★★★',
  },
  {
    id: 'furusato_medical_conflict',
    category: '制度の相互影響',
    title: '医療費控除するとワンストップ特例が無効になる',
    match: (input: UserInput) =>
      input.life.includes('medical_over100k') &&
      input.currentDeductions.includes('furusato'),
    body: 'ふるさと納税でワンストップ特例を使っていても、医療費控除のために確定申告をすると、ワンストップ特例は無効になります。その場合はふるさと納税も確定申告で申請し直す必要があります。',
    source: '総務省ふるさと納税ポータル',
    surprise: '★★★',
  },
  {
    id: 'specific_expense_books',
    category: 'サラリーマン穴場',
    title: '仕事の本・新聞も特定支出控除の対象',
    match: (input: UserInput) =>
      input.workStyle !== 'freelance' && input.life.includes('work_books'),
    body: '業務上必要な書籍・専門誌・新聞の購入費も特定支出控除の対象です（勤務必要経費として年65万円まで）。会社の証明書が必要ですが、自腹で書籍を多く買っている人は要確認。',
    source: '国税庁タックスアンサー No.1415',
    surprise: '★★★',
  },
  {
    id: 'specific_expense_clothes',
    category: 'サラリーマン穴場',
    title: 'スーツ・制服の自費購入も控除対象',
    match: (input: UserInput) =>
      input.workStyle !== 'freelance' && input.life.includes('work_clothes'),
    body: '職務上着用が必要なスーツや制服を自費で購入した場合、特定支出控除の「勤務必要経費」に含められます（年65万円まで）。私服と明確に区別できるものが対象で、会社の証明が必要。',
    source: '国税庁タックスアンサー No.1415',
    surprise: '★★☆',
  },
  {
    id: 'remote_work_expense',
    category: 'サラリーマン穴場',
    title: '在宅勤務の通信費・電気代が控除対象に',
    match: (input: UserInput) =>
      input.workStyle !== 'freelance' && input.life.includes('remote_work'),
    body: '在宅勤務で業務に使った通信費・電気代の業務使用割合分を特定支出控除に含められます。総務省の計算式（通信費：業務日数/30×1/2）に従って按分し、会社の証明書を取得して申告します。',
    source: '国税庁タックスアンサー No.1415',
    surprise: '★★☆',
  },
  {
    id: 'amended_return',
    category: 'タイミング',
    title: '還付申告は過去5年分まで遡れる',
    match: () => true, // 全員対象
    body: '確定申告で還付を受ける場合（医療費控除・住宅ローン控除の初年度など）、申告書の提出期限（3月15日）を過ぎても5年間は申告可能です。過去に申告し忘れた分も今から取り戻せます。',
    source: '国税庁タックスアンサー No.2030',
    surprise: '★★★',
  },
  {
    id: 'year_end_timing',
    category: 'タイミング',
    title: '年末に高額治療の支払いタイミングを調整する',
    match: (input: UserInput) =>
      input.life.includes('medical_over100k') || input.life.includes('dental_orthodontics'),
    body: '翌年1月払いの治療費を12月中に前払いすると、今年の医療費控除に含められます。逆に今年の医療費がわずかに10万円を下回る場合、翌年1月に繰り越すことで両年分を合算して10万円を超えさせることはできません。同一年の合計で判定されます。',
    source: '国税庁タックスアンサー No.1120',
    surprise: '★★☆',
  },
  {
    id: 'stock_withholding',
    category: '投資',
    title: '源泉徴収あり口座でも確定申告が得なケース',
    match: (input: UserInput) => input.life.includes('stock_loss'),
    body: '源泉徴収ありの特定口座でも、①損失があって他の口座の利益と通算したい場合、②配当控除を受けたい場合、③株式の損失を翌年以降に繰り越したい場合は確定申告をすると得になります。',
    source: '国税庁タックスアンサー No.1463',
    surprise: '★★☆',
  },
  {
    id: 'blue_return',
    category: 'フリーランス',
    title: '青色申告の65万円控除はe-Tax必須',
    match: (input: UserInput) =>
      input.workStyle === 'freelance' || input.workStyle === 'employee_side',
    body: '青色申告特別控除65万円を受けるには、e-Taxでの電子申告または電子帳簿保存が必要です。紙で申告すると55万円控除になります。マイナンバーカードを使ったe-Tax申告で10万円の差。',
    source: '国税庁タックスアンサー No.2072',
    surprise: '★★★',
  },
  {
    id: 'family_salary',
    category: 'フリーランス',
    title: '家族への給与で所得を分散できる',
    match: (input: UserInput) =>
      (input.workStyle === 'freelance' || input.workStyle === 'executive') &&
      (input.family.includes('spouse_low') || input.family.includes('spouse_high')),
    body: '青色申告者は、事業に従事する家族への給与を全額経費にできます（青色事業専従者給与）。配偶者や子どもに適正な給与を払うことで、家族全体の税負担を下げられます。',
    source: '国税庁タックスアンサー No.2075',
    surprise: '★★☆',
  },
  {
    id: 'small_assets',
    category: 'フリーランス',
    title: '30万円未満の備品は全額即時経費',
    match: (input: UserInput) =>
      input.workStyle === 'freelance' || input.workStyle === 'executive',
    body: '青色申告の中小事業者は、取得価額30万円未満の備品（PC・カメラ・家具等）を購入年に全額経費として計上できます（少額減価償却資産の特例）。年間300万円まで。',
    source: '国税庁タックスアンサー No.5408',
    surprise: '★★☆',
  },
  {
    id: 'child_pension_by_parent',
    category: '社会保険料最適化',
    title: '子供の国民年金を親が払うと親の控除になる',
    match: (input: UserInput) =>
      input.family.includes('child_19to22') || input.family.includes('child_away'),
    body: '20歳以上の学生の子の国民年金保険料（2025年度は年約21万円）を親が支払うと、全額が親の社会保険料控除になります。所得税率20%＋住民税10%なら約6.3万円の節税効果。口座振替やクレジットカードは必ず親名義にすることがポイント。',
    source: '国税庁タックスアンサー No.1130',
    surprise: '★★★',
  },
  {
    id: 'family_social_insurance_transfer',
    category: '社会保険料最適化',
    title: '親の後期高齢者医療保険料を口座振替に変えると自分の控除になる',
    match: (input: UserInput) =>
      input.family.includes('parent_over70') || input.family.includes('care_needed'),
    body: '親の後期高齢者医療保険料が年金天引き（特別徴収）のままだと、年金受給者である親の控除になります。口座振替に変更して自分の口座から支払えば、所得税率の高い自分の社会保険料控除として申告できます。市区町村窓口で変更手続きが必要。',
    source: '国税庁タックスアンサー No.1130',
    surprise: '★★★',
  },
  {
    id: 'under16_child_resident_tax',
    category: '家族最適化',
    title: '16歳未満の子を申告書に記載すると住民税が非課税になることがある',
    match: (input: UserInput) => input.family.includes('child_under16'),
    body: '16歳未満の子は所得税の扶養控除対象外ですが、住民税の非課税限度額の判定には扶養親族としてカウントされます。限度額は「35万円×（本人＋扶養人数）＋21万円＋10万円」で計算され、年収の低い親が申告書に記載するだけで住民税が全額非課税になるケースがあります。',
    source: '地方税法第295条',
    surprise: '★★★',
  },
  {
    id: 'ideco_optimal_withdrawal',
    category: 'iDeCo出口戦略',
    title: 'iDeCo受取は「一時金＋年金の併用」で税負担を最小化',
    match: (input: UserInput) => input.currentDeductions.includes('ideco'),
    body: '退職所得控除の範囲内を一時金で受け取り、残りを60〜64歳の間に年金形式（年60万円以下）で受け取ると、公的年金等控除（65歳未満は年60万円）を活用して最大300万円まで非課税で受け取れます。退職金が多い人は年金形式で分散、少ない人は一時金優先が基本戦略です。',
    source: '国税庁タックスアンサー No.1420・No.1600',
    surprise: '★★★',
  },
  {
    id: 'side_job_loss',
    category: 'フリーランス',
    title: '副業赤字で本業の税金が還付されるケース',
    match: (input: UserInput) => input.workStyle === 'employee_side',
    body: '副業が事業所得として認められ赤字になった場合、給与所得と損益通算して税金の還付を受けられる可能性があります。ただし、事業性の認定が厳しくなっており、継続的な事業活動の実態が必要。雑所得とみなされると損益通算不可。',
    source: '国税庁タックスアンサー No.1350',
    surprise: '★★★',
  },
  {
    id: 'life_insurance_3slots',
    category: '保険最適化',
    title: '生命保険料控除の3枠を埋め切ると12万円控除',
    match: (input: UserInput) => input.life.includes('life_insurance'),
    body: '生命保険料控除には「一般生命保険料」「介護医療保険料」「個人年金保険料」の3枠があり、それぞれ最大4万円（所得税）、合計12万円まで控除可能。3枠を埋め切ることで最大限の節税効果を得られます。',
    source: '国税庁タックスアンサー No.1140',
    surprise: '★★☆',
  },
];
