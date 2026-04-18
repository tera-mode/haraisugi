import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { getPublishedStaticArticles } from '@/lib/seo-articles/article-data';
import { buildPageMetadata } from '@/lib/seo/metadata';
import CtaBanner from '@/components/common/CtaBanner';

export const revalidate = 86400;

export const metadata = buildPageMetadata({
  title: '節税コラム一覧｜税金払いすぎ診断',
  description:
    '会社員・フリーランス・共働き夫婦の節税・確定申告に役立つコラムを50本以上掲載。医療費控除・ふるさと納税・iDeCo・扶養控除など、知らないと損する控除を徹底解説。',
  path: '/column',
});

type ArticleItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
};

async function getFirestoreArticles(staticSlugs: Set<string>): Promise<ArticleItem[]> {
  try {
    const q = query(collection(db, 'articles'), orderBy('publishedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs
      .map(doc => doc.data() as ArticleItem)
      .filter(a => a.slug && !staticSlugs.has(a.slug));
  } catch {
    return [];
  }
}

const CATEGORY_ORDER = [
  'サラリーマン節税',
  '年収別節税',
  '共働き節税',
  '年末調整',
  '医療費控除',
  'ふるさと納税',
  'iDeCo',
  'iDeCo・退職',
  '副業・確定申告',
  '特定支出控除',
  'セルフメディケーション',
  '生命保険料控除',
  '地震保険料控除',
  '住宅ローン控除',
  '株式投資',
  '扶養控除',
  'ひとり親控除',
  '障害者控除',
  '雑損控除',
  '在宅勤務',
  '還付申告',
  '退職・年金',
  'フリーランス節税',
  '相続税',
  '不動産',
];

export default async function ColumnPage() {
  const staticArticles = getPublishedStaticArticles();
  const staticSlugs = new Set(staticArticles.map(a => a.slug));
  const firestoreArticles = await getFirestoreArticles(staticSlugs);

  const allArticles: ArticleItem[] = [...staticArticles, ...firestoreArticles];

  // カテゴリ別にグループ化
  const grouped: Record<string, ArticleItem[]> = {};
  for (const a of allArticles) {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  }

  // カテゴリを定義順に並べ、残りはアルファベット順で追加
  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped)
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .sort(),
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* ページヘッダー */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">節税コラム一覧</h1>
        <p className="text-sm text-gray-600">
          会社員・フリーランス・共働き夫婦の節税・確定申告に役立つ記事を{allArticles.length}本掲載。
          知らないと損する控除を今すぐチェック。
        </p>
      </div>

      {/* CTA */}
      <div className="mb-10">
        <CtaBanner
          variant="primary"
          heading="まずは3分で控除漏れを診断【無料】"
          subtext="年収・家族構成を入力するだけ。あなたの見落とし控除を自動で発見。"
          label="税金払いすぎ診断を試す →"
        />
      </div>

      {/* カテゴリ別記事一覧 */}
      <div className="space-y-10">
        {orderedCategories.map((category) => (
          <section key={category}>
            <h2 className="text-base font-bold text-brand-700 border-b border-brand-200 pb-1 mb-4">
              {category}
            </h2>
            <div className="space-y-3">
              {grouped[category].map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-400 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium mt-0.5">
                      {article.category}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {article.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{article.publishedAt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 末尾CTA */}
      <div className="mt-12">
        <CtaBanner
          variant="secondary"
          heading="あなたの控除漏れを3分で診断"
          subtext="記事を読んで気になった控除があれば、無料診断で実際の節税額をシミュレーション。"
          label="無料で診断する"
        />
      </div>
    </main>
  );
}
