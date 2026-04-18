'use client';

import { useState } from 'react';
import DiagnosisShell from '@/components/diagnosis/shared/DiagnosisShell';
import StepContainer from '@/components/diagnosis/shared/StepContainer';
import NumberInput from '@/components/diagnosis/shared/NumberInput';
import MedicalResult from './MedicalResult';
import type { MedicalCheckInput, MedicalCheckResult } from '@/lib/diagnosis/medical-check/types';
import { runMedicalCheck } from '@/lib/diagnosis/medical-check/engine';
import { trackEvent } from '@/lib/analytics';

type IncomeOption = { value: number; label: string };

const INCOME_OPTIONS: IncomeOption[] = [
  { value: 200,  label: '300万円未満' },
  { value: 400,  label: '300〜500万円' },
  { value: 600,  label: '500〜700万円' },
  { value: 850,  label: '700〜1,000万円' },
  { value: 1250, label: '1,000〜1,500万円' },
  { value: 2000, label: '1,500万円以上' },
];

const STEP_LABELS = ['💰 収入', '🏥 医療費', '💊 OTC薬'];
const TOTAL_STEPS = 3;

export default function MedicalCheckForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<MedicalCheckResult | null>(null);

  // Step 1
  const [annualIncome, setAnnualIncome] = useState<number | null>(null);

  // Step 2
  const [totalMedical, setTotalMedical] = useState(0);       // 万円
  const [insurance, setInsurance] = useState(0);             // 万円
  const [familySize, setFamilySize] = useState(1);

  // Step 3
  const [otcDrugs, setOtcDrugs] = useState(0);               // 万円
  const [hasCheckup, setHasCheckup] = useState<boolean | null>(null);

  const canNext =
    step === 1 ? annualIncome !== null :
    step === 2 ? true :
    hasCheckup !== null;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      trackEvent('step_complete', { step, diagnosis: 'medical_check' });
      setStep(s => s + 1);
    } else {
      trackEvent('diagnosis_complete', { diagnosis: 'medical_check' });
      const input: MedicalCheckInput = {
        annualIncome: annualIncome!,
        totalMedicalExpenses: totalMedical * 10_000,
        otcDrugExpenses: otcDrugs * 10_000,
        hasHealthCheckup: hasCheckup!,
        familySize,
        insuranceReimbursement: insurance * 10_000,
      };
      setResult(runMedicalCheck(input));
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else setResult(null);
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setAnnualIncome(null);
    setTotalMedical(0);
    setInsurance(0);
    setFamilySize(1);
    setOtcDrugs(0);
    setHasCheckup(null);
  };

  if (result) {
    return <MedicalResult result={result} onReset={handleReset} />;
  }

  return (
    <DiagnosisShell
      title="医療費控除 vs セルフメディケーション判定"
      subtitle="年間の医療費とOTC医薬品購入額を入力して、どちらが有利か自動判定します"
      step={step}
      totalSteps={TOTAL_STEPS}
      stepLabels={STEP_LABELS}
      onBack={step > 1 ? handleBack : undefined}
      onNext={handleNext}
      canNext={canNext}
      isLast={step === TOTAL_STEPS}
      nextLabel={step === TOTAL_STEPS ? '判定する' : undefined}
    >
      {step === 1 && (
        <StepContainer heading="💰 年収" description="あなたの年収帯を選んでください">
          <div className="grid grid-cols-2 gap-2">
            {INCOME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAnnualIncome(opt.value)}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors text-left ${
                  annualIncome === opt.value
                    ? 'bg-brand-50 border-brand-500 text-brand-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </StepContainer>
      )}

      {step === 2 && (
        <StepContainer
          heading="🏥 年間医療費"
          description="医療費には通院交通費・歯科治療・入院費・処方薬代を含みます"
        >
          <NumberInput
            label="年間医療費合計"
            value={totalMedical}
            onChange={setTotalMedical}
            helpText="家族全員（生計を一にする家族）の合計額を入力してください"
          />
          <NumberInput
            label="保険金等で補填される金額"
            value={insurance}
            onChange={setInsurance}
            helpText="民間保険・高額療養費・出産育児一時金等の合計。ない場合は0"
          />
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              医療費を合算する家族の人数
            </label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFamilySize(n)}
                  className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                    familySize === n
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">人</p>
          </div>
        </StepContainer>
      )}

      {step === 3 && (
        <StepContainer
          heading="💊 OTC医薬品・健診"
          description="セルフメディケーション税制の対象OTC薬（スイッチOTC）の購入額を入力してください"
        >
          <NumberInput
            label="年間OTC医薬品購入額"
            value={otcDrugs}
            onChange={setOtcDrugs}
            helpText="レシートに「★」マークがある薬品が対象。ない場合は0"
          />
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              今年、健康診断・予防接種などを受けましたか？
            </p>
            <p className="text-xs text-gray-500 mb-3">
              会社の定期健康診断・市区町村の特定健診・インフルエンザ予防接種などもOKです
            </p>
            <div className="flex gap-3">
              {[
                { value: true,  label: 'はい（受けた）' },
                { value: false, label: 'いいえ（受けていない）' },
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setHasCheckup(opt.value)}
                  className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                    hasCheckup === opt.value
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </StepContainer>
      )}
    </DiagnosisShell>
  );
}
