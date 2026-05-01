"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ══════════════════════════════════════════════════════════════
   CONSTELLATION MAP

   Chronological star chart — Paolo Čerić (May 2023) through
   Ricky Retouch (May 2026). Stars drift on slow orbits. Labels
   float in guaranteed white space (SVG mask clears lines).

   Hover: golden-angle hue walk gives each artist a unique
   colour. Dot swells, label + dot shift into colour, connected
   lines brighten. Click navigates to the artist page.
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

/* ── per-artist hover colour ─────────────────────────────── */
const GOLDEN_ANGLE = 137.508;
const HUE_OFFSET = 220;
function artistColour(index: number): string {
  const hue = (HUE_OFFSET + index * GOLDEN_ANGLE) % 360;
  return `hsl(${hue.toFixed(1)}, 38%, 48%)`;
}

/* ── seeded PRNG ─────────────────────────────────────────── */
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
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
      dAx: 1.5 + r() * 2.0,     // 1.5–3.5 px amplitude
      dAy: 1.2 + r() * 1.5,
      dFx: 0.00015 + r() * 0.00025, // ~25–70s periods
      dFy: 0.00012 + r() * 0.00020,
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

/* ── label placement ─────────────────────────────────────── */
type Label = {
  x: number; y: number;
  anchor: "start" | "end";
  bx: number; by: number; bw: number; bh: number;
};

// Generous estimates for 11px Courier New
const CHAR_W = 6.8;
const LBL_H = 15;
const LBL_PAD = 8;   // large halo so lines never touch text
const DOT_GAP = 12;

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
      { x: cx + DOT_GAP,  y: cy - 10,  a: "start" },
      { x: cx - DOT_GAP,  y: cy - 10,  a: "end" },
      { x: cx + DOT_GAP,  y: cy + 20,  a: "start" },
      { x: cx - DOT_GAP,  y: cy + 20,  a: "end" },
      { x: cx + DOT_GAP,  y: cy - 22,  a: "start" },
      { x: cx - DOT_GAP,  y: cy + 30,  a: "end" },
    ];

    let placed = false;
    for (const t of tries) {
      const lx1 = t.a === "start" ? t.x - LBL_PAD : t.x - tw - LBL_PAD;
      const lx2 = t.a === "start" ? t.x + tw + LBL_PAD : t.x + LBL_PAD;
      const ly1 = t.y - LBL_H;
      const ly2 = t.y + LBL_PAD;

      if (lx1 < 0 || lx2 > cw || ly1 < 0 || ly2 > ch) continue;
      if (!hit(lx1, ly1, lx2, ly2)) {
        labels.push({
          x: t.x, y: t.y, anchor: t.a,
          bx: lx1, by: ly1, bw: lx2 - lx1, bh: ly2 - ly1,
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
      labels.push({
        x: fb.x, y: fb.y, anchor: fb.a,
        bx: lx1, by: ly1, bw, bh,
      });
      rects.push({ x1: lx1, y1: ly1, x2: lx1 + bw, y2: ly1 + bh });
    }
  }
  return labels;
}

/* ── drift animation ─────────────────────────────────────── */
function useDrift(stars: Star[]) {
  const refs = useRef<(SVGGElement | null)[]>([]);
  const frame = useRef(0);

  useEffect(() => {
    let live = true;
    const tick = (t: number) => {
      if (!live) return;
      for (let i = 0; i < stars.length; i++) {
        const g = refs.current[i];
        if (!g) continue;
        const s = stars[i];
        const dx = Math.sin(t * s.dFx + s.dPx) * s.dAx;
        const dy = Math.cos(t * s.dFy + s.dPy) * s.dAy;
        g.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
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
const DOT_R = 3;
const HIT_R = 28; // invisible hit area radius

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
  const groupRefs = useDrift(stars);

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

          {/* Dashed lines — masked where labels sit */}
          <g mask="url(#lbl-mask)">
            {edges.map(([a, b], i) => {
              const active = hovered !== null;
              return (
                <line key={`e${i}`}
                  x1={toX(stars[a])} y1={toY(stars[a])}
                  x2={toX(stars[b])} y2={toY(stars[b])}
                  className={`c-line${active ? " c-line--active" : ""}`}
                  style={active ? {
                    stroke: stars[hovered!].colour,
                  } : undefined}
                />
              );
            })}
          </g>

          {/* Stars — hover managed via React state for reliable colour */}
          {stars.map((s, i) => {
            const cx = toX(s);
            const cy = toY(s);
            const label = labels[i];
            if (!label) return null;
            const active = hovered === i;

            return (
              <g key={s.slug}
                ref={(el) => { groupRefs.current[i] = el; }}
                className="c-star"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/artists#${s.slug}`)}
                style={{ cursor: "pointer" }}
              >
                {/* Invisible hit area — easy to hover */}
                <circle cx={cx} cy={cy} r={HIT_R}
                  fill="transparent" style={{ pointerEvents: "all" }} />
                {/* Visible dot */}
                <circle cx={cx} cy={cy}
                  r={active ? 5 : DOT_R}
                  fill={active ? s.colour : "#000"}
                  className="c-dot" />
                {/* Label */}
                <text x={label.x} y={label.y}
                  textAnchor={label.anchor}
                  className="c-label"
                  style={{
                    fill: active ? s.colour : undefined,
                    opacity: active ? 1 : undefined,
                  }}
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
