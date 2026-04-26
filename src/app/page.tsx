"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MiniPatternCanvas from "@/components/MiniPatternCanvas";
import HoroscopeFrame from "@/components/HoroscopeFrame";
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

    // Seeded pseudo-random for stable star positions
    const sr = (n: number) => {
      const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    // Position helper — push stars away from a central "safe zone" so
    // they don't crowd the text content in the middle of the screen.
    const pushFromCenter = (x0: number, y0: number, safeRadius = 0.26) => {
      const dx = x0 - 0.5;
      const dy = y0 - 0.5;
      const d = Math.hypot(dx, dy);
      if (d < safeRadius && d > 0.001) {
        const scale = safeRadius / d;
        return {
          x: Math.max(0.02, Math.min(0.98, 0.5 + dx * scale)),
          y: Math.max(0.02, Math.min(0.98, 0.5 + dy * scale)),
        };
      }
      return { x: x0, y: y0 };
    };

    // 3-layer starfield — 80 stars total (far 45 / mid 25 / near 10)
    type Star = {
      x: number; y: number;
      size: number; baseOpacity: number;
      phase: number; twinkleSpeed: number;
      rgb: [number, number, number];
      glow: boolean;
    };
    const pickRgb = (tone: number): [number, number, number] => {
      if (tone < 0.6) return [235, 229, 245];   // ivory
      if (tone < 0.8) return [232, 203, 149];   // gold
      if (tone < 0.95) return [181, 184, 200];  // silver
      return [155, 143, 212];                    // mystic
    };
    const stars: Star[] = [];
    // Far layer — small, dim, numerous
    for (let i = 0; i < 45; i++) {
      const p = pushFromCenter(sr(i * 7.13 + 1), sr(i * 13.79 + 1));
      stars.push({
        x: p.x, y: p.y,
        size: 0.35 + sr(i * 21.37 + 1) * 0.55,
        baseOpacity: 0.10 + sr(i * 29.11 + 1) * 0.18,
        phase: sr(i * 37.53 + 1) * Math.PI * 2,
        twinkleSpeed: 0.4 + sr(i * 43.7 + 1) * 0.6,
        rgb: pickRgb(sr(i * 2.17 + 1)),
        glow: false,
      });
    }
    // Mid layer — medium size, medium opacity
    for (let i = 0; i < 25; i++) {
      const p = pushFromCenter(sr(i * 7.13 + 2), sr(i * 13.79 + 2), 0.28);
      stars.push({
        x: p.x, y: p.y,
        size: 0.9 + sr(i * 21.37 + 2) * 0.6,
        baseOpacity: 0.22 + sr(i * 29.11 + 2) * 0.22,
        phase: sr(i * 37.53 + 2) * Math.PI * 2,
        twinkleSpeed: 0.7 + sr(i * 43.7 + 2) * 1.1,
        rgb: pickRgb(sr(i * 2.17 + 2)),
        glow: false,
      });
    }
    // Near layer — bright, fewer, with glow
    for (let i = 0; i < 10; i++) {
      const p = pushFromCenter(sr(i * 7.13 + 3), sr(i * 13.79 + 3), 0.32);
      stars.push({
        x: p.x, y: p.y,
        size: 1.6 + sr(i * 21.37 + 3) * 0.9,
        baseOpacity: 0.35 + sr(i * 29.11 + 3) * 0.25,
        phase: sr(i * 37.53 + 3) * Math.PI * 2,
        twinkleSpeed: 0.9 + sr(i * 43.7 + 3) * 1.6,
        rgb: pickRgb(sr(i * 2.17 + 3)),
        glow: true,
      });
    }

    // Big5 pentagon backdrop — paternia-specific motif behind everything
    const pentagonAngles = [0, 72, 144, 216, 288]; // 5 points, O at top

    // Shooting star state
    type Shooter = { x: number; y: number; vx: number; vy: number; life: number };
    let shooters: Shooter[] = [];
    let nextShooterAt = 2 + Math.random() * 5;

    const draw = () => {
      t += 0.006;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // ambient nebula glow — top-left mystic, bottom-right gold
      const g1 = ctx.createRadialGradient(
        w * 0.2,
        h * 0.2,
        0,
        w * 0.2,
        h * 0.2,
        Math.max(w, h) * 0.55
      );
      g1.addColorStop(0, "rgba(155,143,212,0.08)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);
      const g2 = ctx.createRadialGradient(
        w * 0.85,
        h * 0.9,
        0,
        w * 0.85,
        h * 0.9,
        Math.max(w, h) * 0.5
      );
      g2.addColorStop(0, "rgba(212,181,128,0.05)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Big5 pentagon backdrop — faint, centered, paternia-specific
      const cx = w / 2;
      const cy = h / 2;
      const pR = Math.min(w, h) * 0.36;
      const pts: [number, number][] = pentagonAngles.map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return [cx + Math.cos(rad) * pR, cy + Math.sin(rad) * pR];
      });
      // pentagon outline (faint gold, structure visible)
      ctx.strokeStyle = "rgba(216,187,137,0.10)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
      ctx.closePath();
      ctx.stroke();
      // 5 anchor dots at pentagon corners (slow breathing glow)
      const pulse = 0.55 + 0.45 * Math.sin(t * 0.4);
      pts.forEach((p) => {
        ctx.fillStyle = `rgba(216,187,137,${(0.40 * pulse).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 2.5, 0, Math.PI * 2);
        ctx.fill();
        // soft glow
        ctx.fillStyle = `rgba(216,187,137,${(0.10 * pulse).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 10, 0, Math.PI * 2);
        ctx.fill();
      });

      // stars — drawn AFTER pentagon so they sit on top
      stars.forEach((s) => {
        const twinkle = 0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.phase);
        const opacity = s.baseOpacity * twinkle;
        ctx.fillStyle = `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${opacity.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.size, 0, Math.PI * 2);
        ctx.fill();
        if (s.glow) {
          ctx.fillStyle = `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${(opacity * 0.22).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(s.x * w, s.y * h, s.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // shooting stars
      if (t > nextShooterAt) {
        shooters.push({
          x: Math.random() * w * 0.4,
          y: Math.random() * h * 0.3,
          vx: 4 + Math.random() * 2,
          vy: 2 + Math.random() * 1.5,
          life: 1,
        });
        nextShooterAt = t + 4 + Math.random() * 8;
      }
      shooters = shooters.filter((sh) => {
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.012;
        if (sh.life <= 0) return false;
        const gradient = ctx.createLinearGradient(
          sh.x - sh.vx * 12,
          sh.y - sh.vy * 12,
          sh.x,
          sh.y
        );
        gradient.addColorStop(0, "rgba(232,203,149,0)");
        gradient.addColorStop(1, `rgba(232,203,149,${(sh.life * 0.8).toFixed(3)})`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(sh.x - sh.vx * 12, sh.y - sh.vy * 12);
        ctx.lineTo(sh.x, sh.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(235,229,245,${(sh.life * 0.9).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

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

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* ================== HERO (atlas observer style) ================== */}
        <p
          className="animate-fade-up text-[11px] tracking-[0.55em] text-accent/90 uppercase"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          atlas · specimen
        </p>

        {/* pattern medallion — the art is the hero */}
        <div className="animate-fade-up relative" style={{ width: 180, height: 180 }}>
          <HoroscopeFrame size={180} variant="mini">
            <div
              key={sampleIdx}
              className="animate-fade-in w-full h-full"
            >
              <MiniPatternCanvas
                primary={HERO_SAMPLES[sampleIdx].primary}
                secondary={HERO_SAMPLES[sampleIdx].secondary}
                size={160}
              />
            </div>
          </HoroscopeFrame>
        </div>

        {/* brand wordmark */}
        <p
          className="animate-fade-up stagger-1 text-[38px] tracking-[0.22em] leading-none"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontWeight: 500,
            color: "var(--color-accent-bright)",
            textShadow: "0 0 24px rgba(232, 203, 149, 0.25)",
          }}
        >
          paternia
        </p>

        {/* Japanese title */}
        <h1
          className="animate-fade-up stagger-2 text-[1.625rem] leading-snug font-medium tracking-[0.04em]"
          style={{ fontFamily: "var(--font-shippori)" }}
        >
          あなたの性格が
          <br />
          <span className="text-accent-bright">模様</span>になる
        </h1>

        {/* divider */}
        <div className="animate-fade-up stagger-2 flex items-center gap-3">
          <span className="w-10 h-px bg-accent/40" />
          <span className="text-accent/80 text-[10px]">✦</span>
          <span className="w-10 h-px bg-accent/40" />
        </div>

        <div className="animate-fade-up stagger-2 flex gap-4 text-[13px] tracking-wider" style={{ color: "var(--color-text)", fontFamily: "var(--font-kiwi-maru)" }}>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            無料
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            登録不要
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            最短1分
          </span>
        </div>

        {/* Primary CTA: Quick (10問・約1分) — defaultで目立たせる */}
        <button
          onClick={() => router.push("/quick")}
          className="animate-fade-up stagger-3 mt-2 relative group"
        >
          <div className="absolute inset-0 bg-accent/25 rounded-2xl blur-xl group-hover:bg-accent/35 transition-all" />
          <div
            className="relative px-10 py-3.5 bg-accent/15 border border-accent/50 rounded-2xl
                        text-accent font-semibold tracking-wider text-[15px]
                        hover:bg-accent/25 hover:border-accent/70
                        active:scale-[0.97]
                        transition-all duration-200"
            style={{ fontFamily: "var(--font-kiwi-maru)" }}
          >
            サクッと診断する
            <span className="ml-2 text-[11px] text-accent/70 font-normal tracking-wide">
              約1分 / 10問
            </span>
          </div>
        </button>

        {/* Secondary CTA: Full (45問・約4分) — same size as Primary, outline style */}
        <button
          onClick={() => router.push("/quiz")}
          className="animate-fade-up stagger-4 mt-2 relative group"
        >
          <div
            className="relative px-10 py-3.5 border border-accent/40 rounded-2xl
                        text-accent/85 font-medium tracking-wider text-[15px]
                        hover:bg-accent/10 hover:border-accent/70 hover:text-accent
                        active:scale-[0.97]
                        transition-all duration-200"
            style={{ fontFamily: "var(--font-kiwi-maru)" }}
          >
            じっくり診断する
            <span className="ml-2 text-[11px] text-accent/60 font-normal tracking-wide">
              約4分 / 45問
            </span>
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
          className="animate-fade-up stagger-4 text-[14px] text-text hover:text-accent transition-colors underline underline-offset-4 decoration-text-muted/60 mt-3"
          style={{ fontFamily: "var(--font-kiwi-maru)" }}
        >
          20の模様を見る
        </button>

        <p className="animate-fade-up stagger-5 text-[10px] text-text-muted/50 mt-1">
          Based on Big Five Personality Model
        </p>

        <div className="animate-fade-up stagger-5 mt-6 flex flex-col items-center gap-1.5">
          <p
            className="text-[12px] text-text-muted/75"
            style={{ fontFamily: "var(--font-kiwi-maru)" }}
          >
            黒幕の心理学を知りたい方はこちら
          </p>
          <span className="text-accent/60 text-[14px] leading-none">↓</span>
          <a
            href="https://lit.link/kuromaku_shinri"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-accent/85 hover:text-accent transition-colors underline underline-offset-4 decoration-accent/40 hover:decoration-accent/70 tracking-wide"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            lit.link/kuromaku_shinri
          </a>
        </div>
      </div>
    </div>
  );
}
