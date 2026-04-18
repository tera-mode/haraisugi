# ツール名リブランディング Claude Code 指示要件書

`haraisugi.jp` の7つのニッチ節税診断のツール名を、損失回避バイアスを刺激する訴求力ある名前に統一する。併せて `/tools` ページのカード視認性を改善する。

本要件書は最新のリポジトリ構成（`buildPageMetadata()` / `NicheDiagnosisPageShell` / `CtaBanner` の共通化完了後）に対応している。`CLAUDE.md` の開発ルールを前提に記述する。

---

## 0. 全体方針

| 方針 | 内容 |
|---|---|
| ① URLは不変 | `/medical-check`・`/tomobataraki` 等のパスは**絶対に変更しない**（SEO資産の保全） |
| ② メインブランドは不変 | 大元サービス名「税金払いすぎ診断」は変更しない |
| ③ 表示名は新名称に統一 | カード title・画面H1（DiagnosisShell `title`）・回遊バナー label・CTA文言を新名称に差し替え |
| ④ SEO titleは2段構成 | `buildPageMetadata()` の `title` に「{新ブランド名}｜{既存のSEOフレーズ}」で、検索流入を犠牲にせず新ブランドを刷り込む |
| ⑤ JSON-LD name は新名称 | `getNicheDiagnosisLD()` の `name` は新ブランド名のみ（短く） |
| ⑥ 既存記事タイトルは不変 | `article-data.ts`・`article-contents.ts` の記事 `title` は触らない。本文中のアンカーテキストのみ差し替え |
| ⑦ `/tools` の可読性改善 | `DiagnosisMenuCard` のカード内文字サイズを引き上げ、モバイルでも読みやすく |

---

## 1. 命名マッピング表

| # | パス | 旧カード title（表示用） | **新カード title（H1・表示用）** | SEO title（`buildPageMetadata` 用） |
|---|---|---|---|---|
| 1 | `/medical-check` | 医療費控除 vs セルフメディケーション判定 | **医療費 取り戻し診断** | 医療費 取り戻し診断｜医療費控除とセルフメディケーション税制どっちが得？ |
| 2 | `/tomobataraki` | 共働き世帯の扶養・控除 最適配分診断 | **共働き 損してる診断** | 共働き 損してる診断｜扶養・控除の最適配分で年末調整の損を回避 |
| 3 | `/taishoku-sim` | 退職金・iDeCo 受取戦略シミュレーション | **退職金 取られすぎ診断** | 退職金 取られすぎ診断｜退職金・iDeCoの最適な受取方法をシミュレーション |
| 4 | `/fukugyou-shindan` | 副業の申告判定・節税シミュレーション | **副業 払いすぎ診断** | 副業 払いすぎ診断｜副業の確定申告・節税ポイント自動判定 |
| 5 | `/souzoku` | 相続税 かんたん試算 | **相続税 取られすぎ診断** | 相続税 取られすぎ診断｜うちは相続税かかる？3分で試算 |
| 6 | `/furusato-limit` | ふるさと納税 上限額シミュレーション（控除併用対応） | **ふるさと納税 損してる診断** | ふるさと納税 損してる診断｜iDeCo・住宅ローン控除を加味した正確な上限額計算 |
| 7 | `/fudousan-baikyaku` | 不動産売却 税金シミュレーション | **マイホーム売却 取られすぎ診断** | マイホーム売却 取られすぎ診断｜譲渡所得税・3000万円特別控除の判定 |

**さらに `/tools` 自体：**

| パス | 旧 | 新 |
|---|---|---|
| `/tools` の `buildPageMetadata` title | 節税診断メニュー一覧 | **あなたはどこで損してる？7つの節税診断メニュー** |
| `/tools` の画面H1 | 節税診断メニュー | **あなたはどこで損してる？** |

---

## 2. 修正対象ファイル一覧

