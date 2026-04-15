'use client';

import Link from 'next/link';
import ResultLayout from '@/components/diagnosis/shared/ResultLayout';
import CrossLinkBanner from '@/components/common/CrossLinkBanner';
import type { RealEstateResult } from '@/lib/diagnosis/fudousan-baikyaku/types';
import { trackEvent } from '@/lib/analytics';
import { AFFILIATE_LINKS } from '@/lib/affiliate/links';

type Props = {
  result: RealEstateResult;
  salePrice: number;
  onReset: () => void;
};

function fmt(val: number): string {
  return val.toLocaleString('ja-JP');
}

export default function FudousanResult({ result, salePrice, onReset }: Props) {
  const {
    transferIncome,
    effectiveAcquisitionCost,
    usedEstimatedCost,
    isLongTerm,
    taxRate,
    taxBeforeDeduction,
    taxAfterDeduction,
    deductions,
    canCarryLoss,
    tips,
    warnings,
  } = result;

  const isLoss = transferIncome <= 0;
  const applicableDeductions = deductions.filter(d => d.applicable);
  const taxSavings = taxBeforeDeduction - taxAfterDeduction;

  const hero = (
    <div className={`rounded-2xl p-6 text-white text-center ${
      isLoss
        ? 'bg-gradient-to-br from-gray-500 to-gray-700'
        : taxAfterDeduction === 0
        ? 'bg-gradient-to-br from-green-500 to-green-700'
        : 'bg-gradient-to-br from-teal-600 to-teal-800'
    }`}>
      {isLoss ? (
        <>
          <p className="text-sm opacity-80 mb-1">譲渡所得</p>
          <p className="text-3xl font-extrabold mb-1">損失（課税なし）</p>
          <p className="text-sm opacity-80">
            {canCarryLoss ? '給与所得等との損益通算・3年繰越控除が可能' : '投資用不動産の損失は損益通算不可'}
          </p>
        </>
      ) : taxAfterDeduction === 0 ? (
        <>
          <p className="text-sm opacity-80 mb-1">3,000万円特別控除適用後</p>
          <p className="text-3xl font-extrabold mb-1">課税なし（税額 0円）</p>
          <p className="text-sm opacity-80">譲渡所得が3,000万円以内のため全額控除</p>
        </>
      ) : (
        <>
          <p className="text-sm opacity-80 mb-1">推定譲渡所得税額（特例適用後）</p>
          <p className="text-4xl font-extrabold mb-1">約{fmt(taxAfterDeduction)}万円</p>
          <p className="text-sm opacity-80">
            {isLongTerm ? '長期譲渡（税率20.315%）' : '短期譲渡（税率39.63%）'}
            {taxSavings > 0 && ` ／ 特例で約${fmt(taxSavings)}万円節税`}
          </p>
        </>
      )}
    </div>
  );

  const taxAccountant = AFFILIATE_LINKS.tax_accountant_dot;
  const realEstateQuery = AFFILIATE_LINKS.realestate_query;

  return (
    <ResultLayout hero={hero}>

      {/* 計算内訳 */}
      <div className="mt-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">📊 計算内訳</h2>
        <div className="divide-y divide-gray-100 text-sm rounded-xl border border-gray-100 overflow-hidden">
          {[
            { label: '売却価格', value: `${fmt(salePrice)}万円` },
            { label: `▼ 取得費${usedEstimatedCost ? '（概算5%）' : ''}`, value: `−${fmt(effectiveAcquisitionCost)}万円` },
            { label: '▼ 譲渡費用', value: `−${fmt(result.taxBeforeDeduction > 0 ? salePrice - effectiveAcquisitionCost - transferIncome : 0)}万円` },
            { label: '譲渡所得', value: `${fmt(transferIncome)}万円`, bold: true },
            ...(applicableDeductions.filter(d => d.id === 'special_3000man').length > 0 && !isLoss
              ? [{ label: '▼ 3,000万円特別控除', value: `−${fmt(Math.min(3000, Math.max(0, transferIncome)))}万円` }]
              : []),
            ...(taxAfterDeduction !== taxBeforeDeduction && !isLoss
              ? [{ label: '課税譲渡所得', value: `${fmt(Math.max(0, transferIncome - 3000))}万円`, bold: true }]
              : []),
            { label: `適用税率（${isLongTerm ? '長期' : '短期'}）`, value: `${(taxRate * 100).toFixed(3)}%` },
            { label: '推定税額（特例適用後）', value: `約${fmt(taxAfterDeduction)}万円`, highlight: true },
          ].map((row, i) => (
            <div
              key={i}
              className={`flex justify-between px-4 py-2 ${
                row.highlight ? 'bg-teal-50 font-bold text-teal-700' : 'bg-white'
              }`}
            >
              <span className={row.bold ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                {row.label}
              </span>
              <span className={row.bold ? 'font-semibold' : ''}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 特例一覧 */}
      <div className="mt-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">🛡️ 適用可能な特例・控除</h2>
        <div className="space-y-2">
          {deductions.map(d => (
            <div key={d.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 text-sm">
              <span className={`mt-0.5 text-base ${d.applicable ? 'text-green-500' : 'text-gray-300'}`}>
                {d.applicable ? '✅' : '⬜'}
              </span>
              <div>
                <p className={`font-semibold ${d.applicable ? 'text-gray-900' : 'text-gray-400'}`}>{d.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{d.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 警告 */}
      {warnings.length > 0 && (
        <div className="mt-4 space-y-2">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-sm">
              <span className="text-amber-500 mt-0.5">⚠️</span>
              <span className="text-amber-800">{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* 損益通算 */}
      {isLoss && canCarryLoss && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm">
          <p className="font-bold text-blue-800 mb-1">💡 損益通算・繰越控除が使えます</p>
          <p className="text-blue-700">
            マイホームの売却損は、給与所得等の他の所得と損益通算でき、
            控除しきれない損失は翌年以降3年間繰り越せます（確定申告が必要）。
          </p>
        </div>
      )}

      {/* アドバイス */}
      {tips.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">💡 節税アドバイス</h2>
          <div className="space-y-3">
            {tips.map(tip => (
              <div key={tip.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-semibold text-gray-800 mb-1">{tip.title}</p>
                <p className="text-gray-600 leading-relaxed">{tip.body}</p>
                {tip.sourceUrl && (
                  <a
                    href={tip.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 mt-1 block hover:underline"
                  >
                    出典: {tip.source}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">次のアクション</h2>
        <div className="space-y-3">
          <a
            href={taxAccountant.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('affiliate_click', { key: taxAccountant.key, diagnosis: 'fudousan-baikyaku' })}
            className="flex flex-col gap-1 p-4 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            <span className="font-bold text-base">税理士に相談して申告を確実にする →</span>
            <span className="text-sm opacity-90">税理士ドットコムで無料相談（相談無料）</span>
          </a>

          <a
            href={realEstateQuery.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('affiliate_click', { key: realEstateQuery.key, diagnosis: 'fudousan-baikyaku' })}
            className="flex flex-col gap-1 p-4 rounded-xl border-2 border-teal-200 text-teal-700 hover:bg-teal-50 transition-colors"
          >
            <span className="font-bold text-base">
              <span className="text-xs font-normal bg-teal-100 text-teal-600 px-1.5 py-0.5 rounded mr-1">PR</span>
              不動産一括査定で売却価格の相場を確認する →
            </span>
            <span className="text-sm text-teal-600">イエウールで複数社の査定額を比較</span>
          </a>

          <Link
            href="/souzoku"
            className="flex flex-col gap-1 p-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold">相続した不動産の相続税も確認する →</span>
            <span className="text-sm text-gray-500">相続税かんたん試算で相続税額をシミュレーション</span>
          </Link>
        </div>
      </div>

      {/* 回遊バナー */}
      <CrossLinkBanner
        links={[
          { href: '/souzoku', icon: '🏠', label: '相続税 かんたん試算' },
          { href: '/', icon: '🧾', label: '税金払いすぎ診断（基本版）' },
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
