/**
 * Split Logic — pure color math.
 *
 * Modern perceptual color space (OKLab / OKLCh) with a curatorial
 * distance metric. Lives in its own file so client components can
 * import it without pulling sharp into the browser bundle.
 *
 * Why OKLab over CIE Lab: OKLab was designed specifically for image-
 * processing workflows where Euclidean distance is supposed to track
 * perceptual difference, and it does that better than CIE Lab across
 * pastels and dark earth tones — the two color regions Ricky's wedges
 * actually live in. Why OKLCh on top of that: lightness, chroma, and
 * hue can be weighted independently, which lets us tune the
 * similarity ranking to match what a curator's eye reaches for.
 */

export type WedgeCell = {
  /** Display hex — used in the walker bar. */
  hex: string;
  /** Wedge id, e.g. "wedge-04" */
  wedgeId: string;
  /**
   * Multi-colour palette used for legacy compatibility / debugging.
   * The actual sort runs against `signature` below, which is a fixed-
   * size embedding of the piece's whole chromatic distribution.
   */
  palette: string[];
  /**
   * Color-distribution embedding: 12-bin hue histogram (normalised to
   * sum to 1) + mean L/C of the chromatic pixels. Used by the grid
   * sort to rank pieces by *overall colour feel* rather than nearest
   * single-pixel match — a sage-leaning piece beats a brick-and-jade
   * piece when the locked zone is sage, even if the brick piece has
   * one near-identical pixel.
   */
  signature: ColorSignature;
  /**
   * Top-N colour clusters for this piece (k-means on the chromatic
   * pixels). Each carries population × chroma weight. The colour bar
   * pools every wedge's clusters and runs weighted k-means over the
   * pool to derive the global zones — so a piece contributes its
   * *actual palette* (multiple distinct colours), not a muddied mean.
   */
  clusters: ColorCluster[];
};

export type Oklch = { L: number; C: number; h: number };

/** Number of hue bins in the signature embedding. 12 = 30° per bin —
 *  fine enough to separate red/orange/yellow/lime/etc. as distinct
 *  cells, coarse enough that scanning noise doesn't fragment a coherent
 *  hue across multiple bins. */
export const HUE_BINS = 12;

export type ColorSignature = {
  /** Length-HUE_BINS array, sums to 1. */
  hueHist: number[];
  /** Vibrance-weighted mean OKLCh lightness across chromatic pixels. */
  meanL: number;
  /** Vibrance-weighted mean OKLCh chroma across chromatic pixels. */
  meanC: number;
};

/** sRGB hex → OKLab (Björn Ottosson, 2020). */
export function hexToOklab(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (v: number) =>
    v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  const lr = lin(r), lg = lin(g), lb = lin(b);
  const L_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const M_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const S_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(L_), m_ = Math.cbrt(M_), s_ = Math.cbrt(S_);
  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ];
}

export function hexToOklch(hex: string): Oklch {
  const [L, a, b] = hexToOklab(hex);
  return {
    L,
    C: Math.sqrt(a * a + b * b),
    h: Math.atan2(b, a),
  };
}

