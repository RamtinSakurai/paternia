"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import type { Scores } from "@/lib/diagnosis";
import { getTypeCode, getTypeProfile } from "@/lib/diagnosis";
import { UNIVERSAL_ARTICLES } from "@/data/type-profiles";
import { AXIS_LABELS, type Axis } from "@/data/questions";
import PatternCanvas from "@/components/PatternCanvas";
import ScoreBar from "@/components/ScoreBar";
import Big5Summary from "@/components/Big5Summary";
import { trackShare, trackResultView, trackNoteClick } from "@/lib/analytics";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // If the URL has no scores at all, redirect to quiz
  const hasAnyScore =
    searchParams.has("O") ||
    searchParams.has("C") ||
    searchParams.has("E") ||
    searchParams.has("A") ||
    searchParams.has("N");

  const scores: Scores = {
    O: parseFloat(searchParams.get("O") || "0.5"),
    C: parseFloat(searchParams.get("C") || "0.5"),
    E: parseFloat(searchParams.get("E") || "0.5"),
    A: parseFloat(searchParams.get("A") || "0.5"),
    N: parseFloat(searchParams.get("N") || "0.5"),
  };

  const code = searchParams.get("code") || getTypeCode(scores);
  const profile = getTypeProfile(scores);

  const axes: Axis[] = ["O", "C", "E", "A", "N"];
  const [copied, setCopied] = useState(false);

  // Redirect to quiz if accessed without scores + track view
  useEffect(() => {
    if (!hasAnyScore) {
      router.replace("/quiz");
    } else {
      trackResultView(profile.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAnyScore]);

  if (!hasAnyScore) {
    return null;
  }

  const shareText = `模様診断: ${profile.name}\n${profile.catchCopy}\n\n#模様診断 #Big5`;

  const handleShareX = () => {
    trackShare("x", profile.code);
    const url = window.location.href;
    const text = encodeURIComponent(shareText);
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleShareLine = () => {
    trackShare("line", profile.code);
    const url = window.location.href;
    const text = encodeURIComponent(`${shareText}\n${url}`);
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopy = async () => {
    trackShare("copy", profile.code);
    try {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleRestart = () => {
    try {
      sessionStorage.removeItem("moyou_quiz_progress");
    } catch {
      // ignore
    }
    router.push("/quiz");
  };

  return (
    <div className="min-h-dvh flex flex-col px-5 pt-5 pb-16">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="text-accent/80 hover:text-accent transition-colors text-[15px] tracking-[0.08em] lowercase"
          style={{ fontFamily: "var(--font-fredoka)" }}
          aria-label="トップへ"
        >
          paternia
        </Link>
        <Link
          href="/gallery"
          className="text-[11px] text-text-muted hover:text-accent transition-colors tracking-wider"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          GALLERY →
        </Link>
      </div>

      {/* Section 1: Pattern Art + Type Name + Catch Copy */}
      <section className="flex flex-col items-center gap-5 mb-12 animate-fade-up">
        <p
          className="text-[11px] tracking-[0.25em] text-text-muted"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          YOUR PATTERN
        </p>

        <PatternCanvas scores={scores} size={260} />

        <div className="text-center">
          <p
            className="text-xs text-accent/80 tracking-[0.3em] mb-1"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {profile.code}
          </p>
          <p className="text-[10px] text-text-muted/60 tracking-wider mb-2">
            {AXIS_LABELS[profile.primaryAxis]} × {AXIS_LABELS[profile.secondaryAxis]}
          </p>
          <h1
            className="text-[26px] font-medium mb-3"
            style={{ fontFamily: "var(--font-kiwi-maru)" }}
          >
            {profile.name}
          </h1>
          <p className="text-[13px] text-text-muted leading-[1.8] max-w-[300px] px-3">
            {profile.catchCopy}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="w-12 h-px bg-border mx-auto mb-10" />

      {/* Section 2: Personality Summary (moved up: before Big5) */}
      <section className="mb-12 animate-fade-up stagger-2">
        <h2
          className="text-sm tracking-[0.2em] text-text-muted mb-6 text-center"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          YOUR PERSONALITY
        </h2>

        <div className="p-5 rounded-2xl bg-bg-card border border-border">
          <p className="text-[14px] leading-[1.9]">{profile.summary}</p>
        </div>
      </section>

      {/* Divider */}
      <div className="w-12 h-px bg-border mx-auto mb-10" />

      {/* Section 3: Big5 Scores */}
      <section className="mb-12">
        <h2
          className="text-sm tracking-[0.2em] text-text-muted mb-5 text-center animate-fade-up"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          BIG FIVE SCORES
        </h2>

        {/* At-a-glance summary -- all 5 axes visible without scrolling */}
        <div className="animate-fade-up mb-6">
          <Big5Summary scores={scores} />
        </div>

        {/* Detailed cards with 豆知識 */}
        <p className="text-[11px] text-text-muted/70 text-center mb-4 tracking-wider animate-fade-up">
          ── 詳しく見る ──
        </p>
        <div className="flex flex-col gap-6">
          {axes.map((axis, i) => (
            <ScoreBar
              key={axis}
              axis={axis}
              score={scores[axis]}
              delay={i * 120}
            />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-12 h-px bg-border mx-auto mb-10" />

      {/* Section 4: note deep-dive CTA (no price shown) */}
      {profile.noteUrl && (
        <section className="mb-10 animate-fade-up stagger-3">
          <h2
            className="text-sm tracking-[0.2em] text-text-muted mb-4 text-center"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            MORE ABOUT YOU
          </h2>
          <a
            href={profile.noteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackNoteClick(profile.code, "result")}
            className="block p-5 rounded-2xl bg-gradient-to-br from-accent/15 via-bg-card to-bg-card
                       border border-accent/40 hover:border-accent/80 active:scale-[0.98]
                       transition-all"
          >
            <p
              className="text-[10px] text-accent/80 tracking-[0.25em] mb-3"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              READ DEEPER  ·  note
            </p>
            <p
              className="text-[17px] text-text font-medium leading-[1.55] mb-3"
              style={{ fontFamily: "var(--font-kiwi-maru)" }}
            >
              あなたの恋愛、キャリア、生き方まで。
            </p>
            <p className="text-[12px] text-text-muted leading-[1.85] mb-3">
              {profile.noteTitle}
            </p>
            <p className="text-[11px] text-text-muted/80 leading-[1.85] mb-4">
              恋愛で繰り返してしまう理由、仕事で輝く瞬間、疲れたときの処方箋まで。論文引用と30日ワーク付き、約7,000字。
            </p>
            <div className="flex items-center justify-end">
              <span className="text-[13px] text-accent font-medium whitespace-nowrap">
                もっと自分を知る →
              </span>
            </div>
          </a>
        </section>
      )}

      {/* Divider */}
      <div className="w-12 h-px bg-border mx-auto mb-10" />

      {/* Section 7: Representative Examples (moved after CTA block) */}
      <section className="mb-12 animate-fade-up stagger-6">
        <h2
          className="text-sm tracking-[0.2em] text-text-muted mb-6 text-center"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          REPRESENTATIVE
        </h2>

        <div className="space-y-3">
          {/* Historical */}
          <div className="p-4 rounded-xl bg-bg-card border border-border">
            <p className="text-[11px] text-accent tracking-wider mb-2">
              歴史上の人物
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.examples.historical.map((h) => (
                <span
                  key={h}
                  className="text-[13px] px-3 py-1 rounded-full bg-accent/10 border border-accent/20"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Archetype */}
          <div className="p-4 rounded-xl bg-bg-card border border-border">
            <p className="text-[11px] text-accent tracking-wider mb-2">
              アーキタイプ
            </p>
            <p className="text-[14px]">{profile.examples.archetype}</p>
          </div>

          {/* Lifestyle */}
          <div className="p-4 rounded-xl bg-bg-card border border-border">
            <p className="text-[11px] text-accent tracking-wider mb-2">
              ライフスタイル
            </p>
            <p className="text-[13px] leading-relaxed text-text-muted">
              {profile.examples.lifestyle}
            </p>
          </div>
        </div>
      </section>

      {/* Section 4.6: Compatibility Universal CTA (U1) */}
      {UNIVERSAL_ARTICLES.compatibility.noteUrl && (
        <section className="mb-10 animate-fade-up stagger-6">
          <h2
            className="text-sm tracking-[0.2em] text-text-muted mb-4 text-center"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            COMPATIBILITY MAP
          </h2>
          <a
            href={UNIVERSAL_ARTICLES.compatibility.noteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackNoteClick("U1", "result")}
            className="block p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-bg-card to-bg-card
                       border border-amber-400/40 hover:border-amber-400/80 active:scale-[0.98]
                       transition-all"
          >
            <p
              className="text-[10px] tracking-[0.25em] mb-3"
              style={{ fontFamily: "var(--font-fredoka)", color: "#ffd154" }}
            >
              ALL 190 PAIRS  ·  note
            </p>
            <p
              className="text-[17px] text-text font-medium leading-[1.55] mb-3"
              style={{ fontFamily: "var(--font-kiwi-maru)" }}
            >
              {UNIVERSAL_ARTICLES.compatibility.tagline}
            </p>
            <p className="text-[12px] text-text-muted leading-[1.85] mb-3">
              {UNIVERSAL_ARTICLES.compatibility.noteTitle}
            </p>
            <p className="text-[11px] text-text-muted/80 leading-[1.85] mb-4">
              {UNIVERSAL_ARTICLES.compatibility.description}
            </p>
            <div className="flex items-center justify-end">
              <span
                className="text-[13px] font-medium whitespace-nowrap"
                style={{ color: "#ffd154" }}
              >
                190ペア全部を読む →
              </span>
            </div>
          </a>
        </section>
      )}

      {/* Section 4.7: Love guide CTA (U2) */}
      {UNIVERSAL_ARTICLES.love.noteUrl && (
        <section className="mb-10 animate-fade-up stagger-6">
          <h2
            className="text-sm tracking-[0.2em] text-text-muted mb-4 text-center"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            LOVE GUIDE
          </h2>
          <a
            href={UNIVERSAL_ARTICLES.love.noteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackNoteClick("U2", "result")}
            className="block p-5 rounded-2xl bg-gradient-to-br from-rose-500/15 via-bg-card to-bg-card
                       border border-rose-400/40 hover:border-rose-400/80 active:scale-[0.98]
                       transition-all"
          >
            <p
              className="text-[10px] tracking-[0.25em] mb-3"
              style={{ fontFamily: "var(--font-fredoka)", color: "#ff8ab0" }}
            >
              ALL ABOUT LOVE  ·  note
            </p>
            <p
              className="text-[17px] text-text font-medium leading-[1.55] mb-3"
              style={{ fontFamily: "var(--font-kiwi-maru)" }}
            >
              {UNIVERSAL_ARTICLES.love.tagline}
            </p>
            <p className="text-[12px] text-text-muted leading-[1.85] mb-3">
              {UNIVERSAL_ARTICLES.love.noteTitle}
            </p>
            <p className="text-[11px] text-text-muted/80 leading-[1.85] mb-4">
              {UNIVERSAL_ARTICLES.love.description}
            </p>
            <div className="flex items-center justify-end">
              <span
                className="text-[13px] font-medium whitespace-nowrap"
                style={{ color: "#ff8ab0" }}
              >
                恋愛の全体像を読む →
              </span>
            </div>
          </a>
        </section>
      )}

      {/* Divider */}
      <div className="w-12 h-px bg-border mx-auto mb-10" />

      {/* Section 5: Share & Actions */}
      <section className="flex flex-col items-center gap-3 animate-fade-up stagger-6">
        <p className="text-[11px] tracking-[0.2em] text-text-muted mb-1" style={{ fontFamily: "var(--font-fredoka)" }}>
          SHARE
        </p>
        <div className="grid grid-cols-3 gap-2 w-full mb-1">
          <button
            onClick={handleShareX}
            className="flex flex-col items-center gap-1 py-3 bg-bg-card border border-border rounded-xl
                       hover:border-accent/40 active:scale-[0.96] transition-all"
            aria-label="Xでシェア"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-text">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-[10px] text-text-muted">X</span>
          </button>
          <button
            onClick={handleShareLine}
            className="flex flex-col items-center gap-1 py-3 bg-bg-card border border-border rounded-xl
                       hover:border-[#06C755]/50 active:scale-[0.96] transition-all"
            aria-label="LINEでシェア"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#06C755">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.63V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.63V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v3.742h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            <span className="text-[10px] text-text-muted">LINE</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex flex-col items-center gap-1 py-3 bg-bg-card border border-border rounded-xl
                       hover:border-accent/40 active:scale-[0.96] transition-all relative"
            aria-label="URLをコピー"
          >
            {copied ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )}
            <span className="text-[10px] text-text-muted">
              {copied ? "コピー済" : "URL"}
            </span>
          </button>
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-3.5 bg-transparent border border-border rounded-xl
                     text-text-muted text-sm font-medium tracking-wider
                     hover:border-text-muted/30 active:scale-[0.98] transition-all mt-2"
          style={{ fontFamily: "var(--font-kiwi-maru)" }}
        >
          もう一度診断する
        </button>

        <p className="text-[10px] text-text-muted/50 mt-4 text-center leading-relaxed">
          Based on Big Five Personality Model
          <br />
          Chamorro-Premuzic, Palmer & Schloss, Barrick & Mount, et al.
        </p>
      </section>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-accent"
                style={{
                  animation: "pulse-soft 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
