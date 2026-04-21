/**
 * Artwork palette extraction.
 *
 * Samples the edge pixels of an artwork thumbnail, averages them to the
 * "frame" tone the piece presents to its surroundings, then derives a
 * small set of backdrop tokens (base, glow, deep, foreground, shadow)
 * that naturally pair with the work. The edge is the right source for a
 * backdrop: it's what the viewer's eye sees where the artwork meets the
 * wall.
 *
 * Cached indefinitely — /public assets are immutable, so one extraction
 * per image is enough.
 */

import path from "node:path";
import { promises as fs } from "node:fs";
import { unstable_cache } from "next/cache";
import sharp from "sharp";

export type Palette = {
  base: string;       // edge-averaged frame color
  glow: string;       // softer highlight at center of radial gradient
  deep: string;       // darker outer tone for corners
  foreground: string; // text color that reads on `base`
  shadow: string;     // rgba for drop-shadow under the artwork
  isDark: boolean;
};

const SAMPLE_SIZE = 64;

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

function clamp(n: number, lo = 0, hi = 255): number {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function shift(r: number, g: number, b: number, delta: number): string {
  // Positive delta lightens, negative darkens. Scaled per channel so tinted
  // edges (e.g. cream paper) stay tinted rather than desaturating to gray.
  return rgbToHex(clamp(r + delta), clamp(g + delta), clamp(b + delta));
}

async function extract(src: string): Promise<Palette> {
  const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  const buf = await fs.readFile(filePath);

  const { data, info } = await sharp(buf)
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: "cover" })
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels } = info;
  let r = 0,
    g = 0,
    b = 0,
    n = 0;

  const add = (x: number, y: number) => {
    const i = (y * w + x) * channels;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n += 1;
  };
  for (let x = 0; x < w; x++) {
    add(x, 0);
    add(x, h - 1);
  }
  for (let y = 1; y < h - 1; y++) {
    add(0, y);
    add(w - 1, y);
  }
  r = Math.round(r / n);
  g = Math.round(g / n);
  b = Math.round(b / n);

  // Relative luminance — WCAG coefficients, not gamma-corrected but close
  // enough for a light/dark bucket decision.
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const isDark = lum < 0.5;

  const base = rgbToHex(r, g, b);
  const glow = shift(r, g, b, isDark ? 12 : 6);
  // Deep is a gentle off-base tone — too-dark corners read as a drop shadow
  // around the hero instead of ambient fall-off. 4–8 units is enough to
  // hint at depth without painting a vignette.
  const deep = shift(r, g, b, isDark ? -6 : -8);
  const foreground = isDark ? "#F5F3EF" : "#232326";
  const shadow = isDark
    ? "rgba(0, 0, 0, 0.5)"
    : `rgba(${clamp(r - 60)}, ${clamp(g - 60)}, ${clamp(b - 60)}, 0.14)`;

  return { base, glow, deep, foreground, shadow, isDark };
}

/**
 * Cache key: the src path. /public is immutable, so indefinite cache.
 * React.cache would only dedupe inside one request; unstable_cache persists
 * across requests and across the static generation pipeline.
 */
export const getArtworkPalette = unstable_cache(
  async (src: string) => extract(src),
  ["artwork-palette-v1"],
  { revalidate: false }
);

/** CSS custom properties bundle for inlining onto a <section style={...}> */
export function paletteToCssVars(p: Palette): Record<string, string> {
  return {
    "--hero-base": p.base,
    "--hero-glow": p.glow,
    "--hero-deep": p.deep,
    "--hero-foreground": p.foreground,
    "--hero-shadow": p.shadow,
  };
}
