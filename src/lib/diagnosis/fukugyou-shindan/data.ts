import type { SideJobTip } from './types';

export const SIDE_JOB_TIPS: SideJobTip[] = [
  {
    id: 'twenty_man_resident_tax',
    title: '20万円以下でも住民税の申告は必要',
    body: '副業所得が20万円以下であれば所得税の確定申告は不要ですが、住民税は1円でも所得が発生した場合は市区町村への申告義務があります。申告を怠ると延滞税が発生する可能性があります。',
    source: '国税庁タックスアンサー No.1900',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1900.htm',
  },
  {
    id: 'business_vs_misc',
    title: '事業所得と雑所得で節税効果が大きく変わる',
    body: '副業が「事業所得」として認められると、赤字を本業の給与所得と損益通算できます。2022年の国税庁改正では収入300万円・帳簿の保存が事業所得の目安とされましたが、それ以下でも継続性・帳簿・開業届で認定される場合があります。',
    source: '国税庁 所得税基本通達35-2',
    sourceUrl: 'https://www.nta.go.jp/law/tsutatsu/kihon/shotoku/05/01.htm',
  },
  {
    id: 'blue_return_65',
    title: '青色申告65万円控除で最大10万円超の節税',
    body: '開業届と青色申告承認申請書を提出し、複式簿記+e-Taxで確定申告すると65万円の特別控除が受けられます。年収500万円の方なら最大約13万円の節税効果があります。freeeやマネーフォワードなら複式簿記でも簡単に対応できます。',
    source: '国税庁タックスアンサー No.2072',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2072.htm',
  },
  {
    id: 'resident_tax_ordinary',
    title: '住民税の「普通徴収」で副業が会社にバレにくくなる',
    body: '確定申告の際に住民税の「普通徴収」を選ぶと、副業分の住民税が自分の口座から直接徴収されます。会社の給与天引きに副業分が上乗せされないため、副業収入が会社に発覚するリスクを下げられます。',
    source: '各市区町村の住民税申告手引き',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1900.htm',
  },
  {
    id: 'expense_recording',
    title: '経費を正しく記録すると課税所得を大幅に圧縮できる',
    body: '副業に使ったPC・通信費・書籍代・セミナー代・交通費は経費として認められます。家事按分（在宅ワークなら家賃・光熱費の一部）も可能。経費が増えるほど課税所得が減り、税負担が軽くなります。領収書は7年間保管が必要です。',
    source: '国税庁タックスアンサー No.2210',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2210.htm',
  },
  {
    id: 'stocks_crypto_special',
    title: '株式・暗号資産は20万円以下でも申告が必要なケースがある',
    body: '株式・FX・暗号資産の利益は通常「雑所得（総合課税または申告分離課税）」として扱われます。特定口座（源泉徴収あり）の株式利益は申告不要ですが、一般口座や暗号資産は金額に関わらず申告が必要なケースがあります。',
    source: '国税庁タックスアンサー No.1525',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1525.htm',
  },
];

export const SIDE_JOB_TYPE_LABELS: Record<string, string> = {
  freelance_writing: 'ライティング・ブログ',
  programming: 'プログラミング・IT',
  design: 'デザイン',
  consulting: 'コンサルティング',
  ecommerce: '物販・せどり',
  rental_income: '不動産賃貸',
  stocks: '株式・FX',
  crypto: '暗号資産',
  rideshare_delivery: 'デリバリー・配送',
  other: 'その他',
};
