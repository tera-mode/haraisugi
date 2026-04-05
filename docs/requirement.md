# 税金払いすぎ診断 — 開発要件書

## プロジェクト概要

| 項目 | 内容 |
|------|------|
| サービス名 | 税金払いすぎ診断 |
| リポジトリ名 | `haraisugi` |
| ドメイン | `haraisugi.jp` |
| 運営 | 合同会社LAIV |
| 姉妹サービス | あなたのふるさと納税AI（furusona） |
| タグライン | 「あなたの払いすぎ税金、30秒で見つけます」 |

### サービスの目的

ユーザーの年収・家族構成・ライフイベントを4ステップで入力するだけで、見逃している控除と節税テクニック（裏技）を提案する無料診断ツール。AIは使わず、条件分岐による控除マッチング＋裏技フィルタリングで実装する。診断結果からふるさと納税・iDeCo口座開設・保険見直し・税理士紹介などのアフィリエイト導線で収益化する。

### ターゲットユーザー

- 一次：年収500〜1,000万の共働き会社員（30〜45歳）
- 二次：副業をしている会社員（25〜40歳）
- 三次：退職が近い50代会社員

---

## 技術スタック

| カテゴリ | 技術 | 備考 |
|----------|------|------|
| フレームワーク | Next.js (App Router) | 15.x（バージョン固定） |
| 言語 | TypeScript | 5.x |
| UI | React | 19.x |
| スタイリング | Tailwind CSS | 4.x |
| DB | Firebase (Firestore) | 診断ログ・記事データ・イベント計測用 |
| Markdown描画 | react-markdown | SEO記事ページ用 |
| ホスティング | Vercel | — |
| ドメイン | haraisugi.jp | — |

LLM SDK（Claude, Gemini）、Brevoは使用しない。

---

## サプライチェーン攻撃対策（必須）

Axios事件（2026年3月）を踏まえ、以下を初期セットアップ時に必ず適用すること。

参考: https://qiita.com/Cafebabe_TimeLapse/items/613cfb572a2b9c3da57a

### 1. package.json のバージョン固定

キャレット（^）やチルダ（~）を使わない。すべて完全固定。

```json
{
  "dependencies": {
    "next": "15.5.4",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "firebase": "12.4.0",
    "react-markdown": "10.1.0"
  }
}
```

- `package-lock.json` を必ずGit管理に含める
- CI/CDでは `npm ci`（clean install）を使用し、lockファイルとの整合性を保証する

### 2. .npmrc の作成

プロジェクトルートに `.npmrc` を配置し、postinstallスクリプトの自動実行を禁止する。

```ini
ignore-scripts=true
engine-strict=true
```

### 3. GitHub Actions の SHA ピン留め

すべてのMarketplace Actionsをコミットハッシュで固定する。タグ（`@v4` 等）は使用禁止。

```yaml
# NG
uses: actions/checkout@v4

# OK
uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608 # v4.2.2
```

SHAの取得方法：

```bash
git ls-remote --tags --refs https://github.com/actions/checkout.git 'v4*' \
  | awk -F/ '{print $3}' \
  | sort -V \
  | tail -n 1
```

---

## ディレクトリ構成

