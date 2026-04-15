# 裏技・控除の追加実装指示

## 概要

利用者フィードバックに基づき、エンジェル税制をはじめとする裏技・控除を追加する。  
変更対象ファイルは以下の通り。

| ファイル | 変更内容 |
|----------|----------|
| `src/lib/diagnosis/types.ts` | `LifeOption` に選択肢を追加 |
| `src/components/diagnosis/StepLife.tsx` | UI に新しい選択肢を追加 |
| `src/lib/diagnosis/tricks.ts` | 裏技を 10 件追加 |
| `src/lib/diagnosis/deductions.ts` | 控除を 1 件追加（エンジェル税制 優遇措置A） |

---

## 1. `types.ts` — LifeOption に追加

`LifeOption` の末尾（`crypto` の後）に以下を追加：

```typescript
// 投資（追加）
| 'angel_investment'       // エンジェル投資（スタートアップ出資）
| 'stock_dividend'         // 上場株式の配当収入あり
// 医療（追加）
| 'implant_lasik'          // インプラント・レーシック
| 'infertility_treatment'  // 不妊治療
```

---

## 2. `StepLife.tsx` — カテゴリ内に選択肢を追加

### 医療カテゴリに追加（既存の `commute_to_hospital` の後）

```typescript
{ value: 'implant_lasik', label: 'インプラント・レーシックを受けた' },
{ value: 'infertility_treatment', label: '不妊治療をしている（した）' },
```

### 投資カテゴリに追加（既存の `crypto` の後）

```typescript
{ value: 'angel_investment', label: 'スタートアップに出資した' },
{ value: 'stock_dividend', label: '上場株式の配当収入がある' },
```

---

## 3. `tricks.ts` — 裏技を 10 件追加

`ALL_TRICKS` 配列の末尾に以下を追加する。  
**注意**: `match` 関数の条件・`source` の出典を正確に記述すること。

### 3-1. エンジェル税制で総所得から最大800万円控除

```typescript
{
  id: 'angel_tax',
  category: '投資',
  title: 'エンジェル税制でスタートアップ投資額を総所得から控除',
  match: (input: UserInput) => input.life.includes('angel_investment'),
  body: 'エンジェル税制の優遇措置Aを使うと、対象スタートアップへの投資額−2,000円をその年の総所得金額から控除できます（上限は800万円と総所得×40%の低い方）。令和7年度改正で再投資期間が翌年末まで延長され、FUNDINNOなどのクラウドファンディング経由でも利用可能。確定申告が必要です。',
  source: '国税庁タックスアンサー No.1544・経済産業省エンジェル税制ガイドライン',
  surprise: '★★★',
},
```

### 3-2. 特定親族特別控除（令和7年新設）

```typescript
{
  id: 'specific_relative_special',
  category: '家族最適化',
  title: '19〜22歳の子のバイト年収150万円まで親の63万円控除が維持される',
  match: (input: UserInput) => input.family.includes('child_19to22'),
  body: '令和7年度改正で「特定親族特別控除」が新設。19〜22歳の子（特定扶養親族）の年収上限が103万円→150万円に拡大され、150万円までなら親は従来通り63万円の控除を受けられます。150万〜188万円でも段階的に控除が残ります。年末調整で「特定親族特別控除申告書」の提出が必要。',
  source: '令和7年度税制改正法・国税庁「基礎控除の見直し等について」',
  surprise: '★★★',
},
```

### 3-3. 配当控除（総合課税選択）

```typescript
{
  id: 'dividend_tax_credit',
  category: '投資',
  title: '配当金は総合課税で申告すると税率が下がるケースがある',
  match: (input: UserInput) =>
    input.life.includes('stock_dividend') &&
    ['under300', '300to500', '500to700'].includes(input.income),
  body: '上場株式の配当は通常20.315%の源泉徴収ですが、課税所得695万円以下なら総合課税で申告して配当控除（税額の10%）を受ける方が有利になるケースがあります。所得税率5〜20%の人は検討の価値あり。ただし国民健康保険料に影響する場合があるので要確認。',
  source: '国税庁タックスアンサー No.1250',
  surprise: '★★☆',
},
```

