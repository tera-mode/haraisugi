# haraisugi — 開発ガイドライン

税金払いすぎ診断（https://haraisugi.jp）のコードベース設計・実装ルール。
新しいページやコンポーネントを追加する際は必ずこのドキュメントを参照すること。

---

## 技術スタック

- **Framework**: Next.js 15 App Router（`src/app/`）
- **Styling**: Tailwind CSS v4（`@theme` カスタムカラー）
- **Language**: TypeScript
- **DB**: Firestore（記事データ）
- **Deploy**: Vercel

---

## デザインシステム

### ブランドカラー

```
brand-50  : #fff4f0  （背景・ライトバリアント）
brand-100 : #ffe8de
brand-200 : #ffcfb8  （ボーダー）
brand-500 : #ff5a1f  （アクセント・ボーダー強調）
brand-600 : #ff4600  （メインカラー・ボタン・強調）
brand-700 : #d93c00  （ホバー）
brand-800 : #b33200  （テキスト強調）
brand-900 : #802400
```

**使い分け:**
- ボタン背景: `bg-brand-600 hover:bg-brand-700`
- 選択状態ボタン: `bg-brand-50 border-brand-500 text-brand-700`
- 非選択ボタン: `bg-white border-gray-200 text-gray-700 hover:border-brand-300`
- カテゴリチップ: `bg-brand-100 text-brand-700`
- セクション見出し（記事）: `border-b-2 border-brand-500`

### ページ幅

| ページ種別 | クラス | px換算 |
|---|---|---|
| 診断フォーム・ホーム・ツール | `max-w-lg` | 512px |
| 記事（StaticArticlePage / ArticleLayout） | `max-w-2xl` | 672px |
| コラム一覧 | `max-w-3xl` | 768px |

### タイポグラフィ

| 用途 | クラス |
|---|---|
| ページ h1 | `text-2xl font-extrabold text-gray-900` |
| セクション h2（診断SEO） | `text-base font-bold text-gray-900` |
| セクション h2（記事） | `text-xl font-extrabold text-gray-900` |
| セクション h3（記事） | `text-lg font-bold text-gray-900` |
| 本文 | `text-sm text-gray-700 leading-relaxed` |
| 記事本文 | `text-base leading-7 text-gray-700` |
| サブテキスト | `text-sm text-gray-500` |

---

## 共通コンポーネント

### `<CtaBanner>` — CTA バナー

**ファイル**: `src/components/common/CtaBanner.tsx`

```tsx
import CtaBanner from '@/components/common/CtaBanner';

// Primary（オレンジ背景・強調用）
<CtaBanner
  variant="primary"
  heading="あなたの控除漏れを3分で診断【無料】"
  subtext="年収・家族構成を入力するだけ。見落とし控除を今すぐ確認。"
  label="無料で診断する →"
/>

// Secondary（淡いオレンジ背景・補足用）
<CtaBanner
  variant="secondary"
  heading="税金払いすぎ診断で無料チェック"
  subtext="あなたの年収・家族構成を入力するだけで、見逃し控除を3分で発見します。"
  label="無料で診断する"
/>
```

**使用場所のルール:**
- 記事の冒頭・中間（2番目セクション後）・末尾: `variant="primary"`
- コラム一覧トップ: `variant="primary"`
- コラム一覧末尾・記事末尾（Firestore記事）: `variant="secondary"`

### `<NicheDiagnosisPageShell>` — 診断ページ共通シェル

**ファイル**: `src/components/diagnosis/shared/NicheDiagnosisPageShell.tsx`

```tsx
import NicheDiagnosisPageShell from '@/components/diagnosis/shared/NicheDiagnosisPageShell';
import { getNicheDiagnosisLD } from '@/lib/seo/structured-data';

export default function MyDiagnosisPage() {
  const ld = getNicheDiagnosisLD({
    name: 'ツール名',
    description: '説明文',
    path: '/my-path',
  });

  return (
    <NicheDiagnosisPageShell
      ld={ld}
      seoContent={
        <>
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">見出し</h2>
            <p className="leading-relaxed">本文...</p>
          </div>
        </>
      }
    >
      <MyForm />
    </NicheDiagnosisPageShell>
  );
}
```

