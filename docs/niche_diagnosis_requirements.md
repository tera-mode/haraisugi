# haraisugi.jp ニッチ節税診断 拡張要件書

## 概要

haraisugi.jp の既存アーキテクチャ（ステップ入力→条件分岐→結果＋CTA）を流用し、7 つのニッチ節税診断メニューをサブディレクトリとして追加する。各診断は既存の「税金払いすぎ診断」と同等のボリューム（診断エンジン＋裏技データ＋CTA＋SEO 記事群）を持つ。

**運営**: 合同会社LAIV  
**ホスティング**: Vercel  
**技術スタック**: Next.js (App Router) + TypeScript + Tailwind CSS + Firebase (Firestore)

---

## 全体アーキテクチャ

### ディレクトリ構成（追加分）

```
src/
├── app/
│   ├── medical-check/          # 診断1: 医療費 vs セルフメディケーション
│   │   └── page.tsx
│   ├── tomobataraki/           # 診断2: 共働き最適配分
│   │   └── page.tsx
│   ├── taishoku-sim/           # 診断3: 退職金・iDeCo受取戦略
│   │   └── page.tsx
│   ├── fukugyou-shindan/       # 診断4: 副業の申告判定
│   │   └── page.tsx
│   ├── souzoku/                # 診断5: 相続税かんたん試算
│   │   └── page.tsx
│   ├── furusato-limit/         # 診断6: ふるさと納税上限（併用対応）
│   │   └── page.tsx
│   ├── fudousan-baikyaku/      # 診断7: 不動産売却シミュレーション
│   │   └── page.tsx
│   ├── tools/                  # 診断メニューハブページ
│   │   └── page.tsx
│   └── articles/
│       └── [slug]/
│           └── page.tsx        # 既存（全テーマの記事を収容）
├── components/
│   ├── diagnosis/
│   │   ├── shared/             # 全診断共通コンポーネント（新設）
│   │   │   ├── DiagnosisShell.tsx    # ウィザード共通シェル
│   │   │   ├── StepContainer.tsx     # ステップ枠
│   │   │   ├── ResultLayout.tsx      # 結果画面共通レイアウト
│   │   │   ├── NumberInput.tsx       # 金額入力UI
│   │   │   └── ComparisonTable.tsx   # 比較結果テーブル
│   │   ├── medical-check/      # 診断1固有コンポーネント
│   │   ├── tomobataraki/       # 診断2固有コンポーネント
│   │   ├── taishoku-sim/       # 診断3固有コンポーネント
│   │   ├── fukugyou-shindan/   # 診断4固有コンポーネント
│   │   ├── souzoku/            # 診断5固有コンポーネント
│   │   ├── furusato-limit/     # 診断6固有コンポーネント
│   │   └── fudousan-baikyaku/  # 診断7固有コンポーネント
│   └── common/
│       ├── DiagnosisMenuCard.tsx   # ハブページ用カード
│       └── CrossLinkBanner.tsx     # 診断間回遊バナー
├── lib/
│   ├── diagnosis/
│   │   ├── income-tax/         # 既存の本体診断（変更なし）
│   │   ├── medical-check/      # 診断1エンジン
│   │   │   ├── engine.ts
│   │   │   ├── types.ts
│   │   │   └── data.ts
│   │   ├── tomobataraki/       # 診断2エンジン
│   │   │   ├── engine.ts
│   │   │   ├── types.ts
│   │   │   └── data.ts
│   │   ├── taishoku-sim/       # 診断3エンジン
│   │   ├── fukugyou-shindan/   # 診断4エンジン
│   │   ├── souzoku/            # 診断5エンジン
│   │   ├── furusato-limit/     # 診断6エンジン
│   │   └── fudousan-baikyaku/  # 診断7エンジン
│   ├── affiliate/
│   │   └── links.ts            # 既存＋新規アフィリエイトリンク追加
│   └── seo-articles/
│       └── article-contents.ts # 既存＋新規記事追加
```

### 共通設計原則

- すべての診断はクライアントサイドで完結（API コールなし）
- 免責表示 `<Disclaimer />` を全画面に常時表示
- 結果画面にはアフィリエイト CTA を診断結果に応じて動的表示
- 各診断の結果画面から他の診断への回遊リンクを設置
- GA4 カスタムイベントを診断ごとに発火（`diagnosis_start`、`diagnosis_complete`、`affiliate_click`）
- 税理士法第 52 条対策として「シミュレーション」「概算」の表現を使用し「税務相談」は使わない
- 出典（国税庁タックスアンサー等）を結果画面に明記

---

## 全体作業手順（マスタープラン）

### Phase 0: 共通基盤の整備

**目的**: 7 診断で共有する UI コンポーネント・ユーティリティ・ハブページを先に作る。

| # | タスク | 詳細 |
|---|--------|------|
| 0-1 | 共通コンポーネント設計・実装 | `DiagnosisShell`（ウィザード共通シェル: プログレスバー・ナビボタン・タイトル・免責表示を内包）、`StepContainer`、`ResultLayout`、`NumberInput`（万円単位入力・カンマ表示）、`ComparisonTable` を作成 |
| 0-2 | 診断メニューハブページ | `/tools/` にカード型一覧ページを作成。各診断への導線＋簡単な説明。本体トップからもリンク |
| 0-3 | 回遊バナーコンポーネント | `CrossLinkBanner.tsx` — 診断結果画面の末尾に「こちらの診断もおすすめ」を表示。診断間の相互リンクを実現 |
| 0-4 | アフィリエイトリンク拡張 | `links.ts` に新規案件を追加（不動産一括査定・相続税理士紹介・ふるさと納税ポータル等）。ASP の承認後にURLを差し替え |
| 0-5 | サイトマップ・メタデータ拡張 | `sitemap.ts` に新規パスを追加。各診断ページの `metadata.ts` にタイトル・description・OGP を設定 |
| 0-6 | 構造化データ拡張 | 各診断ページに `WebApplication` 型の JSON-LD を追加（`structured-data.ts` 拡張） |

---

### Phase 1〜7: 各診断の個別実装

**各 Phase は以下の統一手順で実行する（Phase 内のタスクは順番に実行）**:

