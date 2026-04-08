# SEOコンテンツ量産 引き継ぎ書

最終更新: 2026-04-07

---

## 現在の状態

### 完了済み

| ファイル | 内容 | 状態 |
|----------|------|------|
| `src/lib/seo-articles/article-contents.ts` | 記事コンテンツデータ（19本分） | ✅ 作成済み |
| `src/lib/seo-articles/article-data.ts` | 記事メタデータ（1本分のみ） | ⚠️ 要追加 |
| `src/app/articles/[slug]/SalariedWorkerTaxArticle.tsx` | 記事#1 カスタムTSX | ✅ 完成 |
| `src/app/articles/[slug]/page.tsx` | ルーティング（記事#1のみ対応） | ⚠️ 要更新 |
| `src/components/common/GoogleAnalytics.tsx` | GAコンポーネント | ✅ 完成 |
| `src/app/layout.tsx` | GA組み込み済み | ✅ 完成 |

---

## 残りのタスク（優先度順）

### STEP 1: 残り30本のコンテンツデータを追加

`src/lib/seo-articles/article-contents.ts` に以下30本を追記する。
現在19本（スラッグ一覧は下記「完了済みコンテンツ」参照）が書かれている。

**未作成の30本（スラッグ）:**

```
20. kabushiki-soneki-tsusan        株式の損益通算と繰越控除のやり方
21. ideco-taishokukin-ukewatashi   iDeCoと退職金の受取順序で税金が100万円変わる
22. zaitaku-kinmu-kojo             在宅勤務の費用は控除できない？
23. nenshu-500man-setsuzei-plan    年収500万円の節税プラン
24. nenshu-1000man-setsuzei-12sen  年収1000万の節税対策12選
25. yokaigo-shogaisha-kojo         要介護認定で障害者控除が使える
26. tokutei-fuyou-kojo-2026        特定扶養控除と特定親族特別控除の違い
27. hitoriooya-kojo-jouken         ひとり親控除の条件と申請方法
28. jishin-hoken-kojo-kakikata     地震保険料控除の書き方と上限額
29. selfmedication-taishoyaku      セルフメディケーション税制の対象薬の見分け方
30. fukugyou-keihi-dokomade        副業の経費はどこまで認められる？
31. aoiro-shinkoku-65man           青色申告で65万円控除を受ける条件と手順
32. bekkyo-oya-fuyou-setsuzei      別居の親を扶養に入れて節税する方法
33. haito-kojo-zekin-torimodosu    配当控除で税金を取り戻す
34. juutaku-loan-furusato-heiyou   住宅ローン控除とふるさと納税は併用できる
35. zason-kojo-shinkoku            雑損控除の申請方法と計算例
36. taishokukin-zekin-keisan       退職金にかかる税金はいくら？
37. ideco-nisa-docchi              iDeCoとNISAどっちを優先すべき？
38. kakutei-shinkoku-shinai-donatsu 確定申告しないとどうなる？
39. shokibo-kyosai-salaryman       小規模企業共済はサラリーマンでも使える？
40. gensen-choshuhyo-mikata        源泉徴収票の見方と控除漏れの見つけ方
41. nenmatsu-kakekomi-setsuzei     年末の駆け込み節税リスト
42. shussan-ikukyu-kojo            出産・育休でもらえるお金と使える控除
43. tokutei-shishutsu-taiken       特定支出控除を実際に申請してみた体験談
44. telework-denkidai-kojo         テレワークの電気代は控除できる？
45. ninchisho-oya-shogaisha-kojo   認知症の親がいる家庭の節税
46. freelance-kazoku-kyuyo         フリーランスが家族に給与を払って節税する方法
47. shougaku-genka-shokyaku        少額減価償却資産の特例でパソコンを一括経費に
48. 103man-kabe-123man-kaisei      103万円の壁→123万円に変更！2026年税制改正
49. nenkin-kakutei-shinkoku        年金受給者の確定申告は必要？
```

**コンテンツの型（article-contents.ts に追記する形式）:**