**役割**: LD+JSON script タグの注入・`max-w-lg` コンテナ・SEOセクションのスタイルを統一管理。

### `buildPageMetadata()` — メタデータ生成

**ファイル**: `src/lib/seo/metadata.ts`

```ts
import { buildPageMetadata } from '@/lib/seo/metadata';

// 診断ページ・一般ページ共通
export const metadata = buildPageMetadata({
  title: 'ページタイトル',
  description: 'ページ説明文',
  path: '/my-path',  // SITE_URL + path が canonical URL になる
});
```

title・description・canonical・openGraph をまとめて生成する。個別に書かない。

---

## ページ追加ガイド

### A. ニッチ診断ページを追加する

**ステップ:**

1. **診断ロジック作成**: `src/lib/diagnosis/my-tool/` に `types.ts`, `engine.ts`, `data.ts`
2. **フォームコンポーネント作成**: `src/components/diagnosis/my-tool/MyForm.tsx`
   - 選択ボタンの選択済み状態: `bg-brand-50 border-brand-500 text-brand-700`
   - 未選択状態: `bg-white border-gray-200 text-gray-700 hover:border-brand-300`
   - `DiagnosisShell`, `StepContainer`, `NumberInput` を使う
3. **ページファイル作成**: `src/app/my-tool/page.tsx`（下記テンプレートを使用）
4. **ツール一覧に追加**: `src/app/tools/page.tsx` の `DIAGNOSES` 配列にエントリを追加
5. **サイトマップに追加**: `src/app/sitemap.ts` に URL を追加

**`src/app/my-tool/page.tsx` テンプレート:**

```tsx
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getNicheDiagnosisLD } from '@/lib/seo/structured-data';
import NicheDiagnosisPageShell from '@/components/diagnosis/shared/NicheDiagnosisPageShell';
import MyForm from '@/components/diagnosis/my-tool/MyForm';

export const metadata = buildPageMetadata({
  title: 'ページタイトル（検索意図を含む）',
  description: '説明文（120文字以内推奨）',
  path: '/my-tool',
});

export default function MyToolPage() {
  const ld = getNicheDiagnosisLD({
    name: 'ツール名（短め）',
    description: '説明文',
    path: '/my-tool',
  });

  return (
    <NicheDiagnosisPageShell
      ld={ld}
      seoContent={
        <>
          {/* SEOコンテンツ: 3〜5個のdivブロックで構成 */}
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">見出し1</h2>
            <p className="leading-relaxed">本文。</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">見出し2</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>箇条書き1</li>
              <li>箇条書き2</li>
            </ul>
          </div>
        </>
      }
    >
      <MyForm />
    </NicheDiagnosisPageShell>
  );
}
```

---

### B. SEO記事（静的記事）を追加する

静的記事は 2 ファイルを編集するだけでページが生成される。ページファイルは作らない。

**ステップ:**

1. **`src/lib/seo-articles/article-data.ts`** に記事メタデータを追加
2. **`src/lib/seo-articles/article-contents.ts`** に記事コンテンツを追加
3. 以上で `/articles/[slug]` ページが自動生成される

**`article-data.ts` への追加例:**

```ts
// staticArticles オブジェクトに追記
'my-new-article': {
  slug: 'my-new-article',
  title: '記事タイトル（クリック率を意識して）',
  description: '説明文（SNSシェア・Google検索結果に表示される120文字以内）',
  category: 'サラリーマン節税',  // CATEGORY_ORDER に定義済みのカテゴリから選ぶ
  publishedAt: '2026-04-18',
  updatedAt: '2026-04-18',
  published: true,  // false にすると一覧に表示されない
},
```

**`article-contents.ts` への追加例:**

