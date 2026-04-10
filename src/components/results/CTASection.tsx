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
};

function buildCTAs(result: DiagnosisResult, input: UserInput): CTAItem[] {
  const ctas: CTAItem[] = [];
  const deductionIds = result.deductions.map(d => d.id);

  if (deductionIds.includes('furusato')) {
    ctas.push({
      key: 'furusato_satofuru',
      heading: 'まずはふるさと納税から始めよう',
      desc: 'さとふるで上限額を無料シミュレーション。返礼品を受け取りながら節税できます。',
    });
    ctas.push({
      key: 'furusona',
      heading: 'ふるさと納税AIで最適な返礼品を探す',
      desc: '姉妹サービス furusona が、あなたにぴったりの返礼品をAIで提案します。',
    });
  }

  if (deductionIds.includes('ideco')) {
    ctas.push({
      key: 'ideco_matsui',
      heading: 'iDeCoで毎年数万円を節税',
      desc: '松井証券のiDeCoは運営管理手数料0円。業界最多水準の商品ラインナップで、創業100年の安心感。今すぐ開設できます。',
    });
  }

  if (deductionIds.includes('life_insurance')) {
    ctas.push({
      key: 'insurance_review',
      heading: '保険の見直しで節税＋保障を最適化',
      desc: '保険見直しラボで無料相談。生命保険料控除の枠を最大限活用できます。',
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
    });
  }

  if (input.workStyle === 'freelance' || input.workStyle === 'employee_side') {
    ctas.push({
      key: 'accounting_freee',
      heading: '青色申告はfreeeで楽に完結',
      desc: 'freeeなら確定申告・青色申告65万円控除もかんたんに。e-Tax連携で最大控除額を実現。',
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
    <div className="mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4">次のアクション</h3>
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
              className="block border border-blue-200 rounded-xl px-4 py-4 hover:bg-blue-50 transition-colors"
            >
              <p className="font-semibold text-blue-700 mb-1 text-sm">{cta.heading}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{cta.desc}</p>
              <p className="text-xs text-blue-500 mt-1">→ {link.label}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
