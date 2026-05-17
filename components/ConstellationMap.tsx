"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ══════════════════════════════════════════════════════════════
   CONSTELLATION MAP

   Chronological star chart of The Garden's artist roster.
   Dark background, white dots, monospace names.
   On hover every line takes the hovered artist's colour.
   ══════════════════════════════════════════════════════════════ */

const ARTISTS: { name: string; slug: string }[] = [
  { name: "Paolo Čerić",       slug: "paolo-eri" },
  { name: "Khwampa",           slug: "khwampa" },
  { name: "loackme",           slug: "loackme" },
  { name: "cydr",              slug: "cydr" },
  { name: "Eric Andwer",       slug: "eric-andwer" },
  { name: "John Provencher",   slug: "john-provencher" },
  { name: "VES3L",             slug: "ves3l" },
  { name: "Nikita Diakur",     slug: "nikita-diakur" },
  { name: "Yoshi Sodeoka",     slug: "yoshi-sodeoka" },
  { name: "Jeres",             slug: "jeres" },
  { name: "Spøgelsesmaskinen", slug: "sp-gelsesmaskinen" },
  { name: "earthsample",       slug: "earthsample" },
  { name: "Tù.úk'z",          slug: "t-k-z" },
  { name: "Erik Swahn",        slug: "erik-swahn" },
  { name: "Chepertom",         slug: "chepertom" },
  { name: "Itsgalo",           slug: "itsgalo" },
  { name: "rudxane",           slug: "rudxane" },
  { name: "Aluan Wang",        slug: "aluan-wang" },
  { name: "Chuck Anderson",    slug: "chuck-anderson" },
  { name: "Mazin",             slug: "mazin" },
  { name: "riiiis",            slug: "riiiis" },
  { name: "PERFECTL00P",       slug: "perfectl00p" },
  { name: "Paul Prudence",     slug: "paul-prudence" },
  { name: "Mark Webster",      slug: "mark-webster" },
  { name: "1mposter",          slug: "1mposter" },
  { name: "Ricky Retouch",     slug: "ricky-retouch" },
];

/* ── colour ──────────────────────────────────────────────── */
const GOLDEN_ANGLE = 137.508;
const HUE_OFFSET = 210;

/** Desktop constellation hover colour — single hue per artist,
 *  uniform saturation/lightness for the line-glow effect. */
function artistColour(i: number): string {
  const hue = (HUE_OFFSET + i * GOLDEN_ANGLE) % 360;
  return `hsl(${hue.toFixed(1)}, 55%, 62%)`;
}

/** Mobile field dot colour — varies saturation AND lightness per
 *  artist so adjacent hues don't look the same at small size.
 *  Alternates between warm/cool saturation bands and shifts
 *  lightness in a 3-step cycle. */
function artistColourMobile(i: number): string {
  const hue = (HUE_OFFSET + i * GOLDEN_ANGLE) % 360;
  const satBand = [58, 72, 45, 65];
  const litBand = [58, 68, 52, 63, 72];
  const sat = satBand[i % satBand.length];
  const lit = litBand[i % litBand.length];
  return `hsl(${hue.toFixed(1)}, ${sat}%, ${lit}%)`;
}

/* ── seeded PRNG ─────────────────────────────────────────── */
function makeRng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

/* ── types ────────────────────────────────────────────────── */
type Star = {
  name: string; slug: string; colour: string;
  x: number; y: number;
  dAx: number; dAy: number; dFx: number; dFy: number;
  dPx: number; dPy: number;
};
type Edge = [number, number];

