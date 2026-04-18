type ProgressBarProps = {
  current: number; // 1-4
  total: number;
};

const STEP_LABELS = ['💰 収入', '👨‍👩‍👧 家族', '🌱 生活', '✅ 現在の控除'];

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={`flex flex-col items-center text-xs ${
              i + 1 <= current ? 'text-brand-600 font-semibold' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1 ${
                i + 1 < current
                  ? 'bg-brand-600 text-white'
                  : i + 1 === current
                  ? 'bg-brand-600 text-white ring-2 ring-brand-300'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {i + 1 < current ? '✓' : i + 1}
            </div>
            <span className="hidden sm:block">{label}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
        />
      </div>
      <p className="text-right text-xs text-gray-400 mt-1">
        Step {current} / {total}
      </p>
    </div>
  );
}