```
Step A: 調査（リサーチ）
  → 国税庁タックスアンサー・税制の正確な条件・計算式を調査
  → 競合の既存ツール・記事を調査し差別化ポイントを特定
  → アフィリエイト案件の調査（ASP別の報酬・条件）

Step B: 型定義・マスターデータ設計
  → types.ts（ユーザー入力型・診断結果型）
  → data.ts（控除マスター・裏技マスター・判定条件）

Step C: 診断エンジン実装
  → engine.ts（条件分岐ロジック・計算ロジック）
  → ユニットテスト（代表的な入力パターン 5 件以上）

Step D: UI 実装
  → ステップコンポーネント（入力画面 2〜5 ステップ）
  → 結果画面コンポーネント（ヒーロー・詳細・CTA・回遊リンク）
  → ページコンポーネント（page.tsx）

Step E: SEO 記事作成
  → ピラー記事 1 本（3,000〜8,000 字）
  → クラスター記事 3〜5 本（2,000〜5,000 字）
  → 各記事に FAQ スキーマ（JSON-LD）
  → 記事→診断ツール CTA を 3 箇所に設置
  → 内部リンク設計（本体診断・他のニッチ診断・既存記事への相互リンク）

Step F: 統合テスト・動作確認
  → ビルド確認（`npm run build` エラーなし）
  → 全ステップの操作確認
  → レスポンシブ表示確認
  → GA4 イベント発火確認
```

---

## Phase 1: 医療費控除 vs セルフメディケーション判定

### パス・メタデータ

| 項目 | 内容 |
|------|------|
| URL | `/medical-check/` |
| タイトル | 医療費控除とセルフメディケーション税制どっちが得？自動判定ツール |
| description | 年間の医療費とOTC医薬品購入額を入力するだけで、あなたに有利な制度を自動判定。還付額の差額まで計算します。 |
| ターゲット | 子育て世帯・共働き夫婦（30〜45歳） |

### Step A: 調査指示

Claude Code への指示:

```
以下を調査し、調査結果を src/lib/diagnosis/medical-check/RESEARCH.md に保存せよ。

1. 国税庁タックスアンサー No.1120（医療費控除）を確認し、以下を整理:
   - 控除額の計算式（総所得200万円未満の場合の5%ルール含む）
   - 対象となる医療費の範囲（交通費、デンタルローン、歯科矯正の扱い）
   - 家族合算のルール（生計を一にする親族の範囲）

2. 国税庁タックスアンサー No.1129（セルフメディケーション税制）を確認し、以下を整理:
   - 控除額の計算式（12,000円を超える部分、上限88,000円）
   - 「特定の取組み」の具体的な要件
   - スイッチOTC医薬品の判別方法

3. 両制度の併用不可ルールを確認

4. 所得税率の早見表（年収帯→課税所得→税率の対応表）を作成
   - 給与所得控除の計算式（2025年分）
   - 基礎控除・社会保険料控除（概算15%）を加味した実効税率表

5. 競合調査: 「医療費控除 セルフメディケーション どっち」で上位10件の構成を確認
```

### Step B: 型定義・マスターデータ

```typescript
// src/lib/diagnosis/medical-check/types.ts

export type MedicalCheckInput = {
  annualIncome: number;           // 年収（万円）
  totalMedicalExpenses: number;   // 年間医療費合計（円）
  otcDrugExpenses: number;        // 年間OTC医薬品購入額（円）
  hasHealthCheckup: boolean;      // 特定の取組み（健診・予防接種等）を実施したか
  familySize: number;             // 家族の人数（医療費合算対象）
  insuranceReimbursement: number; // 保険金等で補填される金額（円）
};

export type MedicalCheckResult = {
  recommendation: 'medical' | 'self_medication' | 'neither';
  medicalDeduction: number;       // 医療費控除の控除額
  medicalRefund: number;          // 医療費控除の還付額
  selfMedDeduction: number;       // セルフメディケーション控除額
  selfMedRefund: number;          // セルフメディケーション還付額
  difference: number;             // 差額（有利な方 - 不利な方）
  taxRate: number;                // 適用される所得税率
  tips: MedicalTip[];             // 裏技・アドバイス
};

export type MedicalTip = {
  id: string;
  title: string;
  body: string;
  source: string;
  sourceUrl: string;
};
```

### Step C: 診断エンジン

```
Claude Code への指示:

src/lib/diagnosis/medical-check/engine.ts を実装せよ。

RESEARCH.md の調査結果に基づき、以下のロジックを実装:

1. 年収から課税所得・所得税率を算出する関数
   - 給与所得控除の計算（年収別の段階的控除）
   - 基礎控除48万円
   - 社会保険料控除（年収×15%で概算）
   - 課税所得に対する所得税率の判定

2. 医療費控除の計算
   - (医療費 - 保険補填額 - 10万円 or 総所得×5%) を算出
   - 上限200万円

3. セルフメディケーション税制の計算
   - (OTC薬代 - 12,000円) を算出
   - 上限88,000円
   - hasHealthCheckup が false の場合は適用不可

4. 比較判定
   - 両方の還付額を計算し、有利な方を recommendation にセット
   - どちらも条件を満たさない場合は 'neither'

5. 裏技の条件マッチング
   - 「通院交通費も医療費に含められる」
   - 「デンタルローンは契約年に全額控除」
   - 「家族の医療費を合算すると10万円を超えるケースが多い」
   - 「市販の胃腸薬・鎮痛剤もOTC対象の場合がある」
   - 「総所得200万円未満なら10万円ではなく5%が足切りライン」
   - 「年末に高額治療の支払いタイミングを調整する」

6. ユニットテストを src/lib/diagnosis/medical-check/engine.test.ts に作成
   - テストケース: 年収500万・医療費15万・OTC薬0 → 医療費控除が有利
   - テストケース: 年収500万・医療費5万・OTC薬3万 → セルフメディケーションが有利
   - テストケース: 年収300万・医療費8万（200万未満ルール適用）
   - テストケース: 健診未実施 → セルフメディケーション適用不可
   - テストケース: 両方とも条件未達 → 'neither'
```

### Step D: UI 実装

