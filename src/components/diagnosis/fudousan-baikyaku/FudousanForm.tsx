'use client';

import { useState } from 'react';
import DiagnosisShell from '@/components/diagnosis/shared/DiagnosisShell';
import StepContainer from '@/components/diagnosis/shared/StepContainer';
import NumberInput from '@/components/diagnosis/shared/NumberInput';
import FudousanResult from './FudousanResult';
import type { RealEstateInput, RealEstateResult, PropertyType, ResidencyStatus } from '@/lib/diagnosis/fudousan-baikyaku/types';
import { runFudousanShindan } from '@/lib/diagnosis/fudousan-baikyaku/engine';
import { trackEvent } from '@/lib/analytics';

const STEP_LABELS = ['🏘️ 物件・売却情報', '📅 所有期間・居住状況', '🧾 取得費・経費'];
const TOTAL_STEPS = 3;

const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string; desc: string }[] = [
  { value: 'my_home', label: 'マイホーム（居住用）', desc: '自分が住んでいた・住んでいる住宅' },
  { value: 'investment', label: '投資用不動産', desc: 'アパート・マンション・土地等' },
  { value: 'inherited', label: '相続した不動産', desc: '親等から相続した物件' },
];

const OWNERSHIP_PRESETS = [
  { value: 2,  label: '2年以下' },
  { value: 4,  label: '3〜4年' },
  { value: 6,  label: '5〜6年' },
  { value: 10, label: '7〜10年' },
  { value: 15, label: '11〜15年' },
  { value: 20, label: '20年超' },
];