```
# メタデータ・ページ本体
src/app/tools/page.tsx                             ← buildPageMetadata + DIAGNOSES 配列 + H1/サブコピー
src/app/medical-check/page.tsx                     ← buildPageMetadata + getNicheDiagnosisLD
src/app/tomobataraki/page.tsx
src/app/taishoku-sim/page.tsx
src/app/fukugyou-shindan/page.tsx
src/app/souzoku/page.tsx
src/app/furusato-limit/page.tsx
src/app/fudousan-baikyaku/page.tsx
src/app/page.tsx                                   ← ニッチ節税診断ツール紹介セクション

# 結果ページ（本体診断結果）
src/app/result/page.tsx                            ← CrossLinkBanner の label

# 各診断のFormコンポーネント（DiagnosisShell の title）
src/components/diagnosis/medical-check/MedicalCheckForm.tsx
src/components/diagnosis/tomobataraki/TomobatarakiForm.tsx
src/components/diagnosis/taishoku-sim/TaishokuForm.tsx
src/components/diagnosis/fukugyou-shindan/FukugyouForm.tsx
src/components/diagnosis/souzoku/SouzokuForm.tsx
src/components/diagnosis/furusato-limit/FurusatoLimitForm.tsx
src/components/diagnosis/fudousan-baikyaku/FudousanForm.tsx

# 各診断の Resultコンポーネント（CrossLinkBanner の label + CTA文言内の診断名言及）
src/components/diagnosis/medical-check/MedicalResult.tsx
src/components/diagnosis/tomobataraki/TomobatarakiResult.tsx
src/components/diagnosis/taishoku-sim/TaishokuResult.tsx
src/components/diagnosis/fukugyou-shindan/FukugyouResult.tsx
src/components/diagnosis/souzoku/SouzokuResult.tsx
src/components/diagnosis/furusato-limit/FurusatoLimitResult.tsx
src/components/diagnosis/fudousan-baikyaku/FudousanResult.tsx

# UI改善
src/components/common/DiagnosisMenuCard.tsx        ← カード内文字サイズの引き上げ

# 記事本文内のアンカーテキスト（grep で検出したものを新名称へ）
src/lib/seo-articles/article-contents.ts

# サイトマップ
src/app/sitemap.ts                                 ← lastModified を実行日に更新
```

---

## 3. 作業手順（Phase別）

### Phase 0: 事前調査（必ず最初に実施）

旧ツール名がどこに残っているかを洗い出し、結果を `docs/rename-migration.md` に記録してから着手する。

```bash
grep -rn "医療費控除 vs セルフメディケーション判定" src/
grep -rn "医療費控除とセルフメディケーション" src/
grep -rn "共働き世帯の扶養・控除" src/
grep -rn "退職金・iDeCo 受取戦略" src/
grep -rn "退職金・iDeCo受取戦略" src/
grep -rn "副業の申告判定" src/
grep -rn "相続税 かんたん試算" src/
grep -rn "相続税かんたん試算" src/
grep -rn "ふるさと納税 上限額シミュレーション" src/
grep -rn "不動産売却 税金シミュレーション" src/
grep -rn "節税診断メニュー" src/
```

この事前調査を省略すると記事内の言及など見落としが発生する。

---

### Phase 1: `src/app/tools/page.tsx` の修正

#### 1-1. `buildPageMetadata` を差し替え

```diff
 export const metadata = buildPageMetadata({
-  title: '節税診断メニュー一覧',
-  description:
-    '医療費控除・共働き控除・退職金・副業・相続・ふるさと納税・不動産売却など、7つのニッチ節税シミュレーションを無料で利用できます。',
+  title: 'あなたはどこで損してる？7つの節税診断メニュー',
+  description:
+    '医療費・共働き・退職金・副業・相続・ふるさと納税・不動産売却。あなたが損しているポイントを7つの無料診断で見つけます。30秒で結果がわかります。',
   path: '/tools',
 });
```

#### 1-2. `DIAGNOSES` 配列の `title` を新ブランド名に差し替え

`description` は「損してる」「取り戻す」の文脈を補強しつつ機能説明を維持：

