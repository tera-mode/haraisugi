import type { RetirementTip } from './types';

export const RETIREMENT_TIPS: RetirementTip[] = [
  {
    id: 'five_year_rule',
    title: 'iDeCoを先に受け取り、5年後に退職金を受け取ると控除を二重に使える',
    body: '退職金とiDeCoを同じ年に受け取ると、退職所得控除は1回しか使えません。しかしiDeCoを先に一時金で受け取り、5年以上（4年超）空けてから退職金を受け取ると、それぞれで独立した退職所得控除が適用されます。例えばiDeCo加入20年・勤続30年なら計1,600万円超の控除が使えます。',
    source: '国税庁タックスアンサー No.1420',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1420.htm',
  },
  {
    id: 'ideco_annuity_advantage',
    title: 'iDeCo年金受取は65歳以上なら年110万円まで非課税',
    body: 'iDeCoを「年金形式」で受け取ると「公的年金等の雑所得」として扱われ、65歳以上なら年110万円、65歳未満なら年60万円が非課税枠（公的年金等控除）となります。ただし公的年金（国民年金・厚生年金）との合算で判定されるため、年金が多い方には不利な場合もあります。',
    source: '国税庁タックスアンサー No.1600',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1600.htm',
  },
  {
    id: 'retirement_deduction_formula',
    title: '退職所得控除は勤続20年超で急増する',
    body: '勤続20年以下は「40万円×勤続年数（最低80万円）」ですが、20年超は「800万円＋70万円×（勤続年数−20年）」に跳ね上がります。勤続30年なら1,500万円、勤続35年なら1,850万円の控除になります。転職歴がある場合は通算勤続年数ではなく最終退職先の年数で計算します。',
    source: '国税庁タックスアンサー No.1420',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1420.htm',
  },
  {
    id: 'half_tax_advantage',
    title: '退職所得は1/2課税の特例で他の所得より圧倒的に有利',
    body: '退職所得は（退職金−退職所得控除）×1/2 が課税対象となります。これは給与所得や事業所得にはない特別なルールです。さらに総合課税ではなく分離課税のため、他の所得が高くても税率が引き上がりません。',
    source: '国税庁タックスアンサー No.1420',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1420.htm',
  },
  {
    id: 'disability_bonus',
    title: '障害者となって退職した場合は控除額に100万円追加',
    body: '障害を理由に退職した場合、退職所得控除額に100万円が加算されます。障害者手帳の交付を受けていること、または精神もしくは身体に著しい障害があることが条件です。',
    source: '国税庁タックスアンサー No.1420',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1420.htm',
  },
  {
    id: 'tax_return_required',
    title: '退職金は源泉徴収されるが確定申告で還付を受けられる場合がある',
    body: '会社から「退職所得の受給に関する申告書」を提出していれば適切に源泉徴収されます。未提出の場合は一律20.42%の源泉徴収が行われ、確定申告で精算が必要です。複数の退職金がある場合や医療費控除等と合算する場合も確定申告が有利です。',
    source: '国税庁タックスアンサー No.1422',
    sourceUrl: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1422.htm',
  },
];