```
Claude Code への指示:

以下のコンポーネントを実装せよ。既存の DiagnosisShell を使用。

■ ステップ1: 年収の選択
  - 既存の StepIncome と同じ年収帯チップ UI を流用
  - 6段階: 300万未満 / 300〜500万 / 500〜700万 / 700〜1,000万 / 1,000〜1,500万 / 1,500万以上

■ ステップ2: 医療費の入力
  - 年間医療費合計（万円単位の NumberInput）
  - 保険金等の補填額（万円単位の NumberInput、デフォルト0）
  - 家族人数（1〜8の選択）
  - ヘルプテキスト:「医療費には通院交通費・歯科治療・入院費・処方薬代を含みます」

■ ステップ3: OTC医薬品・健診の入力
  - 年間OTC医薬品購入額（万円単位の NumberInput）
  - 今年、健康診断・予防接種等を受けたか（Yes/No トグル）
  - ヘルプテキスト:「会社の定期健康診断もOKです」

■ 結果画面
  - ヒーローセクション:
    - 「あなたには【医療費控除 / セルフメディケーション税制】が有利です」
    - 「推定還付額: ○○円」「差額: ○○円」
  - 比較テーブル（ComparisonTable使用）:
    | 項目 | 医療費控除 | セルフメディケーション税制 |
    | 控除額 | ○○円 | ○○円 |
    | 還付額 | ○○円 | ○○円 |
    | 判定 | ★有利 / — | — / ★有利 |
  - 裏技セクション: マッチした tips を表示
  - CTA セクション:
    - 「もっと詳しく→税金払いすぎ診断で全控除をチェック」（本体への回遊）
    - 保険見直し CTA（保険見直しラボ）
    - 複雑なら税理士相談 CTA（税理士ドットコム）
  - 回遊バナー: 「共働きの方はこちら→扶養・控除の最適配分診断」

■ ページ: src/app/medical-check/page.tsx
  - メタデータ設定（タイトル・description・OGP）
  - JSON-LD（WebApplication型）
  - Disclaimer 常時表示
```

### Step E: SEO 記事

```
Claude Code への指示:

以下の記事を src/lib/seo-articles/article-contents.ts に追加せよ。
既存の記事フォーマット（sections / faqs / summary 構造）に準拠。

■ ピラー記事（1本）
slug: 'iryouhi-self-medication-hikaku'
タイトル: 「医療費控除とセルフメディケーション税制どっちが得？判定フローチャートと年収別シミュレーション【2026年版】」
構成:
  - H2: 医療費控除とセルフメディケーション税制の違いを30秒で理解
  - H2: あなたはどっちが得？判定フローチャート
  - H2: 年収別の還付額シミュレーション（500万/700万/1,000万の3パターン）
  - H2: 医療費控除の裏技5選（交通費・デンタルローン・家族合算etc）
  - H2: セルフメディケーション税制の「特定の取組み」を確認する方法
  - H2: 併用は不可！選び方の最終チェックリスト
  - H2: よくある質問（FAQ 5問）
  - H2: まとめ
  CTA: 3箇所（冒頭・シミュレーション表直後・末尾）→ /medical-check/ へ
  内部リンク: 本体診断、共働き診断、医療費控除裏技記事(#11)、生命保険料控除記事(#16)

■ クラスター記事（4本）
1. slug: 'iryouhi-koujo-urawaza'
   タイトル:「医療費控除の裏技7選｜通院交通費・家族合算・10万円以下でも使えるケース」
   ※既存記事#11の内容を補完・拡張。/medical-check/ へのCTA追加

2. slug: 'self-medication-taishou-list'
   タイトル:「セルフメディケーション税制の対象医薬品リスト｜ドラッグストアで見分ける方法」

3. slug: 'iryouhi-koujo-ikura-modoru'
   タイトル:「医療費控除でいくら戻る？年収300万〜1,500万の還付額一覧表」
   ※既存記事#12の内容を補完・拡張

4. slug: 'shika-kyousei-iryouhi-koujo'
   タイトル:「子どもの歯科矯正は医療費控除の対象？条件と計算例をわかりやすく解説」

各記事に以下を設置:
- FAQスキーマ（JSON-LD）3〜5問
- CTA 3箇所 → /medical-check/
- 内部リンク 3本以上
- 関連記事セクション 5本
```

### Step F: 統合テスト

```
Claude Code への指示:

1. npm run build でエラーがないことを確認
2. /medical-check/ にアクセスし、全ステップの操作を確認
3. 結果画面のCTAリンクが正しいことを確認
4. /articles/ 以下に新規記事が正しく表示されることを確認
5. レスポンシブ表示（モバイル幅375px）で崩れがないことを確認
```

---

## Phase 2: 共働き世帯の扶養・控除 最適配分診断

### パス・メタデータ

| 項目 | 内容 |
|------|------|
| URL | `/tomobataraki/` |
| タイトル | 共働き夫婦の控除、どっちに入れるのが得？最適配分シミュレーション |
| description | 夫婦の年収・子の年齢・住宅ローンを入力するだけで、扶養控除・住宅ローン控除・保険料控除の最適な振り分けを自動提案。 |
| ターゲット | 共働き夫婦（30〜45歳、子持ち） |

### Step A: 調査指示

```
以下を調査し、src/lib/diagnosis/tomobataraki/RESEARCH.md に保存せよ。

1. 扶養控除の要件・控除額（一般38万円 / 特定63万円 / 老人同居58万円等）
2. 配偶者控除・配偶者特別控除の所得制限と段階的減額
3. 住宅ローン控除の基本（控除率0.7%、上限額、省エネ基準、共有持分の扱い）
4. ペアローンの場合の控除計算
5. 生命保険料控除（旧制度・新制度の上限額、一般・介護医療・個人年金の3枠）
6. 地震保険料控除（上限5万円）
7. 「扶養控除を年収の高い方に入れた方が得」の計算根拠（税率差による節税効果）
8. 住民税の扶養控除額（所得税と異なる: 一般33万円 / 特定45万円等）
9. 16歳未満の子の住民税非課税限度額への影響

10. 競合調査: 「共働き 扶養 どっち」「共働き 節税」で上位10件を確認
```

### Step B: 型定義