```ts
const DIAGNOSES = [
  {
    href: '/medical-check',
    icon: '💊',
    title: '医療費 取り戻し診断',
    description:
      '年間の医療費とOTC医薬品購入額を入力するだけで、医療費控除とセルフメディケーション税制どちらが得かを自動判定。還付額の差まで計算します。',
    target: '子育て世帯・共働き夫婦（30〜45歳）',
    available: true,
  },
  {
    href: '/tomobataraki',
    icon: '👨‍👩‍👧',
    title: '共働き 損してる診断',
    description:
      '夫婦の年収・子の年齢・住宅ローンを入力するだけで、扶養控除・住宅ローン控除・保険料控除の最適な振り分けを自動提案。',
    target: '共働き夫婦（30〜45歳、子持ち）',
    available: true,
  },
  {
    href: '/taishoku-sim',
    icon: '🏖️',
    title: '退職金 取られすぎ診断',
    description:
      '退職金とiDeCoの受取順序・受取時期を変えるだけで税金が数百万円変わることも。最適な受取パターンを自動シミュレーション。',
    target: '退職5年前〜退職直後（50〜65歳）',
    available: true,
  },
  {
    href: '/fukugyou-shindan',
    icon: '💻',
    title: '副業 払いすぎ診断',
    description:
      '副業収入・経費・本業年収を入力して、確定申告の要否・節税ポイント・損益通算の可否を自動判定。払いすぎた税金の取り戻し方まで提案。',
    target: '副業をしている会社員（25〜45歳）',
    available: true,
  },
  {
    href: '/souzoku',
    icon: '🏠',
    title: '相続税 取られすぎ診断',
    description:
      '財産総額・相続人数を入力するだけで相続税の概算額と節税対策を提案。生前贈与・小規模宅地等の特例も考慮した取られすぎ回避の戦略を可視化。',
    target: '親が60歳以上の方・財産保有者（40〜70歳）',
    available: true,
  },
  {
    href: '/furusato-limit',
    icon: '🎁',
    title: 'ふるさと納税 損してる診断',
    description:
      '住宅ローン控除・iDeCo・医療費控除の併用で上限が下がるケースに対応した正確な上限額を計算。自己負担2,000円を超えて損していないかチェック。',
    target: 'ふるさと納税をしている・検討中の方',
    available: true,
  },
  {
    href: '/fudousan-baikyaku',
    icon: '🏘️',
    title: 'マイホーム売却 取られすぎ診断',
    description:
      '売却価格・取得費・居住年数を入力して、譲渡所得税の概算と3,000万円特別控除の適用可否を自動判定。特例で税金ゼロにできるか瞬時に判定。',
    target: '不動産の売却を検討している方（40〜60歳）',
    available: true,
  },
];
```

#### 1-3. H1 とサブコピーを差し替え

**注意**: `CLAUDE.md` のタイポグラフィ規定（ページh1は `text-2xl font-extrabold text-gray-900`）は維持する。サイズは変えず、文言のみ差し替え。

```diff
     <div className="max-w-lg mx-auto px-4 py-8">
-      <div className="text-center mb-8">
-        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">節税診断メニュー</h1>
-        <p className="text-sm text-gray-500">
-          あなたの状況に合わせた無料シミュレーションツール
-        </p>
-      </div>
+      <div className="text-center mb-8">
+        <p className="text-xs font-semibold text-brand-600 mb-2">無料・30秒・登録不要</p>
+        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
+          あなたはどこで損してる？
+        </h1>
+        <p className="text-base text-gray-600 leading-relaxed">
+          気になるテーマを選ぶだけ。<br className="sm:hidden" />
+          損しているポイントを7つの診断で見つけます。
+        </p>
+      </div>

-      <div className="space-y-3">
+      <div className="space-y-4">
         {DIAGNOSES.map(d => (
           <DiagnosisMenuCard key={d.href} {...d} />
         ))}
       </div>

-      <div className="mt-10 text-center">
-        <p className="text-sm text-gray-500 mb-2">まずは基本の控除を確認したい方はこちら</p>
+      <div className="mt-12 text-center">
+        <p className="text-base text-gray-600 mb-3">まずは全体像をつかみたい方はこちら</p>
         <Link
           href="/"
-          className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-3 rounded-xl transition-colors"
+          className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-base px-8 py-4 rounded-xl transition-colors shadow-sm"
         >
           税金払いすぎ診断（基本版）を使う →
         </Link>
       </div>
     </div>
```

---

### Phase 2: `src/components/common/DiagnosisMenuCard.tsx` の文字サイズ改善

現状は以下のように小さい：
- カードタイトル: `text-sm font-bold`
- description: `text-xs text-gray-500`
- target: `text-xs text-gray-400`
- 矢印: `text-sm`

これを以下に引き上げる：

