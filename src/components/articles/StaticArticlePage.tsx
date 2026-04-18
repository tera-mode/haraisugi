import type { ArticleContent, ContentBlock } from '@/lib/seo-articles/article-contents';
import type { StaticArticle } from '@/lib/seo-articles/article-data';
import Disclaimer from '@/components/common/Disclaimer';
import CtaBanner from '@/components/common/CtaBanner';

const InfoBox = ({ variant, text }: { variant: 'tip' | 'warn' | 'check'; text: string }) => {
  const styles = {
    tip: 'bg-brand-50 border-brand-200 text-brand-900',
    warn: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    check: 'bg-green-50 border-green-200 text-green-900',
  };
  const icons = { tip: '💡', warn: '⚠️', check: '✅' };
  return (
    <div className={`border rounded-xl px-5 py-4 my-4 text-base leading-relaxed ${styles[variant]}`}>
      <span className="mr-1">{icons[variant]}</span>
      {text}
    </div>
  );
};

const Block = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'p':
      return <p className="text-base leading-7 text-gray-700 mb-4">{block.text}</p>;
    case 'h3':
      return (
        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">{block.text}</h3>
      );
    case 'ul':
      return (
        <ul className="list-disc list-inside space-y-1 text-base text-gray-700 mb-4 pl-2">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case 'info':
      return <InfoBox variant={block.variant} text={block.text} />;
    case 'table':
      return (
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                {block.headers.map((h, i) => (
                  <th key={i} className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-200 px-3 py-2 text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
};

type Props = {
  content: ArticleContent;
  meta: StaticArticle;
};

export default function StaticArticlePage({ content, meta }: Props) {
  const publishedDate = new Date(meta.publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-3">
        <span className="text-xs bg-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full font-medium">
          {meta.category}
        </span>
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">{meta.title}</h1>
      <p className="text-sm text-gray-400 mb-6">最終更新日：{publishedDate}</p>

      <Disclaimer />

      {/* 導入 */}
      <section className="mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mb-4">
          <p className="font-bold text-gray-800 mb-2 text-base">この記事でわかること</p>
          <ul className="list-none space-y-1 text-base text-gray-700">
            {content.introPoints.map((point, i) => (
              <li key={i}>✔ {point}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner
        variant="primary"
        heading="あなたの控除漏れを3分で診断【無料】"
        subtext="年収・家族構成を入力するだけ。見落とし控除を今すぐ確認。"
        label="まず無料診断で控除漏れをチェック →"
      />

      {/* 本文セクション（CTAを3か所に分散） */}
      {content.sections.map((section, si) => (
        <section key={si} className="mb-10">
          <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 border-b-2 border-brand-500 pb-1">
            {section.h2}
          </h2>
          {section.blocks.map((block, bi) => (
            <Block key={bi} block={block} />
          ))}
          {/* 中間CTAを2番目のセクションの後に表示 */}
          {si === 1 && (
            <CtaBanner
              variant="primary"
              heading="あなたの控除漏れを3分で診断【無料】"
              subtext="年収・家族構成を入力するだけ。見落とし控除を今すぐ確認。"
              label="控除漏れを無料チェック →"
            />
          )}
        </section>
      ))}

      {/* FAQセクション */}
      {content.faqs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 border-b-2 border-brand-500 pb-1">
            よくある質問
          </h2>
          <div className="space-y-4">
            {content.faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-brand-50 px-4 py-3">
                  <p className="text-base font-bold text-brand-900">Q. {faq.q}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-base text-gray-700 leading-relaxed">A. {faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* まとめ */}
      {content.summary.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 border-b-2 border-brand-500 pb-1">
            まとめ
          </h2>
          <ul className="space-y-2">
            {content.summary.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-base text-gray-700">
                <span className="text-brand-500 font-bold mt-0.5">▶</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 末尾CTA */}
      <CtaBanner
        variant="primary"
        heading="あなたの控除漏れを3分で診断【無料】"
        subtext="年収・家族構成を入力するだけ。見落とし控除を今すぐ確認。"
        label="税金払いすぎ診断を無料で試す →"
      />
    </article>
  );
}
