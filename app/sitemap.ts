import type { MetadataRoute } from "next";
import { artists } from "@/lib/data/artists";
import { exhibitions } from "@/lib/data/exhibitions";
import { interviews } from "@/lib/data/interviews";

const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://thegarden.art");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/exhibitions", priority: 0.9, changeFrequency: "weekly" },
    { path: "/artists", priority: 0.9, changeFrequency: "weekly" },
    { path: "/journal", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "yearly" },
    { path: "/principles", priority: 0.6, changeFrequency: "yearly" },
    { path: "/constellation", priority: 0.5, changeFrequency: "yearly" },
    { path: "/legal", priority: 0.3, changeFrequency: "yearly" },
  ];

  // exhibitions.ts has a few duplicate slugs (e.g. deluge, new-life-to-still-life).
  // Dedupe before emitting URLs so the sitemap is valid.
  const exhibitionSlugs = Array.from(new Set(exhibitions.map((e) => e.slug)));

  return [
    ...staticEntries.map((e) => ({
      url: `${siteOrigin}${e.path}`,
      lastModified: now,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
    })),
    ...artists.map((a) => ({
      url: `${siteOrigin}/artists/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...exhibitionSlugs.map((slug) => ({
      url: `${siteOrigin}/exhibitions/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...interviews.map((i) => ({
      url: `${siteOrigin}/interviews/${i.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
