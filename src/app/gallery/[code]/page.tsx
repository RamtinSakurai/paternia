import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TYPE_PROFILES, getAllProfiles } from "@/data/type-profiles";
import { getCompatibility } from "@/lib/compatibility";
import ClientView from "./ClientView";

const SITE_URL = "https://paternia.netlify.app";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  return getAllProfiles().map((p) => ({ code: p.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const profile = TYPE_PROFILES[code];
  if (!profile) return {};

  const url = `${SITE_URL}/gallery/${code}/`;
  const title = `${profile.name}(${code}) — Big5性格タイプ | paternia`;
  const description = `${profile.catchCopy}。${profile.summary.slice(0, 90)}`;
  const ogImage = `/og/og-${code.toLowerCase()}.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [
      profile.name,
      code,
      "Big5",
      "ビッグファイブ",
      "性格診断",
      "性格タイプ",
      profile.examples.archetype,
      ...profile.examples.historical,
      "paternia",
      "無料診断",
    ],
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: "ja_JP",
      siteName: "paternia",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${profile.name} (${code}) — ${profile.catchCopy}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function GalleryDetailPage({ params }: Props) {
  const { code } = await params;

  const profile = TYPE_PROFILES[code];
  if (!profile) {
    notFound();
  }

  const compat = getCompatibility(profile);

  return <ClientView profile={profile} good={compat.good} bad={compat.bad} />;
}
