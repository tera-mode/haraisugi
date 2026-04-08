import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { GoogleAnalytics } from '@/components/common/GoogleAnalytics';
import { siteMetadata } from '@/lib/seo/metadata';
import { getWebApplicationLD } from '@/lib/seo/structured-data';

export const metadata: Metadata = siteMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = getWebApplicationLD();

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
