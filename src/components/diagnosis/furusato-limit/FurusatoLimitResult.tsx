'use client';

import Link from 'next/link';
import ResultLayout from '@/components/diagnosis/shared/ResultLayout';
import CrossLinkBanner from '@/components/common/CrossLinkBanner';
import type { FurusatoLimitResult, FurusatoLimitInput } from '@/lib/diagnosis/furusato-limit/types';
import { trackEvent } from '@/lib/analytics';
import { AFFILIATE_LINKS } from '@/lib/affiliate/links';

type Props = {
  result: FurusatoLimitResult;
  input: FurusatoLimitInput;
  onReset: () => void;
};

function fmt(val: number, decimals = 0): string {
  return val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function FurusatoLimitResult({ result, input, onReset }: Props) {
  const {
    limit,
    salaryDeduction,
    income,
    incomeTaxRate,
    residentTaxAmount,
    effectiveResidentTax,
    iDeCoEffect,
    mortgageEffect,
    medicalEffect,
    tips,
  } = result;

  const hasDeductionEffects = iDeCoEffect < 0 || mortgageEffect < 0 || medicalEffect < 0;

  const hero = (
    <div className="rounded-2xl p-6 text-white text-center bg-gradient-to-br from-brand-500 to-amber-600">
      <p className="text-sm opacity-80 mb-1">ふるさと納税の上限額（自己負担2,000円）</p>
      <p className="text-4xl font-extrabold mb-1">約{fmt(limit)}万円</p>
      <p className="text-sm opacity-80">
        住民税所得割: 約{fmt(effectiveResidentTax, 1)}万円 ／ 所得税率: {(incomeTaxRate * 100).toFixed(0)}%
      </p>
    </div>
  );

  const furusona = AFFILIATE_LINKS.furusona;
  const ideco = AFFILIATE_LINKS.ideco_matsui;

  return (
    <ResultLayout hero={hero}>

      {/* 計算内訳 */}
      <div className="mt-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">📊 計算内訳</h2>
        <div className="divide-y divide-gray-100 text-sm rounded-xl border border-gray-100 overflow-hidden">
          {[
            { label: '給与収入', value: `${input.annualIncome}万円` },
            { label: '▼ 給与所得控除', value: `−${fmt(salaryDeduction)}万円` },
            { label: '給与所得', value: `${fmt(income)}万円`, bold: true },
            { label: '住民税課税所得（概算）', value: `${fmt(result.residentTaxIncome)}万円` },
            { label: '住民税所得割（10%）', value: `約${fmt(residentTaxAmount, 1)}万円` },
            ...(input.mortgageDeduction > 0
              ? [{ label: '  ▼ 住宅ローン控除（住民税分）', value: `−${fmt(residentTaxAmount - effectiveResidentTax, 2)}万円` }]
              : []),
            { label: '実質 住民税所得割', value: `約${fmt(effectiveResidentTax, 1)}万円`, bold: true },
            { label: 'ふるさと納税 上限額', value: `約${fmt(limit)}万円`, highlight: true },
          ].map((row, i) => (
            <div
              key={i}
              className={`flex justify-between px-4 py-2 ${
                row.highlight ? 'bg-brand-50 font-bold text-brand-700' : 'bg-white'
              }`}
            >
              <span className={row.bold ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                {row.label}
              </span>
              <span className={row.bold ? 'font-semibold text-gray-900' : ''}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 他の控除の影響 */}
      {hasDeductionEffects && (
        <div className="mt-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">⚠️ 他の控除による上限への影響</h2>
          <div className="space-y-2 text-sm">
            {iDeCoEffect < 0 && (
              <div className="flex items-start gap-2 p-3 bg-brand-50 rounded-lg">
                <span className="text-brand-600 font-bold mt-0.5">↓</span>
                <div>
                  <span className="font-semibold text-brand-800">iDeCo年額{fmt(input.iDeCoMonthly * 12, 1)}万円の影響: </span>
                  <span className="text-brand-700">上限が約{Math.abs(iDeCoEffect)}万円下がっています</span>
                  <p className="text-xs text-brand-500 mt-1">iDeCoは節税効果の方がはるかに大きいので継続推奨です</p>
                </div>
              </div>
            )}
            {mortgageEffect < 0 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-600 font-bold mt-0.5">↓</span>
                <div>
                  <span className="font-semibold text-yellow-800">住宅ローン控除{input.mortgageDeduction}万円の影響: </span>
                  <span className="text-yellow-700">上限が約{Math.abs(mortgageEffect)}万円下がっています</span>
                  <p className="text-xs text-yellow-600 mt-1">住宅ローン控除が住民税から控除されると実質的な上限枠が小さくなります</p>
                </div>
              </div>
            )}
            {medicalEffect < 0 && (
              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 font-bold mt-0.5">↓</span>
                <div>
                  <span className="font-semibold text-green-800">医療費控除の影響: </span>
                  <span className="text-green-700">上限が約{Math.abs(medicalEffect)}万円下がっています</span>
                  <p className="text-xs text-green-600 mt-1">医療費控除は課税所得を下げるため、ふるさと納税上限もわずかに下がります</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* アドバイス */}
      <div className="mt-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">💡 活用アドバイス</h2>
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
                  className="text-xs text-brand-500 mt-1 block hover:underline"
                >
                  出典: {tip.source}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">次のアクション</h2>
        <div className="space-y-3">
          <a
            href={furusona.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('affiliate_click', { key: furusona.key, diagnosis: 'furusato-limit' })}
            className="flex flex-col gap-1 p-4 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors"
          >
            <span className="font-bold text-base">上限額がわかったら返礼品を選ぶ →</span>
            <span className="text-sm opacity-90">fursonaでAIが最適な返礼品を提案</span>
          </a>

          <a
            href="https://www.satofull.jp/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('affiliate_click', { key: 'furusato_satofuru', diagnosis: 'furusato-limit' })}
            className="flex flex-col gap-1 p-4 rounded-xl border-2 border-brand-200 text-brand-700 hover:bg-brand-50 transition-colors"
          >
            <span className="font-bold text-base">
              <span className="text-xs font-normal bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded mr-1">PR</span>
              さとふるでふるさと納税をする →
            </span>
            <span className="text-sm text-brand-600">返礼品が豊富・手続き簡単</span>
          </a>

          {input.iDeCoMonthly === 0 && (
            <a
              href={ideco.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('affiliate_click', { key: ideco.key, diagnosis: 'furusato-limit' })}
              className="flex flex-col gap-1 p-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="font-bold">iDeCoも始めて節税効果を最大化する →</span>
              <span className="text-sm text-gray-500">松井証券 iDeCo（手数料0円）</span>
            </a>
          )}

          <Link
            href="/"
            className="flex flex-col gap-1 p-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold">全控除をまとめてチェック →</span>
            <span className="text-sm text-gray-500">税金払いすぎ診断（基本版）でiDeCo・住宅ローン控除も確認</span>
          </Link>
        </div>
      </div>

      {/* 回遊バナー */}
      <CrossLinkBanner
        links={[
          { href: '/', icon: '🧾', label: '税金払いすぎ診断（基本版）' },
          { href: '/tomobataraki', icon: '👨‍👩‍👧', label: '共働き 損してる診断' },
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