```
haraisugi/
├── .claude/                # Claude Code設定
│   └── settings.json
├── .github/
│   └── workflows/
│       └── deploy.yml      # SHA固定のGitHub Actions
├── public/
│   ├── favicon.ico
│   ├── ogp.png             # OGP画像（1200x630）
│   └── robots.txt
├── scripts/
│   └── ping-search-engines.ts  # サイトマップping（furusonaから流用）
├── src/
│   ├── app/
│   │   ├── layout.tsx      # ルートレイアウト（メタデータ・GA・構造化データ）
│   │   ├── page.tsx        # トップページ（診断ウィザード）
│   │   ├── result/
│   │   │   └── page.tsx    # 診断結果ページ
│   │   ├── articles/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx    # 記事一覧
│   │   ├── sitemap.ts      # 動的サイトマップ
│   │   └── robots.ts
│   ├── components/
│   │   ├── diagnosis/
│   │   │   ├── StepIncome.tsx
│   │   │   ├── StepFamily.tsx
│   │   │   ├── StepLife.tsx
│   │   │   ├── StepCurrent.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── NavButtons.tsx
│   │   ├── results/
│   │   │   ├── ResultHero.tsx
│   │   │   ├── DeductionCard.tsx
│   │   │   ├── TrickCard.tsx
│   │   │   └── CTASection.tsx
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Disclaimer.tsx
│   │   │   └── Chip.tsx
│   │   └── articles/
│   │       └── ArticleLayout.tsx
│   ├── lib/
│   │   ├── diagnosis/
│   │   │   ├── engine.ts       # 控除判定ロジック（条件分岐のみ）
│   │   │   ├── deductions.ts   # 控除マスターデータ
│   │   │   ├── tricks.ts       # 裏技マスターデータ
│   │   │   └── types.ts        # 型定義
│   │   ├── affiliate/
│   │   │   └── links.ts        # アフィリエイトリンク一元管理
│   │   ├── firebase/
│   │   │   └── client.ts       # Firestore クライアント
│   │   ├── seo/
│   │   │   ├── metadata.ts     # ページごとのメタデータ生成
│   │   │   └── structured-data.ts  # JSON-LD
│   │   └── constants.ts
│   └── styles/
│       └── globals.css
├── .env.local.example
├── .eslintignore
├── .firebaserc
├── .gitignore
├── .npmrc                  # ignore-scripts=true
├── eslint.config.mjs
├── firebase.json
├── firestore.rules
├── next.config.ts
├── package.json            # バージョン完全固定
├── package-lock.json       # 必ずGit管理
├── postcss.config.mjs
├── tsconfig.json
└── vercel.json
```

---

## 機能要件

### F-1: 診断ウィザード（4ステップ＋結果）

トップページ（`/`）にステップ形式の診断UIを配置する。クライアントサイドで完結し、APIコールは不要。

#### Step 1: 収入（StepIncome）
- 年収帯の選択（6段階：300万未満 / 300〜500万 / 500〜700万 / 700〜1,000万 / 1,000〜1,500万 / 1,500万以上）
- 働き方の選択（会社員 / 会社員＋副業 / フリーランス / 会社役員）

#### Step 2: 家族（StepFamily）
- 複数選択チップUI
- 選択肢：配偶者（収入150万以下/超）、16歳未満の子、16-18歳の子、19-22歳の子（特定扶養）、70歳以上の親（同居）、要介護認定の家族、障害者手帳を持つ家族、ひとり親、下宿中の子ども

#### Step 3: 生活・ライフイベント（StepLife）
- カテゴリ別にグルーピング表示
- カテゴリ：医療 / 住宅 / 保険 / 寄付 / 災害 / 自己投資 / 仕事 / 投資
- 選択肢：医療費10万超、市販薬購入、歯科矯正、デンタルローン、通院交通費、住宅ローン、省エネ改修、地震保険、生命保険、寄付（NPO等）、災害・盗難、資格取得費、仕事の書籍、制服・スーツ自費購入、在宅勤務、株損失、暗号資産

#### Step 4: 現在利用中の控除（StepCurrent）
- 複数選択チップUI
- 選択肢：ふるさと納税、iDeCo、NISA、小規模企業共済、医療費控除、生命保険料控除、地震保険料控除、配偶者（特別）控除、扶養控除、住宅ローン控除、特になし/わからない

#### 結果画面
- ヒーローセクション：見逃し控除の件数＋推定年間節税額＋裏技件数
- 2タブ構成：
  - 📋 見逃し控除タブ：優先度（高/中/低）順。アコーディオン展開で詳細・期限・難易度・次のアクション
  - 💎 裏技・テクニックタブ：ユーザーの状況にマッチする裏技のみ表示。カテゴリ別グルーピング
