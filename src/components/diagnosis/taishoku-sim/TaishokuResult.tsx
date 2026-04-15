'use client';

import Link from 'next/link';
import ResultLayout from '@/components/diagnosis/shared/ResultLayout';
import CrossLinkBanner from '@/components/common/CrossLinkBanner';
import type { RetirementResult, RetirementPattern } from '@/lib/diagnosis/taishoku-sim/types';
import { trackEvent } from '@/lib/analytics';
import { AFFILIATE_LINKS } from '@/lib/affiliate/links';

type Props = {
  result: RetirementResult;
  onReset: () => void;
};

const PATTERN_COLORS: Record<string, string> = {
  simultaneous:  'border-gray-200 bg-gray-50',
  ideco_annuity: 'border-blue-200 bg-blue-50',
  time_shifted:  'border-green-200 bg-green-50',
};

const PATTERN_BEST_COLORS: Record<string, string> = {
  simultaneous:  'border-gray-400 bg-gray-100',
  ideco_annuity: 'border-blue-400 bg-blue-100',
  time_shifted:  'border-green-500 bg-green-100',
};

function formatMan(val: number): string {
  if (val <= 0) return '0円';
  return `約${Math.round(val)}万円`;
}

function PatternCard({ pattern, isBest }: { pattern: RetirementPattern; isBest: boolean }) {
  const colorClass = isBest ? PATTERN_BEST_COLORS[pattern.id] : PATTERN_COLORS[pattern.id];
  return (
    <div className={`rounded-xl border-2 p-4 ${colorClass} relative`}>
      {isBest && (
        <span className="absolute -top-3 left-4 bg-green-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">
          最もお得
        </span>
      )}
      <p className="text-sm font-bold text-gray-800 mb-1">{pattern.label}</p>
      <p className="text-xs text-gray-500 mb-3">{pattern.description}</p>
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-white rounded-lg p-2 text-center">
          <p className="text-gray-500 mb-0.5">税負担合計</p>
          <p className="font-bold text-red-600">{formatMan(pattern.totalTax)}</p>
        </div>
        <div className="bg-white rounded-lg p-2 text-center">
          <p className="text-gray-500 mb-0.5">手取り概算</p>
          <p className="font-bold text-green-700">{formatMan(pattern.netReceive)}</p>
        </div>
        <div className="bg-white rounded-lg p-2 text-center">
          <p className="text-gray-500 mb-0.5">退職所得控除</p>
          <p className="font-bold text-gray-700">{formatMan(pattern.retirementDeduction)}</p>
        </div>
        {pattern.idecoDeduction > 0 && (
          <div className="bg-white rounded-lg p-2 text-center">
            <p className="text-gray-500 mb-0.5">iDeCo控除</p>
            <p className="font-bold text-gray-700">{formatMan(pattern.idecoDeduction)}</p>
          </div>
        )}
      </div>
      {pattern.notes.length > 0 && (
        <ul className="space-y-1">
          {pattern.notes.map((note, i) => (
            <li key={i} className="text-xs text-gray-600 flex gap-1">
              <span className="text-gray-400 shrink-0">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TaishokuResult({ result, onReset }: Props) {
  const { patterns, bestPatternId, maxSavings, tips, warnings } = result;
  const bestPattern = patterns.find(p => p.id === bestPatternId)!;

  const hero = (
    <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 text-white text-center">
      <p className="text-sm opacity-80 mb-2">受取方法の最適化で節税できる金額（概算）</p>
      {maxSavings > 0 ? (
        <>
          <p className="text-5xl font-extrabold mb-1">{formatMan(maxSavings)}</p>
          <p className="text-sm opacity-80 mt-2">
            最適: <strong>{bestPattern.label}</strong>
          </p>
          <p className="text-sm opacity-80">
            手取り {formatMan(bestPattern.netReceive)}（税負担 {formatMan(bestPattern.totalTax)}）
          </p>
        </>
      ) : (
        <>
          <p className="text-xl font-bold mt-2">どのパターンも税額はほぼ同じです</p>
          <p className="text-sm opacity-80 mt-1">退職所得控除の範囲内に収まっています</p>
        </>
      )}
      {patterns.length === 1 && (
        <p className="text-xs opacity-60 mt-3">iDeCoなしのため1パターンのみ表示</p>
      )}
    </div>
  );

  return (
    <ResultLayout hero={hero}>
      {/* パターン比較 */}
      <div>
        <h2 className="text-base font-bold text-gray-800 mb-3">📊 受取パターンの比較</h2>
        <div className="space-y-4">
          {patterns.map(pattern => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              isBest={pattern.id === bestPatternId}
            />
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
          <h2 className="text-base font-bold text-gray-800 mb-3">💬 退職金・iDeCoの節税アドバイス</h2>
          <div className="space-y-3">
            {tips.map(tip => (
              <div key={tip.id} className="bg-orange-50 rounded-xl border border-orange-100 p-4">
                <p className="text-sm font-bold text-orange-800 mb-1">{tip.title}</p>
                <p className="text-xs text-orange-700 leading-relaxed">{tip.body}</p>
                <a
                  href={tip.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-500 hover:underline mt-1 inline-block"
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
          href={AFFILIATE_LINKS.tax_accountant_dot.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackEvent('affiliate_click', { key: 'tax_accountant_dot', diagnosis: 'taishoku_sim' })}
          className="block bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-5 py-4 transition-colors"
        >
          <p className="text-sm font-bold mb-0.5">退職金・iDeCoの受取設計を税理士に相談 →</p>
          <p className="text-xs opacity-80">{AFFILIATE_LINKS.tax_accountant_dot.label}（相談無料）</p>
        </a>

        <a
          href={AFFILIATE_LINKS.ideco_matsui.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackEvent('affiliate_click', { key: 'ideco_matsui', diagnosis: 'taishoku_sim' })}
          className="block bg-white border border-gray-200 hover:border-orange-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
        >
          <p className="text-xs text-gray-500 mb-0.5">PR</p>
          <p className="text-sm font-bold text-gray-800 mb-0.5">iDeCoを始めて老後の節税と資産形成 →</p>
          <p className="text-xs text-gray-500">{AFFILIATE_LINKS.ideco_matsui.label}</p>
        </a>

        <Link
          href="/"
          className="block bg-white border border-gray-200 hover:border-orange-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
        >
          <p className="text-sm font-bold text-gray-800 mb-0.5">全控除をまとめてチェック →</p>
          <p className="text-xs text-gray-500">税金払いすぎ診断（基本版）でiDeCo以外の控除も確認</p>
        </Link>
      </div>

      {/* 回遊バナー */}
      <CrossLinkBanner
        links={[
          { href: '/', icon: '🧾', label: '税金払いすぎ診断（基本版）', available: true },
          { href: '/tomobataraki', icon: '👨‍👩‍👧', label: '共働き世帯の扶養・控除 最適配分診断', available: true },
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