### 3-4. インプラント・レーシックは医療費控除対象

```typescript
{
  id: 'implant_lasik_deduction',
  category: '医療費',
  title: 'インプラント・レーシックは医療費控除の対象',
  match: (input: UserInput) => input.life.includes('implant_lasik'),
  body: 'インプラント（1本30〜50万円）やレーシック（両眼20〜50万円）は治療目的のため医療費控除の対象です。高額なので1回で10万円超を超えやすく、手術を受けた年に確定申告すれば数万〜十数万円の還付が期待できます。分割払いの場合は契約年に全額計上可能。',
  source: '国税庁タックスアンサー No.1128',
  surprise: '★★★',
},
```

### 3-5. 不妊治療費も医療費控除の対象

```typescript
{
  id: 'infertility_treatment',
  category: '医療費',
  title: '不妊治療の自己負担分は医療費控除の対象',
  match: (input: UserInput) => input.life.includes('infertility_treatment'),
  body: '2022年の保険適用拡大後も、保険適用外の治療や自己負担部分は医療費控除に含められます。体外受精・顕微授精など高額になりやすく、助成金を差し引いた自己負担額が10万円を超えれば控除対象。夫婦で所得税率の高い方が申告すると還付額が大きくなります。',
  source: '国税庁タックスアンサー No.1122',
  surprise: '★★☆',
},
```

### 3-6. 賃貸でも家財の地震保険料控除が使える

```typescript
{
  id: 'rental_earthquake_insurance',
  category: '保険最適化',
  title: '賃貸住宅でも家財の地震保険料控除が使える',
  match: (input: UserInput) => input.life.includes('earthquake_insurance'),
  body: '「持ち家じゃないから関係ない」と思いがちですが、賃貸でも家財を対象とした地震保険に加入していれば控除対象（最大5万円）。火災保険の特約として自動付帯している場合もあるので、保険証券を確認してみましょう。',
  source: '国税庁タックスアンサー No.1145',
  surprise: '★★☆',
},
```

### 3-7. ふるさと納税の返礼品は一時所得になりうる

```typescript
{
  id: 'furusato_ichijishotoku',
  category: '制度の相互影響',
  title: 'ふるさと納税の返礼品が年50万円超で課税される',
  match: (input: UserInput) =>
    input.currentDeductions.includes('furusato') &&
    ['1000to1500', 'over1500'].includes(input.income),
  body: 'ふるさと納税の返礼品は一時所得に該当します。他の一時所得（保険の満期金等）と合算して年間50万円（特別控除額）を超えると課税対象に。寄付上限が高い高所得者は返礼品の合計額に注意が必要です。',
  source: '国税庁タックスアンサー No.1490',
  surprise: '★★★',
},
```

### 3-8. 暗号資産の年末損出し

```typescript
{
  id: 'crypto_loss_harvest',
  category: '投資',
  title: '暗号資産の「損出し」で雑所得を圧縮できる',
  match: (input: UserInput) => input.life.includes('crypto'),
  body: '含み損のある暗号資産を年末に一旦売却して損失を確定させ、すぐ買い戻す「損出し」テクニック。暗号資産の利益は雑所得として最大55%課税されるため、同じ雑所得内で損益通算することで税額を大幅に圧縮できます。取引記録は必ず保存しておくこと。',
  source: '国税庁「暗号資産に関する税務上の取扱いについて」',
  surprise: '★★★',
},
```

### 3-9. 副業の家賃・通信費の按分経費化

```typescript
{
  id: 'side_job_home_expense',
  category: 'フリーランス',
  title: '副業で自宅家賃・通信費の一部を経費にできる',
  match: (input: UserInput) => input.workStyle === 'employee_side',
  body: '副業を事業所得として申告する場合、自宅の家賃・光熱費・通信費を業務使用割合で按分して経費計上できます。例えば自宅の20%を作業スペースとして使っているなら、家賃の20%が経費に。按分根拠（面積比・時間比）を記録しておくことがポイント。雑所得の場合は経費計上に制限があるため注意。',
  source: '国税庁タックスアンサー No.2210',
  surprise: '★★☆',
},
```

