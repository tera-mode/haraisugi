import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, OGP_IMAGE } from '@/lib/constants';

export const siteMetadata: Metadata = {
  title: {
    default: '税金払いすぎ診断 — あなたの取りこぼし控除を3分で発見【無料】',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    '年収・家族構成を入力するだけで、見逃している控除と節税テクニックを提案。サラリーマンの医療費控除の裏技、iDeCo・ふるさと納税の最適配分まで。',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: OGP_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OGP_IMAGE],
  },
  icons: {
    icon: '/image/haraisugi_fav.png',
    apple: '/image/haraisugi_logo_symbol.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export function buildArticleMetadata(article: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
}): Metadata {
  const url = `${SITE_URL}/articles/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      type: 'article',
      url,
      publishedTime: article.publishedAt,
      images: [{ url: OGP_IMAGE, width: 1200, height: 630 }],
    },
    alternates: { canonical: url },
  };
}