/* ── layout ──────────────────────────────────────────────── */
function layoutStars(seed: number): Star[] {
  const r = makeRng(seed);
  const n = ARTISTS.length;
  const stars: Star[] = [];

  const MIN_DX = 0.14;
  const MIN_DY = 0.065;

  const tooClose = (ax: number, ay: number, bx: number, by: number) =>
    Math.abs(ax - bx) < MIN_DX && Math.abs(ay - by) < MIN_DY;

  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);

    const pathX = t * 0.78 + 0.10
      + Math.sin(t * Math.PI * 2.3) * 0.12
      + Math.sin(t * Math.PI * 5.1 + 1.2) * 0.05;
    const pathY = t * 0.78 + 0.10
      + Math.cos(t * Math.PI * 1.8 + 0.5) * 0.10
      + Math.cos(t * Math.PI * 4.3 + 2.1) * 0.04;

    const scatter = 0.26;
    let bestX = pathX;
    let bestY = pathY;
    let bestScore = -Infinity;
    let placed = false;

    for (let attempt = 0; attempt < 80; attempt++) {
      const sx = (r() - 0.5) * scatter + (r() - 0.5) * scatter * 0.4;
      const sy = (r() - 0.5) * scatter + (r() - 0.5) * scatter * 0.4;
      const cx = Math.max(0.03, Math.min(0.97, pathX + sx));
      const cy = Math.max(0.03, Math.min(0.97, pathY + sy));

      let clash = false;
      let minND = Infinity;
      for (let j = 0; j < stars.length; j++) {
        if (tooClose(cx, cy, stars[j].x, stars[j].y)) { clash = true; break; }
        const ndx = (cx - stars[j].x) / MIN_DX;
        const ndy = (cy - stars[j].y) / MIN_DY;
        const nd = Math.sqrt(ndx * ndx + ndy * ndy);
        if (nd < minND) minND = nd;
      }

      if (!clash) { bestX = cx; bestY = cy; placed = true; break; }
      if (minND > bestScore) { bestScore = minND; bestX = cx; bestY = cy; }
    }

    if (!placed && stars.length > 0) {
      let ni = 0, nd = Infinity;
      for (let j = 0; j < stars.length; j++) {
        const dx = (bestX - stars[j].x) / MIN_DX;
        const dy = (bestY - stars[j].y) / MIN_DY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < nd) { nd = d; ni = j; }
      }
      if (nd < 1 && nd > 0) {
        const s = 1.15 / nd;
        bestX = Math.max(0.03, Math.min(0.97, stars[ni].x + (bestX - stars[ni].x) * s));
        bestY = Math.max(0.03, Math.min(0.97, stars[ni].y + (bestY - stars[ni].y) * s));
      }
    }

    stars.push({
      name: ARTISTS[i].name, slug: ARTISTS[i].slug, colour: artistColour(i),
      x: bestX, y: bestY,
      dAx: 1.8 + r() * 2.5, dAy: 1.4 + r() * 2.0,
      dFx: 0.00008 + r() * 0.00012, dFy: 0.00006 + r() * 0.00010,
      dPx: r() * Math.PI * 2, dPy: r() * Math.PI * 2,
    });
  }
  return stars;
}

