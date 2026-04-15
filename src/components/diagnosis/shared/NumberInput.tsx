'use client';

type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  helpText?: string;
  min?: number;
  max?: number;
  placeholder?: string;
};

export default function NumberInput({
  label,
  value,
  onChange,
  unit = '万円',
  helpText,
  min = 0,
  max,
  placeholder = '0',
}: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {helpText && <p className="text-xs text-gray-500 mb-2">{helpText}</p>}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          value={value === 0 ? '' : value}
          placeholder={placeholder}
          onChange={e => {
            const v = e.target.value === '' ? 0 : Number(e.target.value);
            if (!isNaN(v) && v >= min) onChange(v);
          }}
          className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-600">{unit}</span>
      </div>
    </div>
  );
}
