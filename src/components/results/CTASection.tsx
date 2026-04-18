'use client';

import type { DiagnosisResult } from '@/lib/diagnosis/types';
import type { UserInput } from '@/lib/diagnosis/types';
import { AFFILIATE_LINKS } from '@/lib/affiliate/links';
import { trackEvent } from '@/lib/analytics';

type Props = {
  result: DiagnosisResult;
  input: UserInput;
};

type CTAItem = {
  key: string;
  heading: string;
  desc: string;
  free: boolean;
};

function buildCTAs(result: DiagnosisResult, input: UserInput): CTAItem[] {
  const ctas: CTAItem[] = [];
  const deductionIds = result.deductions.map(d => d.id);

  if (deductionIds.includes('furusato')) {
    ctas.push({
      key: 'furusona',
      heading: 'ふるさと納税AIで最適な返礼品を探す',
      desc: '姉妹サービス furusona が、あなたにぴったりの返礼品をAIで提案します。',
      free: true,
    });
  }

  if (deductionIds.includes('ideco')) {
    ctas.push({
      key: 'ideco_matsui',
      heading: 'iDeCoで毎年数万円を節税',
      desc: '松井証券のiDeCoは運営管理手数料0円。業界最多水準の商品ラインナップで、創業100年の安心感。今すぐ開設できます。',
      free: true,
    });
  }

  if (deductionIds.includes('life_insurance')) {
    ctas.push({
      key: 'insurance_review',
      heading: '保険の見直しで節税＋保障を最適化',
      desc: '保険見直しラボで無料相談。生命保険料控除の枠を最大限活用できます。',
      free: true,
    });
  }

  const hasComplex = result.deductions.some(d =>
    ['specific_expense', 'stock_loss', 'casualty_loss', 'donation'].includes(d.id)
  );
  if (hasComplex) {
    ctas.push({
      key: 'tax_accountant_dot',
      heading: '複雑な控除は税理士に相談',
      desc: '税理士ドットコムで無料相談。特定支出控除や損益通算は専門家に任せると確実です。',
      free: true,
    });
  }

  if (input.workStyle === 'freelance' || input.workStyle === 'employee_side') {
    ctas.push({
      key: 'accounting_freee',
      heading: '青色申告はfreeeで楽に完結',
      desc: 'freeeなら確定申告・青色申告65万円控除もかんたんに。e-Tax連携で最大控除額を実現。',
      free: false,
    });
  }

  return ctas;
}

export default function CTASection({ result, input }: Props) {
  const ctas = buildCTAs(result, input);

  if (ctas.length === 0) return null;

  const handleClick = (key: string) => {
    trackEvent('affiliate_click', { link_key: key });
  };

  return (
    <div className="mt-8 mb-10 bg-gradient-to-br from-brand-50 to-brand-50 border border-brand-200 rounded-2xl p-5">
      <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-1">Next Action</p>
      <h3 className="text-base font-bold text-gray-900 mb-4">節税を実現するために、今すぐできること</h3>
      <div className="flex flex-col gap-3">
        {ctas.map(cta => {
          const link = AFFILIATE_LINKS[cta.key];
          if (!link) return null;
          return (
            <a
              key={cta.key}
              href={link.url}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => handleClick(cta.key)}
              className="flex items-center justify-between gap-3 bg-white border border-brand-100 rounded-xl px-4 py-4 hover:border-brand-400 hover:shadow-md transition-all"
            >
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm mb-0.5">{cta.heading}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{cta.desc}</p>
              </div>
              <span className="shrink-0 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap">
                {cta.free ? '無料で試す →' : '詳しく見る →'}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
