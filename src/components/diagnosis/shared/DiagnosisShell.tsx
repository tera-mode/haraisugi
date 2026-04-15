'use client';

import Disclaimer from '@/components/common/Disclaimer';
import NavButtons from '@/components/diagnosis/NavButtons';

type Props = {
  title: string;
  subtitle?: string;
  step: number;
  totalSteps: number;
  stepLabels: string[];
  onBack?: () => void;
  onNext: () => void;
  canNext?: boolean;
  isLast?: boolean;
  nextLabel?: string;
  children: React.ReactNode;
};

export default function DiagnosisShell({
  title,
  subtitle,
  step,
  totalSteps,
  stepLabels,
  onBack,
  onNext,
  canNext = true,
  isLast = false,
  nextLabel,
  children,
}: Props) {
  const pct = totalSteps === 1 ? 100 : ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* タイトル */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {/* プログレスバー */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {stepLabels.map((label, i) => (
              <div
                key={label}
                className={`flex flex-col items-center text-xs ${
                  i + 1 <= step ? 'text-blue-600 font-semibold' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1 ${
                    i + 1 < step
                      ? 'bg-blue-600 text-white'
                      : i + 1 === step
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className="hidden sm:block">{label}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">
            Step {step} / {totalSteps}
          </p>
        </div>

        {/* ステップ内容 */}
        {children}

        {/* ナビゲーションボタン */}
        <NavButtons
          onBack={onBack}
          onNext={onNext}
          canNext={canNext}
          isLast={isLast}
          nextLabel={nextLabel}
        />
      </div>

      <div className="mt-6">
        <Disclaimer />
      </div>
    </>
  );
}
