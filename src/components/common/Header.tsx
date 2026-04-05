import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-blue-700 hover:text-blue-800">
          {SITE_NAME}
        </Link>
        <nav className="flex gap-4 text-sm text-gray-600">
          <Link href="/articles" className="hover:text-blue-700">節税コラム</Link>
        </nav>
      </div>
    </header>
  );
}