- CTAセクション：診断結果に応じたアフィリエイト導線
- 免責表示（常時）：「本結果は一般的な税制情報に基づくシミュレーションであり、個別具体的な税務相談ではありません。最終判断は税理士にご相談ください。」

### F-2: 診断エンジン

すべてクライアントサイドのTypeScriptで完結する。サーバー通信なし。

#### deductions.ts — 控除マスターデータ

各控除を以下の型で定義する。

```typescript
type Deduction = {
  id: string;
  name: string;
  match: (input: UserInput) => boolean;       // 該当判定
  savings: (input: UserInput) => string;       // 推定節税額
  urgency: 'high' | 'medium' | 'low';
  description: string;
  action: string;      // 次にやるべきこと
  deadline: string;    // 期限
  difficulty: 'かんたん' | 'ふつう' | 'やや手間';
  affiliateKey?: string;  // 対応するアフィリエイト導線のキー
};
```

収録する控除（初期リリース時点）：
- ふるさと納税、iDeCo、小規模企業共済、障害者控除（要介護認定者）、特定支出控除、セルフメディケーション税制、医療費控除、生命保険料控除（3枠）、地震保険料控除、特定扶養控除、ひとり親控除、雑損控除/災害減免法、寄附金控除（税額控除の選択）、上場株式等の損益通算・繰越控除、在宅勤務の特定支出控除

#### tricks.ts — 裏技マスターデータ

```typescript
type Trick = {
  id: string;
  category: string;     // 医療費 / 家族最適化 / 制度の相互影響 / サラリーマン穴場 / タイミング / 投資 / フリーランス / 保険最適化
  title: string;
  match: (input: UserInput) => boolean;
  body: string;
  source: string;        // 出典（国税庁タックスアンサー等）
  surprise: '★★★' | '★★☆' | '★☆☆';
};
```

収録する裏技（初期リリース時点）：
- 通院交通費はメモだけで控除OK
- 子どもの歯科矯正は医療費控除対象
- デンタルローンは契約年に全額控除
- 子どもの通院付き添い交通費もOK
- 医療費控除は家族で一番稼ぐ人が申告
- 下宿中の子どもの医療費も合算OK
- 扶養を夫婦で分けると得なケースあり
- 医療費控除・iDeCoでふるさと納税上限が下がる
- 医療費控除するとワンストップ特例が無効に
- 仕事の本・新聞も特定支出控除の対象
- スーツ・制服の自費購入も控除対象
- 在宅勤務の通信費・電気代が控除対象に
- 還付申告は過去5年分まで遡れる
- 年末に高額治療の支払いタイミングを調整
- 源泉徴収あり特定口座でも確定申告が得なケース
- 青色申告の65万円控除はe-Tax必須
- 家族への給与で所得を分散できる
- 30万円未満の備品は全額即時経費
- 副業赤字で本業の税金が還付されるケース
- 生命保険料控除の3枠を埋め切ると12万円控除

#### engine.ts — 診断実行

```typescript
function diagnose(input: UserInput): DiagnosisResult {
  const deductions = ALL_DEDUCTIONS.filter(d => d.match(input));
  const tricks = ALL_TRICKS.filter(t => t.match(input));
  const totalSavings = deductions.reduce((sum, d) => sum + parseSavings(d.savings(input)), 0);
  return { deductions, tricks, totalSavings };
}
```

純粋関数。副作用なし。テスト容易。

### F-3: SEO記事ページ

`/articles/[slug]` で節税テクニック記事を公開する。

- Firestoreに記事データを格納（タイトル、本文Markdown、メタディスクリプション、公開日、カテゴリ、関連控除タグ）
- ISR（Incremental Static Regeneration）で生成、revalidate: 86400（1日）
- 各記事の末尾に「税金払いすぎ診断で無料チェック」CTAを配置
- JSON-LD構造化データ（Article型）を出力

