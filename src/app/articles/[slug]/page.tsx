import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import ArticleLayout from '@/components/articles/ArticleLayout';
import StaticArticlePage from '@/components/articles/StaticArticlePage';
import { buildArticleMetadata } from '@/lib/seo/metadata';
import { getArticleLD } from '@/lib/seo/structured-data';
import { getStaticArticle, getPublishedStaticArticles } from '@/lib/seo-articles/article-data';
import { articleContents } from '@/lib/seo-articles/article-contents';
import SalariedWorkerTaxArticle from './SalariedWorkerTaxArticle';

export const revalidate = 86400;

type FirestoreArticle = {
  title: string;
  description: string;
  body: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
};

async function getFirestoreArticle(slug: string): Promise<FirestoreArticle | null> {
  try {
    const q = query(collection(db, 'articles'), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as FirestoreArticle;
  } catch {
    return null;
  }
}

// カスタムTSXコンポーネントを持つ記事のみここで管理
const customArticleComponents: Record<string, React.ComponentType> = {
  'salaryman-setsuzei-14sen': SalariedWorkerTaxArticle,
};

// ビルド時に静的記事を事前生成
export async function generateStaticParams() {
  return getPublishedStaticArticles().map((a) => ({ slug: a.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // 静的記事を優先
  const staticArticle = getStaticArticle(slug);
  if (staticArticle) {
    return buildArticleMetadata(staticArticle);
  }

  // Firestoreフォールバック
  const article = await getFirestoreArticle(slug);
  if (!article) return {};
  return buildArticleMetadata(article);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const staticArticle = getStaticArticle(slug);

  // ① カスタムTSXコンポーネントがあればそちらを優先
  const CustomComponent = customArticleComponents[slug];
  if (CustomComponent && staticArticle) {
    const ld = getArticleLD(staticArticle);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
        <CustomComponent />
      </>
    );
  }

  // ② article-contents.ts のデータがあればテンプレートで描画
  const content = articleContents[slug];
  if (content && staticArticle) {
    const ld = getArticleLD(staticArticle);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
        <StaticArticlePage content={content} meta={staticArticle} />
      </>
    );
  }

  // ③ Firestoreフォールバック
  const article = await getFirestoreArticle(slug);
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
