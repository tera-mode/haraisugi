import { buildPageMetadata } from '@/lib/seo/metadata';
import { getNicheDiagnosisLD } from '@/lib/seo/structured-data';
import NicheDiagnosisPageShell from '@/components/diagnosis/shared/NicheDiagnosisPageShell';
import SouzokuForm from '@/components/diagnosis/souzoku/SouzokuForm';

export const metadata = buildPageMetadata({
  title: 'うちは相続税かかる？3分でわかる相続税シミュレーション',
  description:
    '相続人の構成と財産の概算を入力するだけで、相続税の概算額と使える特例・控除を自動診断。基礎控除・配偶者軽減・小規模宅地特例・生命保険非課税枠も考慮。',
  path: '/souzoku',
});

export default function SouzokuPage() {
  const ld = getNicheDiagnosisLD({
    name: '相続税 かんたん試算',
    description: '相続人の構成と財産の概算を入力するだけで、相続税の概算額と使える特例・控除を自動診断。',
    path: '/souzoku',
  });

  return (
    <NicheDiagnosisPageShell
      ld={ld}
      seoContent={
        <>
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">相続税の基礎控除と課税対象の判定</h2>
            <p className="leading-relaxed">
              相続税は財産総額が<strong>基礎控除額（3,000万円＋600万円×法定相続人数）</strong>を超える場合に発生します。
              配偶者と子2人の場合の基礎控除は4,200万円です。
              多くの家庭では基礎控除内に収まりますが、不動産を含む場合は注意が必要です。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">配偶者の税額軽減と二次相続の問題</h2>
            <p className="leading-relaxed">
              配偶者が取得する財産が<strong>1億6,000万円以下</strong>、または<strong>法定相続分以下</strong>であれば、
              相続税はかかりません。ただし配偶者が亡くなった際の「二次相続」では配偶者控除が使えないため、
              一次相続の分割方法を慎重に検討することが重要です。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">小規模宅地等の特例で土地評価額を最大80%減額</h2>
            <p className="leading-relaxed">
              被相続人が居住していた土地（330㎡以内）を同居の親族が相続する場合、
              土地の相続税評価額を<strong>最大80%減額</strong>できます。
              路線価3,000万円の土地が600万円に圧縮されるため、相続税額に大きな影響を与えます。
              別居の子が相続する場合は原則適用外ですが、「家なき子特例」が使えるケースもあります。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">生前対策で相続税を減らす方法</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>年間110万円の暦年贈与（2024年改正で持ち戻し期間が7年に延長）</li>
              <li>生命保険の活用（500万円×相続人数の非課税枠）</li>
              <li>相続時精算課税制度（2500万円まで贈与税0円、ただし相続時に合算）</li>
              <li>小規模宅地特例を使えるよう同居・家屋の整理を事前に検討</li>
            </ul>
          </div>
        </>
      }
    >
      <SouzokuForm />
    </NicheDiagnosisPageShell>
  );
}
