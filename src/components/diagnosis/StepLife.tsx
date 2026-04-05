'use client';

import type { LifeOption } from '@/lib/diagnosis/types';
import Chip from '@/components/common/Chip';

type Category = {
  label: string;
  options: { value: LifeOption; label: string }[];
};

const CATEGORIES: Category[] = [
  {
    label: '医療',
    options: [
      { value: 'medical_over100k', label: '医療費が年10万円超' },
      { value: 'otc_medicine', label: '市販薬を定期的に購入' },
      { value: 'dental_orthodontics', label: '歯科矯正をした' },
      { value: 'dental_loan', label: 'デンタルローンを使用' },
      { value: 'commute_to_hospital', label: '通院交通費がある' },
    ],
  },
  {
    label: '住宅',
    options: [
      { value: 'housing_loan', label: '住宅ローンあり' },
      { value: 'eco_renovation', label: '省エネ改修をした' },
    ],
  },
  {
    label: '保険',
    options: [
      { value: 'earthquake_insurance', label: '地震保険に加入中' },
      { value: 'life_insurance', label: '生命保険に加入中' },
    ],
  },
  {
    label: '寄付',
    options: [
      { value: 'donation', label: 'NPO等に寄付した' },
    ],
  },
  {
    label: '災害',
    options: [
      { value: 'disaster_theft', label: '災害・盗難の被害があった' },
    ],
  },
  {
    label: '仕事・自己投資',
    options: [
      { value: 'qualification', label: '資格取得費用を自腹で払った' },
      { value: 'work_books', label: '仕事の書籍・新聞を自腹で購入' },
      { value: 'work_clothes', label: 'スーツ・制服を自腹で購入' },
      { value: 'remote_work', label: '在宅勤務をしている' },
    ],
  },
  {
    label: '投資',
    options: [
      { value: 'stock_loss', label: '株・投信で損失が出た' },
      { value: 'crypto', label: '暗号資産の取引をした' },
    ],
  },
];

type Props = {
  selected: LifeOption[];
  onChange: (v: LifeOption[]) => void;
};

export default function StepLife({ selected, onChange }: Props) {
  const toggle = (value: LifeOption) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Step 3: 生活・ライフイベント</h2>
      <p className="text-sm text-gray-500 mb-6">当てはまるものをすべて選んでください（複数可）</p>
      <div className="flex flex-col gap-5">
        {CATEGORIES.map(cat => (
          <div key={cat.label}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {cat.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.options.map(opt => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  selected={selected.includes(opt.value)}
                  onClick={() => toggle(opt.value)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