```typescript
'kabushiki-soneki-tsusan': {
  slug: 'kabushiki-soneki-tsusan',
  introPoints: ['...', '...', '...'],
  sections: [
    { h2: '...', blocks: [
      { type: 'p', text: '...' },
      { type: 'ul', items: ['...'] },
      { type: 'info', variant: 'tip', text: '...' },
      { type: 'table', headers: ['...'], rows: [['...']] },
    ]},
  ],
  faqs: [{ q: '...', a: '...' }],
  summary: ['...'],
},
```

---

### STEP 2: article-data.ts に残り49本のメタデータを追加

`src/lib/seo-articles/article-data.ts` に以下の形式でエントリを追加する（現在は記事#1のみ）:

```typescript
'zeikin-haraisugichi-check': {
  slug: 'zeikin-haraisugichi-check',
  title: '税金払いすぎていませんか？5分でできる控除漏れセルフチェック法',
  description: '年末調整だけでは取りこぼす控除7選と、5分でできる控除漏れセルフチェック法を解説。過去5年分の還付申告で取り戻す方法も。',
  category: 'サラリーマン節税',
  publishedAt: '2026-04-07',
  updatedAt: '2026-04-07',
  published: true,
},
```

**全50本のタイトル・カテゴリ一覧:**

| スラッグ | タイトル | カテゴリ |
|----------|----------|----------|
| salaryman-setsuzei-14sen | サラリーマンの節税対策14選 【2026年版】 | サラリーマン節税 |
| zeikin-haraisugichi-check | 税金払いすぎていませんか？5分でできる控除漏れセルフチェック法 | サラリーマン節税 |
| tomobataraki-setsuzei-guide | 共働き夫婦の節税最適化ガイド | 共働き節税 |
| fukugyou-kakutei-shinkoku-guide | 副業の確定申告完全ガイド | 副業・確定申告 |
| kanpu-shinkoku-kako-5nen | 過去5年分の還付金を取り戻す方法 | 還付申告 |
| nenshu-800man-setsuzei-8sen | 年収800万円の節税対策8選 | 年収別節税 |
| shotoku-kojo-16shurui-ichiran | 所得控除16種類を一覧表で解説【2026年版】 | サラリーマン節税 |
| freelance-setsuzei-guide | フリーランスの節税完全ガイド | フリーランス節税 |
| 50dai-taishoku-setsuzei-checklist | 50代で退職する前にやるべき節税準備チェックリスト | 退職・年金 |
| nenmatsu-chosei-sonhinai-7kojo | 年末調整で損しない7つの控除 | 年末調整 |
| iryohi-kojo-urawaza-7sen | 医療費控除の裏技7選 | 医療費控除 |
| iryohi-kojo-ikura-modoru | 医療費控除でいくら戻る？年収別シミュレーション | 医療費控除 |
| furusato-nozei-genjo-sagaru | ふるさと納税の上限額が下がる5つのケース | ふるさと納税 |
| ideco-setsuzei-ikura | iDeCoでいくら節税できる？年収別シミュレーション | iDeCo |
| tokutei-shishutsu-kojo-suit | 特定支出控除でスーツ代を経費にする方法 | 特定支出控除 |
| seimei-hoken-kojo-waku | 生命保険料控除の枠を使い切る方法 | 生命保険料控除 |
| iryohi-vs-selfmedication | 医療費控除とセルフメディケーション税制どっちが得？ | セルフメディケーション |
| fukugyou-akaji-soneki-tsusan | 副業の赤字で節税できる？損益通算の条件 | 副業・確定申告 |
| fukugyou-20man-juminzei | 副業20万円以下でも住民税の申告は必要 | 副業・確定申告 |
| tomobataraki-fuyou-docchi | 共働きの子どもの扶養はどっちに入れる？ | 共働き節税 |
| kabushiki-soneki-tsusan | 株式の損益通算と繰越控除のやり方 | 株式投資 |
| ideco-taishokukin-ukewatashi | iDeCoと退職金の受取順序で税金が100万円変わる | iDeCo・退職 |
| zaitaku-kinmu-kojo | 在宅勤務の費用は控除できない？ | 在宅勤務 |
| nenshu-500man-setsuzei-plan | 年収500万円の手取りを最大化する節税プラン | 年収別節税 |
| nenshu-1000man-setsuzei-12sen | 年収1000万のサラリーマンが使える節税対策12選 | 年収別節税 |
| yokaigo-shogaisha-kojo | 要介護認定で障害者控除が使える | 障害者控除 |
| tokutei-fuyou-kojo-2026 | 特定扶養控除と特定親族特別控除の違い | 扶養控除 |
| hitoriooya-kojo-jouken | ひとり親控除の条件と申請方法 | ひとり親控除 |
| jishin-hoken-kojo-kakikata | 地震保険料控除の書き方と上限額 | 地震保険料控除 |
| selfmedication-taishoyaku | セルフメディケーション税制の対象薬の見分け方 | セルフメディケーション |
| fukugyou-keihi-dokomade | 副業の経費はどこまで認められる？ | 副業・確定申告 |
| aoiro-shinkoku-65man | 青色申告で65万円控除を受ける条件と手順 | フリーランス節税 |
| bekkyo-oya-fuyou-setsuzei | 別居の親を扶養に入れて節税する方法 | 扶養控除 |
| haito-kojo-zekin-torimodosu | 配当控除で税金を取り戻す | 株式投資 |
| juutaku-loan-furusato-heiyou | 住宅ローン控除とふるさと納税は併用できる | 住宅ローン控除 |
| zason-kojo-shinkoku | 雑損控除の申請方法と計算例 | 雑損控除 |
| taishokukin-zekin-keisan | 退職金にかかる税金はいくら？ | 退職・年金 |
| ideco-nisa-docchi | iDeCoとNISAどっちを優先すべき？ | iDeCo |
| kakutei-shinkoku-shinai-donatsu | 確定申告しないとどうなる？ | 副業・確定申告 |
| shokibo-kyosai-salaryman | 小規模企業共済はサラリーマンでも使える？ | フリーランス節税 |
| gensen-choshuhyo-mikata | 源泉徴収票の見方と控除漏れの見つけ方 | サラリーマン節税 |
| nenmatsu-kakekomi-setsuzei | 年末の駆け込み節税リスト | 年末調整 |
| shussan-ikukyu-kojo | 出産・育休でもらえるお金と使える控除 | 医療費控除 |
| tokutei-shishutsu-taiken | 特定支出控除を実際に申請してみた体験談 | 特定支出控除 |
| telework-denkidai-kojo | テレワークの電気代は控除できる？ | 在宅勤務 |
| ninchisho-oya-shogaisha-kojo | 認知症の親がいる家庭の節税 | 障害者控除 |
| freelance-kazoku-kyuyo | フリーランスが家族に給与を払って節税する方法 | フリーランス節税 |
| shougaku-genka-shokyaku | 少額減価償却資産の特例でパソコンを一括経費に | フリーランス節税 |
| 103man-kabe-123man-kaisei | 103万円の壁→123万円に変更！2026年税制改正 | 年末調整 |
| nenkin-kakutei-shinkoku | 年金受給者の確定申告は必要？ | 退職・年金 |

