import type { TypeProfile } from "@/data/type-profiles";
import { getAllProfiles } from "@/data/type-profiles";

/**
 * 2つのタイプ間の相性スコアを計算。
 * Big5研究に基づくヒューリスティック:
 *
 *  1. 主軸が一致 → 「同じ核の価値観」を持つ (+4)
 *  2. 主軸と副軸のクロス一致 → 「補完的な理解」(+2 each direction)
 *  3. 副軸が一致 → 「同じ支援スタイル」(+1)
 *  4. 両方がN(神経症傾向)を top2 に持つ → 「不安の増幅」(-5)
 *     (Malouff メタ分析: N低が恋愛満足度の最強予測因子)
 *  5. 片方が N 主軸、もう片方が C or A 主軸 → 「安定の供与」(+2)
 */
export function compatibilityScore(a: TypeProfile, b: TypeProfile): number {
  if (a.code === b.code) return 0;
  let score = 0;

  // 1. 主軸一致
  if (a.primaryAxis === b.primaryAxis) score += 4;

  // 2. クロス一致
  if (a.primaryAxis === b.secondaryAxis) score += 2;
  if (a.secondaryAxis === b.primaryAxis) score += 2;

  // 3. 副軸一致
  if (a.secondaryAxis === b.secondaryAxis) score += 1;

  // 4. N の増幅ペナルティ
  const aHasN = a.primaryAxis === "N" || a.secondaryAxis === "N";
  const bHasN = b.primaryAxis === "N" || b.secondaryAxis === "N";
  if (aHasN && bHasN) score -= 5;

  // 5. N ×（C or A）の安定化ボーナス
  if (a.primaryAxis === "N" && (b.primaryAxis === "C" || b.primaryAxis === "A")) {
    score += 2;
  }
  if (b.primaryAxis === "N" && (a.primaryAxis === "C" || a.primaryAxis === "A")) {
    score += 2;
  }

  return score;
}

export interface CompatibilityResult {
  good: TypeProfile[];
  bad: TypeProfile[];
}

/**
 * 指定タイプに対する相性の上位3つ・下位3つを返す
 */
export function getCompatibility(profile: TypeProfile): CompatibilityResult {
  const others = getAllProfiles().filter((p) => p.code !== profile.code);
  const scored = others.map((p) => ({
    profile: p,
    score: compatibilityScore(profile, p),
  }));

  const sorted = [...scored].sort((a, b) => b.score - a.score);

  return {
    good: sorted.slice(0, 3).map((s) => s.profile),
    bad: sorted.slice(-3).reverse().map((s) => s.profile),
  };
}