#### 初期記事候補（ロングテールSEO狙い）
1. 通院の交通費はメモだけで医療費控除OK
2. 子どもの歯科矯正、医療費控除でいくら戻る？
3. デンタルローンは契約年に全額控除できる
4. 共働き夫婦、扶養を分けると税金が安くなる？
5. 要介護の親→障害者控除で年間5万円の節税
6. 医療費控除すると、ふるさと納税の上限が下がる
7. 特定支出控除は年間1,700人しか使っていない穴場
8. 還付申告は5年前まで遡れる
9. 在宅勤務の通信費・電気代は控除対象
10. 生命保険料控除の3枠、埋め切っていますか？

### F-4: アフィリエイトリンク管理

`affiliate/links.ts` で全アフィリエイトリンクを一元管理する。

```typescript
type AffiliateLink = {
  key: string;
  label: string;
  url: string;
  cvCondition: string;
  estimatedReward: string;
};

const AFFILIATE_LINKS: Record<string, AffiliateLink> = {
  furusato_satofuru: { ... },
  furusato_rakuten: { ... },
  ideco_rakuten: { ... },
  ideco_sbi: { ... },
  insurance_review: { ... },
  tax_accountant_dot: { ... },
  tax_accountant_viscus: { ... },
  accounting_freee: { ... },
  accounting_mf: { ... },
  furusona: { ... },  // 姉妹サービスへの相互送客
};
```

| 診断結果 | 誘導先 | 報酬目安 |
|----------|--------|----------|
| ふるさと納税未利用 | さとふる・楽天 | 寄付額の1〜4% |
| iDeCo未加入 | 楽天証券・SBI証券 | 数百〜数千円/件 |
| 保険控除枠に空き | 保険見直しラボ等 | 5,000〜15,000円/件 |
| 複雑な控除あり | 税理士ドットコム・ビスカス | 3,000〜10,000円/件 |
| 副業で青色申告すべき | freee・マネーフォワード | 数百〜数千円/件 |
| ふるさと納税関連 | furusona | 相互送客 |

- 全アフィリエイトリンクに `rel="nofollow sponsored"` を付与
- クリック計測用のFirestoreイベントログを実装

### F-5: furusonaとの相互送客

- 診断結果でふるさと納税関連の控除が出た場合、furusonaへのリンクを表示
- furusona側にもharaisugiへの誘導バナーを設置（別タスク）

---

## SEO要件

### メタデータ

```typescript
export const siteMetadata = {
  title: '税金払いすぎ診断 — あなたの取りこぼし控除を30秒で発見【無料】',
  description: '年収・家族構成を入力するだけで、見逃している控除と節税テクニックを提案。サラリーマンの医療費控除の裏技、iDeCo・ふるさと納税の最適配分まで。',
  url: 'https://haraisugi.jp',
  ogImage: 'https://haraisugi.jp/ogp.png',
  siteName: '税金払いすぎ診断',
};
```

### 構造化データ（JSON-LD）

- トップページ：`WebApplication` 型
- 記事ページ：`Article` 型

### サイトマップ

`src/app/sitemap.ts` で動的生成。記事追加時に自動で反映。

### ping-search-engines.ts

furusonaから流用。デプロイ時にGoogle・Bingにサイトマップ更新を通知。

---

## 税理士法対策（必須）

税理士法第52条に抵触しないよう、以下を遵守する。

1. サービス名は「診断」「シミュレーション」とし「税務相談」は使わない
2. 免責表示コンポーネント `<Disclaimer />` を全画面に常時表示
3. 「最終判断は税理士にご相談ください」を診断結果に必ず含める
4. 出典（国税庁タックスアンサー等）を明記
5. 「個別具体的な税務相談ではありません」を明示

---

## 非機能要件

### パフォーマンス
- Lighthouse Performance Score 90以上
- LCP 2.5秒以内
- 診断ウィザードはクライアントサイドで完結（APIコールなし）
- 結果表示は入力完了と同時に描画（待ち時間ゼロ）

