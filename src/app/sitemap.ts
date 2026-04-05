import type { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { SITE_URL } from '@/lib/constants';

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
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    const snap = await getDocs(collection(db, 'articles'));
    const articleEntries: MetadataRoute.Sitemap = snap.docs.map(doc => {
      const data = doc.data();
      return {
        url: `${SITE_URL}/articles/${data.slug}`,
        lastModified: data.updatedAt ? new Date(data.updatedAt) : new Date(data.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    });
    return [...base, ...articleEntries];
  } catch {
    return base;
  }
}
