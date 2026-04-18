'use client';

import Link from 'next/link';
import ResultLayout from '@/components/diagnosis/shared/ResultLayout';
import CrossLinkBanner from '@/components/common/CrossLinkBanner';
import type { SideJobResult, FilingType, IncomeCategory } from '@/lib/diagnosis/fukugyou-shindan/types';
import { trackEvent } from '@/lib/analytics';
import { AFFILIATE_LINKS } from '@/lib/affiliate/links';

type Props = {
  result: SideJobResult;
  onReset: () => void;
};

function formatMan(val: number): string {
  if (val === 0) return '0円';
  return `約${Math.round(Math.abs(val) * 10) / 10}万円`;
}

function getCategoryLabel(cat: IncomeCategory): string {
  if (cat === 'business') return '事業所得';
  if (cat === 'miscellaneous') return '雑所得';
  return '事業所得（要確認）';
}

function getCategoryColor(cat: IncomeCategory): string {
  if (cat === 'business') return 'text-green-700 bg-green-100';
  if (cat === 'miscellaneous') return 'text-brand-700 bg-brand-100';
  return 'text-brand-700 bg-brand-100';
}

function getFilingLabel(filing: FilingType): string {
  if (filing === 'blue_65') return '青色申告（65万円控除）';
  if (filing === 'blue_10') return '青色申告（10万円控除）';
  if (filing === 'white') return '白色申告';
  return '申告不要';
}

function getFilingDescription(filing: FilingType): string {
  if (filing === 'blue_65') return '開業届＋複式簿記＋e-Taxで65万円の特別控除が適用できます。最も節税効果が高い方法です。';
  if (filing === 'blue_10') return '開業届＋簡易簿記で10万円の特別控除が適用できます。青色申告承認申請書の提出が必要です。';
  if (filing === 'white') return '帳簿なしでも申告できますが、控除額が少なくなります。来年は青色申告への移行を検討しましょう。';
  return '所得税の確定申告は不要ですが、住民税の申告は必要な場合があります。';
}

