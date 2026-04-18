import Link from 'next/link';
import DiagnosisMenuCard from '@/components/common/DiagnosisMenuCard';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata({
  title: 'あなたはどこで損してる？7つの節税診断メニュー',
  description:
    '医療費・共働き・退職金・副業・相続・ふるさと納税・不動産売却。あなたが損しているポイントを7つの無料診断で見つけます。30秒で結果がわかります。',
  path: '/tools',
});

const DIAGNOSES = [
  {
    href: '/medical-check',
    icon: '💊',
    title: '医療費 取り戻し診断',
    description:
      '年間の医療費とOTC医薬品購入額を入力するだけで、医療費控除とセルフメディケーション税制どちらが得かを自動判定。還付額の差まで計算します。',
    target: '子育て世帯・共働き夫婦（30〜45歳）',
    available: true,
  },
  {
    href: '/tomobataraki',
    icon: '👨‍👩‍👧',
    title: '共働き 損してる診断',
    description:
      '夫婦の年収・子の年齢・住宅ローンを入力するだけで、扶養控除・住宅ローン控除・保険料控除の最適な振り分けを自動提案。',
    target: '共働き夫婦（30〜45歳、子持ち）',
    available: true,
  },
  {
    href: '/taishoku-sim',
    icon: '🏖️',
    title: '退職金 取られすぎ診断',
    description:
      '退職金とiDeCoの受取順序・受取時期を変えるだけで税金が数百万円変わることも。最適な受取パターンを自動シミュレーション。',
    target: '退職5年前〜退職直後（50〜65歳）',
    available: true,
  },
  {
    href: '/fukugyou-shindan',
    icon: '💻',
    title: '副業 払いすぎ診断',
    description:
      '副業収入・経費・本業年収を入力して、確定申告の要否・節税ポイント・損益通算の可否を自動判定。払いすぎた税金の取り戻し方まで提案。',
    target: '副業をしている会社員（25〜45歳）',
    available: true,
  },
  {
    href: '/souzoku',
    icon: '🏠',
    title: '相続税 取られすぎ診断',
    description:
      '財産総額・相続人数を入力するだけで相続税の概算額と節税対策を提案。生前贈与・小規模宅地等の特例も考慮した取られすぎ回避の戦略を可視化。',
    target: '親が60歳以上の方・財産保有者（40〜70歳）',
    available: true,
  },
  {
    href: '/furusato-limit',
    icon: '🎁',
    title: 'ふるさと納税 損してる診断',
    description:
      '住宅ローン控除・iDeCo・医療費控除の併用で上限が下がるケースに対応した正確な上限額を計算。自己負担2,000円を超えて損していないかチェック。',
    target: 'ふるさと納税をしている・検討中の方',
    available: true,
  },
  {
    href: '/fudousan-baikyaku',
    icon: '🏘️',
    title: 'マイホーム売却 取られすぎ診断',
    description:
      '売却価格・取得費・居住年数を入力して、譲渡所得税の概算と3,000万円特別控除の適用可否を自動判定。特例で税金ゼロにできるか瞬時に判定。',
    target: '不動産の売却を検討している方（40〜60歳）',
    available: true,
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold text-brand-600 mb-2">無料・30秒・登録不要</p>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          あなたはどこで損してる？
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          気になるテーマを選ぶだけ。<br className="sm:hidden" />
          損しているポイントを7つの診断で見つけます。
        </p>
      </div>

      <div className="space-y-4">
        {DIAGNOSES.map(d => (
          <DiagnosisMenuCard key={d.href} {...d} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-base text-gray-600 mb-3">まずは全体像をつかみたい方はこちら</p>
        <Link
          href="/"
          className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-base px-8 py-4 rounded-xl transition-colors shadow-sm"
        >
          税金払いすぎ診断（基本版）を使う →
        </Link>
      </div>
    </div>
  );
}
