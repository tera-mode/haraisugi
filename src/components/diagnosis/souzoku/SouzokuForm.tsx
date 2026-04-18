'use client';

import { useState } from 'react';
import DiagnosisShell from '@/components/diagnosis/shared/DiagnosisShell';
import StepContainer from '@/components/diagnosis/shared/StepContainer';
import NumberInput from '@/components/diagnosis/shared/NumberInput';
import SouzokuResult from './SouzokuResult';
import type { InheritanceInput, InheritanceResult } from '@/lib/diagnosis/souzoku/types';
import { runSouzokuShindan } from '@/lib/diagnosis/souzoku/engine';
import { trackEvent } from '@/lib/analytics';

const STEP_LABELS = ['🏠 財産の概算', '👨‍👩‍👧 相続人の構成', '🛡️ 節税対策の状況'];
const TOTAL_STEPS = 3;

const ASSET_PRESETS = [
  { value: 2000,  label: '〜2,000万' },
  { value: 4000,  label: '2,000〜4,000万' },
  { value: 6000,  label: '4,000〜6,000万' },
  { value: 8000,  label: '6,000〜8,000万' },
  { value: 12000, label: '8,000万〜1.2億' },
  { value: 20000, label: '1.2億〜2億' },
];

export default function SouzokuForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<InheritanceResult | null>(null);

  // Step 1: 財産
  const [totalAssets, setTotalAssets] = useState<number | null>(null);
  const [realEstateValue, setRealEstateValue] = useState(0);

  // Step 2: 相続人
  const [hasSpouse, setHasSpouse] = useState<boolean | null>(null);
  const [numChildren, setNumChildren] = useState<number | null>(null);

  // Step 3: 節税対策
  const [hasLiveInHeir, setHasLiveInHeir] = useState<boolean | null>(null);
  const [lifeInsuranceAmount, setLifeInsuranceAmount] = useState(0);
  const [priorGifts, setPriorGifts] = useState(0);

  const canNext =
    step === 1 ? totalAssets !== null :
    step === 2 ? hasSpouse !== null && numChildren !== null :
    hasLiveInHeir !== null;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      trackEvent('step_complete', { step, diagnosis: 'souzoku' });
      setStep(s => s + 1);
    } else {
      trackEvent('diagnosis_complete', { diagnosis: 'souzoku' });
      const input: InheritanceInput = {
        totalAssets: totalAssets!,
        realEstateValue,
        hasSpouse: hasSpouse!,
        numChildren: numChildren!,
        hasLiveInHeir: hasLiveInHeir!,
        lifeInsuranceAmount,
        priorGifts,
      };
      setResult(runSouzokuShindan(input));
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setTotalAssets(null);
    setRealEstateValue(0);
    setHasSpouse(null);
    setNumChildren(null);
    setHasLiveInHeir(null);
    setLifeInsuranceAmount(0);
    setPriorGifts(0);
  };

  if (result) {
    return <SouzokuResult result={result} onReset={handleReset} />;
  }

  return (
    <DiagnosisShell
      title="相続税 取られすぎ診断"
      subtitle="財産と相続人の構成を入力して、相続税の概算と節税対策を診断します"
      step={step}
      totalSteps={TOTAL_STEPS}
      stepLabels={STEP_LABELS}
      onBack={step > 1 ? handleBack : undefined}
      onNext={handleNext}
      canNext={canNext}
      isLast={step === TOTAL_STEPS}
      nextLabel={step === TOTAL_STEPS ? '相続税を試算する' : undefined}
    >
      {/* ---- Step 1: 財産の概算 ---- */}
      {step === 1 && (
        <StepContainer
          heading="🏠 財産の概算"
          description="相続する財産の総額を教えてください（概算で構いません）"
        >
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">財産総額（目安）</label>
            <p className="text-xs text-gray-500 mb-2">預貯金・不動産・株式・保険等すべての合計</p>
            <div className="grid grid-cols-2 gap-2">
              {ASSET_PRESETS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTotalAssets(opt.value)}
                  className={`py-3 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    totalAssets === opt.value
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <NumberInput
            label="うち不動産の評価額"
            value={realEstateValue}
            onChange={setRealEstateValue}
            helpText="土地・建物の相続税評価額（路線価・固定資産税評価額の目安）。不明な場合は0で構いません"
          />

          {totalAssets !== null && (
            <div className="mt-3 bg-brand-50 border border-brand-100 rounded-xl p-3 text-sm">
              <p className="text-brand-800">
                <span className="font-bold">基礎控除の目安: </span>
                相続人数によって変わります（次のステップで計算します）
              </p>
            </div>
          )}
        </StepContainer>
      )}

      {/* ---- Step 2: 相続人の構成 ---- */}
      {step === 2 && (
        <StepContainer
          heading="👨‍👩‍👧 相続人の構成"
          description="法定相続人（配偶者・子）の人数を教えてください"
        >
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">配偶者（夫・妻）の有無</label>
            <div className="flex gap-3">
              {[
                { value: true,  label: 'いる' },
                { value: false, label: 'いない' },
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setHasSpouse(opt.value)}
                  className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                    hasSpouse === opt.value
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">子の人数</label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNumChildren(n)}
                  className={`py-3 rounded-lg border text-sm font-medium transition-colors ${
                    numChildren === n
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300'
                  }`}
                >
                  {n === 4 ? '4人以上' : `${n}人`}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">養子・代襲相続人も含みます。4人以上の場合は4人として計算します</p>
          </div>

          {hasSpouse !== null && numChildren !== null && (
            <div className="mt-4 bg-brand-50 border border-brand-100 rounded-xl p-3">
              <p className="text-sm text-brand-800">
                <span className="font-bold">法定相続人: </span>
                {(hasSpouse ? 1 : 0) + numChildren}人
              </p>
              <p className="text-sm text-brand-800">
                <span className="font-bold">基礎控除: </span>
                {3000 + 600 * ((hasSpouse ? 1 : 0) + numChildren)}万円
              </p>
              {totalAssets !== null && (
                <p className={`text-sm font-bold mt-1 ${
                  totalAssets <= 3000 + 600 * ((hasSpouse ? 1 : 0) + numChildren)
                    ? 'text-green-700'
                    : 'text-brand-700'
                }`}>
                  {totalAssets <= 3000 + 600 * ((hasSpouse ? 1 : 0) + numChildren)
                    ? '→ 基礎控除内のため相続税は発生しません（目安）'
                    : `→ 基礎控除超過: 約${totalAssets - (3000 + 600 * ((hasSpouse ? 1 : 0) + numChildren))}万円が課税対象になる可能性があります`
                  }
                </p>
              )}
            </div>
          )}
        </StepContainer>
      )}

      {/* ---- Step 3: 節税対策の状況 ---- */}
      {step === 3 && (
        <StepContainer
          heading="🛡️ 節税対策の状況"
          description="現在の節税対策の状況を教えてください（概算で構いません）"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                居住用不動産に同居の相続人（子等）はいますか？
              </label>
              <p className="text-xs text-gray-500 mb-2">「小規模宅地等の特例」（土地評価額80%減）の適用判定に使います</p>
              <div className="flex gap-3">
                {[
                  { value: true,  label: 'いる' },
                  { value: false, label: 'いない / 不動産なし' },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setHasLiveInHeir(opt.value)}
                    className={`flex-1 py-3 px-2 rounded-lg border text-sm font-medium transition-colors ${
                      hasLiveInHeir === opt.value
                        ? 'bg-brand-50 border-brand-500 text-brand-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {hasLiveInHeir === true && realEstateValue === 0 && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  ⚠️ 小規模宅地特例を計算するには、Step 1の「不動産の評価額」の入力が必要です。「戻る」で入力してください。
                </p>
              )}
            </div>

            <NumberInput
              label="生命保険金（死亡保険金）の合計"
              value={lifeInsuranceAmount}
              onChange={setLifeInsuranceAmount}
              helpText="相続人が受け取る死亡保険金の合計額。非課税枠（500万円×相続人数）を超えた分が課税対象"
            />

            <NumberInput
              label="過去7年以内の贈与累計額"
              value={priorGifts}
              onChange={setPriorGifts}
              helpText="子や孫への暦年贈与の累計（2024年改正で3年→7年に延長）。110万円×年数分は持ち戻し対象外"
            />
          </div>
        </StepContainer>
      )}
    </DiagnosisShell>
  );
}
