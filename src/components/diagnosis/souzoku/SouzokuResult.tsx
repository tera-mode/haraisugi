'use client';

import Link from 'next/link';
import ResultLayout from '@/components/diagnosis/shared/ResultLayout';
import CrossLinkBanner from '@/components/common/CrossLinkBanner';
import type { InheritanceResult } from '@/lib/diagnosis/souzoku/types';
import { trackEvent } from '@/lib/analytics';
import { AFFILIATE_LINKS } from '@/lib/affiliate/links';

type Props = {
  result: InheritanceResult;
  onReset: () => void;
};

function formatMan(val: number): string {
  if (val <= 0) return '0円';
  if (val >= 10000) return `約${(val / 10000).toFixed(1)}億円`;
  return `約${Math.round(val)}万円`;
}

export default function SouzokuResult({ result, onReset }: Props) {
  const {
    legalHeirs,
    basicDeduction,
    lifeInsuranceExemption,
    taxableInheritance,
    estimatedTax,
    smallScaleLandReduction,
    exemptions,
    tips,
    warnings,
    isSubjectToTax,
  } = result;

  const hero = (
    <div className={`rounded-2xl p-6 text-white text-center ${
      isSubjectToTax
        ? 'bg-gradient-to-br from-brand-600 to-brand-800'
        : 'bg-gradient-to-br from-green-500 to-green-700'
    }`}>
      <p className="text-sm opacity-80 mb-2">推定相続税額（概算）</p>
      {isSubjectToTax ? (
        <>
          <p className="text-5xl font-extrabold mb-1">{formatMan(estimatedTax)}</p>
          <p className="text-sm opacity-80 mt-2">課税遺産総額: {formatMan(taxableInheritance)}</p>
        </>
      ) : (
        <>
          <p className="text-4xl font-extrabold mb-1">相続税は発生しません</p>
          <p className="text-sm opacity-80 mt-2">財産が基礎控除（{formatMan(basicDeduction)}）以内です</p>
        </>
      )}
      <p className="text-xs opacity-70 mt-3">
        法定相続人: {legalHeirs}人 ／ 基礎控除: {formatMan(basicDeduction)}
      </p>
    </div>
  );

  return (
    <ResultLayout hero={hero}>
      {/* 計算サマリー */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h2 className="text-base font-bold text-gray-800 mb-3">📊 計算内訳</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">財産総額（特例適用前）</span>
            <span className="font-medium text-gray-800">{formatMan(result.totalAssets ?? 0)}</span>
          </div>
          {lifeInsuranceExemption > 0 && (
            <div className="flex justify-between text-green-700">
              <span>▼ 生命保険非課税枠</span>
              <span>−{formatMan(lifeInsuranceExemption)}</span>
            </div>
          )}
          {smallScaleLandReduction > 0 && (
            <div className="flex justify-between text-green-700">
              <span>▼ 小規模宅地特例</span>
              <span>−{formatMan(smallScaleLandReduction)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600">課税対象財産</span>
            <span className="font-medium">{formatMan(result.taxableAssets)}</span>
          </div>
          <div className="flex justify-between text-green-700">
            <span>▼ 基礎控除</span>
            <span>−{formatMan(basicDeduction)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold">
            <span className="text-gray-800">課税遺産総額</span>
            <span className={isSubjectToTax ? 'text-red-600' : 'text-green-600'}>
              {isSubjectToTax ? formatMan(taxableInheritance) : '0円（非課税）'}
            </span>
          </div>
          {isSubjectToTax && (
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span className="text-gray-800">推定相続税額</span>
              <span className="text-brand-700">{formatMan(estimatedTax)}</span>
            </div>
          )}
        </div>
      </div>

      {/* 適用可能な特例 */}
      <div>
        <h2 className="text-base font-bold text-gray-800 mb-3">🛡️ 適用可能な節税特例</h2>
        <div className="space-y-3">
          {exemptions.map((ex, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${
                ex.applicable
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{ex.applicable ? '✅' : '⬜'}</span>
                <p className="text-sm font-bold text-gray-800">{ex.name}</p>
              </div>
              <p className="text-xs text-gray-600">{ex.description}</p>
              <p className="text-xs text-gray-400 mt-1">条件: {ex.condition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 注意事項 */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-bold text-yellow-800 mb-2">注意事項</p>
          <ul className="space-y-1">
            {warnings.map((w, i) => (
              <li key={i} className="text-xs text-yellow-700 flex gap-1">
                <span className="shrink-0">⚠️</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 節税アドバイス */}
      {tips.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">💡 相続税の節税アドバイス</h2>
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

        <a
          href={AFFILIATE_LINKS.inheritance_tax.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackEvent('affiliate_click', { key: 'inheritance_tax', diagnosis: 'souzoku' })}
          className="block bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-5 py-4 transition-colors"
        >
          <p className="text-sm font-bold mb-0.5">相続専門の税理士に相談する →</p>
          <p className="text-xs opacity-80">{AFFILIATE_LINKS.inheritance_tax.label}（相談無料）</p>
        </a>

        <a
          href={AFFILIATE_LINKS.insurance_review.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackEvent('affiliate_click', { key: 'insurance_review', diagnosis: 'souzoku' })}
          className="block bg-white border border-gray-200 hover:border-brand-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
        >
          <p className="text-xs text-gray-500 mb-0.5">PR</p>
          <p className="text-sm font-bold text-gray-800 mb-0.5">生命保険の相続対策を無料相談 →</p>
          <p className="text-xs text-gray-500">{AFFILIATE_LINKS.insurance_review.label}</p>
        </a>

        <Link
          href="/taishoku-sim"
          className="block bg-white border border-gray-200 hover:border-brand-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
        >
          <p className="text-sm font-bold text-gray-800 mb-0.5">退職金の受取方法も最適化する →</p>
          <p className="text-xs text-gray-500">退職金 取られすぎ診断で老後設計を確認</p>
        </Link>

        <Link
          href="/"
          className="block bg-white border border-gray-200 hover:border-brand-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
        >
          <p className="text-sm font-bold text-gray-800 mb-0.5">全控除をまとめてチェック →</p>
          <p className="text-xs text-gray-500">税金払いすぎ診断（基本版）でiDeCo・ふるさと納税も確認</p>
        </Link>
      </div>

      {/* 回遊バナー */}
      <CrossLinkBanner
        links={[
          { href: '/fudousan-baikyaku', icon: '🏘️', label: 'マイホーム売却 取られすぎ診断', available: false },
          { href: '/', icon: '🧾', label: '税金払いすぎ診断（基本版）', available: true },
          { href: '/taishoku-sim', icon: '🏖️', label: '退職金 取られすぎ診断', available: true },
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
