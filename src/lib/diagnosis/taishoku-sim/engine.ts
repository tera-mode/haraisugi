import type { RetirementInput, RetirementPattern, RetirementResult } from './types';
import { RETIREMENT_TIPS } from './data';

// ---- 退職所得控除の計算（万円）----
export function calcRetirementDeduction(yearsOfService: number, hasDisability: boolean): number {
  const years = Math.max(1, Math.floor(yearsOfService));
  let deduction: number;
  if (years <= 20) {
    deduction = Math.max(80, 40 * years);
  } else {
    deduction = 800 + 70 * (years - 20);
  }
  if (hasDisability) deduction += 100;
  return deduction;
}

// ---- 退職所得の計算（万円）----
function calcRetirementIncome(benefit: number, deduction: number): number {
  return Math.max(0, (benefit - deduction) * 0.5);
}

// ---- 退職所得に対する所得税（超過累進）万円 ----
function calcIncomeTax(taxableIncome: number): number {
  // 退職所得は分離課税・超過累進（1/2後の所得に適用）
  const t = taxableIncome;
  let tax = 0;
  if (t <= 195)        tax = t * 0.05 - 0;
  else if (t <= 330)   tax = t * 0.10 - 9.75;
  else if (t <= 695)   tax = t * 0.20 - 42.75;
  else if (t <= 900)   tax = t * 0.23 - 63.6;
  else if (t <= 1800)  tax = t * 0.33 - 153.6;
  else if (t <= 4000)  tax = t * 0.40 - 279.6;
  else                 tax = t * 0.45 - 479.6;
  // 復興特別所得税 2.1%
  return Math.max(0, tax * 1.021);
}

// ---- 住民税（退職所得）万円 ----
function calcResidentTax(taxableIncome: number): number {
  return taxableIncome * 0.10;
}

// ---- 公的年金等控除（万円/年）----
function calcPensionDeduction(age: number, annualPension: number): number {
  // 65歳未満: 収入60万円以下は全額控除、超過分は段階的
  // 65歳以上: 110万円以下は全額控除
  if (age < 65) {
    if (annualPension <= 60)  return annualPension;
    if (annualPension <= 130) return 60 + (annualPension - 60) * 0.25;
    if (annualPension <= 410) return annualPension * 0.25 + 27.5;
    if (annualPension <= 770) return annualPension * 0.15 + 68.5;
    if (annualPension <= 1000) return annualPension * 0.05 + 145.5;
    return 195.5;
  } else {
    if (annualPension <= 110)  return annualPension;
    if (annualPension <= 330)  return 110 + (annualPension - 110) * 0.25;
    if (annualPension <= 410)  return annualPension * 0.25 + 27.5;
    if (annualPension <= 770)  return annualPension * 0.15 + 68.5;
    if (annualPension <= 1000) return annualPension * 0.05 + 145.5;
    return 195.5;
  }
}

// ---- 年金雑所得の課税額（万円/年）----
function calcPensionTax(annualPension: number, age: number): number {
  const deduction = calcPensionDeduction(age, annualPension);
  const taxableIncome = Math.max(0, annualPension - deduction);
  // 簡易的に所得税率15%+住民税10%=25%で概算（給与所得控除・基礎控除なし前提）
  // 退職者は他の所得が少ないため低率を想定
  const taxRate = taxableIncome <= 195 ? 0.05 + 0.10 : 0.10 + 0.10;
  return taxableIncome * taxRate;
}

