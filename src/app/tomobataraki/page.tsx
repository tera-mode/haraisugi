import { buildPageMetadata } from '@/lib/seo/metadata';
import { getNicheDiagnosisLD } from '@/lib/seo/structured-data';
import NicheDiagnosisPageShell from '@/components/diagnosis/shared/NicheDiagnosisPageShell';
import TomobatarakiForm from '@/components/diagnosis/tomobataraki/TomobatarakiForm';

export const metadata = buildPageMetadata({
  title: '共働き世帯の扶養・控除 最適配分診断｜年末調整で損をしない方法',
  description:
    '夫婦の年収・子の年齢・保険加入状況を入力するだけで、扶養控除を夫婦どちらに入れると得かを自動診断。年間数万円の節税につながるケースも。',
  path: '/tomobataraki',
});

export default function TomobatarakiPage() {
  const ld = getNicheDiagnosisLD({
    name: '共働き世帯の扶養・控除 最適配分診断',
    description: '夫婦の年収・子の年齢・保険加入状況を入力するだけで、扶養控除を夫婦どちらに入れると得かを自動診断。',
    path: '/tomobataraki',
  });

  return (
    <NicheDiagnosisPageShell
      ld={ld}
      seoContent={
        <>
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">共働き世帯が損をしやすい「扶養控除の申告先」とは？</h2>
            <p className="leading-relaxed">
              年末調整で子どもや高齢の親の扶養控除を「なんとなく夫側に入れている」という家庭は多いですが、
              実は<strong>年収（税率）が高い方に扶養を入れるほど節税効果が大きく</strong>なります。
              夫婦の所得税率が異なる場合、申告先を変えるだけで年間数万円の差が生じることもあります。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">19〜22歳の子は「特定扶養控除63万円」が使える</h2>
            <p className="leading-relaxed">
              大学生世代（19〜22歳）の子は、一般扶養控除38万円ではなく<strong>特定扶養控除63万円</strong>が適用されます。
              所得税率20%の親なら差額25万円×20%=5万円の追加節税が可能です。
              2026年改正で子の収入上限が103万円から150万円に拡大され、アルバイトをしている子でも適用されやすくなりました。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">保険料控除は夫婦それぞれが3枠持てる</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>一般生命保険料控除（最大4万円）</li>
              <li>介護医療保険料控除（最大4万円）</li>
              <li>個人年金保険料控除（最大4万円）</li>
            </ul>
            <p className="leading-relaxed mt-2">
              夫婦それぞれがこの3枠を持つため、最大で合計6枠の控除が可能です。
              空き枠がある場合、対象保険への加入を検討することで追加の節税につながります。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">70歳以上の親の扶養控除は同居か別居かで変わる</h2>
            <p className="leading-relaxed">
              70歳以上の親を扶養に入れる場合、<strong>同居なら「同居老親等控除」で所得税58万円</strong>、
              <strong>別居なら「老人扶養控除」で48万円</strong>が控除されます。
              夫婦どちらの扶養に入れるかによって節税額が異なるため、年収が高い（税率が高い）方に申告するのが原則です。
            </p>
          </div>
        </>
      }
    >
      <TomobatarakiForm />
    </NicheDiagnosisPageShell>
  );
}