export default function FudousanForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<RealEstateResult | null>(null);

  // Step 1
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [salePrice, setSalePrice] = useState(0);

  // Step 2
  const [ownershipYears, setOwnershipYears] = useState<number | null>(null);
  const [residencyStatus, setResidencyStatus] = useState<ResidencyStatus | null>(null);
  const [inheritedWithinYear, setInheritedWithinYear] = useState<boolean>(false);

  // Step 3
  const [acquisitionCostUnknown, setAcquisitionCostUnknown] = useState(false);
  const [acquisitionCost, setAcquisitionCost] = useState(0);
  const [saleExpenses, setSaleExpenses] = useState(0);

  const canNext =
    step === 1 ? propertyType !== null && salePrice > 0 :
    step === 2 ? ownershipYears !== null && (propertyType !== 'my_home' || residencyStatus !== null) :
    true;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      trackEvent('step_complete', { step, diagnosis: 'fudousan-baikyaku' });
      setStep(s => s + 1);
    } else {
      trackEvent('diagnosis_complete', { diagnosis: 'fudousan-baikyaku' });
      const input: RealEstateInput = {
        propertyType: propertyType!,
        salePrice,
        acquisitionCost,
        acquisitionCostUnknown,
        saleExpenses,
        ownershipYears: ownershipYears!,
        residencyStatus: residencyStatus ?? 'rented',
        inheritedWithinYear,
      };
      setResult(runFudousanShindan(input));
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setPropertyType(null);
    setSalePrice(0);
    setOwnershipYears(null);
    setResidencyStatus(null);
    setInheritedWithinYear(false);
    setAcquisitionCostUnknown(false);
    setAcquisitionCost(0);
    setSaleExpenses(0);
  };

  if (result) {
    return (
      <FudousanResult
        result={result}
        salePrice={salePrice}
        onReset={handleReset}
      />
    );
  }

  const estimatedExpenses = salePrice > 0
    ? Math.round(salePrice * 0.03 + 6) // 仲介手数料概算（売却価格×3%+6万）
    : 0;

  return (
    <DiagnosisShell
      title="不動産売却 税金シミュレーション"
      subtitle="売却価格・取得費・居住状況から、譲渡所得税と使える特例を自動診断します"
      stepLabels={STEP_LABELS}
      step={step}
      totalSteps={TOTAL_STEPS}
      onNext={handleNext}
      onBack={() => setStep(s => s - 1)}
      canNext={canNext}
      nextLabel={step === TOTAL_STEPS ? '税額を試算する' : '次へ'}
    >
      {step === 1 && (
        <StepContainer heading="🏘️ 物件と売却価格">
          <p className="text-sm text-gray-500 mb-4">売却する不動産の種別と売却価格を入力してください</p>

          {/* 物件種別 */}
          <div className="mb-5">
            <div className="text-sm font-medium text-gray-700 mb-2">物件の種別</div>
            <div className="space-y-2">
              {PROPERTY_TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setPropertyType(opt.value);
                    if (opt.value !== 'my_home') setResidencyStatus('rented');
                    trackEvent('diagnosis_start', { diagnosis: 'fudousan-baikyaku', type: opt.value });
                  }}
                  className={`w-full flex items-start gap-3 py-3 px-4 rounded-xl border text-left transition-colors ${
                    propertyType === opt.value
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm">{opt.label}</div>
                    <div className={`text-xs mt-0.5 ${propertyType === opt.value ? 'opacity-80' : 'text-gray-400'}`}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 売却価格 */}
          <NumberInput
            label="売却価格（予定）"
            value={salePrice}
            onChange={v => setSalePrice(v)}
            unit="万円"
            placeholder="例: 4500"
            helpText="マンションや土地など、売買契約書または査定額"
          />

          {salePrice > 0 && (
            <div className="mt-3 p-3 bg-brand-50 rounded-lg text-xs text-brand-800">
              仲介手数料の目安: 約{estimatedExpenses}万円（売却価格×3%＋6万円）
            </div>
          )}
        </StepContainer>
      )}

      {step === 2 && (
        <StepContainer heading="📅 所有期間と居住状況">
          <p className="text-sm text-gray-500 mb-4">所有期間が5年を超えると税率が大幅に下がります</p>

          {/* 所有期間 */}
          <div className="mb-5">
            <div className="text-sm font-medium text-gray-700 mb-1">所有期間</div>
            <p className="text-xs text-gray-400 mb-2">
              売却する年の1月1日時点で5年超なら長期譲渡（税率20.315%）、5年以下なら短期譲渡（税率39.63%）
            </p>
            <div className="grid grid-cols-2 gap-2">
              {OWNERSHIP_PRESETS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setOwnershipYears(p.value)}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    ownershipYears === p.value
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {ownershipYears !== null && (
              <p className={`mt-2 text-xs font-medium ${ownershipYears > 5 ? 'text-green-600' : 'text-red-500'}`}>
                {ownershipYears > 5
                  ? `✓ 長期譲渡所得（税率: 20.315%）`
                  : `⚠ 短期譲渡所得（税率: 39.63%）— 5年超になるまで待つと税負担が半減します`}
              </p>
            )}
          </div>

          {/* 居住状況（マイホームのみ） */}
          {propertyType === 'my_home' && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-1">居住状況</div>
              <p className="text-xs text-gray-400 mb-2">3,000万円特別控除の適用可否に影響します</p>
              <div className="space-y-2">
                {[
                  { value: 'living' as ResidencyStatus, label: '現在も居住中' },
                  { value: 'moved_out_within_3years' as ResidencyStatus, label: '転居済み（転居後3年以内）' },
                  { value: 'vacant' as ResidencyStatus, label: '転居済み（転居後3年超）' },
                  { value: 'rented' as ResidencyStatus, label: '賃貸中（投資物件化）' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setResidencyStatus(opt.value)}
                    className={`w-full py-2 px-3 rounded-lg border text-sm text-left font-medium transition-colors ${
                      residencyStatus === opt.value
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 相続後期間（相続のみ） */}
          {propertyType === 'inherited' && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-1">相続後の経過期間</div>
              <p className="text-xs text-gray-400 mb-2">3年10ヶ月以内の売却で「取得費加算の特例」が使えます</p>
              <div className="flex gap-2">
                {[
                  { value: true, label: '3年10ヶ月以内' },
                  { value: false, label: '3年10ヶ月超' },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    onClick={() => setInheritedWithinYear(opt.value)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      inheritedWithinYear === opt.value
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </StepContainer>
      )}

      {step === 3 && (
        <StepContainer heading="🧾 取得費と譲渡費用">
          <p className="text-sm text-gray-500 mb-4">
            取得費が高いほど譲渡所得が減り、税額が下がります
          </p>

          {/* 取得費不明チェック */}
          <div className="mb-4 p-3 bg-amber-50 rounded-lg">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acquisitionCostUnknown}
                onChange={e => {
                  setAcquisitionCostUnknown(e.target.checked);
                  if (e.target.checked) setAcquisitionCost(0);
                }}
                className="mt-0.5 h-4 w-4 rounded"
              />
              <div>
                <span className="text-sm font-medium text-amber-800">取得費が不明（書類紛失等）</span>
                <p className="text-xs text-amber-600 mt-0.5">
                  チェックすると概算取得費（売却価格×5% = 約{Math.round(salePrice * 0.05)}万円）を使用します
                </p>
              </div>
            </label>
          </div>

          {!acquisitionCostUnknown && (
            <NumberInput
              label="取得費（購入価格＋購入時諸費用）"
              value={acquisitionCost}
              onChange={setAcquisitionCost}
              unit="万円"
              placeholder="例: 3500"
              helpText="売買契約書の購入価格＋登記費用・仲介手数料等の合計。建物は減価償却後の金額"
            />
          )}

          <NumberInput
            label="譲渡費用（仲介手数料等）"
            value={saleExpenses}
            onChange={setSaleExpenses}
            unit="万円"
            placeholder={`例: ${estimatedExpenses}`}
            helpText={`仲介手数料・測量費・解体費等の合計。仲介手数料の目安: 約${estimatedExpenses}万円（売却価格×3%＋6万）`}
          />

          {/* 確認サマリ */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">売却価格</span>
              <span className="font-medium">{salePrice}万円</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">取得費</span>
              <span className="font-medium">
                {acquisitionCostUnknown
                  ? `${Math.round(salePrice * 0.05)}万円（概算5%）`
                  : `${acquisitionCost}万円`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">譲渡費用</span>
              <span className="font-medium">{saleExpenses}万円</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-1 mt-1">
              <span>譲渡所得（概算）</span>
              <span className={`${
                salePrice - (acquisitionCostUnknown ? Math.round(salePrice * 0.05) : acquisitionCost) - saleExpenses > 0
                  ? 'text-red-600' : 'text-green-600'
              }`}>
                {salePrice - (acquisitionCostUnknown ? Math.round(salePrice * 0.05) : acquisitionCost) - saleExpenses}万円
              </span>
            </div>
          </div>
        </StepContainer>
      )}
    </DiagnosisShell>
  );
}