```ts
// articleContents オブジェクトに追記
'my-new-article': {
  slug: 'my-new-article',

  // 記事冒頭「この記事でわかること」の箇条書き（3〜4項目）
  introPoints: [
    '読んでわかること1',
    '読んでわかること2',
    '読んでわかること3',
  ],

  // 本文セクション（H2単位）
  sections: [
    {
      h2: 'セクション見出し1',
      blocks: [
        // 段落テキスト
        { type: 'p', text: '本文テキスト。<strong>は使えない。強調はInfoBoxで。' },

        // 箇条書き
        { type: 'ul', items: ['項目1', '項目2', '項目3'] },

        // H3 見出し
        { type: 'h3', text: 'サブ見出し' },

        // 情報ボックス
        { type: 'info', variant: 'tip',   text: '💡ヒント文' },  // ブランド色
        { type: 'info', variant: 'warn',  text: '⚠️注意文' },   // 黄色
        { type: 'info', variant: 'check', text: '✅確認事項' },  // 緑色

        // テーブル
        {
          type: 'table',
          headers: ['列1', '列2', '列3'],
          rows: [
            ['行1-1', '行1-2', '行1-3'],
            ['行2-1', '行2-2', '行2-3'],
          ],
        },
      ],
    },
    {
      h2: 'セクション見出し2',
      // ※ 2番目のセクションの直後に CTA が自動挿入される
      blocks: [ /* ... */ ],
    },
  ],

  // FAQ（0件でも OK、その場合は空配列）
  faqs: [
    { q: '質問文？', a: '回答文。' },
  ],

  // まとめ箇条書き（3〜5項目）
  summary: [
    'まとめ1',
    'まとめ2',
    'まとめ3',
  ],
},
```

**記事に自動適用される要素:**
- ページレイアウト（Header / Footer）
- カテゴリチップ・タイトル・更新日
- 免責事項（Disclaimer）
- 「この記事でわかること」ボックス
- 冒頭・中間・末尾の CtaBanner（primary）
- FAQセクション・まとめセクション
- openGraph / canonical（`buildArticleMetadata()` で自動生成）
- JSON-LD（Article 構造化データ）

---

### C. Firestore 記事を追加する

CMS（Firestore）に以下のフィールドを持つドキュメントを追加すると `/articles/[slug]` に表示される。

```
slug: string        （URLになる。英数字とハイフンのみ）
title: string
description: string
category: string    （CATEGORY_ORDER 内の値を使うと一覧でソートされる）
body: string        （Markdown テキスト）
publishedAt: string （'YYYY-MM-DD' 形式）
```

---

## ファイル構成

```
src/
├── app/
│   ├── layout.tsx              # ルートレイアウト（Header・Footer・GA）
│   ├── page.tsx                # ホーム
│   ├── tools/page.tsx          # 診断メニュー一覧
│   ├── column/page.tsx         # コラム一覧
│   ├── result/page.tsx         # 基本診断の結果
│   ├── articles/[slug]/page.tsx # 記事詳細（Firestore + Static 両対応）
│   └── [診断名]/page.tsx        # 各ニッチ診断ページ
│
├── components/
│   ├── common/
│   │   ├── Header.tsx          # 全ページ共通ヘッダー
│   │   ├── Footer.tsx          # 全ページ共通フッター
│   │   ├── CtaBanner.tsx       # 統一CTAバナー ← 必ずこれを使う
│   │   ├── Disclaimer.tsx      # 免責事項
│   │   └── DiagnosisMenuCard.tsx
│   ├── diagnosis/
│   │   ├── shared/
│   │   │   ├── NicheDiagnosisPageShell.tsx  # 診断ページ共通ラッパー ← 必ずこれを使う
│   │   │   ├── DiagnosisShell.tsx           # フォーム内共通シェル
│   │   │   ├── StepContainer.tsx
│   │   │   └── NumberInput.tsx
│   │   └── [診断名]/
│   │       ├── [Name]Form.tsx
│   │       └── [Name]Result.tsx
│   ├── articles/
│   │   ├── StaticArticlePage.tsx  # 静的記事テンプレート（CtaBanner 統合済み）
│   │   └── ArticleLayout.tsx      # Firestore記事テンプレート（CtaBanner 統合済み）
│   └── results/                   # 基本診断の結果コンポーネント
│
└── lib/
    ├── constants.ts            # SITE_URL, SITE_NAME, OGP_IMAGE
    ├── seo/
    │   ├── metadata.ts         # buildPageMetadata(), buildArticleMetadata(), siteMetadata
    │   └── structured-data.ts  # getNicheDiagnosisLD(), getWebApplicationLD(), getArticleLD()
    ├── seo-articles/
    │   ├── article-data.ts     # 静的記事のメタデータ一覧 ← 記事追加時に編集
    │   └── article-contents.ts # 静的記事のコンテンツ一覧 ← 記事追加時に編集
    └── diagnosis/
        ├── types.ts            # UserInput など共通型
        └── [診断名]/           # 各診断のロジック
```