/* ── edges ────────────────────────────────────────────────── */
function buildEdges(stars: Star[], seed: number): Edge[] {
  const r = makeRng(seed);
  const n = stars.length;
  const edges: Edge[] = [];
  const dist = (a: Star, b: Star) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  // MST
  const inTree = new Set<number>([0]);
  while (inTree.size < n) {
    let bestD = Infinity, bestFrom = -1, bestTo = -1;
    for (const from of inTree) {
      for (let to = 0; to < n; to++) {
        if (inTree.has(to)) continue;
        const d = dist(stars[from], stars[to]);
        if (d < bestD) { bestD = d; bestFrom = from; bestTo = to; }
      }
    }
    if (bestTo >= 0) { edges.push([bestFrom, bestTo]); inTree.add(bestTo); }
  }

  // Prune ~18%
  const degree = new Map<number, number>();
  for (const [a, b] of edges) {
    degree.set(a, (degree.get(a) || 0) + 1);
    degree.set(b, (degree.get(b) || 0) + 1);
  }
  const target = Math.floor(edges.length * 0.18);
  let pruned = 0;
  const order = Array.from({ length: edges.length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const removed = new Set<number>();
  for (const idx of order) {
    if (pruned >= target) break;
    const [a, b] = edges[idx];
    const dA = degree.get(a)!, dB = degree.get(b)!;
    if (dA > 1 && dB > 1) {
      removed.add(idx); degree.set(a, dA - 1); degree.set(b, dB - 1); pruned++;
    }
  }
  return edges.filter((_, i) => !removed.has(i));
}

/* ── adjacency ────────────────────────────────────────────── */
function buildAdjacency(edges: Edge[], n: number): Set<number>[] {
  const adj: Set<number>[] = Array.from({ length: n }, () => new Set<number>());
  edges.forEach(([a, b], i) => { adj[a].add(i); adj[b].add(i); });
  return adj;
}

/* ── label placement ─────────────────────────────────────── 
   Places labels near their dot, trying 12 positions.
   On narrow screens, allows labels to extend slightly beyond
   the SVG edge (clamped at -20px) rather than overlapping.
   ──────────────────────────────────────────────────────────── */
type Label = {
  x: number; y: number;
  anchor: "start" | "end";
  bx: number; by: number; bw: number; bh: number;
};

const LBL_H = 12;
const LBL_PAD = 6;
const DOT_GAP = 3;

type LabelPlacement = {
  labels: Label[];
  /** Count of stars whose label couldn't fit any of the 12 ideal slots
   *  and had to use the last-resort placement (which lets the label
   *  drift past the edge / overlap neighbours). The parent uses this
   *  as the "this layout is cramped, switch to the floating field"
   *  signal. */
  fallbackCount: number;
};

function placeLabels(
  stars: Star[],
  toX: (s: Star) => number,
  toY: (s: Star) => number,
  cw: number, ch: number,
  charW: number,
): LabelPlacement {
  const labels: Label[] = [];
  let fallbackCount = 0;
  const rects: { x1: number; y1: number; x2: number; y2: number }[] = [];

  for (const s of stars) {
    const cx = toX(s), cy = toY(s);
    rects.push({ x1: cx - 8, y1: cy - 8, x2: cx + 8, y2: cy + 8 });
  }

  const hit = (x1: number, y1: number, x2: number, y2: number) =>
    rects.some(r => x1 < r.x2 && x2 > r.x1 && y1 < r.y2 && y2 > r.y1);

  // Hard in-frame: labels must fit within the canvas. On tiny screens
  // (<390px), allow 15px bleed so edge labels aren't forced into overlap
  // with interior names. CSS overflow:visible on .constellation-root
  // at mobile prevents clipping.
  const edgeBleed = 0;

  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const cx = toX(s), cy = toY(s);
    const tw = s.name.length * charW;

    const g = DOT_GAP;
    // Keep labels visually tethered to their dot — max ~16px above /
    // below. If none of these tight slots clear the neighbours, the
    // label falls back, and the parent flips the whole map to the
    // floating-field view (which can place labels anywhere). So
    // "label that has to drift far from its dot" is no longer a
    // possible outcome: either it sits close, or we render the field.
    const tries: { x: number; y: number; a: "start" | "end" }[] = [
      { x: cx + g, y: cy + 4,  a: "start" },
      { x: cx - g, y: cy + 4,  a: "end" },
      { x: cx + g, y: cy - 8,  a: "start" },
      { x: cx - g, y: cy - 8,  a: "end" },
      { x: cx + g, y: cy + 14, a: "start" },
      { x: cx - g, y: cy + 14, a: "end" },
      { x: cx + g, y: cy - 16, a: "start" },
      { x: cx - g, y: cy - 16, a: "end" },
    ];

    let placed = false;
    for (const t of tries) {
      const lx1 = t.a === "start" ? t.x - LBL_PAD : t.x - tw - LBL_PAD;
      const lx2 = t.a === "start" ? t.x + tw + LBL_PAD : t.x + LBL_PAD;
      const ly1 = t.y - LBL_H;
      const ly2 = t.y + LBL_PAD;

      if (lx1 < edgeBleed || lx2 > cw - edgeBleed || ly1 < 0 || ly2 > ch) continue;
      if (!hit(lx1, ly1, lx2, ly2)) {
        labels.push({ x: t.x, y: t.y, anchor: t.a, bx: lx1, by: ly1, bw: lx2 - lx1, bh: ly2 - ly1 });
        rects.push({ x1: lx1, y1: ly1, x2: lx2, y2: ly2 });
        placed = true;
        break;
      }
    }
    if (!placed) {
      fallbackCount++;
      // Last resort — place tight to the dot anyway, on whichever side
      // has more room. This placement may overlap a neighbour or sit
      // past the edge, but the parent watches fallbackCount and flips
      // to the floating-field view as soon as it's non-zero, so this
      // branch only renders for a frame at most. Keeping the offset
      // small means the brief flash before the switch still reads as
      // "label near dot", not "label adrift."
      const anchor: "start" | "end" = cx > cw / 2 ? "end" : "start";
      const tx = anchor === "start" ? cx + g : cx - g;
      const ty = cy + 4;
      const lx1 = anchor === "start" ? tx - LBL_PAD : tx - tw - LBL_PAD;
      const bw = tw + LBL_PAD * 2;
      labels.push({ x: tx, y: ty, anchor, bx: lx1, by: ty - LBL_H, bw, bh: LBL_H + LBL_PAD });
      rects.push({ x1: lx1, y1: ty - LBL_H, x2: lx1 + bw, y2: ty + LBL_PAD });
    }
  }
  return { labels, fallbackCount };
}

/* ── drift (dots + lines) ────────────────────────────────── */
function useDrift(
  stars: Star[],
  edges: Edge[],
  toX: (s: Star) => number,
  toY: (s: Star) => number
) {
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const frame = useRef(0);
  // Mirror toX/toY through refs so the loop reads the latest mapping
  // each frame without the effect re-arming on every resize. Previously
  // toX/toY were in the effect deps, which tore down + re-armed the
  // entire rAF loop on every pixel of viewport change.
  const toXRef = useRef(toX);
  const toYRef = useRef(toY);
  toXRef.current = toX;
  toYRef.current = toY;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let live = true;
    let paused = document.hidden;
    let startT = 0;
    const dxs = new Float64Array(stars.length);
    const dys = new Float64Array(stars.length);

    const tick = (t: number) => {
      if (!live) return;
      if (paused) return;
      if (startT === 0) startT = t;
      // Ease drift amplitude from 0 → 1 over the first ~1.4s so the
      // dots emerge from their layout position and "begin breathing"
      // rather than snapping into mid-motion on the first frame
      // (sin(huge_t) is effectively random). Cubic ease-out so the
      // initial expansion is gentle.
      const elapsed = t - startT;
      const p = Math.min(1, elapsed / 1400);
      const ease = 1 - Math.pow(1 - p, 3);

      const tx = toXRef.current;
      const ty = toYRef.current;

      for (let i = 0; i < stars.length; i++) {
        const c = dotRefs.current[i];
        if (!c) continue;
        const s = stars[i];
        const dx =
          (Math.sin(t * s.dFx + s.dPx) * s.dAx * 0.7 +
            Math.sin(t * s.dFx * 0.6 + s.dPy) * s.dAx * 0.3) * ease;
        const dy =
          (Math.cos(t * s.dFy + s.dPy) * s.dAy * 0.7 +
            Math.cos(t * s.dFy * 0.7 + s.dPx) * s.dAy * 0.3) * ease;
        dxs[i] = dx;
        dys[i] = dy;
        c.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
      }

      for (let e = 0; e < edges.length; e++) {
        const ln = lineRefs.current[e];
        if (!ln) continue;
        const [a, b] = edges[e];
        const ax = tx(stars[a]) + dxs[a];
        const ay = ty(stars[a]) + dys[a];
        const bx = tx(stars[b]) + dxs[b];
        const by = ty(stars[b]) + dys[b];
        const ldx = bx - ax,
          ldy = by - ay;
        const len = Math.sqrt(ldx * ldx + ldy * ldy);
        if (len > DOT_CLEAR * 2) {
          const ux = ldx / len,
            uy = ldy / len;
          ln.setAttribute("x1", (ax + ux * DOT_CLEAR).toFixed(1));
          ln.setAttribute("y1", (ay + uy * DOT_CLEAR).toFixed(1));
          ln.setAttribute("x2", (bx - ux * DOT_CLEAR).toFixed(1));
          ln.setAttribute("y2", (by - uy * DOT_CLEAR).toFixed(1));
        }
      }

      frame.current = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      paused = document.hidden;
      if (!paused && live) {
        // Reset the ease-in anchor so re-entering the tab doesn't
        // jolt the amplitude back to full mid-stride.
        startT = 0;
        frame.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    frame.current = requestAnimationFrame(tick);
    return () => {
      live = false;
      cancelAnimationFrame(frame.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // Only re-arm when the graph identity changes — viewport size
    // updates flow through the toX/toY refs above.
  }, [stars, edges]);

  return { dotRefs, lineRefs };
}

/* ── component ───────────────────────────────────────────── */
const SEED = 3141;
const DOT_R = 2;
const HIT_R = 22;
const DOT_CLEAR = 6; // px gap between line end and dot centre

/* ── mobile field layout ──────────────────────────────────── 
   On viewports <600px, renders a drifting field of coloured
   squares + artist names. Each item floats at a slow, unique
   velocity.  AABB collision pushes overlapping pairs apart so
   names never touch. Items bounce off the container walls so
   nothing leaves the frame. */
function MobileField({ stars }: { stars: Star[] }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const simRef = useRef<{
    x: number[]; y: number[];
    vx: number[]; vy: number[];
    w: number[]; h: number[];
  } | null>(null);
  const rafRef = useRef(0);
  const pointerRef = useRef<{ x: number; y: number; strength: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const els = itemRefs.current;
    const n = stars.length;
    if (n === 0) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cw = 0, ch = 0;
    let cleanedUp = false;
    // Hoisted so the ResizeObserver callback can scale positions
    // against the same padding budget used during initial placement.
    const PAD_X = 16, PAD_TOP = 76, PAD_BOT = 20;

    // Defer one frame so iOS Safari resolves 100dvh
    const startId = requestAnimationFrame(() => {
      if (cleanedUp) return;
      cw = container.clientWidth;
      ch = container.clientHeight;
      if (cw === 0 || ch === 0) return;

      // Measure items
      const widths: number[] = [];
      const heights: number[] = [];
      for (let i = 0; i < n; i++) {
        widths.push(els[i]?.offsetWidth ?? 100);
        heights.push(els[i]?.offsetHeight ?? 24);
      }

      ro.observe(container);

      // Pointer tracking (skip in reduced-motion since we won't animate)
      if (!reduced) {
        container.addEventListener("pointermove", onPointerMove as EventListener);
        container.addEventListener("touchstart", onTouchStart as EventListener, { passive: true });
        container.addEventListener("touchmove", onPointerMove as EventListener, { passive: true });
        container.addEventListener("pointerleave", onPointerLeave);
      }

      // Poisson-disc placement
      const rng = makeRng(SEED + 777);
      const xs: number[] = [], ys: number[] = [];
      for (let i = 0; i < n; i++) {
        let bestX = PAD_X, bestY = PAD_TOP, bestDist = -1;
        for (let attempt = 0; attempt < 80; attempt++) {
          const cx = PAD_X + rng() * Math.max(0, cw - widths[i] - PAD_X * 2);
          const cy = PAD_TOP + rng() * Math.max(0, ch - heights[i] - PAD_TOP - PAD_BOT);
          let minDist = Infinity, overlap = false;
          for (let j = 0; j < xs.length; j++) {
            if (cx < xs[j] + widths[j] + PAD_X && cx + widths[i] + PAD_X > xs[j] &&
                cy < ys[j] + heights[j] + 6 && cy + heights[i] + 6 > ys[j]) {
              overlap = true; break;
            }
            const d = Math.sqrt((cx - xs[j]) ** 2 + (cy - ys[j]) ** 2);
            if (d < minDist) minDist = d;
          }
          if (!overlap) { bestX = cx; bestY = cy; break; }
          if (minDist > bestDist) { bestDist = minDist; bestX = cx; bestY = cy; }
        }
        xs.push(bestX); ys.push(bestY);
      }

      const vxs = stars.map(() => (rng() - 0.5) * 0.22);
      const vys = stars.map(() => (rng() - 0.5) * 0.22);
      simRef.current = { x: xs, y: ys, vx: vxs, vy: vys, w: widths, h: heights };

      // Place items (reset fallback left/top)
      for (let i = 0; i < n; i++) {
        const el = els[i];
        if (el) {
          el.style.left = "0px";
          el.style.top = "0px";
          el.style.transform = `translate(${xs[i].toFixed(1)}px, ${ys[i].toFixed(1)}px)`;
        }
      }

      // Reduced motion: place items at their seeded positions and
      // stop here — no rAF loop, no pointer slowdown, no drift.
      if (reduced) return;

      // Animation loop
      let paused = document.hidden;
      const PROXIMITY_R = 120;

      const tick = () => {
        if (paused || cleanedUp) return;
        const sim = simRef.current;
        if (!sim) return;
        const { x, y, vx, vy, w, h } = sim;
        const ptr = pointerRef.current;

        // Decay touch strength so the slowdown fades out after lifting.
        // 0.94^60 ≈ 0.024, so strength crosses the 0.01 cutoff in
        // roughly 60 frames ≈ 1s at 60fps — matching the comment.
        if (ptr) {
          ptr.strength *= 0.94;
          if (ptr.strength < 0.01) pointerRef.current = null;
        }

        for (let i = 0; i < n; i++) {
          let damp = 1;
          if (ptr && ptr.strength > 0.01) {
            const dx = x[i] + w[i] / 2 - ptr.x;
            const dy = y[i] + h[i] / 2 - ptr.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < PROXIMITY_R) {
              const spatial = 0.05 + 0.95 * (dist / PROXIMITY_R);
              damp = 1 - (1 - spatial) * ptr.strength;
            }
          }
          x[i] += vx[i] * damp;
          y[i] += vy[i] * damp;
        }

        for (let i = 0; i < n; i++) {
          // Items wider than the usable strip (rare — only happens when
          // an artist's name is unusually long on a narrow viewport)
          // cause the two opposing bounce conditions to fire on
          // alternating frames, jittering visibly. When item exceeds
          // the usable width, pin to PAD_X and zero horizontal vel.
          if (w[i] > cw - PAD_X * 2) {
            x[i] = PAD_X;
            vx[i] = 0;
          } else if (x[i] < PAD_X) {
            x[i] = PAD_X; vx[i] = Math.abs(vx[i]);
          } else if (x[i] + w[i] > cw - PAD_X) {
            x[i] = cw - PAD_X - w[i]; vx[i] = -Math.abs(vx[i]);
          }
          if (y[i] < PAD_TOP) { y[i] = PAD_TOP; vy[i] = Math.abs(vy[i]); }
          else if (y[i] + h[i] > ch - PAD_BOT) { y[i] = ch - PAD_BOT - h[i]; vy[i] = -Math.abs(vy[i]); }
        }

        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const gap = 4;
            const oX = (x[i] + w[i] + gap) - x[j];
            const oY = (y[i] + h[i] + gap) - y[j];
            const oXr = (x[j] + w[j] + gap) - x[i];
            const oYr = (y[j] + h[j] + gap) - y[i];
            if (oX > 0 && oXr > 0 && oY > 0 && oYr > 0) {
              if (Math.min(oX, oXr) < Math.min(oY, oYr)) {
                const p = Math.min(oX, oXr) * 0.52;
                if (x[i] < x[j]) { x[i] -= p; x[j] += p; } else { x[i] += p; x[j] -= p; }
                const t = vx[i]; vx[i] = vx[j]; vx[j] = t;
              } else {
                const p = Math.min(oY, oYr) * 0.52;
                if (y[i] < y[j]) { y[i] -= p; y[j] += p; } else { y[i] += p; y[j] -= p; }
                const t = vy[i]; vy[i] = vy[j]; vy[j] = t;
              }
            }
          }
        }

        // Post-AABB clamp pass. The collision push above can shove items
        // past the walls (item against a wall + neighbour overlap pushes
        // it further into the wall). Without this second pass the item
        // sits visibly out-of-bounds for one frame, and items clamped at
        // the wall on the next frame's bounce appear stationary —
        // exactly the "not hovering / drifts out of frame" symptom.
        // Hard-clamp inverts velocity sign toward the field interior so
        // the item resumes drift inward rather than continuing to press
        // the wall.
        for (let i = 0; i < n; i++) {
          if (w[i] > cw - PAD_X * 2) {
            x[i] = PAD_X;
            vx[i] = 0;
          } else if (x[i] < PAD_X) {
            x[i] = PAD_X; vx[i] = Math.abs(vx[i]);
          } else if (x[i] + w[i] > cw - PAD_X) {
            x[i] = cw - PAD_X - w[i]; vx[i] = -Math.abs(vx[i]);
          }
          if (y[i] < PAD_TOP) { y[i] = PAD_TOP; vy[i] = Math.abs(vy[i]); }
          else if (y[i] + h[i] > ch - PAD_BOT) { y[i] = ch - PAD_BOT - h[i]; vy[i] = -Math.abs(vy[i]); }
        }

        for (let i = 0; i < n; i++) {
          const el = els[i];
          if (el) el.style.transform = `translate(${x[i].toFixed(1)}px, ${y[i].toFixed(1)}px)`;
        }
        rafRef.current = requestAnimationFrame(tick);
      };

      visHandler = () => {
        paused = document.hidden;
        if (!paused && !cleanedUp) rafRef.current = requestAnimationFrame(tick);
      };
      document.addEventListener("visibilitychange", visHandler);
      rafRef.current = requestAnimationFrame(tick);
    }); // end deferred rAF

    // Hoisted handlers for cleanup
    let visHandler: (() => void) | null = null;
    const onPointerMove = (e: PointerEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const pt = "touches" in e ? e.touches[0] : e;
      if (pt) pointerRef.current = { x: pt.clientX - rect.left, y: pt.clientY - rect.top, strength: 1 };
    };
    const onTouchStart = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const pt = e.touches[0];
      if (pt) pointerRef.current = { x: pt.clientX - rect.left, y: pt.clientY - rect.top, strength: 1 };
    };
    const onPointerLeave = () => {
      // Don't clear — let the strength decay naturally in the tick loop
    };
    const ro = new ResizeObserver(() => {
      const newCw = container.clientWidth;
      const newCh = container.clientHeight;
      // Proportionally rescale item positions to the new bounds so a
      // narrow→wide resize doesn't leave everything clustered against
      // the left edge, and wide→narrow doesn't squish items off-screen
      // (the wall-bounce would eventually correct it, but visibly).
      const sim = simRef.current;
      if (sim && cw > 0 && ch > 0 && newCw > 0 && newCh > 0) {
        const wRange = Math.max(1, cw - PAD_X * 2);
        const hRange = Math.max(1, ch - PAD_TOP - PAD_BOT);
        const sx = Math.max(1, newCw - PAD_X * 2) / wRange;
        const sy = Math.max(1, newCh - PAD_TOP - PAD_BOT) / hRange;
        for (let i = 0; i < sim.x.length; i++) {
          sim.x[i] = PAD_X + (sim.x[i] - PAD_X) * sx;
          sim.y[i] = PAD_TOP + (sim.y[i] - PAD_TOP) * sy;
        }
      }
      cw = newCw;
      ch = newCh;
    });

    return () => {
      cleanedUp = true;
      cancelAnimationFrame(startId);
      cancelAnimationFrame(rafRef.current);
      if (visHandler) document.removeEventListener("visibilitychange", visHandler);
      container.removeEventListener("pointermove", onPointerMove as EventListener);
      container.removeEventListener("touchstart", onTouchStart as EventListener);
      container.removeEventListener("touchmove", onPointerMove as EventListener);
      container.removeEventListener("pointerleave", onPointerLeave);
      ro.disconnect();
    };
  }, [stars]);

  // Seed a simple grid fallback so items are visible before the
  // useEffect physics kicks in (and permanently if JS fails).
  const fallbackRng = makeRng(SEED + 555);
  const cols = 2;

  return (
    <div className="constellation-mobile-field" ref={containerRef}>
      {stars.map((s, i) => {
        // Simple grid with slight jitter — replaced by physics on mount
        const row = Math.floor(i / cols);
        const col = i % cols;
        const fx = 16 + col * 170 + fallbackRng() * 20;
        const fy = 76 + row * 36 + fallbackRng() * 8;
        return (
          <button
            key={s.slug}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="constellation-mobile-star"
            onClick={() => router.push(`/artists/${s.slug}`)}
            style={{ left: fx, top: fy }}
          >
            <span
              className="constellation-mobile-dot"
              style={{ color: artistColourMobile(i) }}
            />
            <span className="constellation-mobile-name">{s.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ConstellationMap() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // Coalesce resize callbacks through rAF — a drag-resize fires the
    // observer per frame, and each measure cascades into label layout
    // and a render. Without coalescing the page thrashes; with it the
    // measure runs at most once per frame regardless of how many
    // observer callbacks queue up.
    let rafId = 0;
    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(() => {
        pending = false;
        setDims({ w: el.clientWidth, h: el.clientHeight });
      });
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const stars = useMemo(() => layoutStars(SEED), []);
  const edges = useMemo(() => buildEdges(stars, SEED + 77), [stars]);
  const adjacency = useMemo(() => buildAdjacency(edges, stars.length), [edges, stars.length]);

  const w = dims.w || 1;
  const h = dims.h || 1;

  // Responsive margins — only used for the SVG constellation (desktop)
  const narrow = w < 600;
  const mL = narrow ? 12 : Math.max(80, w * 0.10);
  const mR = narrow ? 12 : Math.max(80, w * 0.10);
  const mTop = narrow ? 72 : 120;
  const mBot = narrow ? 24 : 80;
  const iw = Math.max(1, w - mL - mR);
  const ih = Math.max(1, h - mTop - mBot);

  const charW = narrow ? 6.6 : 7.4;

  const toX = useCallback((s: Star) => mL + s.x * iw, [mL, iw]);
  const toY = useCallback((s: Star) => mTop + s.y * ih, [mTop, ih]);
  const { dotRefs, lineRefs } = useDrift(stars, edges, toX, toY);
  // Label placement is the heaviest pass each render (12 tries × N
  // labels × AABB scan). Memoise it so hover / drift / focus state
  // changes don't re-run it. Only viewport + star set + char metric
  // can invalidate the placement.
  const placement: LabelPlacement = useMemo(() => {
    if (dims.w === 0) return { labels: [], fallbackCount: 0 };
    return placeLabels(stars, toX, toY, w, h, charW);
  }, [stars, toX, toY, w, h, charW, dims.w]);
  const labels = placement.labels;

  const hoverColour = hovered !== null ? stars[hovered].colour : null;

  // Switch to the floating-field view either at the canonical narrow
  // breakpoint OR when the constellation labels can't all fit cleanly:
  // any fallback placement means at least one name had to push past
  // the edge or sit awkwardly under its dot — at that point the
  // floating field (which uses physics to avoid every overlap) reads
  // far better than a compromised constellation. Hysteresis isn't
  // needed since the cramped-ness is monotonic in viewport width.
  const isMobile =
    dims.w > 0 && (w < 600 || placement.fallbackCount > 0);

  return (
    <div className="constellation-root" ref={rootRef}>
      {isMobile ? (
        <MobileField stars={stars} />
      ) : dims.w > 0 ? (
        <svg
          className="constellation-svg"
          viewBox={`0 0 ${w} ${h}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id="lbl-mask">
              <rect x="0" y="0" width={w} height={h} fill="white" />
              {labels.map((l, i) => (
                <rect key={`m${i}`} x={l.bx} y={l.by}
                  width={l.bw} height={l.bh} fill="black" />
              ))}
            </mask>
          </defs>

          {/* Lines */}
          <g mask="url(#lbl-mask)">
            {edges.map(([a, b], i) => {
              const anyHover = hovered !== null;
              const isAdjacent =
                hovered !== null && (a === hovered || b === hovered);
              const ax = toX(stars[a]), ay = toY(stars[a]);
              const bx = toX(stars[b]), by = toY(stars[b]);
              const ldx = bx - ax, ldy = by - ay;
              const len = Math.sqrt(ldx * ldx + ldy * ldy);
              let x1 = ax, y1 = ay, x2 = bx, y2 = by;
              if (len > DOT_CLEAR * 2) {
                const ux = ldx / len, uy = ldy / len;
                x1 = ax + ux * DOT_CLEAR; y1 = ay + uy * DOT_CLEAR;
                x2 = bx - ux * DOT_CLEAR; y2 = by - uy * DOT_CLEAR;
              }
              // Three states per edge during hover:
              //   - adjacent to hovered star  → --lit (solid, animated)
              //   - elsewhere in the graph    → --all (tinted, calm)
              //   - no hover                  → default (dim dashed)
              const cls = isAdjacent
                ? "c-line c-line--lit"
                : anyHover
                  ? "c-line c-line--all"
                  : "c-line";
              return (
                <line key={`e${i}`}
                  ref={(el) => { lineRefs.current[i] = el; }}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  className={cls}
                  style={anyHover ? { stroke: hoverColour! } : undefined}
                />
              );
            })}
          </g>

          {/* Stars */}
          {stars.map((s, i) => {
            const cx = toX(s);
            const cy = toY(s);
            const label = labels[i];
            if (!label) return null;
            const active = hovered === i;
            const dimmed = hovered !== null && !active;

            return (
              <g key={s.slug}
                className={`c-star${dimmed ? " c-star--dim" : ""}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/artists/${s.slug}`)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={cx} cy={cy} r={HIT_R}
                  fill="transparent" style={{ pointerEvents: "all" }} />
                <circle
                  ref={(el) => { dotRefs.current[i] = el; }}
                  cx={cx} cy={cy}
                  r={active ? 3.5 : DOT_R}
                  fill={active ? s.colour : "#fff"}
                  className="c-dot" />
                <text x={label.x} y={label.y}
                  textAnchor={label.anchor}
                  className="c-label"
                  style={active ? { fill: s.colour, opacity: 1 } : undefined}
                >
                  {s.name}
                </text>
              </g>
            );
          })}
        </svg>
      ) : null}
    </div>
  );
}