```typescript
// src/lib/diagnosis/tomobataraki/types.ts

export type DualIncomeInput = {
  husbandIncome: number;          // 夫の年収（万円）
  wifeIncome: number;             // 妻の年収（万円）
  children: ChildInfo[];          // 子どもの情報
  elderlyParent: ElderlyParentInfo | null; // 高齢の親
  housingLoan: HousingLoanInfo | null;     // 住宅ローン
  insuranceHusband: InsuranceInfo;  // 夫の保険加入状況
  insuranceWife: InsuranceInfo;     // 妻の保険加入状況
};

export type ChildInfo = {
  age: 'under16' | '16to18' | '19to22' | '23plus';
  currentParent: 'husband' | 'wife' | 'none'; // 現在どちらの扶養に入れているか
};

export type ElderlyParentInfo = {
  age: '70plus_living_together' | '70plus_not_together' | 'under70';
  currentParent: 'husband' | 'wife' | 'none';
  careNeeded: boolean;            // 要介護認定あり
};

export type HousingLoanInfo = {
  type: 'single_husband' | 'single_wife' | 'pair_loan' | 'joint';
  remainingBalance: number;       // 残高（万円）
  husbandShare: number;           // 夫の持分割合（%）: pair_loanの場合
};

export type InsuranceInfo = {
  lifeInsurance: boolean;         // 一般生命保険
  medicalInsurance: boolean;      // 介護医療保険
  pensionInsurance: boolean;      // 個人年金保険
  earthquakeInsurance: boolean;   // 地震保険
};

export type DualIncomeResult = {
  currentTax: { husband: number; wife: number; total: number };
  optimalTax: { husband: number; wife: number; total: number };
  savings: number;                // 最適化による年間節税額
  recommendations: Recommendation[];
  unusedDeductions: UnusedDeduction[]; // 空き枠
  tips: DualIncomeTip[];
};

export type Recommendation = {
  item: string;                   // 「扶養控除（特定）」「住宅ローン控除」等
  current: string;                // 現在の配分
  optimal: string;                // 最適な配分
  effect: number;                 // 節税効果（円）
  reason: string;                 // 理由
};

export type UnusedDeduction = {
  name: string;
  description: string;
  potentialSavings: string;
  affiliateKey?: string;
};
```

### Step C: 診断エンジン

```
Claude Code への指示:

src/lib/diagnosis/tomobataraki/engine.ts を実装せよ。

1. 夫婦それぞれの課税所得・所得税率を算出
2. 扶養控除の最適配分を計算
   - 各子ども・親について、夫側/妻側に入れた場合の税額を比較
   - 税率が高い方に入れるのが基本だが、配偶者特別控除の段階的減額も考慮
3. 住宅ローン控除の最適配分
   - ペアローンの場合: 控除額が所得税額を超える場合、住民税からの控除上限（97,500円）も加味
4. 保険料控除の空き枠チェック
   - 3枠×2人分の利用状況を確認し、空きがあれば提案
5. 16歳未満の子の住民税非課税限度額チェック
   - 妻の年収が限度額付近の場合、16歳未満の子を妻側に記載する提案
6. 全組み合わせの中から最適パターンを選出

テストケース:
- 夫700万・妻400万・特定扶養の子1人 → 夫側が有利
- 夫500万・妻500万・ペアローン → 持分按分の最適化
- 夫1,000万・妻150万・16歳未満の子2人 → 住民税非課税の活用
- 夫600万・妻300万・保険枠に空き → 保険加入提案
```

### Step D: UI 実装

```
■ ステップ1: 夫婦の年収
  - 夫の年収帯（チップ）+ 妻の年収帯（チップ）

■ ステップ2: 子ども・家族
  - 子どもの追加UI（年齢区分を選択、現在の扶養先を選択）
  - 高齢の親（有/無、同居/別居、要介護有無）

■ ステップ3: 住宅・保険
  - 住宅ローン（なし / 夫単独 / 妻単独 / ペアローン / 連帯債務）
  - 残高入力（ペアローンは持分割合も）
  - 夫の保険加入状況（3枠チェックボックス）
  - 妻の保険加入状況（3枠チェックボックス）

■ 結果画面
  - ヒーロー:「最適配分にすると年間○○円お得！」
  - 配分比較テーブル: 各控除項目の現在→最適を矢印で表示
  - 空き枠セクション:「保険料控除の空き枠が○つあります」→ 保険見直しCTA
  - CTA: iDeCo・ふるさと納税上限診断・保険見直しラボ・税理士ドットコム
  - 回遊バナー: 本体診断、ふるさと納税上限診断
```

### Step E: SEO 記事

```
■ ピラー記事（1本）
slug: 'tomobataraki-setsuzei-guide'
タイトル:「共働き夫婦の節税最適化ガイド｜扶養・住宅ローン・保険をどう分けるか【2026年版】」

■ クラスター記事（4本）
1. 'tomobataraki-fuyou-docchi' — 「共働きの扶養控除、夫と妻どっちに入れるのが得？年収別シミュレーション」
2. 'pair-loan-setsuzei' — 「ペアローンの節税メリットと注意点｜共働き夫婦が知るべき控除の仕組み」
3. 'tomobataraki-hoken-koujo' — 「共働き夫婦の保険料控除、枠を使い切る方法｜夫婦で最大24万円控除」
4. 'under16-juminzei-hikazei' — 「16歳未満の子の扶養申告で住民税が非課税に？知られていない仕組みを解説」
```

---

## Phase 3: 退職金・iDeCo受取 最適戦略シミュレーション

### パス・メタデータ

| 項目 | 内容 |
|------|------|
| URL | `/taishoku-sim/` |
| タイトル | 退職金とiDeCo、一括？年金？あなたの最適な受取方法を診断 |
| description | 勤続年数・退職金額・iDeCo残高を入力して、一時金・年金・併用の3パターンの税額を比較。5年ルール・19年ルールも自動判定。 |
| ターゲット | 退職が近い50代（三次ターゲット） |

### Step A: 調査指示