---

## SEO ルール

### metadata の書き方

- 全ページ `buildPageMetadata()` を使う（ホームページのみ手動で openGraph を指定）
- title は `| 税金払いすぎ診断` がサイト名テンプレートで自動付与される（`siteMetadata` の `template` による）
- description は 120 文字以内を目安
- canonical は必ず設定する（重複コンテンツ対策）
- openGraph は全ページに設定する（SNS シェア・検索結果カード対応）

### Structured Data（JSON-LD）

- ルートレイアウト: `WebApplication`（`getWebApplicationLD()`）
- 診断ページ: `WebApplication`（`getNicheDiagnosisLD()`）→ `NicheDiagnosisPageShell` に渡す
- 記事ページ: `Article`（`getArticleLD()`）→ 記事ページで自動適用

### noindex

- `/result` ページ（診断結果）: `robots: { index: false, follow: false }` — `src/app/result/layout.tsx`
- その他ページは原則インデックス許可

---

## 開発ルール（禁止事項）

1. **CTA を直接 JSX で書かない** → `<CtaBanner>` を使う
2. **診断ページに `<>…<script>…<div className="max-w-lg">` を直接書かない** → `NicheDiagnosisPageShell` を使う
3. **`metadata` に `openGraph` を省略しない** → `buildPageMetadata()` で自動設定される
4. **フォームの選択ボタンに `green-*` を使わない** → `brand-*` で統一
5. **NavButtons の最終ステップで `green-*` を使わない** → `brand-*` で統一
6. **`column/page.tsx` の URL をハードコードしない** → `SITE_URL` 定数を使う
7. **新しい記事ページファイル (`app/articles/xxx/page.tsx`) を作らない** → `article-data.ts` と `article-contents.ts` にデータを追加するだけ

---

## プレイテストルール

### スクリーンショットの保存先

```
tmp/playtest/          ← スクリーンショットはここにのみ保存（.gitignore 済み）
```

**禁止**: ルートディレクトリ（`/`) や `src/` 配下に `.png` / `.jpg` を放置しない。
**理由**: `.gitignore` で `/tmp/` と `/*.png` を除外しているが、ルートへの放置はリポジトリを汚す。

### Playwright スクリーンショットの命名規則

```
tmp/playtest/YYYYMMDD_<説明>.png
例: tmp/playtest/20260418_tools-mobile.png
    tmp/playtest/20260418_header-before.png
    tmp/playtest/20260418_header-after.png
```

### プレイテスト手順（PDCA）

1. **dev サーバー起動**: `npm run dev -- --port 3002`（3000 が塞がっている場合は 3002 以降を使う）
2. **確認対象ページを列挙**: 変更の影響範囲を事前に特定する
3. **モバイル幅（375px）とデスクトップ（1280px）の両方**で確認
4. **スクリーンショット保存先は `tmp/playtest/`** に命名規則に従って保存
5. **問題発見 → 修正 → 再確認** を問題がなくなるまで繰り返す
6. `npm run build` でビルドエラーがないことを確認してからコミット

### プレイテスト完了条件

- [ ] 変更ページのモバイル（375px）表示に崩れがない
- [ ] 変更ページのデスクトップ表示に崩れがない
- [ ] `npm run build` がエラーなく完了する
- [ ] 旧文言・旧スタイルが残っていないことを grep で確認
- [ ] コンソールエラーが 0 件
