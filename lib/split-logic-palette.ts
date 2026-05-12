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

import {
  colorDistance,
  hexToOklch,
  kmeansWeighted,
  newSignatureAccumulator,
  type ColorCluster,
  type ColorSignature,
  type Oklch,
  type WedgeCell,
} from "./split-logic-color";
export type { WedgeCell } from "./split-logic-color";

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

const SAMPLE = 128;

type WedgeExtraction = {
  /** The wedge's dominant chromatic colour — what the bar shows
   *  and what the sort matches against. */
  characteristic: string;
  /** Same colour, wrapped as a single-entry palette. Retained for
   *  legacy compatibility / debugging; the live sort runs against
   *  `signature` instead. */
  palette: string[];
  /** Per-pixel hue/L/C distribution embedding — see ColorSignature in
   *  split-logic-color.ts. The same chromatic-pixel pass that yields
   *  `characteristic` also feeds the signature accumulator, so we get
   *  both the "what colour is this piece" headline and the full
   *  distribution vector in a single image read. */
  signature: ColorSignature;
  /** Top-N k-means clusters over the chromatic pixels — the piece's
   *  actual palette, not its mean. The colour bar pools all wedges'
   *  clusters and runs weighted k-means over the pool. */
  clusters: ColorCluster[];
};

const VIBRANCE_THRESHOLD = 0.12;
/** Per-image cluster count. Vibrant.js extracts 6 named swatches; we
 *  use 5 since the wedges are simpler in palette than typical photos —
 *  more than 5 starts producing redundant near-duplicates per piece. */
const PER_IMAGE_CLUSTERS = 5;

/**
 * Threshold-based dominant-colour extraction.
 *
 * For each pixel we compute vibrance = saturation × value (HSV).
 * Pure black, pure white, and any neutral gray sit at v ≈ 0; only
 * chromatic pixels clear the threshold. We then take a vibrance-
 * weighted mean of those chromatic pixels — the saturated ones pull
 * the mean toward themselves, so the result is the *dominant
 * chromatic identity* of the wedge:
 *
 *   • pastel-ground pieces      → the pastel ground
 *   • dark-ground / saturated-ink pieces → the ink colour
 *
 * Black or near-black background pixels never enter the average.
 * Resize uses nearest-neighbour so pure pixels survive the down-
 * sample (Lanczos was bleeding pure-yellow grid lines into
 * desaturated mid-tones, then those mid-tones diluted the mean).
 */
const extractWedgeData = unstable_cache(
  async (src: string): Promise<WedgeExtraction> => {
    const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    const buf = await fs.readFile(filePath);
    const { data, info } = await sharp(buf)
      .resize(SAMPLE, SAMPLE, { fit: "cover", kernel: "nearest" })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { channels } = info;

    let sumR = 0, sumG = 0, sumB = 0, sumW = 0;
    const sig = newSignatureAccumulator();
    // Chromatic pixels in OKLCh — fed to per-image k-means so the
    // piece contributes its actual palette to the global pool, not a
    // muddy single mean.
    const chromaticLchs: Oklch[] = [];
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const val = max / 255;
      const v = sat * val;
      if (v < VIBRANCE_THRESHOLD) continue;
      sumR += r * v;
      sumG += g * v;
      sumB += b * v;
      sumW += v;
      // Same vibrance weight feeds the embedding so a piece's hue
      // histogram reflects "where the chroma actually lives" rather
      // than counting every grey pixel equally.
      const lch = hexToOklch(rgbToHex(r, g, b));
      sig.addPixel(lch.L, lch.C, lch.h, v);
      chromaticLchs.push(lch);
    }

    const dominant =
      sumW > 0
        ? rgbToHex(
            Math.round(sumR / sumW),
            Math.round(sumG / sumW),
            Math.round(sumB / sumW)
          )
        : "#808080";

    // Per-image cluster extraction. K-means(k=5) on the chromatic
    // pixels finds the piece's distinct colour groups, then we
    // partition the pixels by nearest centroid and weight each
    // centroid by population × mean-chroma. Saturated colours pull
    // harder downstream (in the global pool); muted colours still
    // contribute but don't dominate.
    const clusters: ColorCluster[] = [];
    if (chromaticLchs.length >= PER_IMAGE_CLUSTERS) {
      const centroids = kmeansWeighted(
        chromaticLchs.map((lch) => ({ lch, weight: 1 })),
        PER_IMAGE_CLUSTERS
      );
      // Partition pixels to centroids to compute per-cluster weight.
      const populations = new Array(centroids.length).fill(0);
      const chromaSum = new Array(centroids.length).fill(0);
      for (const lch of chromaticLchs) {
        let nearest = 0;
        let minD = Infinity;
        for (let i = 0; i < centroids.length; i++) {
          const d = colorDistance(lch, centroids[i]);
          if (d < minD) {
            minD = d;
            nearest = i;
          }
        }
        populations[nearest]++;
        chromaSum[nearest] += lch.C;
      }
      for (let i = 0; i < centroids.length; i++) {
        const pop = populations[i];
        if (pop === 0) continue;
        const meanC = chromaSum[i] / pop;
        clusters.push({
          lch: centroids[i],
          // Weight = population × (mean chroma + small floor). The
          // floor ensures even an entirely-pastel cluster contributes
          // something — without it, a piece with no saturated cluster
          // would have weight 0 and be invisible to the global pool.
          weight: pop * (meanC + 0.05),
        });
      }
    } else if (chromaticLchs.length > 0) {
      // Tiny piece — just emit each chromatic pixel as its own cluster.
      for (const lch of chromaticLchs) {
        clusters.push({ lch, weight: lch.C + 0.05 });
      }
    }

    return {
      characteristic: dominant,
      palette: [dominant],
      signature: sig.finalize(),
      clusters,
    };
  },
  ["split-logic-wedge-data-v8"],
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
        signature: data.signature,
        clusters: data.clusters,
        wedgeId: `wedge-${n}`,
      };
    })
  );
}

/**
 * Returns colour data for all 100 sl-* items in the full series.
 * Same extraction as getSplitLogicPalette but covering sl-001..sl-100.
 */
export async function getSplitLogicFullPalette(): Promise<WedgeCell[]> {
  const ids = Array.from({ length: 100 }, (_, i) =>
    String(i + 1).padStart(3, "0")
  );
  return Promise.all(
    ids.map(async (n) => {
      const data = await extractWedgeData(
        `/images/ricky-retouch/works/sl-${n}.jpg`
      );
      return {
        hex: data.characteristic,
        palette: data.palette,
        signature: data.signature,
        clusters: data.clusters,
        wedgeId: `sl-${n}`,
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
  const fullItems = await getSplitLogicFullPalette();
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

  // Curated wedges (piece grid)
  for (const w of wedges) {
    map[`/images/ricky-retouch/works/${w.wedgeId}.mp4`] = w.hex;
    map[`/images/ricky-retouch/works/${w.wedgeId}.jpg`] = w.hex;
  }

  // Full series (sl-001..sl-100)
  for (const w of fullItems) {
    map[`/images/ricky-retouch/works/${w.wedgeId}.mp4`] = w.hex;
    map[`/images/ricky-retouch/works/${w.wedgeId}.jpg`] = w.hex;
  }

  return map;
}
