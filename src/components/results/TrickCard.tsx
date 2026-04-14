import type { Trick } from '@/lib/diagnosis/types';

type Props = {
  trick: Trick;
};

export default function TrickCard({ trick }: Props) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 py-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-semibold text-gray-800 text-sm leading-snug">{trick.title}</p>
        <span className="text-yellow-500 text-sm shrink-0">{trick.surprise}</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-2">{trick.body}</p>
      <p className="text-xs text-gray-400">
        出典：{trick.sourceUrl ? (
          <a href={trick.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
            {trick.source}
          </a>
        ) : trick.source}
      </p>
    </div>
  );
}
