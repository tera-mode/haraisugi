'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IncomeRange, WorkStyle, FamilyOption, LifeOption, CurrentDeduction, UserInput } from '@/lib/diagnosis/types';
import ProgressBar from '@/components/diagnosis/ProgressBar';
import StepIncome from '@/components/diagnosis/StepIncome';
import StepFamily from '@/components/diagnosis/StepFamily';
import StepLife from '@/components/diagnosis/StepLife';
import StepCurrent from '@/components/diagnosis/StepCurrent';
import NavButtons from '@/components/diagnosis/NavButtons';
import Disclaimer from '@/components/common/Disclaimer';
import { trackEvent } from '@/lib/analytics';

const TOTAL_STEPS = 4;

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState<IncomeRange | null>(null);
  const [workStyle, setWorkStyle] = useState<WorkStyle | null>(null);
  const [family, setFamily] = useState<FamilyOption[]>([]);
  const [life, setLife] = useState<LifeOption[]>([]);
  const [currentDeductions, setCurrentDeductions] = useState<CurrentDeduction[]>([]);

  const canNext = step === 1 ? (income !== null && workStyle !== null) : true;

  const handleNext = () => {
    if (step === 1) {
      trackEvent('step_complete', { step: 1 });
      if (income && workStyle) setStep(2);
    } else if (step < TOTAL_STEPS) {
      trackEvent('step_complete', { step });
      setStep(s => s + 1);
    } else {
      const input: UserInput = {
        income: income!,
        workStyle: workStyle!,
        family,
        life,
        currentDeductions: currentDeductions.length === 0 ? ['none'] : currentDeductions,
      };
      const params = new URLSearchParams({ d: JSON.stringify(input) });
      trackEvent('diagnosis_complete');
      router.push(`/result?${params.toString()}`);
    }
  };

  const handleBack = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          税金払いすぎ診断
        </h1>
        <p className="text-sm text-gray-500">
          あなたの払いすぎ税金、30秒で見つけます
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <ProgressBar current={step} total={TOTAL_STEPS} />

        {step === 1 && (
          <StepIncome
            income={income}
            workStyle={workStyle}
            onIncomeChange={setIncome}
            onWorkStyleChange={setWorkStyle}
          />
        )}
        {step === 2 && (
          <StepFamily selected={family} onChange={setFamily} />
        )}
        {step === 3 && (
          <StepLife selected={life} onChange={setLife} />
        )}
        {step === 4 && (
          <StepCurrent selected={currentDeductions} onChange={setCurrentDeductions} />
        )}

        <NavButtons
          onBack={step > 1 ? handleBack : undefined}
          onNext={handleNext}
          canNext={canNext}
          isLast={step === TOTAL_STEPS}
        />
      </div>

      <div className="mt-6">
        <Disclaimer />
      </div>
    </div>
  );
}
