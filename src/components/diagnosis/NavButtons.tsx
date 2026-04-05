'use client';

type NavButtonsProps = {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  canNext?: boolean;
  isLast?: boolean;
};

export default function NavButtons({
  onBack,
  onNext,
  nextLabel,
  canNext = true,
  isLast = false,
}: NavButtonsProps) {
  return (
    <div className="flex gap-3 mt-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          戻る
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={`flex-[2] py-3 rounded-lg text-sm font-semibold transition-colors ${
          canNext
            ? isLast
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {nextLabel ?? (isLast ? '診断結果を見る' : '次へ')}
      </button>
    </div>
  );
}
