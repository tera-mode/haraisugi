'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { UserInput } from '@/lib/diagnosis/types';
import { diagnose } from '@/lib/diagnosis/engine';
import ResultHero from '@/components/results/ResultHero';
import DeductionCard from '@/components/results/DeductionCard';
import TrickCard from '@/components/results/TrickCard';
import CTASection from '@/components/results/CTASection';
import Disclaimer from '@/components/common/Disclaimer';

type Tab = 'deductions' | 'tricks';

function ResultContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>('deductions');

  const raw = params.get('d');
  if (!raw) {
    router.push('/');
    return null;
  }

  let input: UserInput;
  try {
    input = JSON.parse(raw) as UserInput;
  } catch {
    router.push('/');
    return null;
  }

  const result = diagnose(input);
  const sortedDeductions = [...result.deductions].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.urgency] - order[b.urgency];
  });

  // 裏技をカテゴリ別にグルーピング
  const tricksByCategory = result.tricks.reduce<Record<string, typeof result.tricks>>(
    (acc, t) => {
      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t);
      return acc;
    },
    {}
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <ResultHero
        deductionCount={result.deductions.length}
        totalSavings={result.totalSavings}
        trickCount={result.tricks.length}
      />

      <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
        <button
          type="button"
          onClick={() => setTab('deductions')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            tab === 'deductions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          📋 見逃し控除（{result.deductions.length}件）
        </button>
        <button
          type="button"
          onClick={() => setTab('tricks')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            tab === 'tricks' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          💎 裏技（{result.tricks.length}件）
        </button>
      </div>

      {tab === 'deductions' && (
        <div className="flex flex-col gap-3">
          {sortedDeductions.length > 0 ? (
            sortedDeductions.map(d => (
              <DeductionCard key={d.id} deduction={d} input={input} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8 text-sm">
              現在の条件では見逃し控除は見つかりませんでした。
            </p>
          )}
        </div>
      )}

      {tab === 'tricks' && (
        <div className="flex flex-col gap-6">
          {Object.keys(tricksByCategory).length > 0 ? (
            Object.entries(tricksByCategory).map(([cat, tricks]) => (
              <div key={cat}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {cat}
                </p>
                <div className="flex flex-col gap-2">
                  {tricks.map(t => <TrickCard key={t.id} trick={t} />)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8 text-sm">
              現在の条件では裏技は見つかりませんでした。
            </p>
          )}
        </div>
      )}

      <CTASection result={result} input={input} />

      <div className="mt-8">
        <Disclaimer />
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400">読み込み中...</div>}>
      <ResultContent />
    </Suspense>
  );
}
