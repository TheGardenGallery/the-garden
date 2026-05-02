/**
 * Split Logic — wedge palette extraction.
 *
 * Each wedge poster has a saturated pastel field that carries the
 * piece's identity (the grid + walkers sit on top in dark ink). We
 * extract that dominant field color per wedge and hand it to the
 * walker bar component, which arrays the 16 cells as a system index.
 *
 * Cached indefinitely — /public assets are immutable.
 */

import path from "node:path";
import { promises as fs } from "node:fs";
import { unstable_cache } from "next/cache";
import sharp from "sharp";

import type { WedgeCell } from "./split-logic-color";
export type { WedgeCell } from "./split-logic-color";

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

const SAMPLE = 96;

/**
 * Saturation-weighted mean of every pixel: each pixel contributes
 * proportionally to (saturation × value). Vivid ink dominates; flat
 * backgrounds (whether near-white or near-black) contribute little.
 * Yields the *characteristic* colour of a wedge — the pastel for the
 * pastel-grounded pieces, the coral / amber / cyan for the dark-
 * grounded ones — instead of the most-common pixel, which would be
 * the background in either case.
 */
const extractCharacteristicHex = unstable_cache(
  async (src: string): Promise<string> => {
    const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    const buf = await fs.readFile(filePath);
    const { data, info } = await sharp(buf)
      .resize(SAMPLE, SAMPLE, { fit: "cover" })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { channels } = info;

    let sumR = 0, sumG = 0, sumB = 0, sumW = 0;
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      // HSV saturation × value, both normalised to [0,1].
      const sat = max === 0 ? 0 : (max - min) / max;
      const val = max / 255;
      const weight = sat * val;
      sumR += r * weight;
      sumG += g * weight;
      sumB += b * weight;
      sumW += weight;
    }

    if (sumW === 0) return "#808080";
    return rgbToHex(
      Math.round(sumR / sumW),
      Math.round(sumG / sumW),
      Math.round(sumB / sumW)
    );
  },
  ["split-logic-wedge-color-v2"],
  { revalidate: false }
);

/**
 * Returns the dominant color of every wedge in the Split Logic series,
 * paired with the wedge id. Order follows the on-disk numbering.
 */
export async function getSplitLogicPalette(): Promise<WedgeCell[]> {
  const ids = Array.from({ length: 16 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  return Promise.all(
    ids.map(async (n) => ({
      hex: await extractCharacteristicHex(
        `/images/ricky-retouch/works/wedge-${n}.jpg`
      ),
      wedgeId: `wedge-${n}`,
    }))
  );
}

/**
 * Per-artwork dominant colors for the rest of the page surfaces:
 * the hero (extracted from a still poster of the looped video) and
 * the three inline-artwork posters. Same saturation-weighted mean as
 * the wedge extraction — the cursor that hangs over each artwork is
 * a sample of that artwork's own colour identity.
 */
export async function getSplitLogicArtworkColors(): Promise<{
  hero: string;
  inline: string[];
}> {
  const hero = await extractCharacteristicHex(
    "/images/ricky-retouch/split-logic-hero.jpg"
  );
  const inline = await Promise.all(
    [1, 2, 3].map((n) =>
      extractCharacteristicHex(`/images/ricky-retouch/inline/inline-${n}.jpg`)
    )
  );
  return { hero, inline };
}

/**
 * Flat lookup from any of this page's artwork URLs (video src or
 * poster src) to that artwork's dominant colour. The magnifier reads
 * it on entry to a new artwork to tint its outline and outer glow.
 */
export async function getSplitLogicMagnifierTones(): Promise<
  Record<string, string>
> {
  const wedges = await getSplitLogicPalette();
  const artwork = await getSplitLogicArtworkColors();
  const map: Record<string, string> = {};

  // Hero
  map["/images/ricky-retouch/split-logic-hero.mp4"] = artwork.hero;
  map["/images/ricky-retouch/split-logic-hero.jpg"] = artwork.hero;

  // Inline triptych
  for (let i = 0; i < artwork.inline.length; i++) {
    map[`/images/ricky-retouch/inline/inline-${i + 1}.mp4`] = artwork.inline[i];
    map[`/images/ricky-retouch/inline/inline-${i + 1}.jpg`] = artwork.inline[i];
  }

  // Wedges (piece grid)
  for (const w of wedges) {
    map[`/images/ricky-retouch/works/${w.wedgeId}.mp4`] = w.hex;
    map[`/images/ricky-retouch/works/${w.wedgeId}.jpg`] = w.hex;
  }

  return map;
}
