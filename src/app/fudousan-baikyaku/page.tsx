import { buildPageMetadata } from '@/lib/seo/metadata';
import { getNicheDiagnosisLD } from '@/lib/seo/structured-data';
import NicheDiagnosisPageShell from '@/components/diagnosis/shared/NicheDiagnosisPageShell';
import FudousanForm from '@/components/diagnosis/fudousan-baikyaku/FudousanForm';

export const metadata = buildPageMetadata({
  title: '不動産を売ったら税金いくら？特例で0円にできるか診断',
  description:
    '売却額・取得費・所有期間・居住状況を入力するだけで、譲渡所得税の概算と適用可能な特例を自動判定。3,000万円特別控除・10年超軽減税率・相続不動産の取得費加算も対応。',
  path: '/fudousan-baikyaku',
});

export default function FudousanBaikyakuPage() {
  const ld = getNicheDiagnosisLD({
    name: '不動産売却 税金シミュレーション',
    description:
      '売却額・取得費・所有期間・居住状況から、譲渡所得税の概算と適用可能な特例を自動診断します。',
    path: '/fudousan-baikyaku',
  });

  return (
    <NicheDiagnosisPageShell
      ld={ld}
      seoContent={
        <>
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">不動産売却にかかる税金（譲渡所得税）の基本</h2>
            <p className="leading-relaxed">
              不動産を売却して利益が出ると「譲渡所得」として課税されます。
              <strong>譲渡所得 ＝ 売却価格 − （取得費 ＋ 譲渡費用）</strong>で計算し、
              所有期間が売却年の1月1日時点で5年超なら長期譲渡（税率20.315%）、
              5年以下なら短期譲渡（税率39.63%）が適用されます。
              取得費が不明な場合は売却価格の5%を概算取得費として使えます。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">マイホーム売却は3,000万円特別控除で大幅節税</h2>
            <p className="leading-relaxed">
              自分が住んでいたマイホーム（居住用財産）を売る場合、
              <strong>譲渡所得から最大3,000万円を控除</strong>できる特別控除があります。
              3,000万円以内の利益なら税額ゼロになる強力な制度です。
              転居後3年を経過する年の12月31日までに売却する必要があります。
              また所有期間が10年超の場合は、3,000万円控除後の残りにさらに軽減税率（6,000万円以下の部分：14.21%）が適用されます。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">相続した不動産を売る場合の特例</h2>
            <p className="leading-relaxed">
              相続した不動産を売却する際は、被相続人（亡くなった方）の取得費を引き継ぎます。
              さらに<strong>相続開始日から3年10ヶ月以内に売却</strong>した場合、
              支払った相続税の一部を取得費に加算できる「取得費加算の特例」が使えます。
              この特例で譲渡所得が減り、税額を大幅に圧縮できる場合があります。
              また、亡くなった親が住んでいた空き家を相続して売る場合は「相続空き家の3,000万円特別控除」も検討できます。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">売却損が出た場合は損益通算で税金を取り戻せる</h2>
            <p className="leading-relaxed">
              マイホームの売却で損失が出た場合、<strong>給与所得等と損益通算</strong>できる場合があります。
              売った年の他の所得と相殺できるだけでなく、控除しきれない損失は
              翌年以降3年間繰り越せます（確定申告が必要）。
              ただし投資用不動産の売却損は原則として他の所得との損益通算はできません。
            </p>
          </div>
        </>
      }
    >
      <FudousanForm />
    </NicheDiagnosisPageShell>
  );
}