```diff
 export default function DiagnosisMenuCard({
   href, icon, title, description, target, available = true,
 }: Props) {
   const inner = (
     <div
-      className={`bg-white rounded-2xl border p-5 flex gap-4 items-start transition-all ${
+      className={`bg-white rounded-2xl border p-5 sm:p-6 flex gap-4 items-start transition-all ${
         available
           ? 'border-gray-200 hover:border-brand-300 hover:shadow-md cursor-pointer'
           : 'border-gray-100 opacity-60 cursor-default'
       }`}
     >
-      <div className="text-3xl flex-shrink-0">{icon}</div>
+      <div className="text-4xl flex-shrink-0 leading-none">{icon}</div>
       <div className="flex-1 min-w-0">
         <div className="flex items-center gap-2 mb-1">
-          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
+          <h2 className="text-base font-bold text-gray-900 leading-tight">{title}</h2>
           {!available && (
             <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">近日公開</span>
           )}
         </div>
-        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
-        <p className="text-xs text-gray-400 mt-2">対象: {target}</p>
+        <p className="text-sm text-gray-600 leading-relaxed mt-1">{description}</p>
+        <p className="text-xs text-gray-400 mt-2.5">対象: {target}</p>
       </div>
       {available && (
-        <div className="text-brand-500 text-sm flex-shrink-0">→</div>
+        <div className="text-brand-500 text-lg flex-shrink-0 font-semibold">→</div>
       )}
     </div>
   );

   if (!available) return inner;
   return <Link href={href} className="block">{inner}</Link>;
 }
