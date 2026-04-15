'use client';

import { useState } from 'react';
import DiagnosisShell from '@/components/diagnosis/shared/DiagnosisShell';
import StepContainer from '@/components/diagnosis/shared/StepContainer';
import TomobatarakiResult from './TomobatarakiResult';
import type {
  DualIncomeInput,
  DualIncomeResult,
  ChildAge,
  ParentSide,
} from '@/lib/diagnosis/tomobataraki/types';
import { runTomobataraki } from '@/lib/diagnosis/tomobataraki/engine';
import { trackEvent } from '@/lib/analytics';

type IncomeOption = { value: number; label: string };
const INCOME_OPTIONS: IncomeOption[] = [
  { value: 200,  label: '300万円未満' },
  { value: 400,  label: '300〜500万円' },
  { value: 600,  label: '500〜700万円' },
  { value: 850,  label: '700〜1,000万円' },
  { value: 1250, label: '1,000〜1,500万円' },
  { value: 2000, label: '1,500万円以上' },
];

const CHILD_AGE_OPTIONS: { value: ChildAge; label: string }[] = [
  { value: 'under16', label: '16歳未満' },
  { value: '16to18',  label: '16〜18歳' },
  { value: '19to22',  label: '19〜22歳（大学生等）' },
  { value: '23plus',  label: '23歳以上' },
];

const PARENT_SIDE_OPTIONS: { value: ParentSide; label: string }[] = [
  { value: 'husband', label: '夫' },
  { value: 'wife',    label: '妻' },
  { value: 'none',    label: '未申告' },
];

const STEP_LABELS = ['💰 夫婦収入', '👧 子ども', '🏠 控除設定'];
const TOTAL_STEPS = 3;

type ChildDraft = { age: ChildAge; currentParent: ParentSide };

