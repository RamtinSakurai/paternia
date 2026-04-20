"use client";

import type { Scores } from "@/lib/diagnosis";
import type { Axis } from "@/data/questions";
import { AXIS_LABELS } from "@/data/questions";
import { getScoreLabel } from "@/lib/diagnosis";

interface Props {
  scores: Scores;
}

const AXIS_ORDER: Axis[] = ["O", "C", "E", "A", "N"];

const AXIS_COLORS: Record<Axis, string> = {
  O: "#00d4ff",
  C: "#ffb020",
  E: "#ff6b6b",
  A: "#7ee8c7",
  N: "#a78bfa",
};

/**
 * コンパクトな5軸サマリー -- スクロールなしで一目で全スコアが見える
 */
export default function Big5Summary({ scores }: Props) {
  return (
    <div className="w-full rounded-2xl bg-bg-card border border-border p-4 space-y-2.5">
      {AXIS_ORDER.map((axis) => {
        const score = scores[axis];
        const percent = Math.round(score * 100);
        const color = AXIS_COLORS[axis];
        const label = getScoreLabel(score);

        return (
          <div key={axis} className="flex items-center gap-3">
            {/* Axis letter */}
            <span
              className="w-4 text-sm font-medium shrink-0 text-center"
              style={{
                fontFamily: "var(--font-fredoka)",
                color,
              }}
            >
              {axis}
            </span>

            {/* Axis name */}
            <span className="text-[12px] text-text-muted w-14 shrink-0">
              {AXIS_LABELS[axis]}
            </span>

            {/* Bar */}
            <div className="flex-1 h-1.5 bg-border/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full animate-grow"
                style={{
                  width: `${percent}%`,
                  background: color,
                  animationDelay: `${AXIS_ORDER.indexOf(axis) * 80}ms`,
                }}
              />
            </div>

            {/* Number + Label */}
            <div className="flex items-baseline gap-1 shrink-0 w-[5.5rem] justify-end">
              <span
                className="text-[15px] font-semibold tabular-nums"
                style={{ fontFamily: "var(--font-fredoka)", color }}
              >
                {percent}
              </span>
              <span className="text-[9px] text-text-muted/80">{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
