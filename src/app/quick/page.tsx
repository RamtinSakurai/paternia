"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QUICK_QUESTIONS } from "@/data/questions";
import { calculateScores, getTypeCode } from "@/lib/diagnosis";
import {
  trackDiagnosisStarted,
  trackDiagnosisCompleted,
  trackQuestionAnswered,
} from "@/lib/analytics";

const DOT_SIZES = [24, 30, 40, 30, 24];
const DOT_LABELS = ["反対", "", "中立", "", "同意"];
const STORAGE_KEY = "moyou_quick_progress";

export default function QuickQuizPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore progress on mount + track start
  useEffect(() => {
    let restored = false;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (
          Array.isArray(data.answers) &&
          typeof data.currentQ === "number" &&
          data.answers.length === data.currentQ
        ) {
          setAnswers(data.answers);
          setCurrentQ(data.currentQ);
          restored = true;
        }
      }
    } catch {
      // ignore
    }
    if (!restored) {
      trackDiagnosisStarted("quick");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentQ, answers })
      );
    } catch {
      // ignore
    }
  }, [currentQ, answers, hydrated]);

  const question = QUICK_QUESTIONS[currentQ];
  const progress = (currentQ / QUICK_QUESTIONS.length) * 100;

  const handleSelect = useCallback(
    (value: number) => {
      if (transitioning) return;
      setSelected(value);
      setTransitioning(true);

      setTimeout(() => {
        const newAnswers = [...answers, value];
        setAnswers(newAnswers);
        trackQuestionAnswered("quick", currentQ + 1, QUICK_QUESTIONS.length);

        if (currentQ + 1 >= QUICK_QUESTIONS.length) {
          // 10問版のスコアリングは 45問版と同じロジックを共有
          const scores = calculateScores(newAnswers, QUICK_QUESTIONS);
          const code = getTypeCode(scores);
          const params = new URLSearchParams({
            O: scores.O.toFixed(3),
            C: scores.C.toFixed(3),
            E: scores.E.toFixed(3),
            A: scores.A.toFixed(3),
            N: scores.N.toFixed(3),
            code,
            mode: "quick",
          });
          try {
            sessionStorage.removeItem(STORAGE_KEY);
            localStorage.setItem(
              "moyou_last_result",
              JSON.stringify({
                scores,
                code,
                mode: "quick",
                takenAt: Date.now(),
                query: params.toString(),
              })
            );
          } catch {
            // ignore
          }
          trackDiagnosisCompleted("quick", code);
          router.push(`/result?${params.toString()}`);
        } else {
          setCurrentQ(currentQ + 1);
          setSelected(null);
          setTransitioning(false);
        }
      }, 350);
    },
    [currentQ, answers, transitioning, router]
  );

  const handleBack = useCallback(() => {
    if (currentQ === 0 || transitioning) return;
    setCurrentQ(currentQ - 1);
    setAnswers(answers.slice(0, -1));
    setSelected(null);
  }, [currentQ, answers, transitioning]);

  return (
    <div className="min-h-dvh flex flex-col px-5 pt-6 pb-10">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={handleBack}
          disabled={currentQ === 0}
          className="text-text-muted disabled:opacity-20 hover:text-accent transition-colors p-1 -ml-1"
          aria-label="前の質問へ"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="flex-1 relative h-[4px]">
          <div className="absolute inset-0 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span
          className="text-xs text-text-muted tabular-nums min-w-[3rem] text-right"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {currentQ + 1}/{QUICK_QUESTIONS.length}
        </span>
      </div>
      <p
        className="text-[10px] text-accent/70 tracking-[0.25em] text-center mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        QUICK · 約 1 分
      </p>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 -mt-16">
        <div
          key={currentQ}
          className={`flex flex-col items-center gap-10 w-full transition-all duration-300 ${
            transitioning
              ? "opacity-0 translate-y-3"
              : "opacity-100 translate-y-0"
          }`}
        >
          <h2
            className="text-lg font-medium text-center leading-relaxed px-2 min-h-[4rem] flex items-center"
            style={{ fontFamily: "var(--font-kiwi-maru)" }}
          >
            {question.text}
          </h2>

          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between text-xs text-text-muted px-1">
              <span className="max-w-[40%] leading-snug">
                {question.labels[0]}
              </span>
              <span className="max-w-[40%] leading-snug text-right">
                {question.labels[1]}
              </span>
            </div>

            <div className="flex justify-center items-start gap-[clamp(16px,6vw,36px)]">
              {DOT_SIZES.map((size, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={() => handleSelect(i)}
                    className={`rounded-full border-2 transition-all duration-200 ${
                      selected === i
                        ? "border-accent bg-accent scale-110"
                        : "border-text-muted/40 bg-transparent hover:border-accent/60 active:scale-110"
                    }`}
                    style={{ width: size, height: size }}
                    aria-label={DOT_LABELS[i] || `${i + 1}/5`}
                  />
                  <span className="text-[10px] text-text-muted/60 h-3">
                    {DOT_LABELS[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