```
以下を調査し、src/lib/diagnosis/taishoku-sim/RESEARCH.md に保存せよ。

1. 退職所得控除の計算式
   - 勤続20年以下: 40万円×勤続年数（最低80万円）
   - 勤続20年超: 800万円＋70万円×（勤続年数-20年）
   - 障害者の場合の加算（＋100万円）

2. 退職所得の計算
   - (退職金 - 退職所得控除) × 1/2 = 退職所得
   - 退職所得に対する所得税・住民税の計算

3. iDeCoの受取方法と税金
   - 一時金受取（退職所得扱い）
   - 年金受取（雑所得・公的年金等控除）
   - 併用受取

4. 5年ルール（前年以前4年以内の退職所得控除の調整）
   - iDeCoを先に一時金で受け取り、5年以上空けて退職金を受け取る場合
   - 退職金を先に受け取り、iDeCoを後から受け取る場合の19年ルール

5. 公的年金等控除の金額
   - 65歳未満: 年60万円まで非課税
   - 65歳以上: 年110万円まで非課税

6. 具体的な最適パターンの計算例
   - 勤続30年・退職金2,000万円・iDeCo残高500万円のケース
   - 勤続25年・退職金1,000万円・iDeCo残高300万円のケース
```

### Step B: 型定義

```typescript
// src/lib/diagnosis/taishoku-sim/types.ts

export type RetirementInput = {
  yearsOfService: number;         // 勤続年数
  retirementBenefit: number;      // 退職金（万円）
  idecoBalance: number;           // iDeCo残高（万円）
  idecoContributionYears: number; // iDeCo加入年数
  plannedRetirementAge: number;   // 退職予定年齢
  idecoReceiveAge: number;        // iDeCo受取予定年齢
  publicPensionAnnual: number;    // 公的年金の年額（万円）
  hasDisability: boolean;         // 障害者加算の有無
};

export type RetirementResult = {
  patterns: ReceivePattern[];     // 受取パターン3種の比較
  bestPattern: string;            // 最適パターンのID
  totalSavings: number;           // 最悪パターンとの差額
  fiveYearRuleApplies: boolean;   // 5年ルールの適用有無
  nineteenYearRuleApplies: boolean;
  warnings: string[];             // 注意事項
  tips: RetirementTip[];
};

export type ReceivePattern = {
  id: 'lump_sum' | 'annuity' | 'hybrid';
  label: string;
  retirementTax: number;          // 退職金にかかる税金
  idecoTax: number;               // iDeCoにかかる税金
  totalTax: number;               // 合計税額
  netReceive: number;             // 手取り合計
  description: string;
  breakdown: TaxBreakdown;
};

export type TaxBreakdown = {
  retirementDeduction: number;    // 退職所得控除額
  taxableRetirement: number;      // 課税退職所得
  incomeTax: number;
  residentTax: number;
  pensionDeduction: number;       // 公的年金等控除（年金受取の場合）
};
```

### Step C〜F: （Phase 1と同じ手順パターンで実装）

```
エンジンの核心ロジック:
- 3パターン（一括・年金・併用）の税額をそれぞれ計算
- 5年ルール・19年ルールの適用判定
- 併用パターンでは「退職所得控除の範囲内を一時金、残りを年金」の最適分割点を探索
- 結果画面に3パターンの比較テーブルを表示
- 税理士相談CTAを全パターン共通で表示（複雑性が高いため）
```

### SEO 記事

```
■ ピラー記事（1本）
'taishoku-ideco-saiteki' — 「退職金とiDeCoの最適な受取方法｜5年ルール・19年ルールをわかりやすく解説【2026年版】」

■ クラスター記事（5本）
1. 'taishoku-shotoku-koujo-keisan' — 「退職所得控除の計算方法｜勤続年数別の早見表と計算例」
2. 'ideco-5nen-rule' — 「iDeCoの5年ルールとは？退職金との受取順序で税金が変わる仕組み」
3. 'ideco-uketori-ikkatsu-nenkin' — 「iDeCoは一括と年金どっちが得？年齢・金額別の最適解」
4. 'taishoku-mae-setsuzei-checklist' — 「50代で退職する前にやるべき節税準備チェックリスト」
5. 'taishokukin-zeikin-keisan' — 「退職金にかかる税金はいくら？1,000万〜3,000万の計算例」
```

---

## Phase 4: 副業の確定申告 要否・最適申告判定

### パス・メタデータ

| 項目 | 内容 |
|------|------|
| URL | `/fukugyou-shindan/` |
| タイトル | 副業の確定申告、あなたは必要？事業所得vs雑所得も判定 |
| description | 副業の種類・収入額・経費を入力するだけで、確定申告の要否・所得区分・最適な申告方法を自動判定。住民税の申告義務も診断。 |
| ターゲット | 副業会社員（25〜40歳、二次ターゲット） |

### Step A: 調査指示

```
以下を調査し、src/lib/diagnosis/fukugyou-shindan/RESEARCH.md に保存せよ。

1. 副業所得20万円以下の確定申告不要ルール（所得税のみ）
2. 住民税の申告義務（所得が1円でも発生した場合）
3. 事業所得 vs 雑所得の判断基準（2022年国税庁改正: 300万円基準・帳簿要件）
4. 損益通算の可否（事業所得のみ可能）
5. 青色申告特別控除（10万円 / 55万円 / 65万円の要件）
6. 副業の経費として認められるもの一覧（業種別）
7. 住民税の普通徴収切替え方法（会社にバレない方法）
8. 開業届の提出タイミングと効果

9. 競合調査: 「副業 確定申告 必要か」「副業 雑所得 事業所得」で上位10件
```

### Step B: 型定義

```typescript
export type SideJobInput = {
  mainJobIncome: number;          // 本業の年収（万円）
  sideJobType: SideJobType;       // 副業の種類
  sideJobRevenue: number;         // 副業の収入（万円）
  sideJobExpenses: number;        // 副業の経費（万円）
  hasBookkeeping: boolean;        // 帳簿をつけているか
  isContinuous: boolean;          // 継続的に行っているか
  hasOpeningNotification: boolean;// 開業届を出しているか
  otherIncome: OtherIncomeType[]; // その他の所得（株・不動産等）
};

export type SideJobType =
  | 'freelance_writing'    // ライティング・ブログ
  | 'programming'          // プログラミング
  | 'design'               // デザイン
  | 'consulting'           // コンサル
  | 'ecommerce'            // 物販・せどり
  | 'rental_income'        // 不動産賃貸
  | 'stocks'               // 株式・FX
  | 'crypto'               // 暗号資産
  | 'rideshare_delivery'   // UberEats等
  | 'other';               // その他

export type SideJobResult = {
  needsTaxReturn: boolean;        // 確定申告の要否
  needsResidentTaxReturn: boolean;// 住民税の申告要否
  incomeCategory: 'business' | 'miscellaneous' | 'unclear';
  recommendedFiling: 'blue_65' | 'blue_10' | 'white' | 'not_needed';
  estimatedTax: number;           // 推定追加税額
  estimatedRefund: number;        // 損益通算した場合の還付額（事業所得の場合）
  recommendations: string[];
  risks: string[];                // 申告しない場合のリスク
  tips: SideJobTip[];
};
```