// ---- パターン1: 同時一括受取 ----
function calcSimultaneous(input: RetirementInput): RetirementPattern {
  const { yearsOfService, retirementBenefit, idecoBalance, idecoContributionYears, hasDisability, age } = input;

  // 同時受取では、勤続年数とiDeCo加入年数の長い方で控除計算（重複する場合）
  // 実務では「退職所得の受給に関する申告書」で最大の控除を選択できる
  const retDeduction = calcRetirementDeduction(yearsOfService, hasDisability);
  const idecoDeduction = calcRetirementDeduction(idecoContributionYears, false);

  // 同一年の場合: 合算した退職金・iDeCoに対して、長い方の勤続年数の控除を1回適用
  // (複数源泉の場合は年数が重複しない部分のみ加算できるが、簡略化のため合算控除÷2で近似)
  const maxDeduction = Math.max(retDeduction, idecoDeduction);
  const totalBenefit = retirementBenefit + idecoBalance;
  const taxableIncome = calcRetirementIncome(totalBenefit, maxDeduction);
  const incomeTax = calcIncomeTax(taxableIncome);
  const residentTax = calcResidentTax(taxableIncome);
  const totalTax = incomeTax + residentTax;

  const notes: string[] = [];
  if (retirementBenefit + idecoBalance <= maxDeduction) {
    notes.push('退職金＋iDeCo合計が退職所得控除内のため税額ゼロ');
  }
  notes.push(`退職所得控除: ${maxDeduction}万円（勤続${Math.max(yearsOfService, idecoContributionYears)}年ベース）`);
  if (age < 65) notes.push('60歳前にiDeCoを受け取る場合は受取要件を確認してください');

  return {
    id: 'simultaneous',
    label: '同時一括受取',
    description: '退職金とiDeCoを同じ年に一時金で受け取るパターン。手続きが最もシンプル。',
    totalTax: Math.round(totalTax * 10) / 10,
    netReceive: Math.round((totalBenefit - totalTax) * 10) / 10,
    retirementDeduction: retDeduction,
    idecoDeduction: maxDeduction,
    incomeTax: Math.round(incomeTax * 10) / 10,
    residentTax: Math.round(residentTax * 10) / 10,
    notes,
  };
}

// ---- パターン2: iDeCoを年金受取 ----
function calcIdecoAnnuity(input: RetirementInput): RetirementPattern {
  const { yearsOfService, retirementBenefit, idecoBalance, hasDisability, age } = input;

  // 退職金: 一時金（退職所得控除フル適用）
  const retDeduction = calcRetirementDeduction(yearsOfService, hasDisability);
  const retTaxableIncome = calcRetirementIncome(retirementBenefit, retDeduction);
  const retIncomeTax = calcIncomeTax(retTaxableIncome);
  const retResidentTax = calcResidentTax(retTaxableIncome);

  // iDeCo: 10年間年金受取（概算）
  const annualIdecoPension = idecoBalance / 10; // 10年で受取
  const annualTax = calcPensionTax(annualIdecoPension, age);
  const totalIdecoTax = annualTax * 10; // 10年分の総税額

  const totalTax = retIncomeTax + retResidentTax + totalIdecoTax;
  const totalBenefit = retirementBenefit + idecoBalance;

  const notes: string[] = [
    `退職金側の控除: ${retDeduction}万円（勤続${yearsOfService}年）`,
    `iDeCoは10年均等年金想定（年${Math.round(annualIdecoPension * 10) / 10}万円/年）`,
    '実際の年金受取額・受取年数は加入先によって異なります',
    age >= 65 ? '65歳以上：年110万円まで非課税枠あり' : '65歳未満：年60万円まで非課税枠あり',
  ];

  return {
    id: 'ideco_annuity',
    label: 'iDeCo年金受取',
    description: '退職金は一時金（退職所得控除フル活用）、iDeCoは年金形式（公的年金等控除活用）のパターン。',
    totalTax: Math.round(totalTax * 10) / 10,
    netReceive: Math.round((totalBenefit - totalTax) * 10) / 10,
    retirementDeduction: retDeduction,
    idecoDeduction: 0,
    incomeTax: Math.round((retIncomeTax + totalIdecoTax * 0.7) * 10) / 10,
    residentTax: Math.round((retResidentTax + totalIdecoTax * 0.3) * 10) / 10,
    notes,
  };
}

