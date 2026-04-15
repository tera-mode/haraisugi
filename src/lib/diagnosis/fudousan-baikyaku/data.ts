import type { RealEstateTip } from './types';

export const REAL_ESTATE_TIPS: RealEstateTip[] = [
  {
    id: 'special_3000man',
    title: '居住用財産の3,000万円特別控除',
    body: '自分が住んでいたマイホームを売る場合、譲渡所得から最大3,000万円を控除できます。売却する年の前年または前々年にこの特例を使っていないこと、売り手と買い手が親族でないことが条件です。住まなくなってから3年を経過する年の12月31日までに売ることが必要です。',
    source: '国税庁タックスアンサー No.3302',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3302.htm',
  },
  {
    id: 'long_term_rate',
    title: '所有期間5年超で税率が大幅低下',
    body: '不動産の所有期間が売却する年の1月1日時点で5年を超えると「長期譲渡所得」として税率が20.315%（所得税15.315%＋住民税5%）になります。5年以下の「短期譲渡所得」は39.63%（所得税30.63%＋住民税9%）と約2倍になります。',
    source: '国税庁タックスアンサー No.3208',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3208.htm',
  },
  {
    id: 'acquisition_cost',
    title: '取得費不明の場合は売却価格の5%で概算',
    body: '購入当時の契約書等が見つからず取得費が不明な場合、概算取得費として「売却価格の5%」を使うことができます。ただし実際の取得費の方が高い場合は実額を使った方が譲渡所得が小さくなります。購入当時の書類（売買契約書・登記関係）は大切に保管しましょう。',
    source: '国税庁タックスアンサー No.3258',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3258.htm',
  },
  {
    id: 'inherited_property',
    title: '相続不動産の取得費加算の特例',
    body: '相続で取得した不動産を相続開始日から3年10ヶ月以内に売却した場合、支払った相続税の一部を取得費に加算できる「取得費加算の特例」が使えます。これにより譲渡所得が減り、税額を圧縮できます。',
    source: '国税庁タックスアンサー No.3267',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3267.htm',
  },
  {
    id: 'loss_deduction',
    title: 'マイホーム売却損は他の所得と損益通算できる場合あり',
    body: 'マイホーム（居住用財産）の売却で損失が生じた場合、一定の要件を満たせば給与所得等と損益通算でき、翌年以降3年間繰り越せます。ただし投資用不動産の損失は他の所得との通算不可です。',
    source: '国税庁タックスアンサー No.3370',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3370.htm',
  },
];
