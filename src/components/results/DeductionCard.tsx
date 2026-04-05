'use client';

import { useState } from 'react';
import type { Deduction } from '@/lib/diagnosis/types';
import type { UserInput } from '@/lib/diagnosis/types';

const URGENCY_LABELS = {
  high: { label: '優先度：高', color: 'bg-red-100 text-red-700' },
  medium: { label: '優先度：中', color: 'bg-yellow-100 text-yellow-700' },
  low: { label: '優先度：低', color: 'bg-gray-100 text-gray-600' },
};

const DIFFICULTY_COLOR = {
  かんたん: 'text-green-600',
  ふつう: 'text-yellow-600',
  'やや手間': 'text-red-600',
};

type Props = {
  deduction: Deduction;
  input: UserInput;
};

export default function DeductionCard({ deduction, input }: Props) {
  const [open, setOpen] = useState(false);
  const u = URGENCY_LABELS[deduction.urgency];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.color}`}>
              {u.label}
            </span>
          </div>
          <p className="font-semibold text-gray-800 truncate">{deduction.name}</p>
          <p className="text-sm text-blue-600 font-medium">{deduction.savings(input)}</p>
        </div>
        <span className="text-gray-400 ml-2">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-700 mt-3 mb-3 leading-relaxed">{deduction.description}</p>
          <div className="flex flex-col gap-1 text-xs text-gray-600">
            <p><span className="font-medium">次のアクション：</span>{deduction.action}</p>
            <p><span className="font-medium">期限：</span>{deduction.deadline}</p>
            <p>
              <span className="font-medium">難易度：</span>
              <span className={DIFFICULTY_COLOR[deduction.difficulty]}>{deduction.difficulty}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
