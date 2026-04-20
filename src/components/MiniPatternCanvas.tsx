"use client";

import { useEffect, useRef } from "react";
import type { Axis } from "@/data/questions";
import PatternCanvas from "./PatternCanvas";

interface Props {
  primary: Axis;
  secondary: Axis;
  size?: number;
}

/**
 * ギャラリー用の小さなパターンプレビュー。
 * 指定されたprimary/secondary軸から代表的なスコアを合成し、
 * PatternCanvasに渡す。
 */
export default function MiniPatternCanvas({ primary, secondary, size = 140 }: Props) {
  // Primary axis: 0.95, Secondary axis: 0.85, others: 0.5
  const scores = {
    O: primary === "O" ? 0.95 : secondary === "O" ? 0.85 : 0.5,
    C: primary === "C" ? 0.95 : secondary === "C" ? 0.85 : 0.5,
    E: primary === "E" ? 0.95 : secondary === "E" ? 0.85 : 0.5,
    A: primary === "A" ? 0.95 : secondary === "A" ? 0.85 : 0.5,
    N: primary === "N" ? 0.95 : secondary === "N" ? 0.85 : 0.5,
  };

  return <PatternCanvas scores={scores} size={size} />;
}
