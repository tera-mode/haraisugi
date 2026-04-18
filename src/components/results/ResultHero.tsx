type Props = {
  deductionCount: number;
  totalSavings: number;
  trickCount: number;
};

export default function ResultHero({ deductionCount, totalSavings, trickCount }: Props) {
  const savingsDisplay =
    totalSavings >= 10000
      ? `約${Math.round(totalSavings / 10000)}万円`
      : `約${Math.round(totalSavings / 1000) * 1000}円`;

  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white text-center mb-6">
      <p className="text-sm opacity-80 mb-2">あなたの取りこぼし節税</p>
      <p className="text-5xl font-extrabold mb-1">{savingsDisplay}</p>
      <p className="text-sm opacity-80 mb-5">推定年間節税額（概算）</p>
      <div className="flex justify-center gap-8">
        <div>
          <p className="text-3xl font-bold">{deductionCount}</p>
          <p className="text-xs opacity-80">見逃し控除</p>
        </div>
        <div className="border-l border-white/30" />
        <div>
          <p className="text-3xl font-bold">{trickCount}</p>
          <p className="text-xs opacity-80">使える裏技</p>
        </div>
      </div>
    </div>
  );
}
