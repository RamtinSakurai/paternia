import type { Metadata, Viewport } from "next";
import { Kiwi_Maru, Zen_Kaku_Gothic_New, Fredoka } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const SITE_URL = "https://paternia.netlify.app";

const kiwiMaru = Kiwi_Maru({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-kiwi-maru",
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
  display: "swap",
});

const fredoka = Fredoka({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "paternia | あなたの性格が模様になる Big5性格診断",
    template: "%s",
  },
  description:
    "心理学のビッグファイブ(Big5)をもとに、45問の回答からあなただけの模様が生まれる。恋愛・仕事・ストレスの傾向まで論文引用で科学的に解き明かす、無料の性格診断。20タイプ別の深掘り記事も配信中。",
  keywords: [
    "Big5",
    "ビッグファイブ",
    "ビッグ5",
    "性格診断",
    "性格タイプ",
    "無料性格診断",
    "paternia",
    "HSP診断",
    "MBTI",
    "相性診断",
    "模様",
    "自己分析",
    "心理テスト",
  ],
  authors: [{ name: "paternia" }],
  creator: "paternia",
  publisher: "paternia",
  alternates: { canonical: SITE_URL },
  verification: {
    google: "gMw7tNXWLPn3BrDJ4hIm8qUzM-zMiu60nrfdcTD-sr4",
  },
  openGraph: {
    title: "paternia | あなたの性格が模様になる",
    description:
      "ビッグファイブ(Big5)の45問診断で、あなただけの模様が生まれる。恋愛・仕事・ストレスの傾向まで科学的に。",
    type: "website",
    locale: "ja_JP",
    siteName: "paternia",
    url: SITE_URL,
    images: [
      {
        url: "/og/og-paternia-default.png",
        width: 1200,
        height: 630,
        alt: "paternia — あなたの性格が模様になる",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "paternia | あなたの性格が模様になる",
    description: "45問で生まれる、あなただけの模様。Big5の科学で深掘り。",
    images: ["/og/og-paternia-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a1a",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "paternia",
  alternateName: "パターニア",
  url: SITE_URL,
  description:
    "ビッグファイブ(Big5)性格診断。45問の回答から、あなたの模様・恋愛・仕事・ストレスの傾向を科学的に解き明かす。",
  inLanguage: "ja-JP",
  publisher: {
    "@type": "Organization",
    name: "paternia",
    url: SITE_URL,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "paternia",
  url: SITE_URL,
  description: "Big5性格診断とアート、有料記事で自己理解を深めるメディア。",
  sameAs: ["https://note.com/paternia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${kiwiMaru.variable} ${zenKaku.variable} ${fredoka.variable}`}
    >
      <body className="min-h-dvh flex flex-col items-center">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <GoogleAnalytics />
        <main className="w-full max-w-[430px] mx-auto relative z-10 flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
