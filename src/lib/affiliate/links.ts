export type AffiliateLink = {
  key: string;
  label: string;
  url: string;
  cvCondition: string;
  estimatedReward: string;
};

export const AFFILIATE_LINKS: Record<string, AffiliateLink> = {
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
  // A8.net アフィリエイトリンク（保険見直し本舗 / insId: s00000027364001 / 15,384円/件 EPC 224.58）
  insurance_mitsumoto: {
    key: 'insurance_mitsumoto',
    label: '保険の見直しなら【保険見直し本舗】',
    url: 'https://px.a8.net/svt/ejp?a8mat=4B1KXR+B0IPO2+5V54+5YJRM',
    cvCondition: '無料相談来店完了',
    estimatedReward: '15,384円/件',
  },
  // A8.net アフィリエイトリンク（保険クリニック / insId: s00000027367001 / 12,030円/件 EPC 107.09）
  insurance_hoken_clinic: {
    key: 'insurance_hoken_clinic',
    label: '日本初の保険ショップが約50社を無料で徹底比較！【保険クリニック】',
    url: 'https://px.a8.net/svt/ejp?a8mat=4B1KXR+B43BAQ+5V5Y+5YJRM',
    cvCondition: '無料相談来店完了',
    estimatedReward: '12,030円/件',
  },
  // A8.net アフィリエイトリンク（FPカフェ / insId: s00000027294001 / 11,700円/件 EPC 226.13）
  fp_cafe: {
    key: 'fp_cafe',
    label: '無料で資産形成や保険について相談できる！FPカフェ',
    url: 'https://px.a8.net/svt/ejp?a8mat=4B1R5V+3F8R02+5ULO+5Z6WX',
    cvCondition: '無料相談申込完了',
    estimatedReward: '11,700円/件',
  },
  // A8.net アフィリエイトリンク（マネードットコム / insId: s00000026246001 / 5,000円/件 確定率85.18%）
  money_dotcom: {
    key: 'money_dotcom',
    label: '生命保険の無料相談サービス【マネードットコム】',
    url: 'https://px.a8.net/svt/ejp?a8mat=4B1R5V+2Z61O2+5MIK+5YJRM',
    cvCondition: '無料相談申込完了',
    estimatedReward: '5,000円/件',
  },
  // A8.net アフィリエイトリンク（税理士法人経営サポートプラスアルファ / insId: s00000026111001 / 10,000円/件）
  tax_accountant_keiei: {
    key: 'tax_accountant_keiei',
    label: '法人化の無料相談なら【会社設立専門・税理士法人経営サポートプラスアルファ】',
    url: 'https://px.a8.net/svt/ejp?a8mat=4B1KXR+BIZ5F6+5LH2+5YJRM',
    cvCondition: '無料相談申込完了',
    estimatedReward: '10,000円/件',
  },
  // 旧ダミーリンク（参照用・CTAでは未使用）
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
  // 不動産一括査定（ASP承認後URLを差し替え）
  realestate_query: {
    key: 'realestate_query',
    label: '不動産一括査定で売却価格を確認する',
    url: 'https://www.ieul.jp/',
    cvCondition: '査定申込完了',
    estimatedReward: '1,000〜5,000円/件',
  },
  // 相続税理士紹介（ASP承認後URLを差し替え）
  inheritance_tax: {
    key: 'inheritance_tax',
    label: '相続専門の税理士を探す（無料相談）',
    url: 'https://www.zeiri4.com/',
    cvCondition: '問い合わせ完了',
    estimatedReward: '3,000〜15,000円/件',
  },
  // iDeCo（退職金診断用）
  ideco_rakuten: {
    key: 'ideco_rakuten',
    label: '楽天証券でiDeCoを始める',
    url: 'https://www.rakuten-sec.co.jp/web/ideco/',
    cvCondition: '口座開設申込完了',
    estimatedReward: '数百〜数千円/件',
  },
};