### 3-10. 住宅ローン控除と繰り上げ返済のタイミング

```typescript
{
  id: 'housing_loan_prepay_timing',
  category: 'タイミング',
  title: '住宅ローンの繰り上げ返済は1月以降にすると控除額を維持できる',
  match: (input: UserInput) =>
    input.life.includes('housing_loan') ||
    input.currentDeductions.includes('housing_loan_deduction'),
  body: '住宅ローン控除は「12月31日時点の年末残高×0.7%」で計算されます。12月中に繰り上げ返済すると年末残高が減り、控除額が下がります。同じ金額を繰り上げ返済するなら、1月に回すだけで今年の控除額を維持でき、数千〜数万円の差が出ることがあります。',
  source: '国税庁タックスアンサー No.1213',
  surprise: '★★★',
},
```

---

## 4. `deductions.ts` — エンジェル税制（控除として追加）

`ALL_DEDUCTIONS` 配列の末尾に以下を追加：

```typescript
{
  id: 'angel_tax_deduction',
  name: 'エンジェル税制（優遇措置A）',
  match: (input: UserInput) =>
    input.life.includes('angel_investment'),
  savings: (input: UserInput) => {
    const income = getIncomeCenter(input);
    const rate = getTaxRate(income);
    // 投資額は不明なので控除効果の目安を表示
    const saving = Math.round(100 * (rate + 0.10) * 10) / 10;
    return `投資額に応じて 年間 数万〜${saving}万円以上の節税（投資額−2,000円を所得控除）`;
  },
  urgency: 'medium',
  description: 'エンジェル税制の優遇措置Aでは、対象スタートアップへの投資額−2,000円をその年の総所得金額から控除できます。控除上限は800万円と総所得×40%の低い方。令和7年度改正で再投資期間が翌年末まで延長されました。FUNDINNOなどのクラウドファンディング経由でも利用可能です。',
  action: 'エンジェル税制対象のスタートアップに投資し、確定申告で優遇措置Aまたは優遇措置Bを選択して申告する',
  deadline: '投資は年内（令和7年改正後は翌年末まで可）。確定申告は翌年3月15日',
  difficulty: 'やや手間',
},
```

---

## 5. テスト・動作確認

実装後に以下を確認すること：

1. **型エラーなし**: `npm run build` が通ること
2. **StepLife の表示**: 医療カテゴリに「インプラント・レーシック」「不妊治療」、投資カテゴリに「スタートアップに出資」「配当収入」が表示されること
3. **裏技の出し分け**: 以下の入力パターンで対応する裏技が結果画面に表示されること
   - 投資 → `angel_investment` 選択 → エンジェル税制の裏技 + 控除が出る
   - 家族 → `child_19to22` 選択 → 特定親族特別控除の裏技が出る
   - 投資 → `stock_dividend` + 年収500〜700万 → 配当控除の裏技が出る
   - 医療 → `implant_lasik` 選択 → インプラント・レーシック裏技が出る
   - 医療 → `infertility_treatment` 選択 → 不妊治療裏技が出る
   - 投資 → `crypto` 選択 → 暗号資産損出し裏技が出る
   - 住宅 → `housing_loan` 選択 → 繰り上げ返済タイミング裏技が出る
4. **既存の裏技に影響がないこと**: 変更前と同じ入力で同じ結果が出ること

---

## 6. 補足：出典の正確性について

各裏技の `source` に記載した国税庁タックスアンサーの番号は、実装時に最新の国税庁サイトで正しいか再確認すること。特に令和7年度改正関連（特定親族特別控除・エンジェル税制の再投資期間延長）は新設条文のため、タックスアンサー番号が変更・追加されている可能性がある。