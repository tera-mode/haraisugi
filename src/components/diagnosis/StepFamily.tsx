'use client';

import type { FamilyOption } from '@/lib/diagnosis/types';
import Chip from '@/components/common/Chip';

const FAMILY_OPTIONS: { value: FamilyOption; label: string }[] = [
  { value: 'spouse_low', label: '配偶者（収入150万以下）' },
  { value: 'spouse_high', label: '配偶者（収入150万超）' },
  { value: 'child_under16', label: '16歳未満の子' },
  { value: 'child_16to18', label: '16〜18歳の子' },
  { value: 'child_19to22', label: '19〜22歳の子（大学生等）' },
  { value: 'parent_over70', label: '70歳以上の親（同居）' },
  { value: 'care_needed', label: '要介護認定の家族' },
  { value: 'disability', label: '障害者手帳を持つ家族' },
  { value: 'single_parent', label: 'ひとり親' },
  { value: 'child_away', label: '下宿中の子ども（仕送りあり）' },
];

type Props = {
  selected: FamilyOption[];
  onChange: (v: FamilyOption[]) => void;
};

export default function StepFamily({ selected, onChange }: Props) {
  const toggle = (value: FamilyOption) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Step 2: 家族構成</h2>
      <p className="text-sm text-gray-500 mb-6">当てはまるものをすべて選んでください（複数可）</p>
      <div className="flex flex-wrap gap-2">
        {FAMILY_OPTIONS.map(opt => (
          <Chip
            key={opt.value}
            label={opt.label}
            selected={selected.includes(opt.value)}
            onClick={() => toggle(opt.value)}
          />
        ))}
      </div>
      {selected.length === 0 && (
        <p className="mt-4 text-sm text-gray-400">
          該当なしの場合はそのまま「次へ」を押してください
        </p>
      )}
    </div>
  );
}
