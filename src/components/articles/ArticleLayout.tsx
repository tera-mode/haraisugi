import ReactMarkdown from 'react-markdown';
import Disclaimer from '@/components/common/Disclaimer';
import CtaBanner from '@/components/common/CtaBanner';

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

      <div className="mt-12">
        <CtaBanner
          variant="secondary"
          heading="税金払いすぎ診断で無料チェック"
          subtext="あなたの年収・家族構成を入力するだけで、見逃し控除を3分で発見します。"
          label="無料で診断する"
        />
      </div>
    </article>
  );
}
