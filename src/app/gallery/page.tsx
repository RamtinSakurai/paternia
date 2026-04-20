"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllProfiles } from "@/data/type-profiles";
import MiniPatternCanvas from "@/components/MiniPatternCanvas";
import { getTypeKey, type Scores } from "@/lib/diagnosis";

export default function GalleryPage() {
  const router = useRouter();
  const profiles = getAllProfiles();
  const [myCode, setMyCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("moyou_last_result");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.scores) {
          const key = getTypeKey(data.scores as Scores);
          setMyCode(key);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-dvh flex flex-col px-5 pt-8 pb-16">
      {/* Header */}
      <header className="flex flex-col items-center gap-2 mb-8 animate-fade-up">
        <div className="w-full flex items-center justify-between mb-2">
          <button
            onClick={() => router.back()}
            className="text-text-muted hover:text-accent transition-colors -ml-1 p-1"
            aria-label="戻る"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <Link
            href="/"
            className="text-accent/80 hover:text-accent transition-colors text-[15px] tracking-[0.08em] lowercase"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            paternia
          </Link>
          <span className="w-5" aria-hidden />
        </div>
        <p
          className="text-[11px] tracking-[0.3em] text-text-muted"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          GALLERY
        </p>
        <h1
          className="text-2xl font-medium text-center"
          style={{ fontFamily: "var(--font-kiwi-maru)" }}
        >
          20の<span className="text-accent">模様</span>
        </h1>
        <p className="text-[12px] text-text-muted text-center leading-relaxed mt-1">
          Big5の性格特性によって生まれる、
          <br />
          20種類のユニークな模様とタイプ
        </p>
      </header>

      {/* CTA to quiz */}
      <Link
        href="/quiz"
        className="animate-fade-up stagger-1 mb-8 py-3 bg-accent/10 border border-accent/30 rounded-xl
                   text-accent text-sm font-medium tracking-wider text-center
                   hover:bg-accent/20 active:scale-[0.98] transition-all"
        style={{ fontFamily: "var(--font-kiwi-maru)" }}
      >
        診断して自分の模様を見つける
      </Link>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {profiles.map((profile, i) => {
          const isMine = myCode === profile.code;
          return (
            <Link
              key={profile.code}
              href={`/gallery/${profile.code}`}
              className={`animate-fade-up group flex flex-col items-center p-4 rounded-2xl transition-all
                         active:scale-[0.98] relative ${
                           isMine
                             ? "bg-accent/10 border-2 border-accent/50 hover:border-accent"
                             : "bg-bg-card border border-border hover:border-accent/40"
                         }`}
              style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
            >
              {isMine && (
                <div
                  className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent text-[9px] text-bg tracking-wider font-semibold z-10"
                  style={{ fontFamily: "var(--font-fredoka)" }}
                >
                  YOU
                </div>
              )}
              <div className="w-[140px] h-[140px] mb-3">
                <MiniPatternCanvas
                  primary={profile.primaryAxis}
                  secondary={profile.secondaryAxis}
                  size={140}
                />
              </div>
              <p
                className={`text-[10px] tracking-[0.2em] mb-1 ${
                  isMine ? "text-accent" : "text-accent/70"
                }`}
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {profile.code}
              </p>
              <h3
                className="text-[14px] font-medium text-center mb-1 leading-tight"
                style={{ fontFamily: "var(--font-kiwi-maru)" }}
              >
                {profile.name}
              </h3>
              <p className="text-[10px] text-text-muted text-center leading-snug line-clamp-2 mt-1">
                {profile.catchCopy}
              </p>
            </Link>
          );
        })}
      </div>

      <p className="text-[10px] text-text-muted/50 mt-8 text-center">
        Based on Big Five Personality Model
      </p>
    </div>
  );
}
