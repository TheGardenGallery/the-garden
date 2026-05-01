"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ══════════════════════════════════════════════════════════════
   CONSTELLATION MAP

   Chronological star chart — Paolo Čerić (May 2023) through
   Ricky Retouch (May 2026).

   Design: think Experimental Jetset, Stockholm Design Lab,
   a page from a Dieter Rams exhibition catalog. Every element
   earns its place. Nothing decorative. The constellation is
   information made beautiful through restraint.

   Resting state: near-invisible hairline connections, small
   precise dots, quiet monospace names. The page breathes.

   Hover: only the lines touching the hovered star come alive
   in that artist's muted colour. Everything else recedes.
   The tag border — a single-pixel hairline — takes the colour.
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
  // Muted, sophisticated — like ink swatches, not highlighters
  return `hsl(${hue.toFixed(1)}, 45%, 42%)`;
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
  const cols = 6;
  const rows = Math.ceil(n / cols);

  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const serpentine = row % 2 === 0;
    const xBase = serpentine
      ? col / Math.max(cols - 1, 1)
      : 1 - col / Math.max(cols - 1, 1);
    const yBase = rows > 1 ? row / (rows - 1) : 0.5;

    const j1x = (r() - 0.5) * 0.14;
    const j1y = (r() - 0.5) * 0.10;
    const j2x = (r() - 0.5) * 0.06;
    const j2y = (r() - 0.5) * 0.04;
    const j3x = (r() - 0.5) * 0.02;
    const j3y = (r() - 0.5) * 0.015;
    const curve = Math.sin(yBase * Math.PI * 0.9 + r() * 0.5) * 0.05;

    stars.push({
      name: ARTISTS[i].name,
      slug: ARTISTS[i].slug,
      colour: artistColour(i),
      x: Math.max(0.03, Math.min(0.97, xBase + j1x + j2x + j3x + curve)),
      y: Math.max(0.03, Math.min(0.97, yBase + j1y + j2y + j3y)),
      dAx: 1.8 + r() * 2.5,
      dAy: 1.4 + r() * 2.0,
      dFx: 0.00008 + r() * 0.00012,
      dFy: 0.00006 + r() * 0.00010,
      dPx: r() * Math.PI * 2,
      dPy: r() * Math.PI * 2,
    });
  }
  return stars;
}

/* ── edges ────────────────────────────────────────────────── */
function buildEdges(stars: Star[], seed: number): Edge[] {
  const r = makeRng(seed);
  const n = stars.length;
  const edges: Edge[] = [];
  for (let i = 0; i < n - 1; i++) edges.push([i, i + 1]);

  const dist = (a: Star, b: Star) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  const target = Math.floor(n * 0.22);
  let added = 0;
  for (let t = 0; t < n * 6 && added < target; t++) {
    const a = Math.floor(r() * n);
    const b = Math.floor(r() * n);
    if (a === b || Math.abs(a - b) <= 1) continue;
    if (dist(stars[a], stars[b]) > 0.25) continue;
    const dup = edges.some(
      ([ea, eb]) => (ea === a && eb === b) || (ea === b && eb === a)
    );
    if (!dup) { edges.push([a, b]); added++; }
  }
  return edges;
}

/* ── pre-compute adjacency: which edges touch which star ── */
function buildAdjacency(edges: Edge[], n: number): Set<number>[] {
  const adj: Set<number>[] = Array.from({ length: n }, () => new Set<number>());
  edges.forEach(([a, b], i) => { adj[a].add(i); adj[b].add(i); });
  return adj;
}

/* ── label placement ─────────────────────────────────────── */
type Label = {
  x: number; y: number;
  anchor: "start" | "end";
  bx: number; by: number; bw: number; bh: number;
  tx: number; ty: number; tw: number; th: number;
};

const CHAR_W = 6.8;
const LBL_H = 14;
const LBL_PAD = 8;
const DOT_GAP = 8;
const TAG_PX = 5;
const TAG_PY = 3.5;

