import { buildPageMetadata } from '@/lib/seo/metadata';
import { getNicheDiagnosisLD } from '@/lib/seo/structured-data';
import NicheDiagnosisPageShell from '@/components/diagnosis/shared/NicheDiagnosisPageShell';
import FukugyouForm from '@/components/diagnosis/fukugyou-shindan/FukugyouForm';

export const metadata = buildPageMetadata({
  title: '副業の確定申告、あなたは必要？事業所得vs雑所得も判定',
  description:
    '副業の種類・収入額・経費を入力するだけで、確定申告の要否・所得区分・最適な申告方法を自動判定。住民税の申告義務や損益通算・青色申告特別控除も診断。',
  path: '/fukugyou-shindan',
});

export default function FukugyouShindanPage() {
  const ld = getNicheDiagnosisLD({
    name: '副業の確定申告 要否・最適申告判定',
    description: '副業の種類・収入額・経費を入力するだけで、確定申告の要否・所得区分・最適な申告方法を自動判定。',
    path: '/fukugyou-shindan',
  });

  return (
    <NicheDiagnosisPageShell
      ld={ld}
      seoContent={
        <>
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">副業所得20万円以下でも確定申告が必要なケース</h2>
            <p className="leading-relaxed">
              「副業収入が20万円以下なら確定申告は不要」というルールは<strong>所得税の確定申告に限った話</strong>です。
              住民税は1円でも副業所得が発生した場合、お住まいの市区町村への申告義務があります。
              また、本業以外に医療費控除や住宅ローン控除がある場合、副業所得が20万円以下でも
              確定申告に含めなければなりません。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">事業所得と雑所得の違い（2022年国税庁改正）</h2>
            <p className="leading-relaxed">
              2022年の国税庁通達改正により、副業の所得区分の判断基準が明確化されました。
              収入300万円以下で帳簿の保存がない場合は原則「雑所得」として扱われます。
              一方で<strong>帳簿保存・継続性・開業届の提出</strong>があれば300万円以下でも事業所得として認められる場合があります。
              事業所得では赤字の場合に給与所得と<strong>損益通算</strong>ができ、大きな節税につながります。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">青色申告特別控除65万円を得るための条件</h2>
            <p className="leading-relaxed">
              青色申告65万円控除を受けるには以下の3条件がすべて必要です。
            </p>
            <ul className="space-y-1 list-disc list-inside mt-2">
              <li>開業届と青色申告承認申請書を税務署に提出していること</li>
              <li>複式簿記で帳簿をつけていること（freee・マネーフォワードで対応可）</li>
              <li>e-Tax（電子申告）で確定申告を行うこと</li>
            </ul>
            <p className="leading-relaxed mt-2">
              年収500万円の方なら65万円控除で最大約13万円の節税効果があります。
              複式簿記が不要な10万円控除（簡易簿記）でも約2万円の節税になります。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">副業が会社にバレないための住民税の普通徴収</h2>
            <p className="leading-relaxed">
              確定申告の際、住民税の徴収方法を「<strong>普通徴収</strong>」（自分で払う）に指定すると、
              副業分の住民税が会社の給与から天引きされなくなります。
              申告書の「給与所得以外の住民税の徴収方法の選択」欄で「自分で納付」を選択してください。
              ただし普通徴収も市区町村に副業所得の情報は届きます。
              会社への情報漏洩防止には効果がありますが、申告自体を省略することはできません。
            </p>
          </div>
        </>
      }
    >
      <FukugyouForm />
    </NicheDiagnosisPageShell>
  );
}
