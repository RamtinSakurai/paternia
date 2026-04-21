"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MiniPatternCanvas from "@/components/MiniPatternCanvas";
import HoroscopeFrame from "@/components/HoroscopeFrame";
import { getTypeKey, type Scores } from "@/lib/diagnosis";
import { AXIS_LABELS } from "@/data/questions";
import { UNIVERSAL_ARTICLES, type TypeProfile } from "@/data/type-profiles";
import { trackGalleryTypeView, trackShare, trackNoteClick } from "@/lib/analytics";

interface Props {
  profile: TypeProfile;
  good: TypeProfile[];
  bad: TypeProfile[];
}

export default function ClientView({ profile, good, bad }: Props) {
  const [isMine, setIsMine] = useState(false);
  const [resultQuery, setResultQuery] = useState<string | null>(null);

  useEffect(() => {
    let mine = false;
    try {
      const raw = localStorage.getItem("moyou_last_result");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.scores && getTypeKey(data.scores as Scores) === profile.code) {
          setIsMine(true);
          mine = true;
          if (data.query) setResultQuery(data.query);
        }
      }
    } catch {
      // ignore
    }
    trackGalleryTypeView(profile.code, mine);
  }, [profile.code]);

  const shareText = `${profile.name}\n${profile.catchCopy}\n\n#模様診断 #Big5`;

  const handleShare = () => {
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${profile.name}(${profile.code}) — ${profile.catchCopy}`,
    description: profile.summary,
    url: `https://paternia.vercel.app/gallery/${profile.code}/`,
    inLanguage: "ja-JP",
    author: { "@type": "Organization", name: "paternia", url: "https://paternia.vercel.app" },
    publisher: { "@type": "Organization", name: "paternia", url: "https://paternia.vercel.app" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://paternia.vercel.app/gallery/${profile.code}/`,
    },
    about: {
      "@type": "Thing",
      name: "Big5 性格診断",
      description: "ビッグファイブ性格特性(開放性・誠実性・外向性・協調性・神経症傾向)に基づく性格タイプ。",
    },
    keywords: [
      profile.name,
      profile.code,
      "Big5",
      "ビッグファイブ",
      "性格診断",
      profile.examples.archetype,
    ].join(","),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="min-h-dvh flex flex-col px-5 pt-5 pb-16">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/gallery"
          className="text-text-muted hover:text-accent transition-colors -ml-1 p-1"
          aria-label="ギャラリーに戻る"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <Link
          href="/"
          className="text-accent/80 hover:text-accent transition-colors text-[15px] tracking-[0.08em] lowercase"
          style={{ fontFamily: "var(--font-fredoka)" }}
          aria-label="トップへ"
        >
          paternia
        </Link>
        <span className="w-5" aria-hidden />
      </div>

      {/* Section 1: Art + Name + Catch */}
      <section className="flex flex-col items-center gap-5 mb-10 animate-fade-up">
        {isMine && (
          <div
            className="px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-[10px] text-accent tracking-widest"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            YOUR TYPE
          </div>
        )}
        <p
          className="text-[11px] tracking-[0.25em] text-text-muted"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          TYPE {profile.code}
        </p>

        <HoroscopeFrame size={280} variant="detail">
          <MiniPatternCanvas
            primary={profile.primaryAxis}
            secondary={profile.secondaryAxis}
            size={236}
          />
        </HoroscopeFrame>

        <div className="text-center">
          <p className="text-[10px] text-text-muted/60 tracking-wider mb-2">
            {AXIS_LABELS[profile.primaryAxis]} × {AXIS_LABELS[profile.secondaryAxis]}
          </p>
          <h1
            className="text-[26px] font-medium mb-3"
            style={{ fontFamily: "var(--font-kiwi-maru)" }}
          >
            {profile.name}
          </h1>
          <p className="text-[13px] text-text-muted leading-relaxed max-w-[300px] px-2">
            {profile.catchCopy}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="w-12 h-px bg-border mx-auto mb-8" />

      {/* Section 2: Summary */}
      <section className="mb-8 animate-fade-up stagger-1">
        <h2
          className="text-sm tracking-[0.2em] text-text-muted mb-4 text-center"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          PERSONALITY
        </h2>
        <div className="p-5 rounded-2xl bg-bg-card border border-border">
          <p className="text-[14px] leading-[1.9]">{profile.summary}</p>
        </div>
      </section>

      {/* Section 3: Examples */}
      <section className="mb-8 animate-fade-up stagger-2">
        <h2
          className="text-sm tracking-[0.2em] text-text-muted mb-4 text-center"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          REPRESENTATIVE
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-bg-card border border-border">
            <p className="text-[11px] text-accent tracking-wider mb-2">歴史上の人物</p>
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
          <div className="p-4 rounded-xl bg-bg-card border border-border">
            <p className="text-[11px] text-accent tracking-wider mb-2">アーキタイプ</p>
            <p className="text-[14px]">{profile.examples.archetype}</p>
          </div>
          <div className="p-4 rounded-xl bg-bg-card border border-border">
            <p className="text-[11px] text-accent tracking-wider mb-2">ライフスタイル</p>
            <p className="text-[13px] leading-relaxed text-text-muted">
              {profile.examples.lifestyle}
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Detailed Analysis (owner result link + note deep-dive) */}
      <section className="mb-8 animate-fade-up stagger-3">
        <h2
          className="text-sm tracking-[0.2em] text-text-muted mb-4 text-center"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {isMine ? "MORE ABOUT YOU" : "MORE ABOUT THIS TYPE"}
        </h2>

        {/* (a) Owner: link back to the full result page */}
        {isMine && resultQuery && (
          <div className="p-5 rounded-2xl bg-accent/10 border border-accent/30 mb-3">
            <p className="text-[13px] text-text mb-4 leading-relaxed">
              あなたのBig5スコア詳細、豆知識、性格プロファイルをお届けします。
            </p>
            <Link
              href={`/result?${resultQuery}`}
              className="block w-full py-3 bg-accent/20 border border-accent/40 rounded-xl
                         text-accent text-sm font-medium tracking-wider text-center
                         hover:bg-accent/30 active:scale-[0.98] transition-all"
              style={{ fontFamily: "var(--font-kiwi-maru)" }}
            >
              あなたの結果詳細を見る →
            </Link>
          </div>
        )}

        {/* (b) Deep-dive note article (primary monetization CTA) */}
        {profile.noteUrl ? (
          <a
            href={profile.noteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackNoteClick(profile.code, isMine ? "gallery_own" : "gallery")}
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
              {isMine
                ? "あなたの恋愛、キャリア、生き方まで。"
                : "このタイプの恋愛、キャリア、生き方。"}
            </p>
            <p className="text-[12px] text-text-muted leading-[1.85] mb-3">
              {profile.noteTitle}
            </p>
            <p className="text-[11px] text-text-muted/80 leading-[1.85] mb-4">
              {isMine
                ? "恋愛で繰り返してしまう理由、仕事で輝く瞬間、疲れたときの処方箋まで。論文引用と30日ワーク付き、約7,000字。"
                : "このタイプが恋愛で陥るパターン、仕事で輝く瞬間、日常の乗り越え方まで。論文引用と30日ワーク付き、約7,000字。"}
            </p>
            <div className="flex items-center justify-end">
              <span className="text-[13px] text-accent font-medium whitespace-nowrap">
                {isMine ? "もっと自分を" : "もっと"}知る →
              </span>
            </div>
          </a>
        ) : (
          !isMine && (
            <div className="relative">
              <div className="p-6 rounded-2xl bg-bg-card border border-dashed border-accent/30 relative overflow-hidden">
                <div className="blur-sm select-none opacity-40 pointer-events-none">
                  <p className="text-[11px] text-accent mb-1">恋愛性質</p>
                  <p className="text-[13px] leading-relaxed mb-4">
                    あなたの恋愛傾向は、独自の美意識と深い共感力に彩られています。パートナーに求めるのは...
                  </p>
                  <p className="text-[11px] text-accent mb-1">努力・成長スタイル</p>
                  <p className="text-[13px] leading-relaxed mb-4">
                    目標に向かうとき、あなたは独特のアプローチを取ります...
                  </p>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg-card/60 backdrop-blur-[2px]">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-accent"
                    >
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-text text-center font-medium">
                    このタイプの深い分析は
                    <br />
                    近日公開予定
                  </p>
                  <Link
                    href="/quiz"
                    className="mt-2 px-6 py-2.5 bg-accent/20 border border-accent/40 rounded-xl
                               text-accent text-[13px] font-medium
                               hover:bg-accent/30 active:scale-[0.98] transition-all"
                    style={{ fontFamily: "var(--font-kiwi-maru)" }}
                  >
                    診断を受ける
                  </Link>
                </div>
              </div>
            </div>
          )
        )}
      </section>

      {/* Section 4.5: Compatibility Universal CTA (U1) */}
      {UNIVERSAL_ARTICLES.compatibility.noteUrl && (
        <section className="mb-10 animate-fade-up stagger-3">
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
            onClick={() => trackNoteClick("U1", isMine ? "gallery_own" : "gallery")}
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
        <section className="mb-10 animate-fade-up stagger-3">
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
            onClick={() => trackNoteClick("U2", isMine ? "gallery_own" : "gallery")}
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

      {/* Section 5: Compatibility -- good */}
      {good.length > 0 && (
        <section className="mb-6 animate-fade-up stagger-4">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <span
              className="text-sm tracking-[0.2em]"
              style={{
                fontFamily: "var(--font-fredoka)",
                color: "#7ee8c7",
              }}
            >
              COMPATIBILITY ◎
            </span>
          </div>
          <p className="text-[11px] text-text-muted text-center mb-4">
            相性のいいタイプ
          </p>
          <div className="grid grid-cols-3 gap-2">
            {good.map((r) => (
              <Link
                key={r.code}
                href={`/gallery/${r.code}`}
                className="flex flex-col items-center p-2 rounded-xl bg-bg-card border transition-all active:scale-[0.98]"
                style={{
                  borderColor: "rgba(126,232,199,0.3)",
                }}
              >
                <div className="w-[80px] h-[80px]">
                  <MiniPatternCanvas
                    primary={r.primaryAxis}
                    secondary={r.secondaryAxis}
                    size={80}
                  />
                </div>
                <p
                  className="text-[9px] tracking-wider mt-2"
                  style={{
                    fontFamily: "var(--font-fredoka)",
                    color: "#7ee8c7",
                  }}
                >
                  {r.code}
                </p>
                <p
                  className="text-[11px] text-center mt-0.5 leading-tight"
                  style={{ fontFamily: "var(--font-kiwi-maru)" }}
                >
                  {r.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Section 6: Compatibility -- bad */}
      {bad.length > 0 && (
        <section className="mb-8 animate-fade-up stagger-5">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <span
              className="text-sm tracking-[0.2em]"
              style={{
                fontFamily: "var(--font-fredoka)",
                color: "#ff9b9b",
              }}
            >
              COMPATIBILITY △
            </span>
          </div>
          <p className="text-[11px] text-text-muted text-center mb-4">
            ぶつかりやすいタイプ
          </p>
          <div className="grid grid-cols-3 gap-2">
            {bad.map((r) => (
              <Link
                key={r.code}
                href={`/gallery/${r.code}`}
                className="flex flex-col items-center p-2 rounded-xl bg-bg-card border transition-all active:scale-[0.98]"
                style={{
                  borderColor: "rgba(255,155,155,0.25)",
                }}
              >
                <div className="w-[80px] h-[80px]">
                  <MiniPatternCanvas
                    primary={r.primaryAxis}
                    secondary={r.secondaryAxis}
                    size={80}
                  />
                </div>
                <p
                  className="text-[9px] tracking-wider mt-2"
                  style={{
                    fontFamily: "var(--font-fredoka)",
                    color: "#ff9b9b",
                  }}
                >
                  {r.code}
                </p>
                <p
                  className="text-[11px] text-center mt-0.5 leading-tight"
                  style={{ fontFamily: "var(--font-kiwi-maru)" }}
                >
                  {r.name}
                </p>
              </Link>
            ))}
          </div>
          <p className="text-[10px] text-text-muted/60 text-center mt-3 px-4 leading-relaxed">
            * 努力次第でうまくいきます。お互いの違いを知ることが第一歩
          </p>
        </section>
      )}

      {/* Divider */}
      <div className="w-12 h-px bg-border mx-auto mb-6" />

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleShare}
          className="w-full py-3.5 bg-accent/10 border border-accent/30 rounded-xl
                     text-accent text-sm font-medium tracking-wider
                     hover:bg-accent/20 active:scale-[0.98] transition-all"
          style={{ fontFamily: "var(--font-kiwi-maru)" }}
        >
          X でシェアする
        </button>
        <Link
          href="/gallery"
          className="w-full py-3.5 bg-transparent border border-border rounded-xl
                     text-text-muted text-sm font-medium tracking-wider text-center
                     hover:border-text-muted/30 active:scale-[0.98] transition-all"
          style={{ fontFamily: "var(--font-kiwi-maru)" }}
        >
          ギャラリーに戻る
        </Link>
      </div>
      </div>
    </>
  );
}