function placeLabels(
  stars: Star[],
  toX: (s: Star) => number,
  toY: (s: Star) => number,
  cw: number, ch: number,
): Label[] {
  const labels: Label[] = [];
  const rects: { x1: number; y1: number; x2: number; y2: number }[] = [];

  for (const s of stars) {
    const cx = toX(s), cy = toY(s);
    rects.push({ x1: cx - 8, y1: cy - 8, x2: cx + 8, y2: cy + 8 });
  }

  const hit = (x1: number, y1: number, x2: number, y2: number) =>
    rects.some(r => x1 < r.x2 && x2 > r.x1 && y1 < r.y2 && y2 > r.y1);

  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const cx = toX(s), cy = toY(s);
    const tw = s.name.length * CHAR_W;

    const tries: { x: number; y: number; a: "start" | "end" }[] = [
      { x: cx + DOT_GAP,  y: cy + 4,   a: "start" },
      { x: cx - DOT_GAP,  y: cy + 4,   a: "end" },
      { x: cx + DOT_GAP,  y: cy - 8,   a: "start" },
      { x: cx - DOT_GAP,  y: cy - 8,   a: "end" },
      { x: cx + DOT_GAP,  y: cy + 18,  a: "start" },
      { x: cx - DOT_GAP,  y: cy + 18,  a: "end" },
      { x: cx + DOT_GAP,  y: cy - 20,  a: "start" },
      { x: cx - DOT_GAP,  y: cy + 28,  a: "end" },
    ];

    let placed = false;
    for (const t of tries) {
      const lx1 = t.a === "start" ? t.x - LBL_PAD : t.x - tw - LBL_PAD;
      const lx2 = t.a === "start" ? t.x + tw + LBL_PAD : t.x + LBL_PAD;
      const ly1 = t.y - LBL_H;
      const ly2 = t.y + LBL_PAD;

      if (lx1 < 0 || lx2 > cw || ly1 < 0 || ly2 > ch) continue;
      if (!hit(lx1, ly1, lx2, ly2)) {
        const tagX = t.a === "start" ? t.x - TAG_PX : t.x - tw - TAG_PX;
        const tagY = t.y - LBL_H + 2;
        const tagW = tw + TAG_PX * 2;
        const tagH = LBL_H + TAG_PY;
        labels.push({
          x: t.x, y: t.y, anchor: t.a,
          bx: lx1, by: ly1, bw: lx2 - lx1, bh: ly2 - ly1,
          tx: tagX, ty: tagY, tw: tagW, th: tagH,
        });
        rects.push({ x1: lx1, y1: ly1, x2: lx2, y2: ly2 });
        placed = true;
        break;
      }
    }
    if (!placed) {
      const fb = tries[0];
      const lx1 = fb.x - LBL_PAD;
      const ly1 = fb.y - LBL_H;
      const bw = tw + LBL_PAD * 2;
      const bh = LBL_H + LBL_PAD;
      const tagX = fb.a === "start" ? fb.x - TAG_PX : fb.x - tw - TAG_PX;
      labels.push({
        x: fb.x, y: fb.y, anchor: fb.a,
        bx: lx1, by: ly1, bw, bh,
        tx: tagX, ty: fb.y - LBL_H + 2, tw: tw + TAG_PX * 2, th: LBL_H + TAG_PY,
      });
      rects.push({ x1: lx1, y1: ly1, x2: lx1 + bw, y2: ly1 + bh });
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
        const dx =
          Math.sin(t * s.dFx + s.dPx) * s.dAx * 0.7 +
          Math.sin(t * s.dFx * 0.6 + s.dPy) * s.dAx * 0.3;
        const dy =
          Math.cos(t * s.dFy + s.dPy) * s.dAy * 0.7 +
          Math.cos(t * s.dFy * 0.7 + s.dPx) * s.dAy * 0.3;
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
const DOT_R = 2.5;
const HIT_R = 24;

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

  const mL = Math.max(110, w * 0.15);
  const mR = Math.max(110, w * 0.15);
  const mTop = 170;
  const mBot = 110;
  const iw = Math.max(1, w - mL - mR);
  const ih = Math.max(1, h - mTop - mBot);

  const toX = useCallback((s: Star) => mL + s.x * iw, [mL, iw]);
  const toY = useCallback((s: Star) => mTop + s.y * ih, [mTop, ih]);
  const labels = dims.w > 0 ? placeLabels(stars, toX, toY, w, h) : [];

  // Which edges are adjacent to the hovered star?
  const activeEdges = hovered !== null ? adjacency[hovered] : null;
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

          {/* Lines — only connected lines take colour on hover */}
          <g mask="url(#lbl-mask)">
            {edges.map(([a, b], i) => {
              const lit = activeEdges?.has(i);
              const dimmed = hovered !== null && !lit;
              return (
                <line key={`e${i}`}
                  x1={toX(stars[a])} y1={toY(stars[a])}
                  x2={toX(stars[b])} y2={toY(stars[b])}
                  className={`c-line${lit ? " c-line--lit" : ""}${dimmed ? " c-line--dim" : ""}`}
                  style={lit ? { stroke: hoverColour! } : undefined}
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
                onClick={() => router.push(`/artists#${s.slug}`)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={cx} cy={cy} r={HIT_R}
                  fill="transparent" style={{ pointerEvents: "all" }} />
                <circle
                  ref={(el) => { dotRefs.current[i] = el; }}
                  cx={cx} cy={cy}
                  r={active ? 4 : DOT_R}
                  fill={active ? s.colour : "#000"}
                  className="c-dot" />
                <rect
                  x={label.tx} y={label.ty}
                  width={label.tw} height={label.th}
                  className="c-tag"
                  style={active ? { stroke: s.colour } : undefined}
                />
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
