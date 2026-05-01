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
function artistColour(i: number): string {
  const hue = (HUE_OFFSET + i * GOLDEN_ANGLE) % 360;
  return `hsl(${hue.toFixed(1)}, 55%, 62%)`;
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
const DOT_GAP = 5;

function placeLabels(
  stars: Star[],
  toX: (s: Star) => number,
  toY: (s: Star) => number,
  cw: number, ch: number,
  charW: number,
): Label[] {
  const labels: Label[] = [];
  const rects: { x1: number; y1: number; x2: number; y2: number }[] = [];

  for (const s of stars) {
    const cx = toX(s), cy = toY(s);
    rects.push({ x1: cx - 8, y1: cy - 8, x2: cx + 8, y2: cy + 8 });
  }

  const hit = (x1: number, y1: number, x2: number, y2: number) =>
    rects.some(r => x1 < r.x2 && x2 > r.x1 && y1 < r.y2 && y2 > r.y1);

  // Allow labels to bleed slightly off-canvas on mobile rather than overlap
  const edgeBleed = cw < 500 ? -20 : 0;

  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const cx = toX(s), cy = toY(s);
    const tw = s.name.length * charW;

    const g = DOT_GAP;
    const tries: { x: number; y: number; a: "start" | "end" }[] = [
      { x: cx + g, y: cy + 4,  a: "start" },
      { x: cx - g, y: cy + 4,  a: "end" },
      { x: cx + g, y: cy - 10, a: "start" },
      { x: cx - g, y: cy - 10, a: "end" },
      { x: cx + g, y: cy + 18, a: "start" },
      { x: cx - g, y: cy + 18, a: "end" },
      { x: cx + g, y: cy - 22, a: "start" },
      { x: cx - g, y: cy - 22, a: "end" },
      { x: cx + g, y: cy + 30, a: "start" },
      { x: cx - g, y: cy + 30, a: "end" },
      { x: cx + g, y: cy - 34, a: "start" },
      { x: cx - g, y: cy + 42, a: "end" },
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
      // Last resort — place below, allow edge bleed
      const t = { x: cx + g, y: cy + 48, a: "start" as const };
      const lx1 = t.x - LBL_PAD;
      const bw = tw + LBL_PAD * 2;
      labels.push({ x: t.x, y: t.y, anchor: t.a, bx: lx1, by: t.y - LBL_H, bw, bh: LBL_H + LBL_PAD });
      rects.push({ x1: lx1, y1: t.y - LBL_H, x2: lx1 + bw, y2: t.y + LBL_PAD });
    }
  }
  return labels;
}

/* ── drift (dots only) ───────────────────────────────────── */
function useDrift(stars: Star[]) {
  const refs = useRef<(SVGCircleElement | null)[]>([]);
  const frame = useRef(0);

  useEffect(() => {
    let live = true;
    const tick = (t: number) => {
      if (!live) return;
      for (let i = 0; i < stars.length; i++) {
        const c = refs.current[i];
        if (!c) continue;
        const s = stars[i];
        const dx = Math.sin(t * s.dFx + s.dPx) * s.dAx * 0.7
          + Math.sin(t * s.dFx * 0.6 + s.dPy) * s.dAx * 0.3;
        const dy = Math.cos(t * s.dFy + s.dPy) * s.dAy * 0.7
          + Math.cos(t * s.dFy * 0.7 + s.dPx) * s.dAy * 0.3;
        c.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => { live = false; cancelAnimationFrame(frame.current); };
  }, [stars]);

  return refs;
}

/* ── component ───────────────────────────────────────────── */
const SEED = 3141;
const DOT_R = 2;
const HIT_R = 22;

export function ConstellationMap() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setDims({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const stars = useMemo(() => layoutStars(SEED), []);
  const edges = useMemo(() => buildEdges(stars, SEED + 77), [stars]);
  const adjacency = useMemo(() => buildAdjacency(edges, stars.length), [edges, stars.length]);
  const dotRefs = useDrift(stars);

  const w = dims.w || 1;
  const h = dims.h || 1;

  // Responsive margins
  const narrow = w < 600;
  const mL = narrow ? 12 : Math.max(80, w * 0.10);
  const mR = narrow ? 12 : Math.max(80, w * 0.10);
  const mTop = narrow ? 72 : 120;
  const mBot = narrow ? 24 : 80;
  const iw = Math.max(1, w - mL - mR);
  const ih = Math.max(1, h - mTop - mBot);

  // Char width matches CSS font size (9.5px mobile, 11.5px desktop)
  const charW = narrow ? 5.7 : 6.8;

  const toX = useCallback((s: Star) => mL + s.x * iw, [mL, iw]);
  const toY = useCallback((s: Star) => mTop + s.y * ih, [mTop, ih]);
  const labels = dims.w > 0 ? placeLabels(stars, toX, toY, w, h, charW) : [];

  const hoverColour = hovered !== null ? stars[hovered].colour : null;

  return (
    <div className="constellation-root" ref={rootRef}>
      {dims.w > 0 && (
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
              return (
                <line key={`e${i}`}
                  x1={toX(stars[a])} y1={toY(stars[a])}
                  x2={toX(stars[b])} y2={toY(stars[b])}
                  className={`c-line${anyHover ? " c-line--all" : ""}`}
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
      )}
    </div>
  );
}
