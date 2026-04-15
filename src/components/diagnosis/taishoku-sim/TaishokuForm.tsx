'use client';

import { useState } from 'react';
import DiagnosisShell from '@/components/diagnosis/shared/DiagnosisShell';
import StepContainer from '@/components/diagnosis/shared/StepContainer';
import NumberInput from '@/components/diagnosis/shared/NumberInput';
import TaishokuResult from './TaishokuResult';
import type { RetirementInput, RetirementResult } from '@/lib/diagnosis/taishoku-sim/types';
import { runTaishokuSim } from '@/lib/diagnosis/taishoku-sim/engine';
import { trackEvent } from '@/lib/analytics';

const STEP_LABELS = ['🏢 勤続・退職金', '💰 iDeCo', '📅 年齢・その他'];
const TOTAL_STEPS = 3;

const AGE_OPTIONS = [
  { value: 50, label: '50歳' },
  { value: 55, label: '55歳' },
  { value: 58, label: '58歳' },
  { value: 60, label: '60歳' },
  { value: 62, label: '62歳' },
  { value: 65, label: '65歳以上' },
];

export default function TaishokuForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<RetirementResult | null>(null);

  // Step 1
  const [yearsOfService, setYearsOfService] = useState(0);
  const [retirementBenefit, setRetirementBenefit] = useState(0);

  // Step 2
  const [hasIdeco, setHasIdeco] = useState<boolean | null>(null);
  const [idecoBalance, setIdecoBalance] = useState(0);
  const [idecoContributionYears, setIdecoContributionYears] = useState(0);

  // Step 3
  const [age, setAge] = useState<number | null>(null);
  const [hasDisability, setHasDisability] = useState(false);

  const canNext =
    step === 1 ? yearsOfService > 0 && retirementBenefit > 0 :
    step === 2 ? hasIdeco !== null :
    age !== null;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      trackEvent('step_complete', { step, diagnosis: 'taishoku_sim' });
      setStep(s => s + 1);
    } else {
      trackEvent('diagnosis_complete', { diagnosis: 'taishoku_sim' });
      const input: RetirementInput = {
        yearsOfService,
        retirementBenefit,
        idecoBalance: hasIdeco ? idecoBalance : 0,
        idecoContributionYears: hasIdeco ? idecoContributionYears : 0,
        age: age!,
        hasDisability,
      };
      setResult(runTaishokuSim(input));
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setYearsOfService(0);
    setRetirementBenefit(0);
    setHasIdeco(null);
    setIdecoBalance(0);
    setIdecoContributionYears(0);
    setAge(null);
    setHasDisability(false);
  };

  if (result) {
    return <TaishokuResult result={result} onReset={handleReset} />;
  }

  return (
    <DiagnosisShell
      title="退職金・iDeCo 受取戦略シミュレーション"
      subtitle="受取方法を変えるだけで税額が大きく変わります。3パターンを自動比較します"
      step={step}
      totalSteps={TOTAL_STEPS}
      stepLabels={STEP_LABELS}
      onBack={step > 1 ? handleBack : undefined}
      onNext={handleNext}
      canNext={canNext}
      isLast={step === TOTAL_STEPS}
      nextLabel={step === TOTAL_STEPS ? '受取戦略を診断する' : undefined}
    >
      {/* ---- Step 1: 勤続年数・退職金 ---- */}
      {step === 1 && (
        <StepContainer
          heading="🏢 勤続年数と退職金"
          description="現在（または退職予定時）の情報を入力してください"
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              勤続年数
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20, 25, 30, 35, 40].map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYearsOfService(y)}
                  className={`py-2 px-2 rounded-lg border text-sm font-medium transition-colors ${
                    yearsOfService === y
                      ? 'bg-orange-50 border-orange-500 text-orange-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  {y}年
                </button>
              ))}
            </div>
            {yearsOfService > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                退職所得控除: {yearsOfService <= 20
                  ? `${Math.max(80, 40 * yearsOfService)}万円`
                  : `${800 + 70 * (yearsOfService - 20)}万円`}
              </p>
            )}
          </div>
          <NumberInput
            label="退職金（予定額）"
            value={retirementBenefit}
            onChange={setRetirementBenefit}
            helpText="会社から支払われる退職金・退職一時金の金額。不明な場合は概算で入力してください"
          />
        </StepContainer>
      )}

      {/* ---- Step 2: iDeCo ---- */}
      {step === 2 && (
        <StepContainer
          heading="💰 iDeCoの有無"
          description="iDeCo（個人型確定拠出年金）に加入していますか？"
        >
          <div className="flex gap-3 mb-4">
            {[
              { value: true,  label: 'はい（加入中）' },
              { value: false, label: 'いいえ（未加入）' },
            ].map(opt => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setHasIdeco(opt.value)}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  hasIdeco === opt.value
                    ? 'bg-orange-50 border-orange-500 text-orange-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {hasIdeco && (
            <div className="space-y-4">
              <NumberInput
                label="iDeCo残高（見込み）"
                value={idecoBalance}
                onChange={setIdecoBalance}
                helpText="退職時のiDeCo口座残高の見込み額"
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  iDeCo加入年数
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 10, 15, 20, 25, 30, 35].map(y => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setIdecoContributionYears(y)}
                      className={`py-2 px-2 rounded-lg border text-sm font-medium transition-colors ${
                        idecoContributionYears === y
                          ? 'bg-orange-50 border-orange-500 text-orange-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      {y}年
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hasIdeco === false && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-bold mb-1">iDeCoに加入していない場合も試算できます</p>
              <p className="text-xs">退職金のみの受取方法（一括）をシミュレーションします。iDeCoは老後の節税に非常に有効です。</p>
            </div>
          )}
        </StepContainer>
      )}

      {/* ---- Step 3: 年齢・その他 ---- */}
      {step === 3 && (
        <StepContainer
          heading="📅 退職予定年齢"
          description="退職（またはiDeCoの受取開始）予定年齢を選んでください"
        >
          <div className="grid grid-cols-3 gap-2 mb-5">
            {AGE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAge(opt.value)}
                className={`py-3 px-2 rounded-lg border text-sm font-medium transition-colors ${
                  age === opt.value
                    ? 'bg-orange-50 border-orange-500 text-orange-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDisability}
                onChange={e => setHasDisability(e.target.checked)}
                className="w-4 h-4 accent-orange-600"
              />
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  障害者として退職する（または障害者手帳あり）
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  該当する場合、退職所得控除額に100万円が加算されます
                </p>
              </div>
            </label>
          </div>
        </StepContainer>
      )}
    </DiagnosisShell>
  );
}
