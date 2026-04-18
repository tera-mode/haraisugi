type Props = {
  /** JSON-LD 構造化データオブジェクト */
  ld: object;
  /** 診断フォームコンポーネント */
  children: React.ReactNode;
  /** ページ下部のSEO静的テキスト（<div> のリスト） */
  seoContent?: React.ReactNode;
};

/**
 * ニッチ診断ページ共通シェル
 * - JSON-LD スクリプトタグを注入
 * - max-w-lg コンテナで統一
 * - SEOセクションのスタイルを統一
 */
export default function NicheDiagnosisPageShell({ ld, children, seoContent }: Props) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <div className="max-w-lg mx-auto px-4 py-8">
        {children}
        {seoContent && (
          <section className="mt-16 space-y-10 text-sm text-gray-700">
            {seoContent}
          </section>
        )}
      </div>
    </>
  );
}
