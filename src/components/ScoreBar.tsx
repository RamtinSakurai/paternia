"use client";

import type { Axis } from "@/data/questions";
import { AXIS_LABELS, AXIS_DESCRIPTIONS } from "@/data/questions";
import { getScoreLabel } from "@/lib/diagnosis";
import { getFactsForScore } from "@/data/research-facts";

const AXIS_COLOR_CLASSES: Record<Axis, string> = {
  O: "bg-axis-o",
  C: "bg-axis-c",
  E: "bg-axis-e",
  A: "bg-axis-a",
  N: "bg-axis-n",
};

const AXIS_TEXT_CLASSES: Record<Axis, string> = {
  O: "text-axis-o",
  C: "text-axis-c",
  E: "text-axis-e",
  A: "text-axis-a",
  N: "text-axis-n",
};

const AXIS_FACT_STYLES: Record<Axis, { bg: string; border: string; accent: string }> = {
  O: { bg: "rgba(0,212,255,0.12)", border: "rgba(0,212,255,0.35)", accent: "#00d4ff" },
  C: { bg: "rgba(255,176,32,0.12)", border: "rgba(255,176,32,0.35)", accent: "#ffb020" },
  E: { bg: "rgba(255,107,107,0.12)", border: "rgba(255,107,107,0.35)", accent: "#ff6b6b" },
  A: { bg: "rgba(126,232,199,0.12)", border: "rgba(126,232,199,0.35)", accent: "#7ee8c7" },
  N: { bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.35)", accent: "#a78bfa" },
};

interface Props {
  axis: Axis;
  score: number;
  delay?: number;
}

export default function ScoreBar({ axis, score, delay = 0 }: Props) {
  const percent = Math.round(score * 100);
  const label = getScoreLabel(score);
  const facts = getFactsForScore(axis, score);
  const fact = facts.length > 0 ? facts[0] : null;

  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${AXIS_TEXT_CLASSES[axis]}`}
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {axis}
          </span>
          <span className="text-xs text-text-muted">
            {AXIS_LABELS[axis]}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-lg font-semibold tabular-nums"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {percent}
          </span>
          <span className="text-[10px] text-text-muted">{label}</span>
        </div>
      </div>

      {/* Bar */}
      <div className="h-2 bg-border rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full animate-grow ${AXIS_COLOR_CLASSES[axis]}`}
          style={{
            width: `${percent}%`,
            animationDelay: `${delay + 200}ms`,
          }}
        />
      </div>

      {/* Description */}
      <p className="text-[11px] text-text-muted leading-relaxed mb-1">
        {AXIS_DESCRIPTIONS[axis]}
      </p>

      {/* Research fact */}
      {fact && (
        <div
          className="mt-3 px-4 py-3.5 rounded-xl"
          style={{
            background: AXIS_FACT_STYLES[axis].bg,
            borderLeft: `3px solid ${AXIS_FACT_STYLES[axis].accent}`,
          }}
        >
          <p className="text-[11px] mb-1.5" style={{ color: AXIS_FACT_STYLES[axis].accent }}>
            豆知識
          </p>
          <p className="text-[13px] text-text leading-[1.7] font-medium">
            {fact.text}
          </p>
          <p className="text-[11px] text-text-muted mt-1.5">
            {fact.source}
          </p>
        </div>
      )}
    </div>
  );
}
