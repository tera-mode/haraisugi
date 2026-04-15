import type { Metadata } from 'next';
import Link from 'next/link';
import DiagnosisMenuCard from '@/components/common/DiagnosisMenuCard';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: '節税診断メニュー一覧',
  description:
    '医療費控除・共働き控除・退職金・副業・相続・ふるさと納税・不動産売却など、7つのニッチ節税シミュレーションを無料で利用できます。',
  alternates: {
    canonical: `${SITE_URL}/tools`,
  },
};

const DIAGNOSES = [
  {
    href: '/medical-check',
    icon: '💊',
    title: '医療費控除 vs セルフメディケーション判定',
    description:
      '年間の医療費とOTC医薬品購入額を入力するだけで、あなたに有利な制度を自動判定。還付額の差額まで計算します。',
    target: '子育て世帯・共働き夫婦（30〜45歳）',
    available: true,
  },
  {
    href: '/tomobataraki',
    icon: '👨‍👩‍👧',
    title: '共働き世帯の扶養・控除 最適配分診断',
    description:
      '夫婦の年収・子の年齢・住宅ローンを入力するだけで、扶養控除・住宅ローン控除・保険料控除の最適な振り分けを自動提案。',
    target: '共働き夫婦（30〜45歳、子持ち）',
    available: true,
  },
  {
    href: '/taishoku-sim',
    icon: '🏖️',
    title: '退職金・iDeCo 受取戦略シミュレーション',
    description:
      '退職金とiDeCoの受取順序・受取時期を変えるだけで税金が大きく変わります。最適な受取パターンをシミュレーション。',
    target: '退職5年前〜退職直後（50〜65歳）',
    available: true,
  },
  {
    href: '/fukugyou-shindan',
    icon: '💻',
    title: '副業の申告判定・節税シミュレーション',
    description:
      '副業収入・経費・本業年収を入力して、確定申告の要否・節税ポイント・損益通算の可否を自動判定。',
    target: '副業をしている会社員（25〜45歳）',
    available: true,
  },
  {
    href: '/souzoku',
    icon: '🏠',
    title: '相続税 かんたん試算',
    description:
      '財産総額・相続人数・基礎控除を入力するだけで相続税の概算額と節税対策を提案。生前贈与・小規模宅地等の特例も考慮。',
    target: '親が60歳以上の方・財産保有者（40〜70歳）',
    available: true,
  },
  {
    href: '/furusato-limit',
    icon: '🎁',
    title: 'ふるさと納税 上限額シミュレーション（控除併用対応）',
    description:
      '住宅ローン控除・iDeCo・医療費控除などを考慮した正確なふるさと納税上限額を計算。控除の組み合わせで上限が下がるケースも対応。',
    target: 'ふるさと納税をしている・検討中の方',
    available: true,
  },
  {
    href: '/fudousan-baikyaku',
    icon: '🏘️',
    title: '不動産売却 税金シミュレーション',
    description:
      '売却価格・取得費・居住年数を入力して、譲渡所得税の概算額と3,000万円特別控除の適用可否を自動判定。',
    target: '不動産の売却を検討している方（40〜60歳）',
    available: true,
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">節税診断メニュー</h1>
        <p className="text-sm text-gray-500">
          あなたの状況に合わせた無料シミュレーションツール
        </p>
      </div>

      <div className="space-y-3">
        {DIAGNOSES.map(d => (
          <DiagnosisMenuCard key={d.href} {...d} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500 mb-2">まずは基本の控除を確認したい方はこちら</p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3 rounded-xl transition-colors"
        >
          税金払いすぎ診断（基本版）を使う →
        </Link>
      </div>
    </div>
  );
}
