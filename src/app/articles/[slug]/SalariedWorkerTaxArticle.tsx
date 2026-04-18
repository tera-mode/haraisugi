import Link from 'next/link';

const CTA = ({ label = '無料で診断する →' }: { label?: string }) => (
  <div className="my-8 bg-brand-600 rounded-2xl px-6 py-5 text-center text-white">
    <p className="text-base font-bold mb-1">あなたの控除漏れを3分で診断【無料】</p>
    <p className="text-sm opacity-90 mb-4">年収・家族構成を入力するだけ。見落とし控除を今すぐ確認。</p>
    <Link
      href="/"
      className="inline-block bg-white text-brand-700 font-bold text-sm px-7 py-2.5 rounded-xl hover:bg-brand-50 transition-colors"
    >
      {label}
    </Link>
  </div>
);

const InfoBox = ({
  type = 'tip',
  children,
}: {
  type?: 'tip' | 'warn' | 'check';
  children: React.ReactNode;
}) => {
  const styles = {
    tip: 'bg-brand-50 border-brand-200 text-brand-900',
    warn: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    check: 'bg-green-50 border-green-200 text-green-900',
  };
  const icons = { tip: '💡', warn: '⚠️', check: '✅' };
  return (
    <div className={`border rounded-xl px-5 py-4 my-4 text-base leading-relaxed ${styles[type]}`}>
      <span className="mr-1">{icons[type]}</span>
      {children}
    </div>
  );
};