### Step C〜F: 実装・記事

```
エンジンの核心ロジック:
- 20万円ルールの判定（他に確定申告する理由がある場合は副業も含める必要あり）
- 事業所得 vs 雑所得の総合判定（収入額・帳簿・継続性・開業届のスコアリング）
- 損益通算シミュレーション（赤字の場合の還付額計算）
- 住民税の申告義務チェック（20万円以下でも必要）
- 青色申告の推奨判定

CTA:
- freee / マネーフォワード（会計ソフト）
- 税理士ドットコム（複雑な場合）
- 本体診断への回遊

SEO記事:
- ピラー: 'fukugyou-kakutei-shinkoku-guide' — 「副業の確定申告 完全ガイド【2026年版】」
- クラスター4本:
  1. 'fukugyou-20man-rule' — 「副業20万円以下でも申告が必要な3つのケース」
  2. 'jigyou-shotoku-vs-zatsu-shotoku' — 「事業所得と雑所得の違い｜2022年改正後の判断基準」
  3. 'fukugyou-keihi-ichiran' — 「副業の経費にできるもの一覧｜業種別の目安と注意点」
  4. 'fukugyou-barenai-houhou' — 「副業が会社にバレない方法｜住民税の普通徴収切替え手順」
```

---

## Phase 5: 相続税かんたん試算＋生前対策チェック

### パス・メタデータ

| 項目 | 内容 |
|------|------|
| URL | `/souzoku/` |
| タイトル | うちは相続税かかる？3分でわかる相続税シミュレーション |
| description | 相続人の構成と財産の概算を入力するだけで、相続税の概算額と使える特例・控除を自動診断。生前対策のチェックリスト付き。 |
| ターゲット | 40〜60代の「親が高齢」な会社員 |

### Step A: 調査指示

```
以下を調査し、src/lib/diagnosis/souzoku/RESEARCH.md に保存せよ。

1. 相続税の基礎控除: 3,000万円 ＋ 600万円 × 法定相続人の数
2. 法定相続人の範囲と法定相続分
3. 相続税の税率表（10%〜55%の累進課税）
4. 配偶者の税額軽減（1億6,000万円 or 法定相続分まで非課税）
5. 小規模宅地等の特例（居住用330㎡まで80%減額の要件）
6. 生命保険金の非課税枠（500万円 × 法定相続人の数）
7. 死亡退職金の非課税枠（500万円 × 法定相続人の数）
8. 暦年贈与（年110万円）と相続時精算課税制度
9. 2024年改正: 暦年贈与の持ち戻し期間が3年→7年に延長
10. 不動産の評価方法（路線価・倍率方式の概要）

11. 競合調査: 「相続税 シミュレーション」「相続税 いくらから」で上位10件
```

### Step B〜F: 型定義・実装・記事

```
型の要点:
- InheritanceInput: 被相続人の財産（不動産評価額・預貯金・有価証券・保険金・その他）
  法定相続人の構成（配偶者有無・子の人数・養子の有無）
  実施済みの対策（暦年贈与の累計・保険加入・小規模宅地特例の該当可否）

- InheritanceResult: 概算相続税額、適用可能な特例一覧、生前対策の提案

エンジンのポイント:
- 基礎控除との比較で「課税対象か否か」を即判定
- 配偶者の税額軽減の自動適用
- 生命保険非課税枠の残り活用提案
- 小規模宅地等の特例の適用可否チェック

CTA:
- 税理士紹介（相続専門）→ 税理士ドットコム / ビスカス
- 生命保険の相続対策 → 保険見直しラボ
- 不動産評価が必要 → 不動産査定（将来的に追加）

SEO記事:
- ピラー: 'souzoku-zei-guide' — 「相続税はいくらからかかる？基礎控除・税率・計算方法を完全解説【2026年版】」
- クラスター5本:
  1. 'souzoku-kiso-koujo' — 「相続税の基礎控除とは？法定相続人の数え方と計算例」
  2. 'souzoku-haigusha-keigen' — 「配偶者の税額軽減で相続税が0円に？条件と落とし穴」
  3. 'shokibo-takuchi-tokurei' — 「小規模宅地等の特例をわかりやすく解説｜80%減額の条件」
  4. 'seizen-zouyo-110man' — 「生前贈与の110万円枠を活用した相続対策｜2024年改正の影響」
  5. 'souzoku-seimei-hoken' — 「生命保険で相続税を節税する方法｜非課税枠の活用術」
```

---

## Phase 6: ふるさと納税 上限額シミュレーション（他控除併用対応版）

### パス・メタデータ

| 項目 | 内容 |
|------|------|
| URL | `/furusato-limit/` |
| タイトル | ふるさと納税の本当の上限額は？iDeCo・住宅ローン控除を加味して正確計算 |
| description | 他の控除（iDeCo・住宅ローン控除・医療費控除）を加味した正確なふるさと納税上限額を計算。多くの簡易計算機では考慮されない併用影響を反映。 |
| ターゲット | 全ターゲット層 |

### Step A: 調査指示

