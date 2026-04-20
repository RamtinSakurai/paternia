import type { MetadataRoute } from "next";
import { getAllProfiles } from "@/data/type-profiles";

export const dynamic = "force-static";

const SITE_URL = "https://paternia.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/quiz/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/gallery/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const galleryRoutes: MetadataRoute.Sitemap = getAllProfiles().map((p) => ({
    url: `${SITE_URL}/gallery/${p.code}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...galleryRoutes];
}
