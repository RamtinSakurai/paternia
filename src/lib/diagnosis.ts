import type { Axis, Question } from "@/data/questions";
import { QUESTIONS } from "@/data/questions";
import { TYPE_PROFILES, type TypeProfile } from "@/data/type-profiles";

export interface Scores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

// answers: 0-4 for each question (5-point scale)
// questions: 使う問題配列 (45問 or 10問版)。省略すると45問版(QUESTIONS)
export function calculateScores(
  answers: number[],
  questions: Question[] = QUESTIONS
): Scores {
  const sums: Record<Axis, number[]> = { O: [], C: [], E: [], A: [], N: [] };

  answers.forEach((val, i) => {
    const q = questions[i];
    if (!q) return;
    const normalized = q.reverse ? 4 - val : val;
    sums[q.axis].push(normalized / 4); // normalize to 0-1
  });

  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0.5;

  // Deterministic small noise (±0.02) based on answer pattern.
  // 全中立回答など、全軸が同値のときにタイブレークで OC に固定されるのを防ぐ。
  // 同じ回答なら同じ結果になる再現性を保つため、乱数ではなく answers 由来の値を使う。
  const seed = answers.reduce((acc, v, i) => acc + v * (i + 1) * 31, 0);
  const noise = (i: number) => {
    const x = Math.sin(seed * 0.001 + i * 12.9898) * 43758.5453;
    return (x - Math.floor(x)) * 0.04 - 0.02; // ±0.02
  };

  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  return {
    O: clamp(avg(sums.O) + noise(0)),
    C: clamp(avg(sums.C) + noise(1)),
    E: clamp(avg(sums.E) + noise(2)),
    A: clamp(avg(sums.A) + noise(3)),
    N: clamp(avg(sums.N) + noise(4)),
  };
}

// 5軸の High/Low 組み合わせで 32 タイプコードを生成
// 例: O+C-E+A-N+ → "OcEan" のような文字列
const AXIS_SYMBOLS: Record<Axis, [string, string]> = {
  O: ["o", "O"], // low, high
  C: ["c", "C"],
  E: ["e", "E"],
  A: ["a", "A"],
  N: ["n", "N"],
};

export function getTypeCode(scores: Scores): string {
  return (Object.keys(AXIS_SYMBOLS) as Axis[])
    .map((axis) => (scores[axis] >= 0.5 ? AXIS_SYMBOLS[axis][1] : AXIS_SYMBOLS[axis][0]))
    .join("");
}

/**
 * 最も偏差が大きい軸2つを取得（プロファイルキー用）
 * 例: scores.O=0.9, scores.C=0.8 → { primary: "O", secondary: "C" }
 */
export function getTopTwoAxes(scores: Scores): { primary: Axis; secondary: Axis } {
  const sorted = (Object.keys(scores) as Axis[])
    .map((a) => ({ axis: a, dev: Math.abs(scores[a] - 0.5) }))
    .sort((a, b) => b.dev - a.dev);
  return {
    primary: sorted[0].axis,
    secondary: sorted[1].axis,
  };
}

/**
 * プロファイル検索用の2文字キー (例: "OC")
 */
export function getTypeKey(scores: Scores): string {
  const { primary, secondary } = getTopTwoAxes(scores);
  return `${primary}${secondary}`;
}

/**
 * スコアから該当するタイププロファイルを取得
 */
export function getTypeProfile(scores: Scores): TypeProfile {
  const key = getTypeKey(scores);
  const profile = TYPE_PROFILES[key];
  if (!profile) {
    // フォールバック：万一マッチしない場合は最初のプロファイルを返す
    return Object.values(TYPE_PROFILES)[0];
  }
  return profile;
}

// スコアのパーセンタイル表現（簡易版）
export function getPercentile(score: number): number {
  // 正規分布近似。Big5スコアは概ね正規分布する
  return Math.round(score * 100);
}

// スコアを文字列ラベルに変換
export function getScoreLabel(score: number): string {
  if (score >= 0.8) return "非常に高い";
  if (score >= 0.6) return "やや高い";
  if (score >= 0.4) return "平均的";
  if (score >= 0.2) return "やや低い";
  return "非常に低い";
}
