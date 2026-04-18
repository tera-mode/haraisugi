'use client';

import Link from 'next/link';
import ResultLayout from '@/components/diagnosis/shared/ResultLayout';
import CrossLinkBanner from '@/components/common/CrossLinkBanner';
import type { DualIncomeResult } from '@/lib/diagnosis/tomobataraki/types';
import { trackEvent } from '@/lib/analytics';
import { AFFILIATE_LINKS } from '@/lib/affiliate/links';

type Props = {
  result: DualIncomeResult;
  onReset: () => void;
};

function formatYen(amount: number): string {
  if (amount === 0) return '0円';
  if (amount >= 10_000) {
    const man = Math.floor(amount / 10_000);
    const sen = Math.round((amount % 10_000) / 1_000);
    if (sen === 0) return `約${man}万円`;
    return `約${man}万${sen}千円`;
  }
  return `約${Math.round(amount / 1_000) * 1_000}円`;
}

export default function TomobatarakiResult({ result, onReset }: Props) {
  const { recommendations, unusedDeductions, tips, totalSavings, husbandTaxRate, wifeTaxRate } = result;

  const hero = (
    <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white text-center">
      <p className="text-sm opacity-80 mb-2">最適化による年間節税額（概算）</p>
      {totalSavings > 0 ? (
        <>
          <p className="text-5xl font-extrabold mb-1">{formatYen(totalSavings)}</p>
          <p className="text-sm opacity-80 mt-2">
            扶養控除の申告先を変えるだけで削減できます
          </p>
        </>
      ) : (
        <p className="text-xl font-bold mt-2">現在の配分は最適です</p>
      )}
      <div className="flex justify-center gap-6 mt-4 text-xs opacity-70">
        <span>夫の税率: {(husbandTaxRate * 100).toFixed(0)}%</span>
        <span>妻の税率: {(wifeTaxRate * 100).toFixed(0)}%</span>
      </div>
    </div>
  );

  return (
    <ResultLayout hero={hero}>
      {/* 最適配分の提案 */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">📋 最適配分の提案</h2>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="border border-brand-100 rounded-xl p-4 bg-brand-50">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-brand-800 flex-1">{rec.item}</p>
                  <span className="text-sm font-bold text-brand-700 ml-2 whitespace-nowrap">
                    {formatYen(rec.effect)}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-gray-600 mb-2">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">現在: {rec.current}</span>
                  <span>→</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">最適: {rec.optimal}</span>
                </div>
                <p className="text-xs text-brand-700">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 保険料控除の空き枠 */}
      {unusedDeductions.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">💡 保険料控除の空き枠</h2>
          <p className="text-xs text-gray-500 mb-3">
            以下の控除枠が未使用です。対象保険に加入することで追加節税ができます。
          </p>
          <div className="space-y-2">
            {unusedDeductions.slice(0, 6).map((d, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-3 bg-white flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-700">
                    <span className="text-gray-500 mr-1">{d.person}</span>
                    {d.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>
                </div>
                <span className="text-xs font-bold text-green-700 ml-2 whitespace-nowrap">{d.potentialSavings}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 知識チップ */}
      {tips.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">💬 あなたへの節税アドバイス</h2>
          <div className="space-y-3">
            {tips.map(tip => (
              <div key={tip.id} className="bg-brand-50 rounded-xl border border-brand-100 p-4">
                <p className="text-sm font-bold text-brand-800 mb-1">{tip.title}</p>
                <p className="text-xs text-brand-700 leading-relaxed">{tip.body}</p>
                <a
                  href={tip.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-500 hover:underline mt-1 inline-block"
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

        <Link
          href="/"
          className="block bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-5 py-4 transition-colors"
        >
          <p className="text-sm font-bold mb-0.5">全控除をまとめてチェック →</p>
          <p className="text-xs opacity-80">税金払いすぎ診断（基本版）でiDeCoなどその他控除も確認</p>
        </Link>

        <a
          href={AFFILIATE_LINKS.insurance_review.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackEvent('affiliate_click', { key: 'insurance_review', diagnosis: 'tomobataraki' })}
          className="block bg-white border border-gray-200 hover:border-brand-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
        >
          <p className="text-xs text-gray-500 mb-0.5">PR</p>
          <p className="text-sm font-bold text-gray-800 mb-0.5">保険料控除の空き枠を活用する →</p>
          <p className="text-xs text-gray-500">{AFFILIATE_LINKS.insurance_review.label}（無料）</p>
        </a>

        <a
          href={AFFILIATE_LINKS.tax_accountant_dot.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackEvent('affiliate_click', { key: 'tax_accountant_dot', diagnosis: 'tomobataraki' })}
          className="block bg-white border border-gray-200 hover:border-brand-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
        >
          <p className="text-xs text-gray-500 mb-0.5">PR</p>
          <p className="text-sm font-bold text-gray-800 mb-0.5">年末調整・確定申告の疑問を税理士に相談 →</p>
          <p className="text-xs text-gray-500">{AFFILIATE_LINKS.tax_accountant_dot.label}（相談無料）</p>
        </a>
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
