import Link from 'next/link';

type Props = {
  variant?: 'primary' | 'secondary';
  heading: string;
  subtext: string;
  label: string;
  href?: string;
};

/**
 * サイト全体で共通のCTAバナー
 * variant="primary"  : brand-600背景（強調用）
 * variant="secondary": brand-50背景（補足用）
 */
export default function CtaBanner({
  variant = 'primary',
  heading,
  subtext,
  label,
  href = '/',
}: Props) {
  if (variant === 'secondary') {
    return (
      <div className="bg-brand-50 border border-brand-200 rounded-xl px-5 py-5 text-center">
        <p className="text-sm font-bold text-brand-800 mb-2">{heading}</p>
        <p className="text-xs text-gray-600 mb-3">{subtext}</p>
        <Link
          href={href}
          className="inline-block bg-brand-600 text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors"
        >
          {label}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-600 rounded-2xl px-6 py-5 text-center text-white">
      <p className="text-base font-bold mb-1">{heading}</p>
      <p className="text-sm opacity-90 mb-4">{subtext}</p>
      <Link
        href={href}
        className="inline-block bg-white text-brand-700 font-bold text-sm px-7 py-2.5 rounded-xl hover:bg-brand-50 transition-colors"
      >
        {label}
      </Link>
    </div>
  );
}