```
以下を調査し、src/lib/diagnosis/furusato-limit/RESEARCH.md に保存せよ。

1. ふるさと納税の自己負担2,000円で済む上限額の計算式
   - 所得税からの控除: (寄付額-2,000) × 所得税率 × 1.021
   - 住民税からの控除（基本分）: (寄付額-2,000) × 10%
   - 住民税からの控除（特例分）: (寄付額-2,000) × (100%-10%-所得税率×1.021)
   - 特例分の上限 = 住民税所得割額 × 20%

2. 住民税所得割額の計算方法
   - 給与所得控除
   - 基礎控除（住民税は43万円）
   - 社会保険料控除
   - 配偶者控除・扶養控除（住民税の額は所得税と異なる）
   - iDeCo掛金（小規模企業共済等掛金控除）
   - 生命保険料控除（住民税の上限は所得税と異なる）

3. 他の控除がふるさと納税上限に与える影響
   - iDeCo加入→上限が下がる（所得が減るため）
   - 住宅ローン控除→住民税からの控除と重なる場合の影響
   - 医療費控除→所得が下がり上限が下がる

4. ワンストップ特例制度 vs 確定申告の違い
   - ワンストップ: 所得税からの控除なし（全額住民税から）
   - 確定申告: 所得税＋住民税から控除

5. 競合調査: さとふる・楽天・ふるさとチョイスのシミュレーターの入力項目と計算精度
   → 差別化ポイント: 多くは iDeCo・住宅ローン控除の影響を正確に反映していない
```

### Step B〜F: 型定義・実装・記事

```
型の要点:
- FurusatoLimitInput: 年収、家族構成（配偶者・子の扶養控除人数）、
  iDeCo掛金月額、住宅ローン控除額、医療費控除見込み額、
  生命保険料控除の利用状況、社会保険料（概算可）

- FurusatoLimitResult: 上限額（概算）、各控除の影響額（iDeCoで○○円下がる等）、
  ワンストップ vs 確定申告の比較

エンジンのポイント:
- 住民税所得割額の正確な計算（住民税と所得税で控除額が異なる点を反映）
- 各控除の有無で上限額がどう変わるかを個別に算出（影響額表示）
- 「iDeCoに年27.6万円拠出すると上限が約○○円下がる」のような具体的な表示

CTA:
- furusona への送客（姉妹サービス）
- さとふるアフィリエイト
- iDeCo口座開設（松井証券）

SEO記事:
- ピラー: 'furusato-limit-seikaku-keisan' — 「ふるさと納税の上限額を正確に計算する方法｜iDeCo・住宅ローン控除の影響も反映【2026年版】」
- クラスター4本:
  1. 'furusato-ideco-heiyou' — 「ふるさと納税とiDeCoを併用すると上限はいくら下がる？年収別の影響額」
  2. 'furusato-juutaku-loan-heiyou' — 「ふるさと納税と住宅ローン控除の併用｜上限が下がるケースと対処法」
  3. 'furusato-one-stop-vs-kakutei' — 「ワンストップ特例と確定申告どっちが得？5自治体超えたらどうする？」
  4. 'furusato-nenmatsu-kakekomi' — 「ふるさと納税の年末駆け込みガイド｜12月に間に合わせる方法」
```

---

## Phase 7: 不動産売却の税金シミュレーション

### パス・メタデータ

| 項目 | 内容 |
|------|------|
| URL | `/fudousan-baikyaku/` |
| タイトル | 不動産を売ったら税金いくら？特例で0円にできるか診断 |
| description | 売却額・取得費・所有期間・居住状況を入力するだけで、譲渡所得税の概算と適用可能な特例を自動判定。3,000万円特別控除・買換え特例も対応。 |
| ターゲット | 不動産売却予定の40〜60代 |

### Step A: 調査指示

```
以下を調査し、src/lib/diagnosis/fudousan-baikyaku/RESEARCH.md に保存せよ。

1. 譲渡所得の計算式
   - 譲渡所得 = 売却価格 - (取得費 + 譲渡費用)
   - 取得費が不明な場合: 概算取得費（売却価格の5%）

2. 税率
   - 長期譲渡所得（所有期間5年超）: 所得税15.315% + 住民税5% = 20.315%
   - 短期譲渡所得（所有期間5年以下）: 所得税30.63% + 住民税9% = 39.63%
   - 所有期間の判定: 取得日〜譲渡日の年の1月1日時点で5年超か

3. 居住用財産の3,000万円特別控除（措置法35条）
   - 適用要件（居住用、引越し後3年以内等）
   - 前年・前々年に適用していない等の要件

4. 10年超所有の軽減税率の特例（措置法31条の3）
   - 6,000万円以下の部分: 14.21%
   - 6,000万円超の部分: 20.315%

5. 買換え特例（措置法36条の2）
   - 適用要件と繰延べの仕組み

6. 空き家の3,000万円特別控除（相続空き家）
   - 2024年改正での要件緩和

7. 相続不動産の取得費加算の特例

8. 損失が出た場合の損益通算・繰越控除
   - マイホームの買換え等の場合の損失の損益通算（措置法41条の5）

9. 競合調査: 不動産ポータルの税金シミュレーターの精度と不足点
```

### Step B〜F: 型定義・実装・記事

```
型の要点:
- RealEstateInput: 物件種別（マイホーム/投資用/相続）、売却価格、取得費（不明可）、
  取得時期、売却時期、居住状況（居住中/空き家/賃貸中）、居住年数、
  相続物件の場合の被相続人情報

- RealEstateResult: 譲渡所得額、適用可能な特例一覧（3,000万円控除・軽減税率等）、
  特例適用後の税額、取得費不明の場合の概算と実額の差

エンジンのポイント:
- 長期/短期の自動判定
- 適用可能な特例の網羅的チェック（複数特例の併用可否含む）
- 取得費不明の場合の概算取得費と、実額がわかる場合の差額表示
- 損失が出る場合の損益通算可否

CTA:
- 不動産一括査定アフィリエイト（将来的にASP追加）
- 税理士紹介（税理士ドットコム / ビスカス）
- 相続診断への回遊

SEO記事:
- ピラー: 'fudousan-baikyaku-zeikin-guide' — 「不動産売却にかかる税金と節税方法を完全解説｜譲渡所得税の計算から特例まで【2026年版】」
- クラスター5本:
  1. 'fudousan-3000man-tokubetsu-koujo' — 「マイホーム売却の3,000万円特別控除｜条件・手続き・注意点」
  2. 'fudousan-shutoku-hi-fumei' — 「取得費がわからない不動産の売却｜概算取得費5%ルールと損しない方法」
  3. 'souzoku-fudousan-baikyaku' — 「相続した不動産を売却する場合の税金｜取得費加算の特例と空き家特例」
  4. 'fudousan-chouki-tanki' — 「不動産の長期譲渡と短期譲渡の違い｜税率が2倍になる所有期間の判定」
  5. 'fudousan-sonshitsu-tsusan' — 「不動産売却で損失が出た場合の確定申告｜損益通算で税金を取り戻す方法」
```

