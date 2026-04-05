import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import ArticleLayout from '@/components/articles/ArticleLayout';
import { buildArticleMetadata } from '@/lib/seo/metadata';
import { getArticleLD } from '@/lib/seo/structured-data';

export const revalidate = 86400;

type Article = {
  title: string;
  description: string;
  body: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
};

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const q = query(collection(db, 'articles'), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as Article;
  } catch {
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return buildArticleMetadata(article);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const ld = getArticleLD(article);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <ArticleLayout
        title={article.title}
        body={article.body}
        publishedAt={article.publishedAt}
        category={article.category}
      />
    </>
  );
}
