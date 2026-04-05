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
  furusato_rakuten: {
    key: 'furusato_rakuten',
    label: '楽天ふるさと納税で上限を確認',
    url: 'https://event.rakuten.co.jp/furusato/',
    cvCondition: '初回寄付完了',
    estimatedReward: '寄付額の1〜4%',
  },
  ideco_rakuten: {
    key: 'ideco_rakuten',
    label: '楽天証券でiDeCoを始める',
    url: 'https://www.rakuten-sec.co.jp/ideco/',
    cvCondition: '口座開設完了',
    estimatedReward: '数百〜数千円/件',
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
  accounting_freee: {
    key: 'accounting_freee',
    label: 'freeeで確定申告を始める',
    url: 'https://www.freee.co.jp/',
    cvCondition: '有料プラン契約',
    estimatedReward: '数百〜数千円/件',
  },
  accounting_mf: {
    key: 'accounting_mf',
    label: 'マネーフォワードで青色申告',
    url: 'https://biz.moneyforward.com/',
    cvCondition: '有料プラン契約',
    estimatedReward: '数百〜数千円/件',
  },
  furusona: {
    key: 'furusona',
    label: 'ふるさと納税AI（furusona）で最適な返礼品を探す',
    url: 'https://furusona.jp',
    cvCondition: '相互送客',
    estimatedReward: '相互送客',
  },
};
