export type AffiliateLink = {
  key: string;
  label: string;
  url: string;
  cvCondition: string;
  estimatedReward: string;
};

export const AFFILIATE_LINKS: Record<string, AffiliateLink> = {
  furusato_satofuru: {
    key: 'furusato_satofuru',
    label: 'さとふるでふるさと納税をする',
    url: 'https://www.satofull.jp/',
    cvCondition: '初回寄付完了',
    estimatedReward: '寄付額の1〜4%',
  },
  // A8.net アフィリエイトリンク（楽天アフィリエイト / insId: s00000011623001）
  furusato_rakuten: {
    key: 'furusato_rakuten',
    label: '楽天ふるさと納税で上限を確認',
    url: 'https://rpx.a8.net/svt/ejp?a8mat=4B1H1O+2SMA0I+2HOM+BW8O1&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26040900393_4B1H1O_2SMA0I_2HOM_BW8O1%3Fpc%3Dhttps%253A%252F%252Fevent.rakuten.co.jp%252Ffurusato%252F%26m%3Dhttps%253A%252F%252Fevent.rakuten.co.jp%252Ffurusato%252F',
    cvCondition: '寄付完了',
    estimatedReward: '寄付額に応じた報酬',
  },
  // A8.net アフィリエイトリンク（松井証券 iDeCo / insId: s00000018318002 / 確定率87.5%）
  ideco_matsui: {
    key: 'ideco_matsui',
    label: '松井証券でiDeCoを始める（手数料0円）',
    url: 'https://px.a8.net/svt/ejp?a8mat=4B1H1O+30CWVM+3XCC+BXIYQ',
    cvCondition: '口座開設申込完了',
    estimatedReward: '500円/件',
  },
  ideco_sbi: {
    key: 'ideco_sbi',
    label: 'SBI証券でiDeCoを始める',
    url: 'https://www.sbisec.co.jp/ETGate/?_ControlID=WPLETmgR001Control&_PageID=WPLETmgR001Identer&_DataStoreID=DSWPLETmgR001Control&_ActionID=DefaultAction&getFlg=on&burl=search_home&cat1=home&cat2=none&dir=none&file=home_ideco_start.html',
    cvCondition: '口座開設完了',
    estimatedReward: '数百〜数千円/件',
  },
  insurance_review: {
    key: 'insurance_review',
    label: '保険見直しラボで無料相談',
    url: 'https://www.hoken-minaoshi.jp/',
    cvCondition: '無料相談予約完了',
    estimatedReward: '5,000〜15,000円/件',
  },
  tax_accountant_dot: {
    key: 'tax_accountant_dot',
    label: '税理士ドットコムで税理士を探す',
    url: 'https://www.zeiri4.com/',
    cvCondition: '問い合わせ完了',
    estimatedReward: '3,000〜10,000円/件',
  },
  tax_accountant_viscus: {
    key: 'tax_accountant_viscus',
    label: 'ビスカスで税理士に相談',
    url: 'https://www.visucus.com/',
    cvCondition: '問い合わせ完了',
    estimatedReward: '3,000〜10,000円/件',
  },
  // A8.net アフィリエイトリンク（freee会計 / insId: s00000017718057 / EPC: 3.09）
  accounting_freee: {
    key: 'accounting_freee',
    label: 'freeeで確定申告を始める',
    url: 'https://px.a8.net/svt/ejp?a8mat=4B1H1O+38OZCI+3SPO+9FDI8Y',
    cvCondition: '新規導入',
    estimatedReward: '1,500円（通常）/ 20,000円（補助金）',
  },
  // A8.net アフィリエイトリンク（マネーフォワード クラウド / insId: s00000017718074）
  accounting_mf: {
    key: 'accounting_mf',
    label: 'マネーフォワードで青色申告',
    url: 'https://px.a8.net/svt/ejp?a8mat=4B1H1O+3H11TE+3SPO+C8KZDE',
    cvCondition: '新規導入',
    estimatedReward: '2,000円（通常）/ 20,000円（補助金）',
  },
  furusona: {
    key: 'furusona',
    label: 'ふるさと納税AI（furusona）で最適な返礼品を探す',
    url: 'https://furusona.jp',
    cvCondition: '相互送客',
    estimatedReward: '相互送客',
  },
};