---

### STEP 3: StaticArticlePage テンプレートコンポーネントを作成

`src/components/articles/StaticArticlePage.tsx` を新規作成する。
`ArticleContent` 型のデータを受け取り、記事ページ全体をレンダリングするテンプレート。

**役割:**
- article-contents.ts のデータを受け取ってページを描画
- CTA（3カ所）・InfoBox・Table・FAQセクションを自動レンダリング
- 記事#1（SalariedWorkerTaxArticle.tsx）以外はこのテンプレントで描画

**参考デザイン:** `SalariedWorkerTaxArticle.tsx` と同じスタイル（青系、max-w-2xl）

---

### STEP 4: page.tsx を更新

`src/app/articles/[slug]/page.tsx` を更新して全50本に対応させる。

```typescript
// 現在の対応:
const staticArticleComponents = {
  'salaryman-setsuzei-14sen': SalariedWorkerTaxArticle,
  // ← 残り49本の対応が未実装
};

// 必要な処理:
// 1. salaryman-setsuzei-14sen → SalariedWorkerTaxArticle（カスタムTSX）
// 2. それ以外の静的記事 → StaticArticlePage(articleContents[slug])
// 3. 該当なし → Firestoreフォールバック
```

---

### STEP 5: コンテンツ目次ページを作成

