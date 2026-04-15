import type { FurusatoTip } from './types';

export const FURUSATO_TIPS: FurusatoTip[] = [
  {
    id: 'one_stop',
    title: '5自治体以内ならワンストップ特例が便利',
    body: '会社員でふるさと納税先が5自治体以内なら、確定申告不要の「ワンストップ特例制度」が利用できます。申請書を各自治体に提出するだけで控除が完了します。ただし医療費控除等で確定申告が必要な場合は、ワンストップ特例を利用していても確定申告に寄付金控除を含める必要があります。',
    source: '国税庁タックスアンサー No.1155',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1155.htm',
  },
  {
    id: 'deadline',
    title: '年内の寄付が対象・12月31日が締め切り',
    body: 'ふるさと納税の控除対象は1月1日〜12月31日の寄付分です。年末は自治体サイトが混雑するため、遅くとも12月中旬までに手続きを済ませましょう。クレジットカード決済は決済完了日が寄付日とみなされます。',
    source: '総務省ふるさと納税ポータル',
    sourceUrl: 'https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/furusato/mechanism/deduction.html',
  },
  {
    id: 'ideco_interaction',
    title: 'iDeCoとの併用：上限が下がる理由',
    body: 'iDeCoの掛金は「小規模企業共済等掛金控除」として所得控除されるため、課税所得が減ります。課税所得が下がると所得税率が下がる場合があり、住民税所得割も減ります。その結果、ふるさと納税の上限額が若干下がります。ただし節税効果はiDeCoの方が大きいため、iDeCoは最優先で活用すべきです。',
    source: '国税庁「iDeCoと税制」',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1135.htm',
  },
  {
    id: 'mortgage_interaction',
    title: '住宅ローン控除との関係',
    body: '住宅ローン控除は税額控除のため、所得税から控除しきれない分は住民税から差し引かれます。住民税から住宅ローン控除が差し引かれると、ふるさと納税の「住民税所得割×20%」の上限枠が実質的に小さくなり、上限額が下がる場合があります。住宅購入直後は特に影響が大きくなります。',
    source: '国税庁タックスアンサー No.1213',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1213.htm',
  },
  {
    id: 'furusona_recommendation',
    title: '返礼品選びはfursonaがおすすめ',
    body: '上限額がわかったら、何をもらうかが重要です。AIが最適な返礼品を提案してくれるfursonaを使えば、食品・日用品・旅行券など自分に合った返礼品を効率的に選べます。',
  },
];