---

## Phase 8: 全体統合・仕上げ

| # | タスク | 詳細 |
|---|--------|------|
| 8-1 | 診断メニューハブページの最終調整 | `/tools/` に全7診断＋本体診断のカードを配置。おすすめ順に並べる |
| 8-2 | 本体トップページへのリンク追加 | 本体診断の結果画面に「もっと詳しく診断」セクションを追加し、関連するニッチ診断へ誘導 |
| 8-3 | 回遊リンクの最終設計 | 全診断の結果画面に CrossLinkBanner を設置。診断テーマに応じて表示する推奨診断を設定 |
| 8-4 | サイトマップ最終確認 | 全ページ（診断7本＋記事30本以上）がサイトマップに含まれていることを確認 |
| 8-5 | 構造化データ確認 | 全診断ページの WebApplication JSON-LD、全記事の Article JSON-LD + FAQ スキーマを確認 |
| 8-6 | OGP画像の作成 | 各診断ページ用のOGP画像を作成（1200x630px） |
| 8-7 | furusona との相互リンク更新 | furusona側にも haraisugi.jp の新診断メニューへのリンクを追加（別タスク） |
| 8-8 | GA4 イベント設計の最終確認 | 全診断で以下のイベントが発火することを確認: `diagnosis_start`（診断名付き）、`step_complete`、`diagnosis_complete`、`affiliate_click` |
| 8-9 | パフォーマンス測定 | Lighthouse スコア90以上を全ページで確認。LCP 2.5秒以内 |
| 8-10 | Google Search Console 更新 | サイトマップの再送信、新規ページのインデックス登録リクエスト |

---

## 回遊リンク設計マトリクス

各診断の結果画面に表示する「おすすめ診断」の対応表:

| 診断 | 回遊先1 | 回遊先2 | 回遊先3 |
|------|---------|---------|---------|
| 本体（税金払いすぎ診断） | 医療費判定 | 共働き配分 | ふるさと納税上限 |
| 医療費 vs セルフメディケーション | 本体診断 | 共働き配分 | ふるさと納税上限 |
| 共働き最適配分 | 本体診断 | ふるさと納税上限 | 医療費判定 |
| 退職金・iDeCo受取 | 本体診断 | 相続税試算 | ふるさと納税上限 |
| 副業申告判定 | 本体診断 | ふるさと納税上限 | 医療費判定 |
| 相続税試算 | 不動産売却 | 本体診断 | 退職金受取 |
| ふるさと納税上限 | 本体診断 | 共働き配分 | furusona |
| 不動産売却 | 相続税試算 | 本体診断 | 退職金受取 |

---

## アフィリエイトリンク追加一覧

`links.ts` に追加するアフィリエイトリンク:

| key | サービス名 | 対象診断 | CV条件 | 報酬目安 |
|-----|-----------|---------|--------|---------|
| `souzoku_zeirishi` | 税理士ドットコム（相続専門） | 相続税 | 問い合わせ完了 | 5,000〜15,000円/件 |
| `fudousan_satei` | 不動産一括査定（イエウール等） | 不動産売却 | 査定依頼完了 | 5,000〜15,000円/件 |
| `furusato_satofuru` | さとふる | ふるさと納税上限 | 寄付完了 | 寄付額の1〜2% |
| `kaikei_freee` | freee（確定申告） | 副業申告 | 新規導入 | 1,500〜20,000円/件 |
| `kaikei_mf` | マネーフォワード | 副業申告 | 新規導入 | 2,000〜20,000円/件 |
| `hoken_souzoku` | 保険見直しラボ（相続対策） | 相続税 | 無料相談予約 | 5,000〜15,000円/件 |

※ ASP承認前は公式URLを仮設定し、承認後にトラッキングURLに差し替える。

---

## SEO 記事 全体量

| Phase | ピラー記事 | クラスター記事 | 合計 |
|-------|-----------|--------------|------|
| Phase 1: 医療費判定 | 1本 | 4本 | 5本 |
| Phase 2: 共働き | 1本 | 4本 | 5本 |
| Phase 3: 退職金 | 1本 | 5本 | 6本 |
| Phase 4: 副業 | 1本 | 4本 | 5本 |
| Phase 5: 相続税 | 1本 | 5本 | 6本 |
| Phase 6: ふるさと納税 | 1本 | 4本 | 5本 |
| Phase 7: 不動産売却 | 1本 | 5本 | 6本 |
| **合計** | **7本** | **31本** | **38本** |

既存の50本計画に加えて38本追加。合計88本の記事体制。

---

## Claude Code 実行時の注意事項

### 調査フェーズ（Step A）での指示

各 Phase の Step A では、以下のように指示する:

```
このフェーズでは最初に必ず調査を行う。
web_search を使って国税庁タックスアンサーの該当ページと、
競合サイトの上位10件を確認し、RESEARCH.md に以下を記録せよ:

1. 正確な計算式・要件（出典URL付き）
2. 競合ツールの有無と差別化ポイント
3. ユーザーが「知らなかった」と思いそうなポイント（裏技候補）

調査が完了するまで実装に進むな。
```

### 実装フェーズでの品質基準

- 全ての金額計算に出典（国税庁タックスアンサーの番号）をコメントで明記
- 計算ロジックには最低5件のユニットテストを付ける
- 結果画面には必ず `<Disclaimer />` を表示
- アフィリエイトリンクには `rel="nofollow sponsored"` を付与
- モバイルファースト（最小幅375px）でレスポンシブ

### 記事作成フェーズでの品質基準

- 各記事は最低3,000字以上
- 年収別シミュレーション表を含む（500万 / 700万 / 1,000万の3パターン）
- FAQ を3〜5問含む（構造化データ対応）
- CTA を冒頭・中間・末尾の3箇所に設置
- 内部リンクを本文中3本以上＋末尾関連記事5本以上
- 出典を明記（国税庁タックスアンサー、法令等）
- 「2026年版」「令和8年分対応」等の年度表記を含める