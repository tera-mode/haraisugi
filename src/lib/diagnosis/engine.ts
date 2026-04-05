import type { UserInput, DiagnosisResult } from './types';
import { ALL_DEDUCTIONS } from './deductions';
import { ALL_TRICKS } from './tricks';

function parseSavings(savingsStr: string): number {
  // "年間 約X万円" 形式から数値を抽出
  const match = savingsStr.match(/約(\d+(?:\.\d+)?)万円/);
  if (match) return parseFloat(match[1]) * 10000;
  return 0;
}

export function diagnose(input: UserInput): DiagnosisResult {
  const deductions = ALL_DEDUCTIONS.filter(d => d.match(input));
  const tricks = ALL_TRICKS.filter(t => t.match(input));
  const totalSavings = deductions.reduce(
    (sum, d) => sum + parseSavings(d.savings(input)),
    0
  );
  return { deductions, tricks, totalSavings };
}
