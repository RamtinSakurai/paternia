/**
 * Google Analytics 4 helper
 *
 * Measurement ID は環境変数 NEXT_PUBLIC_GA_ID に設定する（例: G-XXXXXXXXXX）。
 * 未設定ならすべての関数が何もしないので、ローカル開発で安心。
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const GA_ENABLED = !!GA_ID;

type GtagFn = (command: string, action: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

/**
 * ページビュー送信（通常は GA4 の config 側で自動送信されるが、手動で呼ぶ場合に使う）
 */
export function pageview(url: string) {
  if (!GA_ENABLED || typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, { page_path: url });
}

/**
 * カスタムイベント送信
 * @param name イベント名（例: 'quiz_start', 'quiz_complete', 'share_click'）
 * @param params 任意のパラメータ
 */
export function event(name: string, params?: Record<string, unknown>) {
  if (!GA_ENABLED || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

// ============================================================
// 名前付きヘルパー（コードの読みやすさのため）
// ============================================================

export const trackQuizStart = () => event("quiz_start");

export const trackQuizComplete = (typeCode: string) =>
  event("quiz_complete", { type_code: typeCode });

export const trackShare = (platform: "x" | "line" | "copy", typeCode?: string) =>
  event("share_click", { platform, type_code: typeCode });

export const trackGalleryOpen = (source: "home" | "result" | "direct") =>
  event("gallery_open", { source });

export const trackGalleryTypeView = (typeCode: string, isOwn: boolean) =>
  event("gallery_type_view", { type_code: typeCode, is_own: isOwn });

export const trackResultView = (typeCode: string) =>
  event("result_view", { type_code: typeCode });

export const trackNoteClick = (typeCode: string, source: "result" | "gallery" | "gallery_own") =>
  event("note_click", { type_code: typeCode, source });
