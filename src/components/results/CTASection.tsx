'use client';

import type { DiagnosisResult, UserInput } from '@/lib/diagnosis/types';
import AffiliateCTACard from '@/components/common/AffiliateCTACard';

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
      key: 'insurance_mitsumoto',
      heading: '保険の見直しで節税＋保障を最適化',
      desc: '保険見直し本舗の無料相談は全国対応・何度でも無料。生命保険料控除の枠を最大限活用できます。',
      free: true,
    });
  }

  const hasComplex = result.deductions.some(d =>
    ['specific_expense', 'stock_loss', 'casualty_loss', 'donation'].includes(d.id)
  );
  if (hasComplex) {
    ctas.push({
      key: 'tax_accountant_keiei',
      heading: '複雑な控除は税理士に相談',
      desc: '会社設立・法人化も含む税務相談なら税理士法人経営サポートプラスアルファへ。初回無料で対応。',
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

  return (
    <div className="mt-8 mb-10 bg-gradient-to-br from-brand-50 to-brand-50 border border-brand-200 rounded-2xl p-5">
      <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-1">Next Action</p>
      <h3 className="text-base font-bold text-gray-900 mb-4">節税を実現するために、今すぐできること</h3>
      <div className="flex flex-col gap-3">
        {ctas.map(cta => (
          <AffiliateCTACard
            key={cta.key}
            linkKey={cta.key}
            heading={cta.heading}
            desc={cta.desc}
            diagnosisName="result"
            variant="cta"
            free={cta.free}
          />
        ))}
      </div>
    </div>
  );
}