`src/app/column/page.tsx` を新規作成する（furusona の /info に相当）。

**要件:**
- URL: `/column`
- 全50本の記事をカテゴリ別にグループ化して表示
- 各記事カード: カテゴリバッジ + タイトル + description + 公開日
- ページ上部にCTA（税金払いすぎ診断へ）
- SEOメタデータ（title/description/canonical）を設定
- フッターの「節税コラム」リンクを `/articles` から `/column` に変更するかどうかも検討

---

## 完了済みコンテンツ（article-contents.ts 内の19本）

| # | スラッグ | タイトル |
|---|----------|----------|
| 1 | zeikin-haraisugichi-check | 税金払いすぎていませんか？5分でできる控除漏れセルフチェック法 |
| 2 | tomobataraki-setsuzei-guide | 共働き夫婦の節税最適化ガイド |
| 3 | fukugyou-kakutei-shinkoku-guide | 副業の確定申告完全ガイド |
| 4 | kanpu-shinkoku-kako-5nen | 過去5年分の還付金を取り戻す方法 |
| 5 | nenshu-800man-setsuzei-8sen | 年収800万円の節税対策8選 |
| 6 | shotoku-kojo-16shurui-ichiran | 所得控除16種類を一覧表で解説 |
| 7 | freelance-setsuzei-guide | フリーランスの節税完全ガイド |
| 8 | 50dai-taishoku-setsuzei-checklist | 50代で退職する前にやるべき節税準備 |
| 9 | nenmatsu-chosei-sonhinai-7kojo | 年末調整で損しない7つの控除 |
| 10 | iryohi-kojo-urawaza-7sen | 医療費控除の裏技7選 |
| 11 | iryohi-kojo-ikura-modoru | 医療費控除でいくら戻る？年収別シミュレーション |
| 12 | furusato-nozei-genjo-sagaru | ふるさと納税の上限額が下がる5つのケース |
| 13 | ideco-setsuzei-ikura | iDeCoでいくら節税できる？年収別シミュレーション |
| 14 | tokutei-shishutsu-kojo-suit | 特定支出控除でスーツ代を経費にする方法 |
| 15 | seimei-hoken-kojo-waku | 生命保険料控除の枠を使い切る方法 |
| 16 | iryohi-vs-selfmedication | 医療費控除とセルフメディケーション税制どっちが得？ |
| 17 | fukugyou-akaji-soneki-tsusan | 副業の赤字で節税できる？損益通算の条件 |
| 18 | fukugyou-20man-juminzei | 副業20万円以下でも住民税の申告は必要 |
| 19 | tomobataraki-fuyou-docchi | 共働きの子どもの扶養はどっちに入れる？ |

---

## 次回の再開手順

1. `docs/seo_contents_handoff.md`（このファイル）を読む
2. STEP 1 → STEP 5 の順番で実装を進める
3. 全STEP完了後、`npm run dev` で動作確認
4. ビルドエラーがないか `npm run build` で確認

---

## 技術メモ

- 記事#1（SalariedWorkerTaxArticle.tsx）はカスタムTSXのため template 不使用
- article-contents.ts の型定義はファイル冒頭に記載済み（ContentBlock / Section / ArticleContent）
- GA計測ID: `G-BTHCKX0JW2`（.env.local設定済み）
- 現在のルーティング: `/articles/[slug]`（静的記事 + Firestoreフォールバック）
- 目次ページ候補URL: `/column`（furusona の /info に相当）
