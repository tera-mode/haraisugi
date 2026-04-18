import Link from 'next/link';

type Props = {
  href: string;
  icon: string;
  title: string;
  description: string;
  target: string;
  available?: boolean;
};

export default function DiagnosisMenuCard({
  href,
  icon,
  title,
  description,
  target,
  available = true,
}: Props) {
  const inner = (
    <div
      className={`bg-white rounded-2xl border p-5 sm:p-6 flex gap-4 items-start transition-all ${
        available
          ? 'border-gray-200 hover:border-brand-300 hover:shadow-md cursor-pointer'
          : 'border-gray-100 opacity-60 cursor-default'
      }`}
    >
      <div className="text-4xl flex-shrink-0 leading-none">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-bold text-gray-900 leading-tight">{title}</h2>
          {!available && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">近日公開</span>
          )}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mt-1">{description}</p>
        <p className="text-xs text-gray-400 mt-2.5">対象: {target}</p>
      </div>
      {available && (
        <div className="text-brand-500 text-lg flex-shrink-0 font-semibold">→</div>
      )}
    </div>
  );

  if (!available) return inner;

  return <Link href={href} className="block">{inner}</Link>;
}
