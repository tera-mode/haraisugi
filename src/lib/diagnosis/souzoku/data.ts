import type { InheritanceTip } from './types';

export const INHERITANCE_TIPS: InheritanceTip[] = [
  {
    id: 'life_insurance_exemption',
    title: '生命保険の非課税枠で相続税を節税',
    body: '相続人が受け取る生命保険金には「500万円×法定相続人数」の非課税枠があります。まだ加入していない場合、終身保険に加入して死亡保険金を受け取ることで、相続財産を非課税枠に移すことができます。',
    source: '国税庁タックスアンサー No.4114',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4114.htm',
  },
  {
    id: 'small_scale_land',
    title: '小規模宅地等の特例で土地評価額が最大80%減',
    body: '居住用の土地（330㎡以内）を同居の親族が相続する場合、土地の評価額を80%減額できる「小規模宅地等の特例」が使えます。例えば評価額3,000万円の土地が600万円に減額され、相続税が大幅に軽減されます。',
    source: '国税庁タックスアンサー No.4124',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4124.htm',
  },
  {
    id: 'annual_gift',
    title: '年間110万円の暦年贈与で財産を移転する',
    body: '毎年110万円以内の贈与は贈与税がかかりません。ただし2024年の改正で、相続開始前7年以内の贈与は相続財産に持ち戻されます（改正前は3年）。早めに開始するほど効果が高くなります。',
    source: '国税庁タックスアンサー No.4408',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/zoyo/4408.htm',
  },
  {
    id: 'spouse_deduction',
    title: '配偶者の税額軽減で配偶者はほぼ無税',
    body: '配偶者が相続する財産が1億6,000万円以下、または法定相続分以下であれば相続税がかかりません。ただし、配偶者が亡くなった際の二次相続も考慮した分割設計が重要です。',
    source: '国税庁タックスアンサー No.4158',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4158.htm',
  },
  {
    id: 'consult_specialist',
    title: '相続専門の税理士に相談すると節税額が大きく変わる',
    body: '相続税の申告は複雑で、土地の評価・特例の適用・分割方法によって税額が数百万円単位で変わります。相続発生後10ヶ月以内が申告期限のため、早めに相続専門の税理士に相談することをお勧めします。',
    source: '国税庁 相続税申告の手引き',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4100.htm',
  },
];

// 相続税の税率表（法定相続分に応ずる取得金額）
export const INHERITANCE_TAX_BRACKETS = [
  { limit: 1000,  rate: 0.10, deduction: 0 },
  { limit: 3000,  rate: 0.15, deduction: 50 },
  { limit: 5000,  rate: 0.20, deduction: 200 },
  { limit: 10000, rate: 0.30, deduction: 700 },
  { limit: 20000, rate: 0.40, deduction: 1700 },
  { limit: 30000, rate: 0.45, deduction: 2700 },
  { limit: 60000, rate: 0.50, deduction: 4200 },
  { limit: Infinity, rate: 0.55, deduction: 7200 },
];
