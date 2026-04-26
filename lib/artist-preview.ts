import { exhibitions } from "@/lib/data/exhibitions";

/**
 * Manual overrides for the floating preview shown when hovering an
 * artist's name in the plot grid. Drop a `slug → /images/...` line
 * here to pin a specific work; otherwise the helper falls back to
 * the most recent exhibition's `cardVideo`, `heroVideo`, `cardImage`,
 * or `hero` (in that order — videos preferred so motion-pieces
 * animate in the preview).
 *
 * Edit this map directly to swap previews — keys are the same artist
 * slugs used everywhere else (matches `Artist["slug"]`). Either
 * image or video paths work; the type is detected from the file
 * extension.
 */
const PREVIEW_OVERRIDES: Record<string, string> = {
  chepertom: "/images/chepertom/deluge-undertow-preview.png",
  // John's HAHA card has a Verse-style metadata band baked into the
  // top of the original — this preview asset has that band cropped
  // off so the artwork sits clean.
  "john-provencher": "/images/john-provencher/haha-preview.jpg",
  // Itsgalo: live generative artwork — Verse S3 bundle for edition
  // #34, proxied through /api/genart/itsgalo so we can inject CSS to
  // strip the bundle's white body padding (it'd otherwise leave a
  // thick white border around the artwork at preview scale) plus the
  // synthetic-pointer kickstart so it autoplays.
  itsgalo:
    "/api/genart/itsgalo?payload=eyJoYXNoIjoiMHg1ZTllYmY1Y2NlMDZlMWRiMmM4M2JiZmU1MDU4OTlhMjY4ODEzMjQwMmNhMWMxZmVlNDg5MTliMTEzMmU1ZjhjIiwiZWRpdGlvbk51bWJlciI6MzQsInRvdGFsRWRpdGlvbnMiOjY1LCJpbnB1dCI6eyIkdXNlcm5hbWUiOiJoYW5uYWgyMTA2In19",
  // "ves3l": "/images/ves3l/solve-un-solve-hero.png",
};


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
};

/**
 * Aspect-ratio overrides for iframe previews. Genart bundles render
 * inside an iframe whose dimensions WE choose — the bundle then
 * centers its artwork inside that frame, which leaves whitespace
 * around portrait or wide compositions when the iframe is square.
 * Pin a per-artist aspect here so the iframe bucket matches the
 * artwork's natural shape and the whitespace disappears.
 */
const IFRAME_ASPECTS: Record<string, number> = {
  itsgalo: 0.7,
};

/**
 * Cross-origin upstream sub-resources that an iframe preview pulls
 * in beyond the HTML loader itself. Listed here so PlotGrid can
 * warm the browser's HTTP cache for them at idle time, before the
 * first hover — otherwise the user pays for a full
 * proxy+style+script chain on first reveal.
 */
const IFRAME_PRELOAD_RESOURCES: Record<string, string[]> = {
  itsgalo: [
    "https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com/genart/itsgalo-jun-2024-v4/style.css",
    "https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com/genart/itsgalo-jun-2024-v4/script.js",
  ],
};

export function getIframePreloadResources(artistSlug: string): string[] {
  return IFRAME_PRELOAD_RESOURCES[artistSlug] ?? [];
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
  const override = PREVIEW_OVERRIDES[artistSlug];
  if (override) {
    const type = detectType(override);
    return {
      src: override,
      type,
      aspect: type === "iframe" ? IFRAME_ASPECTS[artistSlug] : undefined,
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
    return { src: recent.cardVideo, type: "video", poster: recent.cardImage ?? recent.hero };
  }
  if (recent.heroVideo) {
    return {
      src: recent.heroVideo,
      type: "video",
      poster: recent.heroVideoPoster ?? recent.hero,
    };
  }
  const stillSrc = recent.cardImage ?? recent.hero;
  if (!stillSrc) return null;
  return { src: stillSrc, type: "image" };
}
