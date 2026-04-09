import type { Metadata } from 'next';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `節税コラム | ${SITE_NAME}`,
  description: '医療費控除・ふるさと納税・iDeCoなど、サラリーマンの節税に役立つコラムをまとめています。',
  alternates: {
    canonical: 'https://haraisugi.jp/articles',
  },
};

type Article = {
  id: string;
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  category: string;
};

export const revalidate = 86400;

async function getArticles(): Promise<Article[]> {
  try {
    const q = query(collection(db, 'articles'), orderBy('publishedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
  } catch {
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">節税コラム</h1>
      <p className="text-sm text-gray-500 mb-8">
        医療費控除・ふるさと納税・iDeCoなど、今すぐ使える節税テクニックを解説します。
      </p>

      {articles.length === 0 ? (
        <p className="text-gray-400 text-sm">記事はまだありません。</p>
      ) : (
        <div className="flex flex-col gap-4">
          {articles.map(article => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {article.category}
                </span>
                <span className="text-xs text-gray-400">{article.publishedAt}</span>
              </div>
              <p className="font-semibold text-gray-800 leading-snug">{article.title}</p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
