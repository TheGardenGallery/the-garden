"use client";

import { useEffect, useRef, useState } from "react";

/**
 * DashedFrame — the chunky white dashed rectangle that sits OUTSIDE the artwork.
 *
 * Robust clean corners via SVG `pathLength`: we normalise the rect's perimeter
 * to a fixed virtual length (4 * SEG_PER_SIDE) so EACH SIDE is exactly the same
 * number of normalised units, then use a dasharray that divides a side evenly.
 * Because every side is identical in normalised space and a dash starts at unit
 * 0 (a corner), all four corners get the identical dash phase — clean at ANY
 * size/aspect. (The old CSS gradient-edges landed dashes at a different phase on
 * each differently-sized side, so every corner looked different / shoddy.)
 */
export default function DashedFrame() {
  const ref = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setBox({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const THICK = 5;
  const inset = THICK / 2;

  // Normalised perimeter: each side = 1000 units → total 4000. A dash period
  // that divides 1000 evenly (e.g. 50 → 20 periods/side) guarantees a dash at
  // every corner and identical corners on all four sides.
  const SIDE = 1000;
  const PATH_LEN = SIDE * 4;
  const PERIODS_PER_SIDE = 20;        // 20 dashes per side
  const period = SIDE / PERIODS_PER_SIDE; // = 50
  const dash = period * 0.62;          // ~31 units dash
  const gap = period - dash;           // ~19 units gap
  // start with the dash centred on each corner: offset back by half a dash
  const dashOffset = -dash / 2;

  return (
    <svg
      ref={ref}
      className="dashed-frame"
      aria-hidden
      preserveAspectRatio="none"
      viewBox={box ? `0 0 ${box.w} ${box.h}` : undefined}
    >
      {box && (
        <rect
          x={inset}
          y={inset}
          width={box.w - THICK}
          height={box.h - THICK}
          fill="none"
          stroke="#fff"
          strokeWidth={THICK}
          pathLength={PATH_LEN}
          strokeDasharray={`${dash} ${gap}`}
          strokeDashoffset={dashOffset}
        />
      )}
    </svg>
  );
}