```

**狙い**:
- タイトル `text-sm → text-base` で視認性向上（カードでクリック意思決定を助ける最重要要素）
- description `text-xs → text-sm` で読みやすく
- アイコン `text-3xl → text-4xl` で存在感アップ
- パディング `p-5 → p-5 sm:p-6` でデスクトップでは余白広く
- 矢印 `text-sm → text-lg` でクリッカブル性を強調

モバイル（375px幅）と通常デスクトップ両方で表示を確認。

---

### Phase 3: 各診断ページ（`src/app/*/page.tsx`）のメタデータ差し替え

各ページは `buildPageMetadata()` と `getNicheDiagnosisLD()` の2箇所のみ更新。`NicheDiagnosisPageShell` 内の `seoContent` プロパティは**絶対に触らない**（既存のSEO記事本文を保全）。

**パターン（`/medical-check/page.tsx` の例）**：

```diff
 export const metadata = buildPageMetadata({
-  title: '医療費控除とセルフメディケーション税制どっちが得？自動判定ツール',
+  title: '医療費 取り戻し診断｜医療費控除とセルフメディケーション税制どっちが得？',
   description:
     '年間の医療費とOTC医薬品購入額を入力するだけで、あなたに有利な制度を自動判定。還付額の差額まで計算します。',
   path: '/medical-check',
 });

 export default function MedicalCheckPage() {
   const ld = getNicheDiagnosisLD({
-    name: '医療費控除 vs セルフメディケーション判定ツール',
+    name: '医療費 取り戻し診断',
     description: '年間の医療費とOTC医薬品購入額を入力するだけで、あなたに有利な制度を自動判定。還付額の差額まで計算します。',
     path: '/medical-check',
   });
   ...
 }
```

**残り6ページの差し替え値一覧**：

| ファイル | `buildPageMetadata` の新 `title` | `getNicheDiagnosisLD` の新 `name` |
|---|---|---|
| `/tomobataraki/page.tsx` | `共働き 損してる診断｜扶養・控除の最適配分で年末調整の損を回避` | `共働き 損してる診断` |
| `/taishoku-sim/page.tsx` | `退職金 取られすぎ診断｜退職金・iDeCoの最適な受取方法をシミュレーション` | `退職金 取られすぎ診断` |
| `/fukugyou-shindan/page.tsx` | `副業 払いすぎ診断｜副業の確定申告・節税ポイント自動判定` | `副業 払いすぎ診断` |
| `/souzoku/page.tsx` | `相続税 取られすぎ診断｜うちは相続税かかる？3分で試算` | `相続税 取られすぎ診断` |
| `/furusato-limit/page.tsx` | `ふるさと納税 損してる診断｜iDeCo・住宅ローン控除を加味した正確な上限額計算` | `ふるさと納税 損してる診断` |
| `/fudousan-baikyaku/page.tsx` | `マイホーム売却 取られすぎ診断｜譲渡所得税・3000万円特別控除の判定` | `マイホーム売却 取られすぎ診断` |

**注意**:
- `description` は既存のものを維持してよい（既存の検索キーワードが含まれているため）
- `buildPageMetadata()` は内部で `| 税金払いすぎ診断` をサフィックス付与する（`siteMetadata.title.template` による）。ブラウザタブは例えば `医療費 取り戻し診断｜... | 税金払いすぎ診断` と表示される

---

### Phase 4: 各 Form コンポーネント（`DiagnosisShell` の `title`）

各 `*Form.tsx` は `DiagnosisShell` に `title` を渡す。これを新ブランド名に揃える。

例（`MedicalCheckForm.tsx`）：
```diff
 <DiagnosisShell
-  title="医療費控除 vs セルフメディケーション判定"
+  title="医療費 取り戻し診断"
   ...
 >
```

7ファイル分、同パターンで修正。渡す `title` は **Phase 1 のマッピング表「新カード title」** と完全一致させる。

---

### Phase 5: 各 Result コンポーネント（`CrossLinkBanner` の `label` + CTA文言）

#### 5-1. `CrossLinkBanner` の `label` を差し替え

全7件の `*Result.tsx` で、他診断への `CrossLinkBanner` の `label` を新名称に差し替え。

例（`TomobatarakiResult.tsx`）：
```diff
 <CrossLinkBanner
   links={[
     { href: '/', icon: '🧾', label: '税金払いすぎ診断（基本版）', available: true },
-    { href: '/medical-check', icon: '💊', label: '医療費控除 vs セルフメディケーション判定', available: true },
+    { href: '/medical-check', icon: '💊', label: '医療費 取り戻し診断', available: true },
     { href: '/tools', icon: '🗂️', label: '節税診断メニューをすべて見る', available: true },
   ]}
 />
```

例（`TaishokuResult.tsx`）：
```diff
-    { href: '/tomobataraki', icon: '👨‍👩‍👧', label: '共働き世帯の扶養・控除 最適配分診断', available: true },
+    { href: '/tomobataraki', icon: '👨‍👩‍👧', label: '共働き 損してる診断', available: true },
```

例（`SouzokuResult.tsx`）：
```diff
-    { href: '/fudousan-baikyaku', icon: '🏘️', label: '不動産売却 税金シミュレーション', available: false },
-    { href: '/taishoku-sim', icon: '🏖️', label: '退職金・iDeCo 受取戦略シミュレーション', available: true },
+    { href: '/fudousan-baikyaku', icon: '🏘️', label: 'マイホーム売却 取られすぎ診断', available: false },
+    { href: '/taishoku-sim', icon: '🏖️', label: '退職金 取られすぎ診断', available: true },
```

#### 5-2. CTA 内の診断名言及を差し替え

例（`SouzokuResult.tsx`）の CTA リンク文言：
```diff
 <Link href="/taishoku-sim" ...>
   <p className="text-sm font-bold text-gray-800 mb-0.5">退職金の受取方法も最適化する →</p>
-  <p className="text-xs text-gray-500">退職金・iDeCo受取戦略シミュレーションで老後設計を確認</p>
+  <p className="text-xs text-gray-500">退職金 取られすぎ診断で老後設計を確認</p>
 </Link>
```

例（`FudousanResult.tsx`）：
```diff
 <Link href="/souzoku" ...>
   <span className="font-bold">相続した不動産の相続税も確認する →</span>
-  <span className="text-sm text-gray-500">相続税かんたん試算で相続税額をシミュレーション</span>
+  <span className="text-sm text-gray-500">相続税 取られすぎ診断で相続税額をシミュレーション</span>
 </Link>
```

Phase 0 の grep 結果に従って全箇所を精査すること。

---

### Phase 6: `src/app/result/page.tsx`（本体診断結果ページの回遊バナー）

`/result` ページ末尾の「より詳しく診断したい方へ」の `CrossLinkBanner` にも旧名称が残っている：

```diff
 <CrossLinkBanner
   heading="より詳しく診断したい方へ"
   links={[
-    { href: '/medical-check', icon: '💊', label: '医療費控除 vs セルフメディケーション判定', available: true },
-    { href: '/tomobataraki', icon: '👨‍👩‍👧', label: '共働き世帯の扶養・控除 最適配分診断', available: true },
-    { href: '/furusato-limit', icon: '🎁', label: 'ふるさと納税 上限額シミュレーション', available: true },
+    { href: '/medical-check', icon: '💊', label: '医療費 取り戻し診断', available: true },
+    { href: '/tomobataraki', icon: '👨‍👩‍👧', label: '共働き 損してる診断', available: true },
+    { href: '/furusato-limit', icon: '🎁', label: 'ふるさと納税 損してる診断', available: true },
     { href: '/tools', icon: '🛠️', label: '全7つの節税診断メニューを見る', available: true },
   ]}
 />
```

---

### Phase 7: 本体トップページ（`src/app/page.tsx`）

「ニッチ節税診断ツール」セクションの紹介文を更新：

```diff
 <div className="border-t border-gray-100 pt-8">
   <h2 className="text-base font-bold text-gray-900 mb-3">ニッチ節税診断ツール</h2>
   <p className="text-gray-600 mb-4">
-    医療費控除・共働き控除・副業申告・相続税・ふるさと納税など、テーマ別の詳細シミュレーションツールを提供しています。
+    医療費の取り戻し・共働きの損・退職金の取られすぎ・副業の払いすぎなど、テーマ別の無料診断ツールを7つ提供しています。
   </p>
   <Link href="/tools" ...>
-    節税診断メニューを見る →
+    あなたはどこで損してる？診断メニューを見る →
   </Link>
 </div>
```

---

### Phase 8: 記事内のアンカーテキスト差し替え

**重要**: 記事の `title` フィールド自体（`article-data.ts` 内の `title`）は**絶対に変更しない**。検索順位を維持するため。

変更対象は、`article-contents.ts` 本文中に登場する「医療費控除 vs セルフメディケーション判定」のような**ツールへのリンクアンカーテキスト**のみ。

```diff
- [医療費控除 vs セルフメディケーション判定](/medical-check)
+ [医療費 取り戻し診断](/medical-check)
```

Phase 0 の grep 結果に従って精査。該当がなければスキップでOK。

---

### Phase 9: サイトマップ更新（`src/app/sitemap.ts`）

診断ページ8件と `/tools`・`/` の `lastModified` を**実行日の日付**に更新：

```diff
-    { url: SITE_URL, lastModified: new Date('2026-04-18'), ... },
+    { url: SITE_URL, lastModified: new Date('YYYY-MM-DD'), ... },
-    { url: `${SITE_URL}/tools`, lastModified: new Date('2026-04-18'), ... },
+    { url: `${SITE_URL}/tools`, lastModified: new Date('YYYY-MM-DD'), ... },
     ... (/medical-check から /fudousan-baikyaku まで7件も同様)
```

これでGoogleに「更新があった」とシグナルを送れる。

---

### Phase 10: 検証・デプロイ

```bash
# 1. ビルド確認
npm run build

# 2. ローカル確認（モバイル375px幅で）
npm run dev
# 確認項目:
# - /tools でカードが読みやすい（タイトル text-base, desc text-sm）
# - 各診断ページのブラウザタブ title が「{新ブランド名}｜... | 税金払いすぎ診断」
# - 各診断のH1が新ブランド名
# - 結果画面まで操作して回遊バナーの label が新名称
# - /result の回遊バナーも新名称

# 3. 旧名称が残っていないことを確認
grep -rn "医療費控除 vs セルフメディケーション判定" src/
grep -rn "共働き世帯の扶養・控除 最適配分診断" src/
grep -rn "退職金・iDeCo 受取戦略シミュレーション" src/
grep -rn "退職金・iDeCo受取戦略シミュレーション" src/
grep -rn "副業の申告判定・節税シミュレーション" src/
grep -rn "相続税 かんたん試算" src/
grep -rn "相続税かんたん試算" src/
grep -rn "ふるさと納税 上限額シミュレーション" src/
grep -rn "不動産売却 税金シミュレーション" src/
# → article-data.ts の記事 title を除いて0件になること

# 4. Vercelデプロイ（通常のGit push）

# 5. Google/Bingに更新通知
#    package.json に ping-search-engines スクリプトがある場合:
npm run ping-search-engines
#    ない場合: npx ts-node scripts/ping-search-engines.ts

# 6. Google Search Console で主要ページのインデックス再登録をリクエスト
#    /tools  /medical-check  /tomobataraki  /taishoku-sim
#    /fukugyou-shindan  /souzoku  /furusato-limit  /fudousan-baikyaku
```

---

## 4. やってはいけないこと

- ❌ **URLパスの変更**（`/medical-check` → `/iryouhi-torimodoshi` などは禁止）
- ❌ **メインブランド「税金払いすぎ診断」の変更**（サイト全体のアイデンティティ）
- ❌ **既存記事（`article-data.ts`・`article-contents.ts`）の `title` フィールドの変更**（SEO順位を失う）
- ❌ **`constants.ts` の `SITE_NAME` 変更**（これも「税金払いすぎ診断」のまま）
- ❌ **TypeScript識別子（`id: 'medical_check'`・診断エンジンの `diagnosis: 'tomobataraki'` などのGA4イベントキー）の変更**（内部APIとアナリティクスに影響するため不可）
- ❌ **`CLAUDE.md` のデザインシステム規約（ページh1は `text-2xl`）の変更**（全ページの一貫性を保つため、`/tools` のH1もこの規定を守る）
- ❌ **`NicheDiagnosisPageShell` の `seoContent` 内 SEO記事本文の変更**（既存のオーガニック流入を損なわない）

---

## 5. 完了条件（DoD）

- [ ] `/tools` を開いて、7つのカードが新ブランド名で表示される
- [ ] `/tools` のH1が「あなたはどこで損してる？」
- [ ] 各診断ページをブラウザで開いて、タブtitleが「{新ブランド名}｜... | 税金払いすぎ診断」になっている
- [ ] 各診断ページのH1（`DiagnosisShell` の title）が新ブランド名
- [ ] 診断結果画面・`/result` 画面の回遊バナー `label` が新ブランド名を参照
- [ ] 本体トップ `/` の「ニッチ節税診断ツール」セクションの文言が新ブランド名
- [ ] `grep` で旧名称がヒットしない（記事titleフィールドを除く）
- [ ] iPhone SE幅（375px）で `/tools` のカードタイトル・description が読みやすい
- [ ] `npm run build` がエラーなく完了
- [ ] Lighthouse Performance Score 90以上を維持
- [ ] サイトマップの `lastModified` が実行日の日付
- [ ] サーチコンソールから主要8URLのインデックス再登録を実行

---

## 6. ASP監査・審査観点の補足

「取られすぎ」「損してる」「払いすぎ」の煽り系ワードは、既に稼働中のメインサービス名「税金払いすぎ診断」と同水準の表現であり、金融系ASP（A8.net・もしもアフィリエイト等）の審査で致命的にはならないと判断する。ただし以下は避ける：

- 「絶対儲かる」「100%取り返せる」等の断定表現 → 使わない
- 「税務相談」「節税対策です」等の税理士法第52条抵触表現 → 使わない（「診断」「シミュレーション」「概算」の範囲を維持）
- 結果画面で表示される金額には必ず「概算」「推定」を明示 → 既存実装を踏襲

---

## 7. 参考：実装パターンの再確認（触っていい/ダメ の線引き）

プロジェクトの共通基盤は以下。リブランディングでこの構造を崩さない。

| コンポーネント/関数 | 役割 | 今回のリブランディングで触る箇所 |
|---|---|---|
| `buildPageMetadata()` | メタデータ生成（title / description / canonical / openGraph） | 呼び出し側の `title` 引数のみ |
| `getNicheDiagnosisLD()` | JSON-LD `WebApplication` 生成 | 呼び出し側の `name` 引数のみ |
| `NicheDiagnosisPageShell` | 診断ページ共通シェル（JSON-LD 注入 + コンテナ） | **触らない**（構造変更なし） |
| `DiagnosisShell` | フォーム内ウィザード共通シェル | 呼び出し側の `title` prop のみ |
| `DiagnosisMenuCard` | `/tools` のカード | **文字サイズだけ引き上げ**、構造は維持 |
| `CrossLinkBanner` | 診断間回遊バナー | 呼び出し側の `links[].label` のみ |
| `CtaBanner` | 統一CTAバナー | **触らない**（記事・コラム用、今回のスコープ外） |

以上。