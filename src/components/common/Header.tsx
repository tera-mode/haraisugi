import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME } from '@/lib/constants';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* ナビゲーション行 */}
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
        <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
          <Image
            src="/image/haraisugi_logo.png"
            alt={SITE_NAME}
            height={32}
            width={160}
            className="h-7 sm:h-8 w-auto"
            priority
          />
        </Link>
        <nav className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
          <Link href="/tools" className="hover:text-brand-700 whitespace-nowrap">診断メニュー</Link>
          <Link href="/column" className="hover:text-brand-700 whitespace-nowrap">節税コラム</Link>
        </nav>
      </div>
      {/* トラストシグナルバー */}
      <div className="bg-brand-50 border-t border-brand-100">
        <div className="max-w-3xl mx-auto px-4 py-1 flex items-center justify-center gap-3 text-xs text-brand-700 font-medium">
          <span>✓ 無料</span>
          <span aria-hidden="true" className="text-brand-300">|</span>
          <span>✓ 3分で完了</span>
          <span aria-hidden="true" className="text-brand-300">|</span>
          <span>✓ 登録不要</span>
        </div>
      </div>
    </header>
  );
}
