import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME } from '@/lib/constants';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            src="/image/haraisugi_logo.png"
            alt={SITE_NAME}
            height={36}
            width={180}
            className="h-9 w-auto"
            priority
          />
        </Link>
        <nav className="flex gap-4 text-sm text-gray-600">
          <Link href="/tools" className="hover:text-brand-700">診断メニュー</Link>
          <Link href="/column" className="hover:text-brand-700">節税コラム</Link>
        </nav>
      </div>
    </header>
  );
}
