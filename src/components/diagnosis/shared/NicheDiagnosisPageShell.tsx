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
            <p className="text-xs text-gray-500 pb-4 border-b border-gray-100">
              本ツールは<strong className="text-gray-700">無料・登録不要</strong>でご利用いただけます。回答に要する時間は約30秒〜3分です。
            </p>
            {seoContent}
          </section>
        )}
      </div>
    </>
  );
}
