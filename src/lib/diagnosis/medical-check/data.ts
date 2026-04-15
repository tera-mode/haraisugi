import type { MedicalTip } from './types';

export const ALL_MEDICAL_TIPS: MedicalTip[] = [
  {
    id: 'transport',
    title: '通院交通費も医療費に含められる',
    body: 'バス・電車などの公共交通機関の通院交通費は医療費控除の対象です。タクシーは歩行困難な場合や深夜など緊急時に限り対象。領収書がなくてもメモや手帳への記録でOKです。',
    source: '国税庁タックスアンサー No.1122',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1122.htm',
  },
  {
    id: 'dental_loan',
    title: 'デンタルローンは契約年に全額控除できる',
    body: '歯科矯正のローンを組んだ場合、ローン会社が歯科医院に支払った年に医療費として全額控除できます。分割払いでも支払い完了を待つ必要はありません。',
    source: '国税庁タックスアンサー No.1120',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1120.htm',
  },
  {
    id: 'family_total',
    title: '家族の医療費を合算すると10万円を超えやすい',
    body: '生計を一にする家族全員（配偶者・子ども・同居の親など）の医療費を合算できます。子どもの歯科矯正・親の介護関連費用も含め、世帯全体で確認しましょう。',
    source: '国税庁タックスアンサー No.1120',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1120.htm',
  },
  {
    id: 'otc_generic',
    title: '市販の胃腸薬・鎮痛剤もセルフメディケーション対象',
    body: 'ロキソニン・ガスター・アレグラなどのスイッチOTC医薬品はセルフメディケーション税制の対象です。ドラッグストアのレシートに「★」マークがある商品が目印です。',
    source: '国税庁タックスアンサー No.1129',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1129.htm',
  },
  {
    id: 'low_income_5pct',
    title: '総所得200万円未満なら足切りは5%（10万円より有利）',
    body: '総所得金額が200万円未満の場合、医療費控除の足切り額は10万円ではなく「総所得金額×5%」です。年収約370万円以下の方は対象となる可能性があり、より少ない医療費でも控除が受けられます。',
    source: '国税庁タックスアンサー No.1120',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1120.htm',
  },
  {
    id: 'year_end_timing',
    title: '年末に高額治療の支払いタイミングを調整すると有利',
    body: '医療費控除は「支払った年分」で申告します。12月末か1月初めかで控除を受ける年が変わります。複数年にまたがる場合、同一年に集中させて10万円を超えるように調整すると節税効果が高くなります。',
    source: '国税庁タックスアンサー No.1120',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1120.htm',
  },
];