export default function SalariedWorkerTaxArticle() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      {/* ─── ヘッダー情報 ─── */}
      <div className="mb-3">
        <span className="text-xs bg-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full font-medium">
          サラリーマン節税
        </span>
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">
        サラリーマンの節税対策14選｜会社員が今すぐ使える控除を完全解説【2026年版】
      </h1>
      <p className="text-sm text-gray-400 mb-6">最終更新日：2026年4月7日</p>

      {/* ─── 導入 ─── */}
      <section className="mb-6 text-base leading-7 text-gray-700">
        <p className="mb-3">
          「年末調整は毎年出しているのに、なぜか税金が多い気がする——」
          そう感じているサラリーマンは少なくありません。実は、<strong>会社員でも使える控除は14種類以上</strong>あり、
          年末調整だけでは申告できないものが多数存在します。
        </p>
        <p className="mb-3">
          この記事では、年収500〜1,000万の会社員が<strong>今すぐ実践できる節税対策を14個</strong>厳選し、
          年収別の節税シミュレーションとともに解説します。
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mb-4">
          <p className="font-bold text-gray-800 mb-2 text-base">この記事でわかること</p>
          <ul className="list-none space-y-1 text-base text-gray-700">
            <li>✔ 年末調整では取れない控除の一覧</li>
            <li>✔ 年収500万・700万・1,000万別の節税シミュレーション</li>
            <li>✔ 会社員が使いやすい順番に並べた14の節税手段</li>
          </ul>
        </div>
      </section>

      <CTA label="まず無料診断で控除漏れをチェック →" />

      {/* ─── H2: 基本解説 ─── */}
      <section className="mb-10">
        <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 border-b-2 border-brand-500 pb-1">
          会社員の節税とは？年末調整と確定申告の違い
        </h2>
        <p className="text-base leading-7 text-gray-700 mb-4">
          多くの会社員は「節税＝年末調整」と思い込んでいますが、年末調整で申告できるのは限られた控除のみです。
          医療費控除・セルフメディケーション税制・ふるさと納税（ワンストップ特例を使わない場合）・
          雑損控除などは<strong>必ず確定申告が必要</strong>です。
        </p>

        <div className="overflow-x-auto my-5">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-600 text-white">
                <th className="text-left px-3 py-2 rounded-tl-lg">控除の種類</th>
                <th className="px-3 py-2 text-center">年末調整</th>
                <th className="px-3 py-2 text-center rounded-tr-lg">確定申告</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                ['生命保険料控除', '○', '○'],
                ['地震保険料控除', '○', '○'],
                ['扶養控除・配偶者控除', '○', '○'],
                ['住宅ローン控除（2年目以降）', '○', '○'],
                ['ふるさと納税（ワンストップ）', '○', '—'],
                ['医療費控除', '—', '○'],
                ['セルフメディケーション税制', '—', '○'],
                ['特定支出控除', '—', '○'],
                ['住宅ローン控除（初年度）', '—', '○'],
                ['株式の損益通算', '—', '○'],
                ['雑損控除', '—', '○'],
                ['還付申告（過去5年）', '—', '○'],
              ].map(([name, nenmats, kakutei], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium">{name}</td>
                  <td className="px-3 py-2 text-center text-brand-600 font-bold">{nenmats}</td>
                  <td className="px-3 py-2 text-center text-green-600 font-bold">{kakutei}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InfoBox type="tip">
          年末調整だけでは「医療費控除」「ふるさと納税の確定申告方式」「特定支出控除」などを取りこぼします。
          確定申告を活用することで、さらに数万〜数十万円の還付が得られるケースがあります。
        </InfoBox>
      </section>

      {/* ─── H2: シミュレーション ─── */}
      <section className="mb-10">
        <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 border-b-2 border-brand-500 pb-1">
          年収別シミュレーション｜節税14手段をフル活用すると？
        </h2>
        <p className="text-base leading-7 text-gray-700 mb-4">
          以下は、独身会社員が主要な節税手段をすべて活用した場合の試算です（住民税込み）。
          実際の節税額は家族構成・保険加入状況によって異なります。
        </p>

        <div className="overflow-x-auto my-5">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-600 text-white">
                <th className="text-left px-3 py-2 rounded-tl-lg">節税手段</th>
                <th className="px-3 py-2 text-center">年収500万</th>
                <th className="px-3 py-2 text-center">年収700万</th>
                <th className="px-3 py-2 text-center rounded-tr-lg">年収1,000万</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {[
                ['ふるさと納税（上限額で寄付）', '約6万円分の返礼品', '約10万円分の返礼品', '約17万円分の返礼品'],
                ['iDeCo（月2.3万円）', '年間約5.5万円軽減', '年間約6.3万円軽減', '年間約9.1万円軽減'],
                ['医療費控除（年20万支払い）', '約1.5万円還付', '約1.9万円還付', '約3万円還付'],
                ['生命保険料控除（上限活用）', '約1.2万円軽減', '約1.4万円軽減', '約2万円軽減'],
                ['地震保険料控除（上限5万円）', '約1万円軽減', '約1.15万円軽減', '約1.65万円軽減'],
                ['特定支出控除（条件次第）', '数万〜十数万', '数万〜十数万', '数万〜十数万'],
              ].map(([name, y500, y700, y1000], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium">{name}</td>
                  <td className="px-3 py-2 text-center">{y500}</td>
                  <td className="px-3 py-2 text-center">{y700}</td>
                  <td className="px-3 py-2 text-center">{y1000}</td>
                </tr>
              ))}
              <tr className="bg-brand-50 font-bold text-brand-800">
                <td className="px-3 py-2">合計の目安（主要手段合算）</td>
                <td className="px-3 py-2 text-center">年間10〜20万円</td>
                <td className="px-3 py-2 text-center">年間20〜35万円</td>
                <td className="px-3 py-2 text-center">年間35〜60万円</td>
              </tr>
            </tbody>
          </table>
        </div>

        <InfoBox type="warn">
          上記はあくまで概算です。実際の節税額は所得控除の合計・家族構成・住宅ローン有無などによって大きく変わります。
          正確な金額は「税金払いすぎ診断」でご確認ください。
        </InfoBox>
      </section>

      <CTA label="あなたの年収でシミュレーション →" />

      {/* ─── H2: 14選 ─── */}
      <section className="mb-10">
        <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-6 border-b-2 border-brand-500 pb-1">
          節税対策14選｜今すぐ使えるものから解説
        </h2>

        {/* 1 ふるさと納税 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ① ふるさと納税｜返礼品をもらって控除も受ける
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            自己負担2,000円で全国の自治体に寄付でき、寄付額から2,000円を引いた全額が所得税・住民税から控除される制度です。
            上限額内であれば実質2,000円で肉・魚介・日用品などの返礼品を受け取れます。
          </p>
          <InfoBox type="tip">
            <strong>手続き：</strong>ワンストップ特例（確定申告不要・会社員向け）またはふるさと納税専用ポータルから寄付。
            iDeCoや住宅ローン控除を使っている場合は上限額が下がるため、必ず事前にシミュレーションを。
          </InfoBox>
        </div>

        {/* 2 iDeCo */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ② iDeCo（個人型確定拠出年金）｜掛金が全額所得控除に
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            毎月の掛金（企業型DC未加入の会社員は月最大2.3万円）が<strong>全額所得控除</strong>になります。
            年収700万の会社員が月2.3万円（年27.6万円）を拠出すると、所得税＋住民税で年間約6〜9万円の節税効果があります。
            60歳まで引き出せない点に注意が必要ですが、長期的な節税力は最強クラスです。
          </p>
          <InfoBox type="tip">
            <strong>2024年改正：</strong>企業型DC加入者も原則としてiDeCoへの同時加入が可能になりました（会社の規約確認が必要）。
          </InfoBox>
        </div>

        {/* 3 医療費控除 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ③ 医療費控除｜家族合算で10万円を超えたら確定申告
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            1年間（1〜12月）に支払った医療費が<strong>10万円（または所得の5%）を超えた分</strong>が控除対象になります。
            自分だけでなく、生計を一にする家族全員分を合算できます。
            歯科矯正（大人含む）・出産費用・介護費用・通院交通費（公共交通機関）も対象です。
          </p>
          <InfoBox type="check">
            <strong>裏ワザ：</strong>世帯で医療費が多い場合、所得の低い配偶者名義で申告すると控除率が下がる可能性も。
            所得の高い人が申告した方が還付額は多くなるケースがほとんどです。
          </InfoBox>
        </div>

        {/* 4 セルフメディケーション */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ④ セルフメディケーション税制｜医療費が10万円に届かない人向け
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            健康診断・予防接種など特定の取組みを行い、ドラッグストアなどで「スイッチOTC医薬品」を
            <strong>年間1.2万円超</strong>購入した場合に使える控除です。
            医療費控除とは選択適用（どちらか一方のみ）のため、年間の医療費が10万円未満の健康な会社員に向いています。
          </p>
          <InfoBox type="tip">
            対象薬品はレシートに「★」マークが付いているものが多いです（薬局・ドラッグストアで確認可）。
          </InfoBox>
        </div>

        {/* 5 生命保険料控除 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ⑤ 生命保険料控除｜3つの枠を使い切れているか確認
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            「一般生命保険料」「介護医療保険料」「個人年金保険料」の3枠があり、
            各枠の控除上限は所得税4万円・住民税2.8万円です。3枠すべてを使い切ると
            所得税で最大12万円・住民税で最大7万円の所得控除になります。
            年末調整の控除証明書で各枠に残りがないか確認しましょう。
          </p>
        </div>

        {/* 6 地震保険料控除 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ⑥ 地震保険料控除｜持ち家なら必ずチェック
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            地震保険に加入していれば、支払った保険料の全額（上限5万円）が所得控除になります。
            火災保険に地震オプションをセットしているだけでも対象です。
            控除証明書が届いたら年末調整に必ず添付しましょう。
          </p>
        </div>

        {/* 7 住宅ローン控除 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ⑦ 住宅ローン控除｜ふるさと納税との併用に注意
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            住宅ローン残高の0.7%が所得税から直接控除される（税額控除）非常に強力な制度です。
            ただし、<strong>ふるさと納税の上限額を圧迫する</strong>ため、住宅ローンがある方は必ず
            他の控除との影響を計算したうえでふるさと納税額を決めてください。
          </p>
          <InfoBox type="warn">
            住宅ローン控除で所得税が0円になっている場合、ふるさと納税の住民税控除も本来の上限より下がります。
          </InfoBox>
        </div>

        {/* 8 扶養控除 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ⑧ 扶養控除の最適配置｜共働きはどちらに入れるべきか
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            子どもや親を扶養に入れる場合、所得税率が高い側（収入が多い側）に入れた方が
            控除額あたりの節税効果が大きくなります。
            16歳以上の子どもは38万円（所得税）の扶養控除、
            19〜22歳は63万円の特定扶養控除が使えます。
          </p>
          <InfoBox type="check">
            <strong>2026年の注意点：</strong>「特定親族特別控除」が新設され、大学生アルバイトの年収上限が
            103万円から123万円に引き上げられました。扶養外れを回避できるケースが増えています。
          </InfoBox>
        </div>

        {/* 9 特定支出控除 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ⑨ 特定支出控除｜スーツ代・転勤費用を経費に
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            会社が負担していない業務関連支出が<strong>給与所得控除額の1/2</strong>を超えた場合、
            超えた分を控除できます。スーツ代・資格取得費・単身赴任の帰省費・英会話スクール費用などが対象。
            会社が「業務上必要」と認める証明書（給与支払者の証明）が必要です。
          </p>
          <InfoBox type="tip">
            年収700万の場合、給与所得控除額の1/2は約96万円。支出が96万円を超えた部分が控除対象になります。
            営業職・転勤族・専門職の方は特に要確認。
          </InfoBox>
        </div>

        {/* 10 小規模企業共済 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ⑩ 小規模企業共済｜副業・個人事業主を持つ会社員
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            副業で個人事業主として開業届を出している場合、小規模企業共済（月最大7万円）に加入できます。
            掛金全額が所得控除になるため、iDeCoとのダブル活用で年間最大120万円以上の節税枠を確保できます。
          </p>
        </div>

        {/* 11 配当控除 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ⑪ 配当控除｜年収695万以下なら総合課税が有利
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            上場株式の配当を受けている場合、申告分離課税（20.315%）か総合課税かを選択できます。
            課税所得が695万円以下（目安：年収800万以下）の方は<strong>総合課税＋配当控除</strong>を
            選ぶと実効税率が下がるケースがあります。ただし、健康保険料増加との比較が必要です。
          </p>
        </div>

        {/* 12 雑損控除 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ⑫ 雑損控除｜災害・盗難にあったら忘れずに
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            台風・地震などの自然災害や、盗難・横領による損害が一定額を超える場合に使えます。
            損失額が大きい場合は3年間繰越が可能。災害減免法との有利な方を選択できます。
          </p>
        </div>

        {/* 13 還付申告 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ⑬ 還付申告｜過去5年分の控除漏れを今から取り戻す
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            還付申告（払いすぎた税金を取り戻す申告）は<strong>過去5年分</strong>まで遡れます。
            「医療費控除を申告し忘れていた」「ふるさと納税の確定申告を忘れた」という場合も、
            2026年中であれば2021年分まで申請可能です。
          </p>
          <InfoBox type="check">
            源泉徴収票と医療費の領収書が手元にあれば、e-Taxから5年分まとめて申請できます。
            1年分あたり数万〜十数万円の還付になるケースもあります。
          </InfoBox>
        </div>

        {/* 14 障害者控除・ひとり親控除 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ⑭ 障害者控除・ひとり親控除｜意外な取りこぼしに注意
          </h3>
          <p className="text-base leading-7 text-gray-700 mb-2">
            以下の控除は申告しないと取りこぼす可能性があります：
          </p>
          <ul className="list-disc list-inside text-base leading-7 text-gray-700 mb-2 space-y-1">
            <li>
              <strong>障害者控除</strong>：要介護認定を受けている親が同居・別居にかかわらず
              市区町村に「障害者控除対象者認定書」を申請すると、1人あたり27〜75万円が控除に
            </li>
            <li>
              <strong>ひとり親控除</strong>：未婚・離婚・死別でひとり親の場合35万円控除。
              2026年からは所得制限が1,000万円に緩和予定
            </li>
            <li>
              <strong>寡婦控除</strong>：離婚・死別の女性（ひとり親控除の対象外の場合）で27万円
            </li>
          </ul>
          <InfoBox type="warn">
            要介護の親がいる40〜60代の方は「障害者控除対象者認定書」の存在を知らないケースが非常に多いです。
            市区町村の窓口で無料で申請できます。
          </InfoBox>
        </div>
      </section>

      {/* ─── H2: 注意点 ─── */}
      <section className="mb-10">
        <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 border-b-2 border-brand-500 pb-1">
          知らないと損する注意点・よくある失敗
        </h2>
        <div className="space-y-4 text-base leading-7 text-gray-700">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4">
            <p className="font-bold text-yellow-900 mb-1">⚠️ ふるさと納税の上限を超えて寄付してしまう</p>
            <p>
              住宅ローン控除・iDeCo・医療費控除を活用すると課税所得が下がり、ふるさと納税の上限額も変動します。
              必ずシミュレーションツールで上限額を計算してから寄付しましょう。
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4">
            <p className="font-bold text-yellow-900 mb-1">⚠️ ふるさと納税でワンストップを使いながら確定申告をしてしまう</p>
            <p>
              ワンストップ特例を使った後に確定申告をすると、ワンストップの申請が無効になります。
              確定申告をするなら、ふるさと納税も申告書に含める必要があります。
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4">
            <p className="font-bold text-yellow-900 mb-1">⚠️ 医療費の領収書を捨ててしまっている</p>
            <p>
              医療費控除は領収書の提出は不要になりましたが、5年間の保管義務があります。
              年初からレシートをまとめておく習慣をつけましょう。
            </p>
          </div>
        </div>
      </section>

      {/* ─── H2: FAQ ─── */}
      <section className="mb-10">
        <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 border-b-2 border-brand-500 pb-1">
          よくある質問
        </h2>
        <div className="space-y-5">
          {[
            {
              q: '年末調整をしていれば確定申告は不要ですか？',
              a: '年末調整だけでは「医療費控除」「セルフメディケーション税制」「ふるさと納税（確定申告方式）」「特定支出控除」「株式の損益通算」などは申告できません。これらの控除を使いたい場合は翌年2〜3月の確定申告期間に申告が必要です。',
            },
            {
              q: 'iDeCoとふるさと納税は併用できますか？',
              a: 'はい、両方使えます。ただしiDeCoで所得控除が増えると課税所得が下がるため、ふるさと納税の上限額もわずかに下がります。具体的な数字はシミュレーションツールで確認してください。',
            },
            {
              q: '副業の収入が20万円以下でも申告は必要ですか？',
              a: '所得税の確定申告は副業所得が20万円以下なら不要ですが、住民税の申告は別途必要な場合があります。また、医療費控除など他の理由で確定申告をする場合は副業収入も含める必要があります。',
            },
            {
              q: '過去に申告しなかった医療費控除は今から取り戻せますか？',
              a: 'はい、還付申告は申告できる年の翌年1月1日から5年以内であれば遡って申請できます。2025年中であれば2020年分（令和2年分）まで申請可能です。',
            },
            {
              q: '要介護の親がいる場合に使える控除はありますか？',
              a: 'あります。「障害者控除」が代表的で、要介護1〜5の認定を受けている親について、市区町村に「障害者控除対象者認定書」を申請すると1人につき27〜75万円の所得控除になります。多くの方が知らないまま見落としている控除のひとつです。',
            },
          ].map(({ q, a }, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-brand-50 px-5 py-3">
                <p className="text-base font-bold text-brand-900">Q. {q}</p>
              </div>
              <div className="px-5 py-3 text-base text-gray-700 leading-7">
                <p>A. {a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── H2: まとめ ─── */}
      <section className="mb-10">
        <h2 className="text-xl font-extrabold text-gray-900 mt-10 mb-4 border-b-2 border-brand-500 pb-1">
          まとめ
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-base leading-7 text-gray-700">
          <ul className="space-y-2">
            <li>✔ 会社員が使える節税手段は14種類以上あり、年末調整だけでは取りこぼすものが多い</li>
            <li>✔ 年収700万の会社員がiDeCo・ふるさと納税・医療費控除を組み合わせると年間20〜35万円の節税も可能</li>
            <li>✔ 「障害者控除（要介護）」「特定支出控除」「還付申告」は特に見落とされやすい控除</li>
            <li>✔ 過去5年分の控除漏れは今からでも取り戻せる</li>
          </ul>
        </div>
      </section>

      <CTA label="この記事の控除、あなたはすべて使えていますか？ → 3分で無料診断" />

      {/* ─── 関連記事 ─── */}
      <section className="mt-12">
        <h2 className="text-base font-bold text-gray-700 mb-3">関連記事</h2>
        <div className="flex flex-col gap-2">
          {[
            { href: '/column', label: '節税コラム一覧', desc: '控除・確定申告の解説記事をまとめています' },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="block bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-300 transition-colors"
            >
              <p className="text-sm font-semibold text-brand-700">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