### セキュリティ
- サプライチェーン攻撃対策を全適用（上記参照）
- FirebaseのAPIキーは公開用（Firestoreルールで制限）
- Firestoreルールでログデータの書き込みのみ許可、読み取りは管理者のみ

### アナリティクス
- Google Analytics 4を導入
- カスタムイベント：
  - `diagnosis_start`：診断開始
  - `step_complete`：各ステップ完了（step番号付き）
  - `diagnosis_complete`：診断完了（見逃し件数・裏技件数付き）
  - `affiliate_click`：アフィリエイトリンクのクリック（リンクキー付き）
  - `article_view`：記事閲覧（slug付き）
- 診断結果のFirestoreログ（匿名・集計用。個人情報は保存しない）

---

## 環境変数

```bash
# .env.local.example
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=haraisugi.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=haraisugi
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-xxxxx
```

サーバーサイドAPIキーは不要（LLMを使わないため）。
Firebase Admin SDKも不要（記事投稿はFirebaseコンソールから直接行う）。

---

## 開発フロー

### Phase 1: MVP（1週間）
- [ ] プロジェクト初期セットアップ（Next.js + Tailwind + Firebase）
- [ ] サプライチェーン攻撃対策（.npmrc, バージョン固定, Actions SHA固定）
- [ ] 型定義（types.ts）
- [ ] 控除マスターデータ（deductions.ts）
- [ ] 裏技マスターデータ（tricks.ts）
- [ ] 診断エンジン（engine.ts）
- [ ] 診断ウィザードUI（4ステップ＋結果画面）
- [ ] 免責表示コンポーネント
- [ ] Vercelデプロイ + haraisugi.jpドメイン設定
- [ ] OGP画像 + メタデータ

### Phase 2: 収益化・計測（2週目）
- [ ] アフィリエイトリンク管理（links.ts）
- [ ] CTAセクション（診断結果に応じた動的表示）
- [ ] Firestore設定（イベントログ）
- [ ] GA4導入・カスタムイベント
- [ ] furusonaとの相互送客リンク

### Phase 3: SEOコンテンツ（3週目）
- [ ] 記事ページテンプレート（ISR）
- [ ] Firestoreへの記事データ投入
- [ ] 初期記事10本
- [ ] JSON-LD構造化データ
- [ ] サイトマップ自動生成
- [ ] ping-search-engines.ts
- [ ] Google Search Console登録

### Phase 4: 拡張（継続）
- [ ] 動的OGP画像（診断結果をSNSシェア用に画像化）
- [ ] 裏技データベースの拡充（年次税制改正に対応）
- [ ] 診断結果のSNSシェア機能
- [ ] 記事の継続追加（月2〜4本）

---

## furusonaからの流用対象

https://github.com/tera-mode/furusona
C:\Users\User\Documents\furusona

| ファイル | 流用方法 |
|----------|----------|
| `scripts/ping-search-engines.ts` | ほぼそのまま流用（URL変更のみ） |
| `src/lib/firebase/client.ts` | 構成パターンを踏襲 |
| `.github/workflows/` | SHA固定に修正して流用 |
| `vercel.json` | 設定パターンを踏襲 |
| `firebase.json`, `firestore.rules` | 設定パターンを踏襲 |
| `eslint.config.mjs` | そのまま流用 |
| `postcss.config.mjs` | そのまま流用 |
| `tsconfig.json` | そのまま流用 |
| `next.config.ts` | 設定パターンを踏襲 |

流用不要（haraisugiでは使わない）：
- `@anthropic-ai/sdk`, `@google/generative-ai` — LLM不使用
- `@getbrevo/brevo` — メール配信なし
- `firebase-admin` — サーバーサイド管理不要
- `google-trends-api` — トレンド機能なし
- `scripts/prefetch-products.ts` — 返礼品データ取得は不要