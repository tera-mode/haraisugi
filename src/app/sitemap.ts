import type { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { SITE_URL } from '@/lib/constants';
import { getPublishedStaticArticles } from '@/lib/seo-articles/article-data';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/column`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // 静的記事（50本）をサイトマップに追加
  const staticArticles = getPublishedStaticArticles();
  const staticSlugs = new Set(staticArticles.map(a => a.slug));
  const staticEntries: MetadataRoute.Sitemap = staticArticles.map(a => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Firestore記事（静的記事と重複するスラグは除外）
  try {
    const snap = await getDocs(collection(db, 'articles'));
    const firestoreEntries: MetadataRoute.Sitemap = snap.docs
      .filter(doc => !staticSlugs.has(doc.data().slug))
      .map(doc => {
        const data = doc.data();
        return {
          url: `${SITE_URL}/articles/${data.slug}`,
          lastModified: data.updatedAt ? new Date(data.updatedAt) : new Date(data.publishedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      });
    return [...base, ...staticEntries, ...firestoreEntries];
  } catch {
    return [...base, ...staticEntries];
  }
}
