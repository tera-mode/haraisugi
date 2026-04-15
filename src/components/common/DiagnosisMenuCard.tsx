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
      className={`bg-white rounded-2xl border p-5 flex gap-4 items-start transition-all ${
        available
          ? 'border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
          : 'border-gray-100 opacity-60 cursor-default'
      }`}
    >
      <div className="text-3xl flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          {!available && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">近日公開</span>
          )}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        <p className="text-xs text-gray-400 mt-2">対象: {target}</p>
      </div>
      {available && (
        <div className="text-blue-500 text-sm flex-shrink-0">→</div>
      )}
    </div>
  );

  if (!available) return inner;

  return <Link href={href} className="block">{inner}</Link>;
}
