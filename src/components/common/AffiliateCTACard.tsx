'use client';

import { AFFILIATE_LINKS } from '@/lib/affiliate/links';
import { trackEvent } from '@/lib/analytics';

type Props = {
  linkKey: string;
  heading: string;
  desc?: string;
  diagnosisName: string;
  /** cta: 右側ボタンバッジ付き（基本診断結果用）/ card: PRラベル＋テキスト（ニッチ診断結果用） */
  variant?: 'cta' | 'card';
  free?: boolean;
};

export default function AffiliateCTACard({
  linkKey,
  heading,
  desc,
  diagnosisName,
  variant = 'card',
  free = true,
}: Props) {
  const link = AFFILIATE_LINKS[linkKey];
  if (!link) return null;

  const displayDesc = desc ?? link.label;

  const handleClick = () => {
    trackEvent('affiliate_click', { link_key: linkKey, diagnosis: diagnosisName });
  };

  const wrapperBorder =
    variant === 'cta'
      ? 'border-brand-100 hover:border-brand-400 hover:shadow-md'
      : 'border-gray-200 hover:border-brand-300 hover:shadow-sm';

  return (
    <div className={`bg-white border ${wrapperBorder} rounded-xl overflow-hidden transition-all`}>
      {link.banner && (
        <>
          <a
            href={link.banner.clickUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            onClick={handleClick}
            className="block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={link.banner.src}
              alt={link.label}
              width={link.banner.width}
              height={link.banner.height}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </a>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={link.banner.trackingPixel}
            alt=""
            width={1}
            height={1}
            style={{ display: 'none' }}
          />
        </>
      )}
      {variant === 'cta' ? (
        <a
          href={link.url}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={handleClick}
          className="flex items-center justify-between gap-3 px-4 py-4"
        >
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm mb-0.5">{heading}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{displayDesc}</p>
          </div>
          <span className="shrink-0 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap">
            {free ? '無料で試す →' : '詳しく見る →'}
          </span>
        </a>
      ) : (
        <a
          href={link.url}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={handleClick}
          className="block px-5 py-4"
        >
          <p className="text-xs text-gray-500 mb-0.5">PR</p>
          <p className="text-sm font-bold text-gray-800 mb-0.5">{heading}</p>
          <p className="text-xs text-gray-500">{displayDesc}</p>
        </a>
      )}
    </div>
  );
}