export default function FukugyouResult({ result, onReset }: Props) {
  const {
    needsTaxReturn,
    needsResidentTaxReturn,
    incomeCategory,
    recommendedFiling,
    netIncome,
    estimatedTax,
    estimatedRefund,
    canLossOffset,
    recommendations,
    risks,
    tips,
  } = result;

  const hero = (
    <div className={`rounded-2xl p-6 text-white text-center ${
      needsTaxReturn
        ? 'bg-gradient-to-br from-green-600 to-green-800'
        : 'bg-gradient-to-br from-brand-500 to-brand-700'
    }`}>
      <p className="text-sm opacity-80 mb-2">確定申告（所得税）</p>
      <p className="text-4xl font-extrabold mb-2">
        {needsTaxReturn ? '申告が必要です' : '申告は不要です'}
      </p>
      {canLossOffset && estimatedRefund > 0 && (
        <>
          <p className="text-sm opacity-80 mt-2">損益通算で還付できる概算</p>
          <p className="text-3xl font-bold mt-1">{formatMan(estimatedRefund)}</p>
        </>
      )}
      {needsTaxReturn && estimatedTax > 0 && (
        <>
          <p className="text-sm opacity-80 mt-2">推定追加税額</p>
          <p className="text-3xl font-bold mt-1">{formatMan(estimatedTax)}</p>
        </>
      )}
      <p className="text-xs opacity-70 mt-3">
        住民税の申告: {needsResidentTaxReturn ? '必要（市区町村へ）' : '不要'}
      </p>
    </div>
  );

  return (
    <ResultLayout hero={hero}>
      {/* 判定サマリー */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <h2 className="text-base font-bold text-gray-800">📊 診断結果サマリー</h2>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 mb-1">所得区分</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${getCategoryColor(incomeCategory)}`}>
              {getCategoryLabel(incomeCategory)}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 mb-1">推奨申告方法</p>
            <p className="font-bold text-gray-800 text-xs">{getFilingLabel(recommendedFiling)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 mb-1">副業の純利益</p>
            <p className={`font-bold ${netIncome < 0 ? 'text-brand-600' : 'text-gray-800'}`}>
              {netIncome >= 0 ? `${netIncome}万円` : `▲${Math.abs(netIncome)}万円（赤字）`}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 mb-1">損益通算</p>
            <p className={`font-bold ${canLossOffset ? 'text-green-600' : 'text-gray-400'}`}>
              {canLossOffset ? '可能（事業所得）' : '不可'}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">{getFilingDescription(recommendedFiling)}</p>
      </div>

      {/* 推奨事項 */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">✅ あなたへの推奨アクション</h2>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-sm text-green-800 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* リスク */}
      {risks.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-bold text-yellow-800 mb-2">注意事項</p>
          <ul className="space-y-1">
            {risks.map((risk, i) => (
              <li key={i} className="text-xs text-yellow-700 flex gap-1">
                <span className="shrink-0">⚠️</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 節税アドバイス */}
      {tips.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">💡 副業の節税アドバイス</h2>
          <div className="space-y-3">
            {tips.map(tip => (
              <div key={tip.id} className="bg-green-50 rounded-xl border border-green-100 p-4">
                <p className="text-sm font-bold text-green-800 mb-1">{tip.title}</p>
                <p className="text-xs text-green-700 leading-relaxed">{tip.body}</p>
                <a
                  href={tip.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-500 hover:underline mt-1 inline-block"
                >
                  出典: {tip.source}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTAセクション */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-800 mb-1">次のアクション</h2>

        <a
          href={AFFILIATE_LINKS.accounting_freee.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackEvent('affiliate_click', { key: 'accounting_freee', diagnosis: 'fukugyou_shindan' })}
          className="block bg-green-600 hover:bg-green-700 text-white rounded-xl px-5 py-4 transition-colors"
        >
          <p className="text-sm font-bold mb-0.5">freeeで青色申告・確定申告をかんたんに →</p>
          <p className="text-xs opacity-80">{AFFILIATE_LINKS.accounting_freee.label}（30日間無料）</p>
        </a>

        <a
          href={AFFILIATE_LINKS.accounting_mf.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackEvent('affiliate_click', { key: 'accounting_mf', diagnosis: 'fukugyou_shindan' })}
          className="block bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
        >
          <p className="text-xs text-gray-500 mb-0.5">PR</p>
          <p className="text-sm font-bold text-gray-800 mb-0.5">マネーフォワードで帳簿・青色申告 →</p>
          <p className="text-xs text-gray-500">{AFFILIATE_LINKS.accounting_mf.label}</p>
        </a>

        {(netIncome > 100 || canLossOffset) && (
          <a
            href={AFFILIATE_LINKS.tax_accountant_dot.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => trackEvent('affiliate_click', { key: 'tax_accountant_dot', diagnosis: 'fukugyou_shindan' })}
            className="block bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
          >
            <p className="text-xs text-gray-500 mb-0.5">PR</p>
            <p className="text-sm font-bold text-gray-800 mb-0.5">複雑な申告は税理士に相談 →</p>
            <p className="text-xs text-gray-500">{AFFILIATE_LINKS.tax_accountant_dot.label}（相談無料）</p>
          </a>
        )}

        <Link
          href="/"
          className="block bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
        >
          <p className="text-sm font-bold text-gray-800 mb-0.5">全控除をまとめてチェック →</p>
          <p className="text-xs text-gray-500">税金払いすぎ診断（基本版）でiDeCo・ふるさと納税の控除も確認</p>
        </Link>
      </div>

      {/* 回遊バナー */}
      <CrossLinkBanner
        links={[
          { href: '/', icon: '🧾', label: '税金払いすぎ診断（基本版）', available: true },
          { href: '/medical-check', icon: '💊', label: '医療費 取り戻し診断', available: true },
          { href: '/tools', icon: '🗂️', label: '節税診断メニューをすべて見る', available: true },
        ]}
      />

      <div className="text-center">
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          入力内容をリセットして最初からやり直す
        </button>
      </div>
    </ResultLayout>
  );
}
