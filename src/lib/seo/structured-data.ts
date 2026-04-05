import { SITE_URL, SITE_NAME, OGP_IMAGE } from '@/lib/constants';

export function getWebApplicationLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      '年収・家族構成を入力するだけで、見逃している控除と節税テクニックを提案する無料診断ツール。',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    image: OGP_IMAGE,
    inLanguage: 'ja',
  };
}

export function getArticleLD(article: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: `${SITE_URL}/articles/${article.slug}`,
    image: OGP_IMAGE,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: '合同会社LAIV',
      url: SITE_URL,
    },
    inLanguage: 'ja',
  };
}
