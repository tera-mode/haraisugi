import { buildPageMetadata } from '@/lib/seo/metadata';
import { getNicheDiagnosisLD } from '@/lib/seo/structured-data';
import NicheDiagnosisPageShell from '@/components/diagnosis/shared/NicheDiagnosisPageShell';
import TaishokuForm from '@/components/diagnosis/taishoku-sim/TaishokuForm';

export const metadata = buildPageMetadata({
  title: '退職金 取られすぎ診断｜退職金・iDeCoの最適な受取方法をシミュレーション',
  description:
    '無料・登録不要。勤続年数・退職金額・iDeCo残高を入力して、一時金・年金・時間差受取の3パターンの税額を自動比較。5年ルール・19年ルールも解説。',
  path: '/taishoku-sim',
});

export default function TaishokuSimPage() {
  const ld = getNicheDiagnosisLD({
    name: '退職金 取られすぎ診断',
    description: '勤続年数・退職金額・iDeCo残高を入力して、一時金・年金・時間差受取の3パターンの税額を自動比較。',
    path: '/taishoku-sim',
  });

  return (
    <NicheDiagnosisPageShell
      ld={ld}
      seoContent={
        <>
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">退職金の税金は「退職所得控除」で大幅に軽減できる</h2>
            <p className="leading-relaxed">
              退職金は<strong>退職所得控除</strong>と<strong>1/2課税</strong>という二重の優遇を受けられる特別な所得です。
              勤続20年超なら控除額は「800万円＋70万円×（勤続年数−20年）」と急増し、
              勤続30年なら1,500万円、35年なら1,850万円の控除が適用されます。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">iDeCoと退職金の「5年ルール」とは？</h2>
            <p className="leading-relaxed">
              iDeCoを一時金で受け取り、その後4年以内に退職金も受け取ると退職所得控除が重複し片方しか使えません。
              しかし<strong>5年以上（4年超）空ければ独立した退職所得控除を二重に活用</strong>できます。
              iDeCo加入20年・勤続30年なら合計2,300万円超の控除が可能になるケースもあります。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">iDeCoを年金形式で受け取る場合の税金</h2>
            <p className="leading-relaxed">
              iDeCoを「年金」として受け取ると、公的年金（国民年金・厚生年金）と合算して<strong>公的年金等控除</strong>が適用されます。
              65歳以上なら年110万円、65歳未満なら年60万円が控除されます。
              ただし公的年金が多い方は合算により課税対象が増える場合があるため、シミュレーションで確認が重要です。
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">受取方法を決める前に確認すべきこと</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>退職所得の受給に関する申告書を勤務先・iDeCo運営管理機関に提出する</li>
              <li>iDeCoの受取開始は原則60歳（加入期間10年未満は繰り下げあり）</li>
              <li>複数の退職金（転職先・役員退職金等）がある場合は個別に計算が必要</li>
              <li>障害者として退職する場合は控除額に100万円が加算される</li>
            </ul>
          </div>
        </>
      }
    >
      <TaishokuForm />
    </NicheDiagnosisPageShell>
  );
}
