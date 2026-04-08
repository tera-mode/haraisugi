import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-3xl mx-auto px-4 py-8 text-sm text-gray-500">
        <p className="mb-2 font-medium text-gray-700">{SITE_NAME}</p>
        <p className="mb-4 text-xs leading-relaxed">
          本サービスは一般的な税制情報に基づくシミュレーションであり、個別具体的な税務相談ではありません。
          最終判断は税理士にご相談ください。
        </p>
        <div className="flex flex-wrap gap-4 text-xs">
          <Link href="/column" className="hover:text-blue-700">節税コラム</Link>
          <a href="https://www.laiv.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">運営会社</a>
          <a href="https://www.laiv.jp/terms" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">利用規約</a>
          <a href="https://www.laiv.jp/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">プライバシーポリシー</a>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} 合同会社LAIV. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
