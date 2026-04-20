"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MiniPatternCanvas from "@/components/MiniPatternCanvas";
import type { Axis } from "@/data/questions";

interface LastResult {
  query: string;
  takenAt: number;
}

// Showcase samples for hero preview
const HERO_SAMPLES: Array<{ primary: Axis; secondary: Axis }> = [
  { primary: "O", secondary: "E" }, // 虹色の旅人
  { primary: "E", secondary: "O" }, // 夜空の革命児
  { primary: "A", secondary: "E" }, // 陽だまりの主
  { primary: "N", secondary: "E" }, // 警鐘を鳴らす者
  { primary: "C", secondary: "A" }, // 藍色の守り手
  { primary: "O", secondary: "N" }, // 夢の建築家
];

export default function Home() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastResult, setLastResult] = useState<LastResult | null>(null);
  const [sampleIdx, setSampleIdx] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("moyou_last_result");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.query) {
          setLastResult({ query: data.query, takenAt: data.takenAt || 0 });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Rotate through sample patterns
  useEffect(() => {
    const id = setInterval(() => {
      setSampleIdx((i) => (i + 1) % HERO_SAMPLES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const orbs = [
        { x: 0.3, y: 0.3, r: 180, color: "rgba(157,143,255,0.08)" },
        { x: 0.7, y: 0.6, r: 200, color: "rgba(0,212,255,0.06)" },
        { x: 0.5, y: 0.8, r: 160, color: "rgba(255,107,107,0.05)" },
      ];

      orbs.forEach((orb, i) => {
        const ox = orb.x * canvas.width + Math.sin(t + i * 2) * 40;
        const oy = orb.y * canvas.height + Math.cos(t * 0.7 + i) * 30;
        const gradient = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      for (let i = 0; i < 30; i++) {
        const px =
          ((Math.sin(t * 0.5 + i * 0.7) + 1) / 2) * canvas.width;
        const py =
          ((Math.cos(t * 0.3 + i * 1.1) + 1) / 2) * canvas.height;
        const size = 1.5 + Math.sin(t + i) * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(157,143,255,${0.15 + Math.sin(t + i) * 0.1})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center px-6 pb-12">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center gap-5 text-center">
        {/* Hero pattern preview (auto-rotating with crossfade) */}
        <div className="relative" style={{ width: 130, height: 130 }}>
          <div
            key={sampleIdx}
            className="animate-fade-in absolute inset-0 opacity-90"
          >
            <MiniPatternCanvas
              primary={HERO_SAMPLES[sampleIdx].primary}
              secondary={HERO_SAMPLES[sampleIdx].secondary}
              size={130}
            />
          </div>
        </div>

        <div className="animate-fade-up">
          <p
            className="text-[20px] tracking-[0.15em] text-accent font-normal mb-3 lowercase"
            style={{ fontFamily: "var(--font-fredoka)", letterSpacing: "0.08em" }}
          >
            paternia
          </p>
          <h1
            className="text-[1.75rem] leading-snug font-medium"
            style={{ fontFamily: "var(--font-kiwi-maru)" }}
          >
            あなたの性格が
            <br />
            <span className="text-accent">模様</span>になる
          </h1>
        </div>

        <p className="animate-fade-up stagger-1 text-[13px] leading-relaxed max-w-[260px]" style={{ color: "#b4b4cc" }}>
          心理学のビッグファイブをもとに
          <br />
          45問の回答からあなただけの模様が生まれる
        </p>

        <div className="animate-fade-up stagger-2 flex gap-4 text-[12px]" style={{ color: "#a0a0c0" }}>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            45問
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            約5分
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            登録不要
          </span>
        </div>

        <button
          onClick={() => router.push("/quiz")}
          className="animate-fade-up stagger-3 mt-2 relative group"
        >
          <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl group-hover:bg-accent/30 transition-all" />
          <div
            className="relative px-12 py-3.5 bg-accent/10 border border-accent/30 rounded-2xl
                        text-accent font-medium tracking-wider text-[15px]
                        hover:bg-accent/20 hover:border-accent/50
                        active:scale-[0.97]
                        transition-all duration-200"
            style={{ fontFamily: "var(--font-kiwi-maru)" }}
          >
            診断をはじめる
          </div>
        </button>

        {lastResult && (
          <button
            onClick={() => router.push(`/result?${lastResult.query}`)}
            className="animate-fade-up text-[12px] text-accent/80 hover:text-accent transition-colors underline underline-offset-4 decoration-accent/30 mt-1"
            style={{ fontFamily: "var(--font-kiwi-maru)" }}
          >
            前回の結果を見る
          </button>
        )}

        <button
          onClick={() => router.push("/gallery")}
          className="animate-fade-up stagger-4 text-[12px] text-text-muted hover:text-accent transition-colors underline underline-offset-4 decoration-text-muted/30 mt-1"
          style={{ fontFamily: "var(--font-kiwi-maru)" }}
        >
          20の模様を見る
        </button>

        <p className="animate-fade-up stagger-5 text-[10px] text-text-muted/50 mt-1">
          Based on Big Five Personality Model
        </p>
      </div>
    </div>
  );
}