// ---- パターン3: 時間差受取（5年ルール活用）----
function calcTimeShifted(input: RetirementInput): RetirementPattern {
  const { yearsOfService, retirementBenefit, idecoBalance, idecoContributionYears, hasDisability } = input;

  // iDeCoを先に一時金受取（iDeCo加入年数で独立した控除）
  const idecoDeduction = calcRetirementDeduction(idecoContributionYears, false);
  const idecoTaxableIncome = calcRetirementIncome(idecoBalance, idecoDeduction);
  const idecoIncomeTax = calcIncomeTax(idecoTaxableIncome);
  const idecoResidentTax = calcResidentTax(idecoTaxableIncome);

  // 5年後に退職金を一時金受取（勤続年数で独立した控除）
  const retDeduction = calcRetirementDeduction(yearsOfService, hasDisability);
  const retTaxableIncome = calcRetirementIncome(retirementBenefit, retDeduction);
  const retIncomeTax = calcIncomeTax(retTaxableIncome);
  const retResidentTax = calcResidentTax(retTaxableIncome);

  const totalTax = idecoIncomeTax + idecoResidentTax + retIncomeTax + retResidentTax;
  const totalBenefit = retirementBenefit + idecoBalance;
  const totalDeduction = idecoDeduction + retDeduction;

  const notes: string[] = [
    `iDeCo側控除: ${idecoDeduction}万円（iDeCo加入${idecoContributionYears}年）`,
    `退職金側控除: ${retDeduction}万円（勤続${yearsOfService}年）`,
    `控除合計: ${totalDeduction}万円（二重活用）`,
    '⚠️ iDeCoを先に受け取り、5年（4年超）空けてから退職金を受け取ることが条件',
    '退職金を先に受け取る場合は19年ルールが適用されます',
  ];

  return {
    id: 'time_shifted',
    label: '時間差受取（5年ルール）',
    description: 'iDeCoを先に一時金で受け取り、5年後に退職金を一時金で受け取るパターン。控除を二重に活用できる可能性が最大。',
    totalTax: Math.round(totalTax * 10) / 10,
    netReceive: Math.round((totalBenefit - totalTax) * 10) / 10,
    retirementDeduction: retDeduction,
    idecoDeduction,
    incomeTax: Math.round((idecoIncomeTax + retIncomeTax) * 10) / 10,
    residentTax: Math.round((idecoResidentTax + retResidentTax) * 10) / 10,
    notes,
  };
}

// ---- メインエンジン ----
export function runTaishokuSim(input: RetirementInput): RetirementResult {
  const hasIdeco = input.idecoBalance > 0;

  const patterns: RetirementPattern[] = [
    calcSimultaneous(input),
  ];

  if (hasIdeco) {
    patterns.push(calcIdecoAnnuity(input));
    patterns.push(calcTimeShifted(input));
  }

  // 最良パターンの判定（税額が最小）
  const bestPattern = patterns.reduce((a, b) => a.totalTax <= b.totalTax ? a : b);
  const worstPattern = patterns.reduce((a, b) => a.totalTax >= b.totalTax ? a : b);
  const maxSavings = Math.round((worstPattern.totalTax - bestPattern.totalTax) * 10) / 10;

  // 5年ルール活用余地
  const fiveYearRuleAvailable = hasIdeco && input.idecoContributionYears >= 1;

  // tips のマッチング
  const tips = [];
  if (fiveYearRuleAvailable) {
    tips.push(RETIREMENT_TIPS.find(t => t.id === 'five_year_rule')!);
  }
  if (hasIdeco) {
    tips.push(RETIREMENT_TIPS.find(t => t.id === 'ideco_annuity_advantage')!);
  }
  tips.push(RETIREMENT_TIPS.find(t => t.id === 'retirement_deduction_formula')!);
  tips.push(RETIREMENT_TIPS.find(t => t.id === 'half_tax_advantage')!);
  if (input.hasDisability) {
    tips.push(RETIREMENT_TIPS.find(t => t.id === 'disability_bonus')!);
  }

  // 警告
  const warnings: string[] = [];
  if (input.age < 60) {
    warnings.push('iDeCoは原則60歳まで受け取れません。受取可能年齢を確認してください。');
  }
  if (input.idecoContributionYears < 10) {
    warnings.push('iDeCo加入10年未満の場合、受取開始年齢が繰り下がる場合があります（加入5年未満→65歳から）。');
  }
  warnings.push('本シミュレーションは概算です。実際の税額は確定申告書等で計算するか、税理士にご相談ください。');

  return {
    patterns,
    bestPatternId: bestPattern.id,
    maxSavings,
    fiveYearRuleAvailable,
    tips: tips.filter(Boolean).slice(0, 4),
    warnings,
  };
}
