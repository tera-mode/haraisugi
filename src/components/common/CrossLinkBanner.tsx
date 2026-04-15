import Link from 'next/link';

type CrossLink = {
  href: string;
  label: string;
  icon: string;
  available?: boolean;
};

type Props = {
  links: CrossLink[];
  heading?: string;
};

export default function CrossLinkBanner({ links, heading = 'こちらの診断もおすすめ' }: Props) {
  const available = links.filter(l => l.available !== false);
  if (available.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
      <p className="text-sm font-bold text-gray-700 mb-3">{heading}</p>
      <div className="space-y-2">
        {available.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="text-sm font-medium text-gray-800 flex-1">{link.label}</span>
            <span className="text-blue-500 text-sm">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
