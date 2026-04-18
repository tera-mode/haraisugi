import { buildPageMetadata } from '@/lib/seo/metadata';
import { getNicheDiagnosisLD } from '@/lib/seo/structured-data';
import NicheDiagnosisPageShell from '@/components/diagnosis/shared/NicheDiagnosisPageShell';
import FurusatoLimitForm from '@/components/diagnosis/furusato-limit/FurusatoLimitForm';

export const metadata = buildPageMetadata({
  title: 'ふるさと納税の本当の上限額は？iDeCo・住宅ローン控除を加味して正確計算',
  description:
    '他の控除（iDeCo・住宅ローン控除・医療費控除）を加味した正確なふるさと納税上限額を計算。多くの簡易計算機では考慮されない併用影響を反映。',
  path: '/furusato-limit',
});

export default function FurusatoLimitPage() {
  const ld = getNicheDiagnosisLD({
    name: 'ふるさと納税 上限額シミュレーション（控除併用対応）',
    description:
      'iDeCo・住宅ローン控除・医療費控除を加味した正確なふるさと納税上限額を計算します。',
    path: '/furusato-limit',
  });

  return (
    <NicheDiagnosisPageShell
      ld={ld}
      seoContent={
        <>
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">ふるさと納税の上限額の計算式</h2>
            <p className="leading-relaxed">
              ふるさと納税の自己負担を2,000円に抑えられる上限額は、
              <strong>住民税所得割額×20% ÷（90%−所得税率×1.021）＋2,000円</strong>
              で計算されます。分母の「90%−所得税率」は住民税の特例分控除率です。
              所得税率が高いほど特例分控除率が下がるため、上限額の伸びが鈍くなります。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">iDeCoとふるさと納税を併用すると上限が下がる理由</h2>
            <p className="leading-relaxed">
              iDeCoの掛金は全額「小規模企業共済等掛金控除」として所得控除されます。
              その結果、課税所得が下がり所得税率が変わる場合や、住民税課税所得が下がって
              住民税所得割額が減ります。住民税所得割額が減ると、ふるさと納税の上限計算の
              分子（住民税所得割×20%）が小さくなるため、上限額がわずかに下がります。
              ただし<strong>iDeCoの節税効果はふるさと納税よりはるかに大きい</strong>ため、
              iDeCoを優先して継続しながらふるさと納税の上限を計算し直すのが最善です。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">住宅ローン控除との関係</h2>
            <p className="leading-relaxed">
              住宅ローン控除（住宅借入金等特別控除）は税額控除のため、所得税から全額引ける場合は
              ふるさと納税の上限に影響しません。しかし<strong>所得税額から控除しきれない分は
              住民税から差し引かれます</strong>（上限: 住民税所得割額の5%または97,500円）。
              住宅ローン控除が住民税から差し引かれると、ふるさと納税の特例分上限枠
              （住民税所得割×20%）の計算ベースが実質的に小さくなるため、上限額が下がります。
              住宅購入直後の数年間は特に注意が必要です。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">ワンストップ特例と確定申告の使い分け</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>ワンストップ特例</strong>: 給与所得者で寄付先が5自治体以内の場合に利用可。
                各自治体に申請書を送るだけで確定申告不要。ただし所得税からの還付はなく、
                全額を住民税から控除。
              </li>
              <li>
                <strong>確定申告</strong>: 寄付先が6自治体以上の場合や、医療費控除等で
                元々確定申告が必要な場合はこちら。所得税＋住民税の両方から控除。
                ワンストップ特例を利用していても医療費控除で確定申告する場合は、
                寄付金控除を確定申告書に含める必要があります。
              </li>
            </ul>
          </div>
        </>
      }
    >
      <FurusatoLimitForm />
    </NicheDiagnosisPageShell>
  );
}
