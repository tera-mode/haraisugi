'use client';

import { useState } from 'react';
import DiagnosisShell from '@/components/diagnosis/shared/DiagnosisShell';
import StepContainer from '@/components/diagnosis/shared/StepContainer';
import NumberInput from '@/components/diagnosis/shared/NumberInput';
import FurusatoLimitResult from './FurusatoLimitResult';
import type { FurusatoLimitInput, FurusatoLimitResult as FLResult } from '@/lib/diagnosis/furusato-limit/types';
import { runFurusatoShindan } from '@/lib/diagnosis/furusato-limit/engine';
import { trackEvent } from '@/lib/analytics';

const STEP_LABELS = ['💴 年収・家族構成', '📋 各種控除の状況', '🎁 確認・計算'];
const TOTAL_STEPS = 3;

const INCOME_PRESETS = [
  { value: 250,  label: '〜300万' },
  { value: 350,  label: '300〜400万' },
  { value: 450,  label: '400〜500万' },
  { value: 550,  label: '500〜600万' },
  { value: 650,  label: '600〜700万' },
  { value: 750,  label: '700〜800万' },
  { value: 900,  label: '800万〜1000万' },
  { value: 1100, label: '1000〜1200万' },
];

export default function FurusatoLimitForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<FLResult | null>(null);

  // Step 1: 年収・家族構成
  const [annualIncome, setAnnualIncome] = useState<number | null>(null);
  const [hasSpouse, setHasSpouse] = useState<boolean | null>(null);
  const [numDependents, setNumDependents] = useState<number>(0);

  // Step 2: 各種控除
  const [iDeCoMonthly, setIDeCoMonthly] = useState(0);
  const [mortgageDeduction, setMortgageDeduction] = useState(0);
  const [medicalExpenses, setMedicalExpenses] = useState(0);
  const [lifeInsurancePremium, setLifeInsurancePremium] = useState(0);

  const canNext =
    step === 1 ? annualIncome !== null && hasSpouse !== null :
    step === 2 ? true :
    true;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      trackEvent('step_complete', { step, diagnosis: 'furusato-limit' });
      setStep(s => s + 1);
    } else {
      trackEvent('diagnosis_complete', { diagnosis: 'furusato-limit' });
      const input: FurusatoLimitInput = {
        annualIncome: annualIncome!,
        hasSpouse: hasSpouse!,
        numDependents,
        iDeCoMonthly,
        mortgageDeduction,
        medicalExpenses,
        lifeInsurancePremium,
        socialInsurancePremium: 0,
      };
      setResult(runFurusatoShindan(input));
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setAnnualIncome(null);
    setHasSpouse(null);
    setNumDependents(0);
    setIDeCoMonthly(0);
    setMortgageDeduction(0);
    setMedicalExpenses(0);
    setLifeInsurancePremium(0);
  };

  if (result) {
    return (
      <FurusatoLimitResult
        result={result}
        input={{ annualIncome: annualIncome!, hasSpouse: hasSpouse!, numDependents, iDeCoMonthly, mortgageDeduction, medicalExpenses, lifeInsurancePremium, socialInsurancePremium: 0 }}
        onReset={handleReset}
      />
    );
  }

  return (
    <DiagnosisShell
      title="ふるさと納税 損してる診断"
      subtitle="iDeCo・住宅ローン控除・医療費控除の影響を加味した正確な上限額を計算します"
      stepLabels={STEP_LABELS}
      step={step}
      totalSteps={TOTAL_STEPS}
      onNext={handleNext}
      onBack={() => setStep(s => s - 1)}
      canNext={canNext}
      nextLabel={step === TOTAL_STEPS ? '上限額を計算する' : '次へ'}
    >
      {step === 1 && (
        <StepContainer heading="💴 年収と家族構成">
          <p className="text-sm text-gray-500 mb-4">
            給与収入（税込み・額面）と家族構成を入力してください
          </p>

          {/* 年収プリセット */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-1">年収（給与収入）</div>
            <p className="text-xs text-gray-400 mb-2">税込み額面。ボーナス含む</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {INCOME_PRESETS.map(p => (
                <button
                  key={p.value}
                  onClick={() => {
                    setAnnualIncome(p.value);
                    trackEvent('diagnosis_start', { diagnosis: 'furusato-limit', income: p.value });
                  }}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    annualIncome === p.value
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              ※ 上記以外の場合は下の欄に直接入力してください
            </p>
            <NumberInput
              label="年収を直接入力（万円）"
              value={annualIncome ?? 0}
              onChange={v => setAnnualIncome(v > 0 ? v : null)}
              unit="万円"
              placeholder="例: 550"
            />
          </div>

          {/* 配偶者控除 */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-1">配偶者控除の適用</div>
            <p className="text-xs text-gray-400 mb-2">配偶者の年収が201万円以下の場合に適用できます</p>
            <div className="flex gap-2">
              {[
                { value: true, label: '適用あり' },
                { value: false, label: '適用なし / 独身' },
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  onClick={() => setHasSpouse(opt.value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    hasSpouse === opt.value
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 扶養控除 */}
          <div className="mb-2">
            <div className="text-sm font-medium text-gray-700 mb-1">16歳以上の扶養親族数</div>
            <p className="text-xs text-gray-400 mb-2">子・親など。16歳未満は住民税の均等割への影響のみのため除外</p>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(n => (
                <button
                  key={n}
                  onClick={() => setNumDependents(n)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    numDependents === n
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {n}人
                </button>
              ))}
            </div>
          </div>

          {/* ライブプレビュー */}
          {annualIncome !== null && hasSpouse !== null && (
            <div className="mt-4 p-3 bg-brand-50 rounded-lg text-sm text-brand-800">
              <span className="font-bold">入力内容確認: </span>
              年収{annualIncome}万円、配偶者控除{hasSpouse ? 'あり' : 'なし'}、扶養{numDependents}人
            </div>
          )}
        </StepContainer>
      )}

      {step === 2 && (
        <StepContainer heading="📋 各種控除の状況">
          <p className="text-sm text-gray-500 mb-4">
            各控除の状況を入力してください。不明な場合は0のままで構いません
          </p>

          <NumberInput
            label="iDeCo月額掛金"
            value={iDeCoMonthly}
            onChange={setIDeCoMonthly}
            unit="万円/月"
            placeholder="例: 2.3"
            helpText="未加入の場合は0。上限は会社員2.3万円/月、自営業6.8万円/月"
          />

          <NumberInput
            label="住宅ローン控除額（年間）"
            value={mortgageDeduction}
            onChange={setMortgageDeduction}
            unit="万円/年"
            placeholder="例: 30"
            helpText="年末調整や確定申告書の「住宅借入金等特別控除額」。住宅なし・借入なしは0"
          />

          <NumberInput
            label="医療費控除の見込み額"
            value={medicalExpenses}
            onChange={setMedicalExpenses}
            unit="万円/年"
            placeholder="例: 20"
            helpText="年間の医療費合計（交通費含む）。10万円以下なら影響なし"
          />

          <NumberInput
            label="生命保険料（年払い）"
            value={lifeInsurancePremium}
            onChange={setLifeInsurancePremium}
            unit="万円/年"
            placeholder="例: 8"
            helpText="生命保険・医療保険・個人年金の年間保険料の合計。未加入は0"
          />

          {/* ライブプレビュー */}
          <div className="mt-4 p-3 bg-brand-50 rounded-lg text-xs text-brand-800 space-y-1">
            {iDeCoMonthly > 0 && (
              <p>✓ iDeCo年額 {(iDeCoMonthly * 12).toFixed(1)}万円 → 課税所得が下がり上限が若干減少</p>
            )}
            {mortgageDeduction > 0 && (
              <p>✓ 住宅ローン控除 {mortgageDeduction}万円 → 住民税から控除されると上限が下がる場合あり</p>
            )}
            {medicalExpenses > 0 && (
              <p>✓ 医療費 {medicalExpenses}万円 → 10万円超の場合、控除が上限に影響</p>
            )}
            {iDeCoMonthly === 0 && mortgageDeduction === 0 && medicalExpenses === 0 && lifeInsurancePremium === 0 && (
              <p>他の控除なし → 年収と家族構成のみで上限を計算します</p>
            )}
          </div>
        </StepContainer>
      )}

      {step === 3 && (
        <StepContainer heading="🎁 入力内容の確認">
          <p className="text-sm text-gray-500 mb-4">以下の内容でふるさと納税上限額を計算します</p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">年収</span>
              <span className="font-bold text-gray-900">{annualIncome}万円</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">配偶者控除</span>
              <span className="font-medium">{hasSpouse ? 'あり（38万円）' : 'なし'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">扶養控除</span>
              <span className="font-medium">{numDependents}人（{numDependents * 38}万円）</span>
            </div>
            {iDeCoMonthly > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">iDeCo年額</span>
                <span className="font-medium">{(iDeCoMonthly * 12).toFixed(1)}万円</span>
              </div>
            )}
            {mortgageDeduction > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">住宅ローン控除</span>
                <span className="font-medium">{mortgageDeduction}万円/年</span>
              </div>
            )}
            {medicalExpenses > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">医療費（年間）</span>
                <span className="font-medium">{medicalExpenses}万円</span>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-gray-400">
            ※ 社会保険料は年収から自動概算（約14.2%）します
          </p>
        </StepContainer>
      )}
    </DiagnosisShell>
  );
}
