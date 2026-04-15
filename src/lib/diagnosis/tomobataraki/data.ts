import type { DualIncomeTip } from './types';

export const DUAL_INCOME_TIPS: DualIncomeTip[] = [
  {
    id: 'dependent_high_income',
    title: '扶養控除は年収が高い（税率が高い）方に入れると節税効果が最大',
    body: '扶養控除の控除額は同じでも、所得税率が高い方が申告することで還付額が大きくなります。例えば所得税20%の夫と5%の妻で38万円の扶養控除を比較すると、夫側で約7.6万円、妻側で約1.9万円の差が生じます。',
    source: '国税庁タックスアンサー No.1180',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm',
  },
  {
    id: 'specific_dependent_63',
    title: '19〜22歳の子は「特定扶養控除63万円」が使える',
    body: '大学生世代（19〜22歳）の子は、一般扶養控除38万円ではなく特定扶養控除63万円が適用されます。税率20%の場合、差額25万円×20%=5万円追加で節税できます。2026年改正で子の収入上限が103万円→150万円に拡大されました。',
    source: '国税庁タックスアンサー No.1180',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm',
  },
  {
    id: 'insurance_3slots',
    title: '保険料控除の3枠は夫婦それぞれが使える',
    body: '一般生命保険・介護医療保険・個人年金保険の3枠は夫婦それぞれが持ちます。空き枠がある場合、新しい保険に加入することで最大4万円×空き枠数の控除が追加されます。',
    source: '国税庁タックスアンサー No.1140',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1140.htm',
  },
  {
    id: 'pair_loan_advantage',
    title: 'ペアローンで住宅ローン控除を夫婦それぞれが受けられる',
    body: '夫婦それぞれが債務者となるペアローンは、住宅ローン控除（0.7%）を夫婦それぞれが受けられます。合計控除額が大きくなるケースが多く、特に両者の所得税が十分ある場合に有利です。',
    source: '国税庁タックスアンサー No.1213',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1213.htm',
  },
  {
    id: 'under16_resident_tax',
    title: '16歳未満の子でも妻側に記載すると住民税が非課税になる場合がある',
    body: '16歳未満の子は所得税の扶養控除対象外ですが、住民税では「非課税限度額の計算」に利用できます。収入が少ない妻の側に記載することで、妻が住民税非課税となり国民健康保険料等の軽減につながる場合があります。',
    source: '総務省・住民税の非課税',
    sourceUrl: 'https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/ichiran05_01.html',
  },
  {
    id: 'elderly_parent_same_household',
    title: '同居老親の扶養控除は58万円（別居は48万円）',
    body: '70歳以上の親を扶養に入れる場合、同居なら「同居老親等控除」で所得税58万円、別居なら「老人扶養控除」で48万円となります。どちらの扶養に入れるかで節税額が変わります。',
    source: '国税庁タックスアンサー No.1182',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1182.htm',
  },
];
