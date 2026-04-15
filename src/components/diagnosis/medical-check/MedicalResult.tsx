'use client';

import Link from 'next/link';
import ComparisonTable from '@/components/diagnosis/shared/ComparisonTable';
import ResultLayout from '@/components/diagnosis/shared/ResultLayout';
import CrossLinkBanner from '@/components/common/CrossLinkBanner';
import type { MedicalCheckResult } from '@/lib/diagnosis/medical-check/types';
import { trackEvent } from '@/lib/analytics';
import { AFFILIATE_LINKS } from '@/lib/affiliate/links';

type Props = {
  result: MedicalCheckResult;
  onReset: () => void;
};

function formatYenSimple(amount: number): string {
  if (amount === 0) return '—（適用なし）';
  if (amount >= 10_000) {
    const man = Math.floor(amount / 10_000);
    const sen = Math.round((amount % 10_000) / 1_000);
    if (sen === 0) return `約${man}万円`;
    return `約${man}万${sen}千円`;
  }
  return `約${Math.round(amount / 1_000) * 1_000}円`;
}

const RECOMMENDATION_TEXT: Record<string, { label: string; color: string }> = {
  medical:        { label: '医療費控除', color: 'text-blue-700' },
  self_medication: { label: 'セルフメディケーション税制', color: 'text-green-700' },
  neither:        { label: '（条件未達）', color: 'text-gray-600' },
};

export default function MedicalResult({ result, onReset }: Props) {
  const rec = RECOMMENDATION_TEXT[result.recommendation];

  const comparisonRows = [
    {
      label: '控除額',
      left: result.medicalDeduction > 0 ? formatYenSimple(result.medicalDeduction) : '—（条件未達）',
      right: result.selfMedDeduction > 0 ? formatYenSimple(result.selfMedDeduction) : result.selfMedDeduction === 0 && !result.tips.find(t => t.id === 'otc_generic') ? '—（健診未実施）' : '—（条件未達）',
      highlight:
        result.recommendation === 'medical' && result.medicalDeduction > 0
          ? 'left' as const
          : result.recommendation === 'self_medication' && result.selfMedDeduction > 0
          ? 'right' as const
          : undefined,
    },
    {
      label: '還付額',
      left: result.medicalRefund > 0 ? formatYenSimple(result.medicalRefund) : '—',
      right: result.selfMedRefund > 0 ? formatYenSimple(result.selfMedRefund) : '—',
      highlight:
        result.recommendation === 'medical' && result.medicalRefund > 0
          ? 'left' as const
          : result.recommendation === 'self_medication' && result.selfMedRefund > 0
          ? 'right' as const
          : undefined,
    },
    {
      label: '判定',
      left: result.recommendation === 'medical' ? '★ 有利' : '—',
      right: result.recommendation === 'self_medication' ? '★ 有利' : '—',
      highlight:
        result.recommendation === 'medical' ? 'left' as const :
        result.recommendation === 'self_medication' ? 'right' as const :
        undefined,
    },
  ];

  const bestRefund = Math.max(result.medicalRefund, result.selfMedRefund);

  const hero = (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white text-center">
      <p className="text-sm opacity-80 mb-2">あなたに有利な制度</p>
      <p className={`text-3xl font-extrabold mb-1 ${rec.color === 'text-blue-700' ? 'text-white' : 'text-green-200'}`}>
        {rec.label}
      </p>
      {bestRefund > 0 ? (
        <>
          <p className="text-sm opacity-80 mt-3 mb-1">推定還付額（概算）</p>
          <p className="text-4xl font-extrabold">{formatYenSimple(bestRefund)}</p>
          {result.difference > 0 && (
            <p className="text-sm opacity-80 mt-2">
              もう一方との差額: {formatYenSimple(result.difference)}
            </p>
          )}
        </>
      ) : (
        <p className="text-sm opacity-80 mt-3">現在の条件では両制度とも適用できません</p>
      )}
      <p className="text-xs opacity-60 mt-3">適用所得税率: {(result.taxRate * 100).toFixed(0)}%</p>
    </div>
  );

  return (
    <ResultLayout hero={hero}>
      {/* 比較テーブル */}
      <div>
        <h2 className="text-base font-bold text-gray-800 mb-3">制度の比較</h2>
        <ComparisonTable
          leftHeader="医療費控除"
          rightHeader="セルフメディケーション税制"
          rows={comparisonRows}
        />
        <p className="text-xs text-gray-500 mt-2">
          ※ 両制度は併用できません。いずれか有利な方を選択してください。
        </p>
      </div>

      {/* 裏技セクション */}
      {result.tips.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">あなたへの節税アドバイス</h2>
          <div className="space-y-3">
            {result.tips.map(tip => (
              <div key={tip.id} className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                <p className="text-sm font-bold text-blue-800 mb-1">{tip.title}</p>
                <p className="text-xs text-blue-700 leading-relaxed">{tip.body}</p>
                <a
                  href={tip.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline mt-1 inline-block"
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

        {/* 本体診断への回遊 */}
        <Link
          href="/"
          className="block bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-4 transition-colors"
        >
          <p className="text-sm font-bold mb-0.5">全控除をまとめてチェック →</p>
          <p className="text-xs opacity-80">税金払いすぎ診断（基本版）で医療費控除以外の控除も一括確認</p>
        </Link>

        {/* 保険見直しCTA */}
        <a
          href={AFFILIATE_LINKS.insurance_review.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackEvent('affiliate_click', { key: 'insurance_review', diagnosis: 'medical_check' })}
          className="block bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
        >
          <p className="text-xs text-gray-500 mb-0.5">PR</p>
          <p className="text-sm font-bold text-gray-800 mb-0.5">保険見直しで医療費リスクを下げる →</p>
          <p className="text-xs text-gray-500">{AFFILIATE_LINKS.insurance_review.label}（無料）</p>
        </a>

        {/* 税理士CTA */}
        <a
          href={AFFILIATE_LINKS.tax_accountant_dot.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackEvent('affiliate_click', { key: 'tax_accountant_dot', diagnosis: 'medical_check' })}
          className="block bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
        >
          <p className="text-xs text-gray-500 mb-0.5">PR</p>
          <p className="text-sm font-bold text-gray-800 mb-0.5">確定申告を税理士に依頼 →</p>
          <p className="text-xs text-gray-500">{AFFILIATE_LINKS.tax_accountant_dot.label}（相談無料）</p>
        </a>
      </div>

      {/* 回遊バナー */}
      <CrossLinkBanner
        links={[
          { href: '/', icon: '🧾', label: '税金払いすぎ診断（基本版）', available: true },
          { href: '/tools', icon: '🗂️', label: '節税診断メニューをすべて見る', available: true },
        ]}
      />

      {/* やり直しボタン */}
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