export default function TomobatarakiForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<DualIncomeResult | null>(null);

  // Step 1
  const [husbandIncome, setHusbandIncome] = useState<number | null>(null);
  const [wifeIncome, setWifeIncome] = useState<number | null>(null);

  // Step 2
  const [children, setChildren] = useState<ChildDraft[]>([]);

  // Step 3
  const [hasElderlyParent, setHasElderlyParent] = useState<boolean | null>(null);
  const [elderlyLiving, setElderlyLiving] = useState(false);
  const [elderlyParentSide, setElderlyParentSide] = useState<ParentSide>('none');
  const [insHusband, setInsHusband] = useState({ lifeInsurance: false, medicalInsurance: false, pensionInsurance: false, earthquakeInsurance: false });
  const [insWife, setInsWife] = useState({ lifeInsurance: false, medicalInsurance: false, pensionInsurance: false, earthquakeInsurance: false });

  const canNext =
    step === 1 ? husbandIncome !== null && wifeIncome !== null :
    step === 2 ? true :
    hasElderlyParent !== null;

  const addChild = () => {
    if (children.length < 8) {
      setChildren(prev => [...prev, { age: 'under16', currentParent: 'none' }]);
    }
  };

  const removeChild = (i: number) => {
    setChildren(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateChild = (i: number, field: keyof ChildDraft, value: string) => {
    setChildren(prev => prev.map((c, idx) =>
      idx === i ? { ...c, [field]: value } : c
    ));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      trackEvent('step_complete', { step, diagnosis: 'tomobataraki' });
      setStep(s => s + 1);
    } else {
      trackEvent('diagnosis_complete', { diagnosis: 'tomobataraki' });
      const input: DualIncomeInput = {
        husbandIncome: husbandIncome!,
        wifeIncome: wifeIncome!,
        children,
        elderlyParent: hasElderlyParent
          ? { livingTogether: elderlyLiving, currentParent: elderlyParentSide }
          : null,
        housingLoan: null,
        insuranceHusband: insHusband,
        insuranceWife: insWife,
      };
      setResult(runTomobataraki(input));
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setHusbandIncome(null);
    setWifeIncome(null);
    setChildren([]);
    setHasElderlyParent(null);
    setElderlyLiving(false);
    setElderlyParentSide('none');
    setInsHusband({ lifeInsurance: false, medicalInsurance: false, pensionInsurance: false, earthquakeInsurance: false });
    setInsWife({ lifeInsurance: false, medicalInsurance: false, pensionInsurance: false, earthquakeInsurance: false });
  };

  if (result) {
    return <TomobatarakiResult result={result} onReset={handleReset} />;
  }

  return (
    <DiagnosisShell
      title="共働き世帯の扶養・控除 最適配分診断"
      subtitle="夫婦の年収・子の年齢・保険加入状況を入力して、扶養控除の最適な振り分けを提案します"
      step={step}
      totalSteps={TOTAL_STEPS}
      stepLabels={STEP_LABELS}
      onBack={step > 1 ? handleBack : undefined}
      onNext={handleNext}
      canNext={canNext}
      isLast={step === TOTAL_STEPS}
      nextLabel={step === TOTAL_STEPS ? '最適配分を診断する' : undefined}
    >
      {/* ---- Step 1: 夫婦の年収 ---- */}
      {step === 1 && (
        <StepContainer heading="💰 夫婦の年収" description="夫と妻それぞれの年収帯を選んでください">
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-2">夫の年収</p>
            <div className="grid grid-cols-2 gap-2">
              {INCOME_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setHusbandIncome(opt.value)}
                  className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors text-left ${
                    husbandIncome === opt.value
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">妻の年収</p>
            <div className="grid grid-cols-2 gap-2">
              {INCOME_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setWifeIncome(opt.value)}
                  className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors text-left ${
                    wifeIncome === opt.value
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </StepContainer>
      )}

      {/* ---- Step 2: 子どもの情報 ---- */}
      {step === 2 && (
        <StepContainer
          heading="👧 お子さまの情報"
          description="扶養に入れているお子さまを追加してください（任意）"
        >
          {children.length === 0 && (
            <p className="text-sm text-gray-500 mb-4">
              子どもがいない場合はそのまま「次へ」を押してください
            </p>
          )}
          <div className="space-y-4 mb-4">
            {children.map((child, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-semibold text-gray-700">子ども {i + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeChild(i)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 mb-1">年齢区分</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CHILD_AGE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateChild(i, 'age', opt.value)}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors text-left ${
                          child.age === opt.value
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">現在どちらの扶養に入れていますか？</label>
                  <div className="flex gap-1.5">
                    {PARENT_SIDE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateChild(i, 'currentParent', opt.value)}
                        className={`flex-1 py-2 px-2 rounded-lg border text-xs font-medium transition-colors ${
                          child.currentParent === opt.value
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {children.length < 8 && (
            <button
              type="button"
              onClick={addChild}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              ＋ 子どもを追加する
            </button>
          )}
        </StepContainer>
      )}

      {/* ---- Step 3: 親・保険 ---- */}
      {step === 3 && (
        <StepContainer
          heading="🏠 高齢の親・保険料控除"
          description="70歳以上の親の扶養状況と、保険料控除の加入状況を入力してください"
        >
          {/* 高齢の親 */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              70歳以上の親を扶養に入れていますか（または検討中）？
            </p>
            <div className="flex gap-3 mb-3">
              {[
                { value: true,  label: 'はい' },
                { value: false, label: 'いいえ' },
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setHasElderlyParent(opt.value)}
                  className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                    hasElderlyParent === opt.value
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {hasElderlyParent && (
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">同居していますか？</label>
                  <div className="flex gap-2">
                    {[{ v: true, l: '同居（同居老親等控除 58万円）' }, { v: false, l: '別居（老人扶養控除 48万円）' }].map(opt => (
                      <button
                        key={String(opt.v)}
                        type="button"
                        onClick={() => setElderlyLiving(opt.v)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                          elderlyLiving === opt.v
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                        }`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">現在どちらの扶養に入れていますか？</label>
                  <div className="flex gap-1.5">
                    {PARENT_SIDE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setElderlyParentSide(opt.value)}
                        className={`flex-1 py-2 px-2 rounded-lg border text-xs font-medium transition-colors ${
                          elderlyParentSide === opt.value
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 保険料控除 */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">保険料控除の加入状況</p>
            <p className="text-xs text-gray-500 mb-3">
              現在加入している保険の種類を選んでください（各人最大3枠）
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { side: '夫', ins: insHusband, setIns: setInsHusband },
                { side: '妻', ins: insWife,    setIns: setInsWife },
              ].map(({ side, ins, setIns }) => (
                <div key={side} className="border border-gray-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-gray-700 mb-2">{side}</p>
                  {([
                    { key: 'lifeInsurance'    as const, label: '一般生命保険' },
                    { key: 'medicalInsurance' as const, label: '介護医療保険' },
                    { key: 'pensionInsurance' as const, label: '個人年金保険' },
                  ] as const).map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ins[key]}
                        onChange={e => setIns(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-xs text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </StepContainer>
      )}
    </DiagnosisShell>
  );
}
