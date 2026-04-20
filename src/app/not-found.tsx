import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-6">
      <p
        className="text-xs tracking-[0.3em] text-text-muted"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        404
      </p>
      <h1
        className="text-2xl font-medium"
        style={{ fontFamily: "var(--font-kiwi-maru)" }}
      >
        この模様は見つかりません
      </h1>
      <p className="text-[13px] text-text-muted leading-relaxed max-w-[280px]">
        URLを確認するか、
        <br />
        トップページから探してみてください
      </p>
      <div className="flex gap-3 mt-2">
        <Link
          href="/"
          className="px-6 py-3 bg-accent/10 border border-accent/30 rounded-xl
                     text-accent text-sm font-medium tracking-wider
                     hover:bg-accent/20 active:scale-[0.97] transition-all"
          style={{ fontFamily: "var(--font-kiwi-maru)" }}
        >
          トップへ
        </Link>
        <Link
          href="/gallery"
          className="px-6 py-3 bg-transparent border border-border rounded-xl
                     text-text-muted text-sm font-medium tracking-wider
                     hover:border-text-muted/30 active:scale-[0.97] transition-all"
          style={{ fontFamily: "var(--font-kiwi-maru)" }}
        >
          ギャラリー
        </Link>
      </div>
    </div>
  );
}
