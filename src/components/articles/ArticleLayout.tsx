import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Disclaimer from '@/components/common/Disclaimer';

type Props = {
  title: string;
  body: string;
  publishedAt: string;
  category: string;
};

export default function ArticleLayout({ title, body, publishedAt, category }: Props) {
  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-2">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{category}</span>
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">{title}</h1>
      <p className="text-xs text-gray-400 mb-6">{publishedAt}</p>

      <Disclaimer />

      <div className="prose prose-sm max-w-none mt-6 text-gray-800">
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl px-5 py-5 text-center">
        <p className="text-sm font-bold text-blue-800 mb-2">税金払いすぎ診断で無料チェック</p>
        <p className="text-xs text-gray-600 mb-3">
          あなたの年収・家族構成を入力するだけで、見逃し控除を30秒で発見します。
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          無料で診断する
        </Link>
      </div>
    </article>
  );
}
