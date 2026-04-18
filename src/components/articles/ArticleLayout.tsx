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
        <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">{category}</span>
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">{title}</h1>
      <p className="text-xs text-gray-400 mb-6">{publishedAt}</p>

      <Disclaimer />

      <div className="prose prose-sm max-w-none mt-6 text-gray-800">
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-xl px-5 py-5 text-center">
        <p className="text-sm font-bold text-brand-800 mb-2">税金払いすぎ診断で無料チェック</p>
        <p className="text-xs text-gray-600 mb-3">
          あなたの年収・家族構成を入力するだけで、見逃し控除を3分で発見します。
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-600 text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors"
        >
          無料で診断する
        </Link>
      </div>
    </article>
  );
}
