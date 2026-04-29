import { exhibitions } from "@/lib/data/exhibitions";
import {
  artistPreviewOverrides,
  artistPreviewSizeScales,
} from "@/lib/data/display-rules";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type ArtistPreview = {
  src: string;
  type: "image" | "video" | "iframe";
  /** Optional poster frame URL for video previews — shows instantly
      while the video buffers. */
  poster?: string;
  /** Aspect-ratio hint, mainly for iframes which have no intrinsic
      dimensions to bucket from. Set so the preview slot matches the
      artwork's actual composition (no whitespace). Images and videos
      derive aspect from the loaded asset and ignore this. */
  aspect?: number;
  /** Multiplier applied to the bucket's (w, h) dims so a specific
      artist's preview can read larger or smaller than the global
      sizing — preserves the bucket's relative shape. */
  sizeScale?: number;
};

export function getIframePreloadResources(artistSlug: string): string[] {
  return artistPreviewOverrides[artistSlug]?.preloadResources ?? [];
}

function detectType(src: string): "image" | "video" | "iframe" {
  if (/\.(mp4|webm|mov)(\?|$)/i.test(src)) return "video";
  if (
    /index\.html(\?|$)/i.test(src) ||
    /[?&]payload=/i.test(src) ||
    /^\/api\/genart\//i.test(src)
  )
    return "iframe";
  return "image";
}

/**
 * Wrap an image asset path in Next's image-optimization endpoint so
 * the hover preview gets a smaller / lower-quality variant instead of
 * the full hero file. GIFs and videos are passed through unchanged —
 * Next doesn't re-encode animated formats and only handles images.
 * 640 is the next allowed Next bucket up from the 440px MAX_DIMENSION
 * cap (covers retina); q=45 keeps the bytes small.
 */
export function optimizeImageSrc(
  src: string,
  width = 640,
  quality = 45,
): string {
  if (/\.gif(\?|$)/i.test(src)) return src;
  if (detectType(src) === "video") return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/**
 * Resolve the preview asset for a given artist slug. Override map
 * wins; otherwise pick the most recent exhibition (by year, then
 * month) and prefer motion assets so animated works actually animate
 * in the preview: cardVideo → heroVideo → cardImage → hero.
 */
export function getArtistPreviewImage(artistSlug: string): ArtistPreview | null {
  const override = artistPreviewOverrides[artistSlug];
  const sizeScale =
    override?.sizeScale ?? artistPreviewSizeScales[artistSlug];
  if (override) {
    const type = detectType(override.src);
    return {
      src: override.src,
      type,
      aspect: type === "iframe" ? override.aspect : undefined,
      sizeScale,
    };
  }

  const matches = exhibitions
    .filter((e) => e.artistSlug === artistSlug)
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return MONTHS.indexOf(b.month) - MONTHS.indexOf(a.month);
    });
  const recent = matches[0];
  if (!recent) return null;

  // Videos first so motion pieces play in the preview; corresponding
  // poster image (if any) carries through for the video tag.
  if (recent.cardVideo) {
    return { src: recent.cardVideo, type: "video", poster: recent.cardImage ?? recent.hero, sizeScale };
  }
  if (recent.heroVideo) {
    return {
      src: recent.heroVideo,
      type: "video",
      poster: recent.heroVideoPoster ?? recent.hero,
      sizeScale,
    };
  }
  const stillSrc = recent.cardImage ?? recent.hero;
  if (!stillSrc) return null;
  return { src: stillSrc, type: "image", sizeScale };
}