/** OKLab → sRGB hex. Inverse of hexToOklab. */
export function oklabToHex([L, a, b]: [number, number, number]): string {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  const enc = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };
  const r = Math.round(enc(lr) * 255);
  const g = Math.round(enc(lg) * 255);
  const b2 = Math.round(enc(lb) * 255);
  return (
    "#" +
    [r, g, b2].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

export function oklchToHex({ L, C, h }: Oklch): string {
  return oklabToHex([L, C * Math.cos(h), C * Math.sin(h)]);
}

/**
 * Brightens a hex for legibility on dark surfaces while preserving
 * its hue and chroma. Used by the readout: navy / plum / brick
 * stays "navy in identity" but renders at a comfortable reading
 * lightness rather than sinking into the black background. Pastels
 * (already above the threshold) pass through unchanged.
 */
export function legibleOnDark(hex: string, minL = 0.78): string {
  const lch = hexToOklch(hex);
  if (lch.L >= minL) return hex;
  return oklchToHex({ L: minL, C: lch.C, h: lch.h });
}

/**
 * Brown / tan / khaki test in OKLCh. Brown sits in the orange-yellow
 * hue band (~40°–95°) but at low chroma and middling lightness — i.e.
 * the muted/dark corner of orange. Saturated yellows (#E5F448-ish)
 * stay above the chroma floor and pass through; saturated oranges
 * likewise.
 */
export function isBrownish(lch: Oklch): boolean {
  const hueDeg = ((lch.h * 180) / Math.PI + 360) % 360;
  const inOrangeYellowBand = hueDeg >= 40 && hueDeg <= 95;
  const mutedOrDark = lch.L < 0.82 && lch.C < 0.14;
  return inOrangeYellowBand && mutedOrDark;
}

/**
 * Near-neutral test — greys, beiges, dusty off-whites, anything whose
 * chroma is too low to read as a colour identity. The colour bar uses
 * this together with isBrownish to keep the row firmly chromatic; a
 * pale grey-blue or warm beige in the middle of saturated zones reads
 * as a gap rather than a colour. Threshold raised to 0.10 so dusty
 * pastels also fail the gate — the bar should be firmly saturated.
 */
export function isNeutral(lch: Oklch): boolean {
  return lch.C < 0.10;
}

/**
 * Extreme-luminance test — near-black or near-white. These are
 * edge tones that read as background ground, not chromatic identity,
 * even when chroma squeaks past the neutral threshold (a near-white
 * with a slight tint, for example). Filtered out of bar candidates so
 * the row stays in the meaty middle of the lightness range.
 */
export function isExtremeLuminance(lch: Oklch): boolean {
  return lch.L < 0.18 || lch.L > 0.92;
}

/**
 * Combined gate used by the colour bar — true if a candidate wedge
 * tone should be skipped when picking distinct zones. Centralised so
 * the rules can grow (or be relaxed) in one place.
 */
export function isUnsuitableForBar(lch: Oklch): boolean {
  return isBrownish(lch) || isNeutral(lch) || isExtremeLuminance(lch);
}

/** A single colour cluster extracted from an image — the centroid in
 *  OKLCh space plus a population-derived weight. Multiple per piece;
 *  the pool of all clusters across the series feeds the global
 *  weighted k-means that drives the colour bar. */
export type ColorCluster = {
  lch: Oklch;
  /** Population × mean-chroma. Saturated colours pull harder, sparse
   *  ones pull less, but every cluster contributes something. */
  weight: number;
};

/** Generic weighted sample for the weighted k-means below. */
export type WeightedSample = {
  lch: Oklch;
  weight: number;
};

/**
 * Weighted k-means clustering in OKLCh space. Same Lloyd's algorithm
 * as `kmeansClusters`, but each sample carries a weight that scales
 * its pull on its assigned centroid. Used to aggregate the per-image
 * cluster pool into the small global palette: a "red" cluster from
 * a 90%-red piece pulls 9× harder than a "red" cluster from a piece
 * with one stray red pixel.
 *
 * Hue averaging uses a chroma-weighted vector mean — points near the
 * grey axis (low C) shouldn't tug the centroid hue with their noisy
 * angular position, which they don't here because they barely
 * contribute to the (cos×C, sin×C) sum.
 */
export function kmeansWeighted(
  samples: WeightedSample[],
  k: number,
  maxIter: number = 40
): Oklch[] {
  if (samples.length === 0 || k === 0) return [];
  const effK = Math.min(k, samples.length);

  // k-means++ seeding: start with the highest-chroma sample, then each
  // next centroid maximises the minimum (weighted) distance from any
  // existing centroid. Spreads seeds across the colour space without
  // depending on shuffle order.
  let seedIdx = 0;
  let maxC = -Infinity;
  for (let i = 0; i < samples.length; i++) {
    if (samples[i].lch.C > maxC) {
      maxC = samples[i].lch.C;
      seedIdx = i;
    }
  }
  const centroids: Oklch[] = [{ ...samples[seedIdx].lch }];

  while (centroids.length < effK) {
    let bestIdx = -1;
    let bestMinD = -Infinity;
    for (let i = 0; i < samples.length; i++) {
      let minD = Infinity;
      for (const c of centroids) {
        const d = colorDistance(samples[i].lch, c);
        if (d < minD) minD = d;
      }
      if (minD > bestMinD) {
        bestMinD = minD;
        bestIdx = i;
      }
    }
    if (bestIdx < 0) break;
    centroids.push({ ...samples[bestIdx].lch });
  }

  // Lloyd's with weighted means.
  for (let iter = 0; iter < maxIter; iter++) {
    const buckets: WeightedSample[][] = Array.from({ length: effK }, () => []);
    for (const s of samples) {
      let nearest = 0;
      let minD = Infinity;
      for (let i = 0; i < effK; i++) {
        const d = colorDistance(s.lch, centroids[i]);
        if (d < minD) {
          minD = d;
          nearest = i;
        }
      }
      buckets[nearest].push(s);
    }
    let shifted = 0;
    for (let i = 0; i < effK; i++) {
      const bucket = buckets[i];
      if (bucket.length === 0) continue;
      let totalW = 0;
      let sumL = 0;
      let sumC = 0;
      let sumX = 0;
      let sumY = 0;
      for (const s of bucket) {
        const w = s.weight;
        totalW += w;
        sumL += s.lch.L * w;
        sumC += s.lch.C * w;
        // Chroma-weighted vector mean for hue (cos/sin × C × w) so
        // grey-ish points contribute negligibly to the angular pull.
        sumX += Math.cos(s.lch.h) * s.lch.C * w;
        sumY += Math.sin(s.lch.h) * s.lch.C * w;
      }
      if (totalW <= 0) continue;
      const newL = sumL / totalW;
      const newC = sumC / totalW;
      const newH = Math.atan2(sumY, sumX);
      if (
        Math.abs(newL - centroids[i].L) > 0.0008 ||
        Math.abs(newC - centroids[i].C) > 0.0008 ||
        Math.abs(newH - centroids[i].h) > 0.005
      ) {
        shifted++;
      }
      centroids[i] = { L: newL, C: newC, h: newH };
    }
    if (shifted === 0) break;
  }

  return centroids;
}

/**
 * K-means clustering in OKLCh space. Used to find the *main* colour
 * families across the series — each cluster centroid is the mean of
 * all wedges whose dominant tone falls into that group. Unlike
 * farthest-first selection (which surfaces maximally-diverse points,
 * including rare ones), k-means weights centroids by member count, so
 * the resulting palette reflects what colours the series actually
 * leans on.
 *
 * Initialisation uses k-means++: first centroid is the most-saturated
 * point (acts as a stable anchor across runs), each subsequent
 * centroid is chosen weighted toward the point farthest from any
 * existing centroid. Then Lloyd's algorithm runs to convergence.
 *
 * Hue averaging uses a vector mean (cos/sin × chroma) so the wraparound
 * at ±π is handled correctly — naive arithmetic mean of hues at 350°
 * and 10° would give 180° (cyan), not 0° (red), which is what we want.
 */
export function kmeansClusters(
  lchs: Oklch[],
  k: number,
  maxIter: number = 40
): Oklch[] {
  if (lchs.length === 0 || k === 0) return [];
  const effK = Math.min(k, lchs.length);

  // Seed with the highest-chroma point — most distinctive starting anchor.
  let seedIdx = 0;
  let maxC = -Infinity;
  for (let i = 0; i < lchs.length; i++) {
    if (lchs[i].C > maxC) {
      maxC = lchs[i].C;
      seedIdx = i;
    }
  }
  const centroids: Oklch[] = [{ ...lchs[seedIdx] }];

  // k-means++: each subsequent centroid maximises minimum distance to
  // the existing centroids — spreads seeds across the colour space.
  while (centroids.length < effK) {
    let bestIdx = -1;
    let bestMinD = -Infinity;
    for (let i = 0; i < lchs.length; i++) {
      let minD = Infinity;
      for (const c of centroids) {
        const d = colorDistance(lchs[i], c);
        if (d < minD) minD = d;
      }
      if (minD > bestMinD) {
        bestMinD = minD;
        bestIdx = i;
      }
    }
    if (bestIdx < 0) break;
    centroids.push({ ...lchs[bestIdx] });
  }

  // Lloyd's algorithm.
  for (let iter = 0; iter < maxIter; iter++) {
    const buckets: Oklch[][] = Array.from({ length: effK }, () => []);
    for (const lch of lchs) {
      let nearest = 0;
      let minD = Infinity;
      for (let i = 0; i < effK; i++) {
        const d = colorDistance(lch, centroids[i]);
        if (d < minD) {
          minD = d;
          nearest = i;
        }
      }
      buckets[nearest].push(lch);
    }
    let shifted = 0;
    for (let i = 0; i < effK; i++) {
      const bucket = buckets[i];
      if (bucket.length === 0) continue;
      let sumL = 0;
      let sumX = 0;
      let sumY = 0;
      let sumC = 0;
      for (const p of bucket) {
        sumL += p.L;
        sumC += p.C;
        // Vector mean for hue: weight each direction by chroma so
        // grey-ish points (low C) don't tug the hue with their
        // arbitrary direction.
        sumX += Math.cos(p.h) * p.C;
        sumY += Math.sin(p.h) * p.C;
      }
      const n = bucket.length;
      const newL = sumL / n;
      const newC = sumC / n;
      const newH = Math.atan2(sumY, sumX);
      if (
        Math.abs(newL - centroids[i].L) > 0.0008 ||
        Math.abs(newC - centroids[i].C) > 0.0008 ||
        Math.abs(newH - centroids[i].h) > 0.005
      ) {
        shifted++;
      }
      centroids[i] = { L: newL, C: newC, h: newH };
    }
    if (shifted === 0) break;
  }

  return centroids;
}

/**
 * Greedy farthest-first selection over OKLCh-distance. Used to thin a
 * full series palette down to a small set of mutually-distinct
 * representatives — so the bar shows colour *zones* rather than every
 * piece's near-duplicate ground.
 *
 * Returns indices into the input array, sorted by lightness ascending
 * (so the bar reads as a coherent dark→light spectrum).
 */
export function pickDistinctIndices(lchs: Oklch[], n: number): number[] {
  const total = lchs.length;
  const k = Math.min(n, total);
  if (k <= 0) return [];

  // Seed with the highest-chroma colour — the most "characteristic"
  // anchor for the rest of the picks to spread away from.
  let seedIdx = 0;
  let maxC = -Infinity;
  for (let i = 0; i < total; i++) {
    if (lchs[i].C > maxC) {
      maxC = lchs[i].C;
      seedIdx = i;
    }
  }

  const selected: number[] = [seedIdx];
  while (selected.length < k) {
    let bestIdx = -1;
    let bestMinDist = -Infinity;
    for (let i = 0; i < total; i++) {
      if (selected.includes(i)) continue;
      // Distance to the *nearest* already-selected colour. Maximising
      // this picks the candidate that is farthest from the closest
      // existing pick — i.e. fills the largest gap in the spread.
      let minDist = Infinity;
      for (const j of selected) {
        const d = colorDistance(lchs[i], lchs[j]);
        if (d < minDist) minDist = d;
      }
      if (minDist > bestMinDist) {
        bestMinDist = minDist;
        bestIdx = i;
      }
    }
    if (bestIdx < 0) break;
    selected.push(bestIdx);
  }

  // Reorder the picks light → dark so the bar reads as a spectrum
  // rather than the order farthest-first happened to discover them.
  selected.sort((a, b) => lchs[b].L - lchs[a].L);
  return selected;
}

/** Builder for a signature accumulator — call addPixel per chromatic
 *  pixel during image extraction, then finalize() to get the
 *  normalised ColorSignature. The same accumulator is used to build
 *  a target signature from the locked zone's single hex (one synthetic
 *  pixel with full vibrance), so target and artwork live in the same
 *  embedding space. */
export function newSignatureAccumulator() {
  const hueHist = new Array<number>(HUE_BINS).fill(0);
  let lSum = 0;
  let cSum = 0;
  let total = 0;

  return {
    addPixel(L: number, C: number, hRad: number, weight: number) {
      // Convert hue (radians, [-π, π]) to bin index [0, HUE_BINS).
      let deg = (hRad * 180) / Math.PI;
      if (deg < 0) deg += 360;
      const bin = Math.floor((deg / 360) * HUE_BINS) % HUE_BINS;
      // Smooth across ±1 bin so a piece whose hue sits on the seam
      // between two bins reads as occupying both, not one cliff-edge
      // bin. Total mass per pixel = weight * (1 + 0.5 + 0.5).
      hueHist[bin] += weight;
      hueHist[(bin + 1) % HUE_BINS] += weight * 0.4;
      hueHist[(bin + HUE_BINS - 1) % HUE_BINS] += weight * 0.4;
      lSum += L * weight;
      cSum += C * weight;
      total += weight;
    },
    finalize(): ColorSignature {
      // Pure-grey image (no chromatic pixels) — return a flat
      // distribution so distance to any locked zone is finite and
      // similar.
      if (total <= 0) {
        return {
          hueHist: new Array<number>(HUE_BINS).fill(1 / HUE_BINS),
          meanL: 0.5,
          meanC: 0,
        };
      }
      const sum = hueHist.reduce((s, v) => s + v, 0);
      return {
        hueHist: hueHist.map((v) => v / sum),
        meanL: lSum / total,
        meanC: cSum / total,
      };
    },
  };
}

/** Build a synthetic signature from a single colour — used for the
 *  locked zone's target. One pixel through the same accumulator gives
 *  a smoothed three-bin spike around the zone's hue. */
export function signatureFromHex(hex: string): ColorSignature {
  const lch = hexToOklch(hex);
  const acc = newSignatureAccumulator();
  acc.addPixel(lch.L, lch.C, lch.h, 1);
  return acc.finalize();
}

/** Distance between two colour signatures. Hue similarity uses cosine
 *  distance on the histogram (handles wraparound naturally because the
 *  smoothing in addPixel already bridges adjacent bins). Lightness is
 *  a separate Euclidean term so a dark sage is ranked closer to a
 *  light sage than to a dark brick. Chroma weighting is gentle —
 *  a muted vs. saturated mismatch should nudge, not dominate. */
export function signatureDistance(
  a: ColorSignature,
  target: ColorSignature
): number {
  let dot = 0;
  let magA = 0;
  let magT = 0;
  for (let i = 0; i < HUE_BINS; i++) {
    dot += a.hueHist[i] * target.hueHist[i];
    magA += a.hueHist[i] * a.hueHist[i];
    magT += target.hueHist[i] * target.hueHist[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magT) + 1e-9;
  const hueCos = 1 - dot / denom;
  const dL = a.meanL - target.meanL;
  const dC = a.meanC - target.meanC;
  // Weights tuned so hue identity dominates (the "is this green?"
  // signal carries the locked zone), L is a real but secondary
  // refinement, and chroma only nudges.
  return hueCos * 1.6 + Math.abs(dL) * 0.8 + Math.abs(dC) * 0.2;
}

/**
 * Curatorial distance — what a person browsing a series might call
 * "similar." Lightness creates the visual neighborhood (pastels feel
 * like sisters, deeps feel like sisters), hue carries identity, chroma
 * differentiates "muted" from "saturated."
 *
 * Hue is multiplied by mean chroma so that two near-grays don't get
 * pulled apart by random hue noise. Wraparound is handled via
 * shortest-arc.
 */
export function colorDistance(a: Oklch, b: Oklch): number {
  const dL = a.L - b.L;
  const dC = a.C - b.C;

  let dh = a.h - b.h;
  if (dh > Math.PI) dh -= 2 * Math.PI;
  else if (dh < -Math.PI) dh += 2 * Math.PI;
  const Cmean = (a.C + b.C) / 2;
  const dHc = dh * Cmean;

  // Weights — hue carries colour identity (the "this is a green
  // piece" signal), so it dominates. Lightness is a secondary
  // refinement (sorts pastel-green ahead of mid-green when locked
  // to a sage). Chroma differentiates muted from saturated.
  const wL = 0.6, wC = 0.7, wH = 2.6;
  return Math.sqrt(
    (dL * wL) ** 2 + (dC * wC) ** 2 + (dHc * wH) ** 2
  );
}
