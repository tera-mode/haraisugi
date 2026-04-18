'use client';

import { useState } from 'react';
import DiagnosisShell from '@/components/diagnosis/shared/DiagnosisShell';
import StepContainer from '@/components/diagnosis/shared/StepContainer';
import NumberInput from '@/components/diagnosis/shared/NumberInput';
import FukugyouResult from './FukugyouResult';
import type { SideJobInput, SideJobResult, SideJobType } from '@/lib/diagnosis/fukugyou-shindan/types';
import { SIDE_JOB_TYPE_LABELS } from '@/lib/diagnosis/fukugyou-shindan/data';
import { runFukugyouShindan } from '@/lib/diagnosis/fukugyou-shindan/engine';
import { trackEvent } from '@/lib/analytics';

const STEP_LABELS = ['💼 本業・副業の種類', '💰 収入・経費', '📋 申告状況'];
const TOTAL_STEPS = 3;

const INCOME_OPTIONS = [
  { value: 300,  label: '〜300万' },
  { value: 450,  label: '300〜500万' },
  { value: 600,  label: '500〜700万' },
  { value: 850,  label: '700〜1000万' },
  { value: 1250, label: '1000〜1500万' },
  { value: 1800, label: '1500万〜' },
];

const SIDE_JOB_TYPES: SideJobType[] = [
  'freelance_writing',
  'programming',
  'design',
  'consulting',
  'ecommerce',
  'rental_income',
  'stocks',
  'crypto',
  'rideshare_delivery',
  'other',
];

