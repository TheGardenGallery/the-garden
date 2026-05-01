"use client";

import { useEffect, useRef, useState } from "react";
import { artists } from "@/lib/data/artists";

/* ── seeded PRNG ─────────────────────────────────────────── */
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── types ────────────────────────────────────────────────── */
type Star = {
  name: string;
  slug: string;
  x: number; // 0–1 normalised
  y: number;
};

type Edge = [number, number]; // indices into stars[]

/* ── layout: place stars with seeded organic scatter ─────── */
function layoutStars(seed: number): Star[] {
  const rng = createRng(seed);

  // Padding from edges (normalised)
  const pad = 0.08;
  const range = 1 - pad * 2;

  return artists.map((a) => ({
    name: a.name,
    slug: a.slug,
    x: pad + rng() * range,
    y: pad + rng() * range,
  }));
}

/* ── edges: connect stars into a constellation graph ─────── */
function buildEdges(stars: Star[], seed: number): Edge[] {
  const rng = createRng(seed);
  const n = stars.length;
  const edges: Edge[] = [];
  const connected = new Set<number>();

  // Sort by distance from a random anchor to create an organic spanning path
  const anchorIdx = Math.floor(rng() * n);
  const dist = (a: Star, b: Star) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  // Build a minimum-spanning-tree-ish structure using Prim's
  connected.add(anchorIdx);
  while (connected.size < n) {
    let bestDist = Infinity;
    let bestFrom = -1;
    let bestTo = -1;

    for (const from of connected) {
      for (let to = 0; to < n; to++) {
        if (connected.has(to)) continue;
        const d = dist(stars[from], stars[to]);
        if (d < bestDist) {
          bestDist = d;
          bestFrom = from;
          bestTo = to;
        }
      }
    }

    if (bestTo >= 0) {
      edges.push([bestFrom, bestTo]);
      connected.add(bestTo);
    }
  }

  // Add a few extra cross-links for visual interest
  const extraCount = Math.floor(n * 0.3);
  for (let i = 0; i < extraCount; i++) {
    const a = Math.floor(rng() * n);
    const b = Math.floor(rng() * n);
    if (a !== b && dist(stars[a], stars[b]) < 0.35) {
      const exists = edges.some(
        ([ea, eb]) => (ea === a && eb === b) || (ea === b && eb === a)
      );
      if (!exists) edges.push([a, b]);
    }
  }

  return edges;
}

/* ── component ───────────────────────────────────────────── */
const SEED = 2718;
const DOT_R = 4;
const LABEL_OFFSET = 10;

export function ConstellationMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const stars = layoutStars(SEED);
  const edges = buildEdges(stars, SEED + 42);

  const w = size.w || 1;
  const h = size.h || 1;

  return (
    <div className="constellation-root" ref={containerRef}>
      {size.w > 0 && (
        <svg
          className="constellation-svg"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
        >
          {/* dashed connector lines */}
          {edges.map(([a, b], i) => (
            <line
              key={`e-${i}`}
              x1={stars[a].x * w}
              y1={stars[a].y * h}
              x2={stars[b].x * w}
              y2={stars[b].y * h}
              className="constellation-line"
            />
          ))}

          {/* dots + labels */}
          {stars.map((s, i) => {
            const cx = s.x * w;
            const cy = s.y * h;
            // Alternate label side to reduce overlap
            const labelLeft = cx > w * 0.5;
            const anchor = labelLeft ? "end" : "start";
            const lx = labelLeft ? cx - LABEL_OFFSET : cx + LABEL_OFFSET;

            return (
              <g key={s.slug}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={DOT_R}
                  className="constellation-dot"
                />
                <text
                  x={lx}
                  y={cy + 3.5}
                  textAnchor={anchor}
                  className="constellation-label"
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
