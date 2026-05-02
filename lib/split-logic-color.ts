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
   * Multi-colour palette used for similarity matching: typically the
   * "ground band" and the "ink band" of the wedge. The grid sort
   * uses min(distance) over this set, so a dark-ground piece with
   * saturated ink ranks correctly against the ink's hue rather than
   * the muddy mean of dark + ink.
   */
  palette: string[];
};

export type Oklch = { L: number; C: number; h: number };

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
