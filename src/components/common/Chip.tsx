'use client';

type ChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export default function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
        selected
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
      }`}
    >
      {label}
    </button>
  );
}
