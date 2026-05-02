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

type WedgeExtraction = {
  /** Saturation-weighted mean over all pixels — used for bar display. */
  characteristic: string;
  /** Two-band palette: ink band + ground band. Each is the
   *  saturation-weighted mean of the pixels above (light) and below
   *  (dark) the image's mean luminance. Falls back gracefully when
   *  one band has no chromatic mass. */
  palette: string[];
};

/**
 * Two-pass wedge extraction.
 *
 *  pass 1: mean luminance + overall sat-weighted mean (the
 *          *characteristic*; this is what the walker bar shows).
 *  pass 2: split pixels by mean luminance into "above" (ground/ink-
 *          on-dark) and "below" (ink-on-light/ground), and compute
 *          a sat-weighted mean of each band. Yields the colours that
 *          actually show through the piece — for a dark-ground piece
 *          with saturated ink, the *light band* mean is the pure ink
 *          colour, not the muddy black-plus-ink average.
 *
 * Palette = [light, dark] de-duplicated when both bands are
 * essentially the same colour (uniform pieces).
 */
const extractWedgeData = unstable_cache(
  async (src: string): Promise<WedgeExtraction> => {
    const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    const buf = await fs.readFile(filePath);
    const { data, info } = await sharp(buf)
      .resize(SAMPLE, SAMPLE, { fit: "cover" })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { channels } = info;

    // Pass 1.
    let lumSum = 0;
    let lumCount = 0;
    let allR = 0, allG = 0, allB = 0, allW = 0;
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const val = max / 255;
      const w = sat * val;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      lumSum += lum;
      lumCount++;
      allR += r * w; allG += g * w; allB += b * w; allW += w;
    }
    const meanLum = lumSum / Math.max(lumCount, 1);
    const characteristic =
      allW > 0
        ? rgbToHex(
            Math.round(allR / allW),
            Math.round(allG / allW),
            Math.round(allB / allW)
          )
        : "#808080";

    // Pass 2 — split bands.
    let lightR = 0, lightG = 0, lightB = 0, lightW = 0;
    let darkR = 0, darkG = 0, darkB = 0, darkW = 0;
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const val = max / 255;
      const w = sat * val;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (lum >= meanLum) {
        lightR += r * w; lightG += g * w; lightB += b * w; lightW += w;
      } else {
        darkR += r * w; darkG += g * w; darkB += b * w; darkW += w;
      }
    }

    const palette: string[] = [];
    if (lightW > 0.001) {
      palette.push(
        rgbToHex(
          Math.round(lightR / lightW),
          Math.round(lightG / lightW),
          Math.round(lightB / lightW)
        )
      );
    }
    if (darkW > 0.001) {
      palette.push(
        rgbToHex(
          Math.round(darkR / darkW),
          Math.round(darkG / darkW),
          Math.round(darkB / darkW)
        )
      );
    }
    if (palette.length === 0) palette.push(characteristic);

    return { characteristic, palette };
  },
  ["split-logic-wedge-data-v3"],
  { revalidate: false }
);

/**
 * Returns the characteristic colour + matching palette for every
 * wedge in the Split Logic series, paired with the wedge id. Order
 * follows the on-disk numbering.
 */
export async function getSplitLogicPalette(): Promise<WedgeCell[]> {
  const ids = Array.from({ length: 16 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  return Promise.all(
    ids.map(async (n) => {
      const data = await extractWedgeData(
        `/images/ricky-retouch/works/wedge-${n}.jpg`
      );
      return {
        hex: data.characteristic,
        palette: data.palette,
        wedgeId: `wedge-${n}`,
      };
    })
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
  const hero = (
    await extractWedgeData("/images/ricky-retouch/split-logic-hero.jpg")
  ).characteristic;
  const inline = await Promise.all(
    [1, 2, 3].map(async (n) =>
      (
        await extractWedgeData(
          `/images/ricky-retouch/inline/inline-${n}.jpg`
        )
      ).characteristic
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