export default function FukugyouForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<SideJobResult | null>(null);

  // Step 1
  const [mainJobIncome, setMainJobIncome] = useState<number | null>(null);
  const [sideJobType, setSideJobType] = useState<SideJobType | null>(null);

  // Step 2
  const [sideJobRevenue, setSideJobRevenue] = useState(0);
  const [sideJobExpenses, setSideJobExpenses] = useState(0);

  // Step 3
  const [hasBookkeeping, setHasBookkeeping] = useState<boolean | null>(null);
  const [isContinuous, setIsContinuous] = useState<boolean | null>(null);
  const [hasOpeningNotification, setHasOpeningNotification] = useState<boolean | null>(null);

  const canNext =
    step === 1 ? mainJobIncome !== null && sideJobType !== null :
    step === 2 ? sideJobRevenue > 0 :
    hasBookkeeping !== null && isContinuous !== null && hasOpeningNotification !== null;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      trackEvent('step_complete', { step, diagnosis: 'fukugyou_shindan' });
      setStep(s => s + 1);
    } else {
      trackEvent('diagnosis_complete', { diagnosis: 'fukugyou_shindan' });
      const input: SideJobInput = {
        mainJobIncome: mainJobIncome!,
        sideJobType: sideJobType!,
        sideJobRevenue,
        sideJobExpenses,
        hasBookkeeping: hasBookkeeping!,
        isContinuous: isContinuous!,
        hasOpeningNotification: hasOpeningNotification!,
      };
      setResult(runFukugyouShindan(input));
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setMainJobIncome(null);
    setSideJobType(null);
    setSideJobRevenue(0);
    setSideJobExpenses(0);
    setHasBookkeeping(null);
    setIsContinuous(null);
    setHasOpeningNotification(null);
  };

  if (result) {
    return <FukugyouResult result={result} onReset={handleReset} />;
  }

  return (
    <DiagnosisShell
      title="副業の確定申告 要否・最適申告判定"
      subtitle="副業の種類・収入・経費を入力して、確定申告の要否と最適な申告方法を診断します"
      step={step}
      totalSteps={TOTAL_STEPS}
      stepLabels={STEP_LABELS}
      onBack={step > 1 ? handleBack : undefined}
      onNext={handleNext}
      canNext={canNext}
      isLast={step === TOTAL_STEPS}
      nextLabel={step === TOTAL_STEPS ? '申告要否を診断する' : undefined}
    >
      {/* ---- Step 1: 本業年収・副業種類 ---- */}
      {step === 1 && (
        <StepContainer
          heading="💼 本業の年収と副業の種類"
          description="本業の収入と副業の種類を教えてください"
        >
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">本業の年収（目安）</label>
            <div className="grid grid-cols-3 gap-2">
              {INCOME_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMainJobIncome(opt.value)}
                  className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors ${
                    mainJobIncome === opt.value
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">副業の種類</label>
            <div className="grid grid-cols-2 gap-2">
              {SIDE_JOB_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSideJobType(type)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors text-left ${
                    sideJobType === type
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  {SIDE_JOB_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        </StepContainer>
      )}

      {/* ---- Step 2: 収入・経費 ---- */}
      {step === 2 && (
        <StepContainer
          heading="💰 副業の収入・経費"
          description="今年（または昨年）の副業の収入と経費を入力してください"
        >
          <NumberInput
            label="副業の年間収入（売上）"
            value={sideJobRevenue}
            onChange={setSideJobRevenue}
            helpText="振込や売上の合計金額。源泉徴収されている場合は源泉前の金額で入力してください"
          />
          <NumberInput
            label="副業の年間経費"
            value={sideJobExpenses}
            onChange={setSideJobExpenses}
            helpText="PC・通信費・書籍・交通費・セミナー代など副業に直接かかった費用の合計"
          />
          {sideJobRevenue > 0 && (
            <div className={`rounded-xl p-3 mt-2 text-sm ${
              sideJobRevenue - sideJobExpenses > 20
                ? 'bg-brand-50 border border-brand-200'
                : sideJobRevenue - sideJobExpenses > 0
                ? 'bg-green-50 border border-green-200'
                : 'bg-brand-50 border border-brand-200'
            }`}>
              <span className="font-semibold">副業の純利益: </span>
              <span className="font-bold">
                {sideJobRevenue - sideJobExpenses > 0
                  ? `${sideJobRevenue - sideJobExpenses}万円`
                  : `▲${sideJobExpenses - sideJobRevenue}万円（赤字）`}
              </span>
              {sideJobRevenue - sideJobExpenses > 20 && (
                <p className="text-xs mt-1 text-brand-700">20万円超のため確定申告が必要な可能性があります</p>
              )}
              {sideJobRevenue - sideJobExpenses <= 20 && sideJobRevenue - sideJobExpenses > 0 && (
                <p className="text-xs mt-1 text-green-700">20万円以下のため所得税の確定申告は不要な可能性があります</p>
              )}
              {sideJobRevenue - sideJobExpenses <= 0 && (
                <p className="text-xs mt-1 text-brand-700">赤字の場合、事業所得であれば本業と損益通算できる可能性があります</p>
              )}
            </div>
          )}
        </StepContainer>
      )}

      {/* ---- Step 3: 申告状況 ---- */}
      {step === 3 && (
        <StepContainer
          heading="📋 副業の状況"
          description="以下の状況を教えてください（節税方法の提案に使います）"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                帳簿（収支記録）をつけていますか？
              </label>
              <div className="flex gap-3">
                {[
                  { value: true,  label: 'つけている' },
                  { value: false, label: 'つけていない' },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setHasBookkeeping(opt.value)}
                    className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                      hasBookkeeping === opt.value
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                副業を継続的に（反復して）行っていますか？
              </label>
              <div className="flex gap-3">
                {[
                  { value: true,  label: 'はい（継続中）' },
                  { value: false, label: 'いいえ（単発）' },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setIsContinuous(opt.value)}
                    className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                      isContinuous === opt.value
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                開業届を税務署に提出していますか？
              </label>
              <div className="flex gap-3">
                {[
                  { value: true,  label: '提出済み' },
                  { value: false, label: '未提出' },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setHasOpeningNotification(opt.value)}
                    className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                      hasOpeningNotification === opt.value
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {hasOpeningNotification === false && (
                <p className="text-xs text-gray-500 mt-1">
                  開業届は費用0円・15分で提出可能です。提出すると青色申告が使えるようになります
                </p>
              )}
            </div>
          </div>
        </StepContainer>
      )}
    </DiagnosisShell>
  );
}
