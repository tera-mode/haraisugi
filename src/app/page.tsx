import type { Metadata } from 'next';
import Link from 'next/link';
import DiagnosisForm from '@/components/diagnosis/DiagnosisForm';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          税金払いすぎ診断
        </h1>
        <p className="text-sm text-gray-500">
          あなたの払いすぎ税金、3分で見つけます
        </p>
      </div>

      <DiagnosisForm />

      {/* SEO静的コンテンツ */}
      <section className="mt-16 space-y-10 text-sm text-gray-700">
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">税金払いすぎ診断とは？</h2>
          <p className="leading-relaxed">
            年収・家族構成・ライフスタイルを入力するだけで、あなたが見逃している控除と節税テクニックを無料で診断するツールです。
            医療費控除・ふるさと納税・iDeCo・扶養控除など、申請しなければ自動的には戻ってこない控除を自動で洗い出します。
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">こんな方におすすめ</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>年末調整だけで税金の手続きを終わらせている会社員の方</li>
            <li>医療費をたくさん払ったが確定申告していない方</li>
            <li>ふるさと納税・iDeCoを始めてみたいが何から手をつければいいか分からない方</li>
            <li>共働き夫婦で扶養控除・配偶者控除の最適化を知りたい方</li>
            <li>副業収入があり節税の方法を探している方</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">診断でわかること</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>あなたが申請できる控除の一覧と、それぞれの節税効果の目安</li>
            <li>ふるさと納税・iDeCoなど今すぐ始められる節税テクニック</li>
            <li>年収・家族構成に合った最優先の節税アクション</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">よくある質問</h2>
          <dl className="space-y-4">
            <div>
              <dt className="font-semibold">無料で使えますか？</dt>
              <dd className="mt-1 text-gray-600">はい、完全無料です。登録不要でお使いいただけます。</dd>
            </div>
            <div>
              <dt className="font-semibold">個人情報は入力しますか？</dt>
              <dd className="mt-1 text-gray-600">
                氏名・住所・マイナンバーなどの個人情報は一切入力不要です。年収レンジと家族構成のみで診断します。
              </dd>
            </div>
            <div>
              <dt className="font-semibold">診断結果はどのくらい正確ですか？</dt>
              <dd className="mt-1 text-gray-600">
                概算の節税効果を提示するものです。正確な税額計算は税理士または国税庁の確定申告書等作成コーナーをご利用ください。
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">節税コラム</h2>
          <p className="text-gray-600 mb-4">
            会社員・フリーランス・共働き夫婦向けの節税・確定申告コラムを50本以上掲載しています。
          </p>
          <Link
            href="/column"
            className="inline-block text-brand-600 font-semibold hover:underline"
          >
            節税コラム一覧を見る →
          </Link>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">ニッチ節税診断ツール</h2>
          <p className="text-gray-600 mb-4">
            医療費控除・共働き控除・副業申告・相続税・ふるさと納税など、テーマ別の詳細シミュレーションツールを提供しています。
          </p>
          <Link
            href="/tools"
            className="inline-block text-brand-600 font-semibold hover:underline"
          >
            節税診断メニューを見る →
          </Link>
        </div>
      </section>
    </div>
  );
}
