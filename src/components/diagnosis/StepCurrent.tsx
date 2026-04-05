'use client';

import type { CurrentDeduction } from '@/lib/diagnosis/types';
import Chip from '@/components/common/Chip';

const CURRENT_OPTIONS: { value: CurrentDeduction; label: string }[] = [
  { value: 'furusato', label: 'ふるさと納税' },
  { value: 'ideco', label: 'iDeCo' },
  { value: 'nisa', label: 'NISA' },
  { value: 'small_biz_mutual', label: '小規模企業共済' },
  { value: 'medical_deduction', label: '医療費控除' },
  { value: 'life_insurance_deduction', label: '生命保険料控除' },
  { value: 'earthquake_deduction', label: '地震保険料控除' },
  { value: 'spouse_deduction', label: '配偶者（特別）控除' },
  { value: 'dependent_deduction', label: '扶養控除' },
  { value: 'housing_loan_deduction', label: '住宅ローン控除' },
  { value: 'none', label: '特になし・わからない' },
];

type Props = {
  selected: CurrentDeduction[];
  onChange: (v: CurrentDeduction[]) => void;
};

export default function StepCurrent({ selected, onChange }: Props) {
  const toggle = (value: CurrentDeduction) => {
    if (value === 'none') {
      onChange(['none']);
      return;
    }
    const without = selected.filter(v => v !== 'none');
    if (without.includes(value)) {
      onChange(without.filter(v => v !== value));
    } else {
      onChange([...without, value]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Step 4: 現在利用中の控除</h2>
      <p className="text-sm text-gray-500 mb-6">
        すでに使っている控除・制度を選んでください（複数可）
      </p>
      <div className="flex flex-wrap gap-2">
        {CURRENT_OPTIONS.map(opt => (
          <Chip
            key={opt.value}
            label={opt.label}
            selected={selected.includes(opt.value)}
            onClick={() => toggle(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
