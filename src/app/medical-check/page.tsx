import { buildPageMetadata } from '@/lib/seo/metadata';
import { getNicheDiagnosisLD } from '@/lib/seo/structured-data';
import NicheDiagnosisPageShell from '@/components/diagnosis/shared/NicheDiagnosisPageShell';
import MedicalCheckForm from '@/components/diagnosis/medical-check/MedicalCheckForm';

export const metadata = buildPageMetadata({
  title: '医療費 取り戻し診断｜医療費控除とセルフメディケーション税制どっちが得？',
  description:
    '無料・登録不要。年間の医療費とOTC医薬品購入額を入力するだけで、あなたに有利な制度を自動判定。還付額の差額まで計算します。',
  path: '/medical-check',
});

export default function MedicalCheckPage() {
  const ld = getNicheDiagnosisLD({
    name: '医療費 取り戻し診断',
    description: '年間の医療費とOTC医薬品購入額を入力するだけで、あなたに有利な制度を自動判定。還付額の差額まで計算します。',
    path: '/medical-check',
  });

  return (
    <NicheDiagnosisPageShell
      ld={ld}
      seoContent={
        <>
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">医療費控除とセルフメディケーション税制とは？</h2>
            <p className="leading-relaxed">
              医療費控除は年間の医療費が10万円（総所得200万円未満の場合は総所得×5%）を超えた場合に使える所得控除です。
              一方、セルフメディケーション税制はスイッチOTC医薬品の購入額が年間1万2千円を超えた場合に利用できる控除です。
              <strong>両制度は併用できないため</strong>、どちらが有利かを判断して申告する必要があります。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">セルフメディケーション税制の「特定の取組み」とは</h2>
            <p className="leading-relaxed">
              セルフメディケーション税制を利用するには、その年に「健康の保持増進や疾病の予防への取り組み」を行っていることが条件です。
              会社の定期健康診断、市区町村の特定健診、インフルエンザ予防接種、がん検診、人間ドックなどが該当します。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">どちらが得かの判定ポイント</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>年間医療費が10万円を大きく超える場合 → 医療費控除が有利なことが多い</li>
              <li>医療費は少ないがドラッグストアでよく薬を購入する場合 → セルフメディケーションが有利な場合がある</li>
              <li>総所得が200万円未満 → 医療費控除の足切りが有利になる（5%ルール）</li>
            </ul>
          </div>
        </>
      }
    >
      <MedicalCheckForm />
    </NicheDiagnosisPageShell>
  );
}
