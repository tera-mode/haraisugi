'use client';

import type { IncomeRange, WorkStyle } from '@/lib/diagnosis/types';

const INCOME_OPTIONS: { value: IncomeRange; label: string }[] = [
  { value: 'under300', label: '300万円未満' },
  { value: '300to500', label: '300〜500万円' },
  { value: '500to700', label: '500〜700万円' },
  { value: '700to1000', label: '700〜1,000万円' },
  { value: '1000to1500', label: '1,000〜1,500万円' },
  { value: 'over1500', label: '1,500万円以上' },
];

const WORK_OPTIONS: { value: WorkStyle; label: string; desc: string; icon: string }[] = [
  { value: 'employee', label: '会社員', desc: '給与収入のみ', icon: '🏢' },
  { value: 'employee_side', label: '会社員＋副業', desc: '給与収入＋副業収入あり', icon: '💼' },
  { value: 'freelance', label: 'フリーランス', desc: '個人事業主・自営業', icon: '🖥️' },
  { value: 'executive', label: '会社役員', desc: '中小企業の役員・社長', icon: '👔' },
];

type Props = {
  income: IncomeRange | null;
  workStyle: WorkStyle | null;
  onIncomeChange: (v: IncomeRange) => void;
  onWorkStyleChange: (v: WorkStyle) => void;
};

export default function StepIncome({ income, workStyle, onIncomeChange, onWorkStyleChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">💰 収入</h2>
      <p className="text-sm text-gray-500 mb-6">あなたの年収帯と働き方を選んでください</p>

      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">年収帯</p>
        <div className="grid grid-cols-2 gap-2">
          {INCOME_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onIncomeChange(opt.value)}
              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors text-left ${
                income === opt.value
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">働き方</p>
        <div className="flex flex-col gap-2">
          {WORK_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onWorkStyleChange(opt.value)}
              className={`py-3 px-4 rounded-lg border text-sm transition-colors text-left ${
                workStyle === opt.value
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
            >
              <span className="mr-2">{opt.icon}</span>
              <span className={`font-semibold ${workStyle === opt.value ? 'text-blue-700' : 'text-gray-800'}`}>
                {opt.label}
              </span>
              <span className="text-gray-500 text-xs ml-2">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
