"use client";

import { useEffect, useRef, useState } from "react";

/**
 * DashedFrame — camera-viewfinder geometry sitting OUTSIDE the artwork.
 *
 * Solid L-brackets at TL/TR/BL/BR plus dashed segments running between them on
 * each side. Each dashed segment derives its own period from its pixel length
 * so the pattern starts AND ends with a half-dash flush against the bracket
 * arms — no random mid-cycle truncation, so all four corners read identically.
 */
export default function DashedFrame() {
  const ref = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      // Round to integer pixels. Subpixel dimensions (from dvw/dvh sizing)
      // cause anti-aliased strokes on the right/bottom edges that don't match
      // the crisp left/top, so each corner reads differently. Snap to integers.
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      if (w > 0 && h > 0) setBox({ w, h });
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

  // Target dash period in pixels; per-side we round so the pattern fits cleanly.
  const TARGET_PERIOD = 22;
  const DASH_RATIO = 0.55;

  /**
   * For a dashed segment of pixel length L, pick a period that divides L into a
   * whole number of cycles AND starts/ends with a half-dash flush to the corner.
   * Path length L = N * period → dashOffset = -dash/2 puts a half-dash at both
   * ends (since the visible pattern is symmetric about the path's centre).
   */
  function fit(L: number) {
    const N = Math.max(1, Math.round(L / TARGET_PERIOD));
    const period = L / N;
    const dash = period * DASH_RATIO;
    const gap = period - dash;
    return { dash, gap, offset: -dash / 2 };
  }

  if (!box) {
    return (
      <svg ref={ref} className="dashed-frame" aria-hidden preserveAspectRatio="none" />
    );
  }

  const { w, h } = box;
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = h - inset;
  // Corner arm length scales with the shorter side so brackets stay balanced;
  // floor at 28px so brackets read on small viewports.
  const a = Math.max(28, Math.min(w, h) * 0.08);

  const hLen = x1 - x0 - 2 * a; // top/bottom dashed length
  const vLen = y1 - y0 - 2 * a; // left/right dashed length
  const hFit = fit(hLen);
  const vFit = fit(vLen);

  return (
    <svg
      ref={ref}
      className="dashed-frame"
      aria-hidden
      preserveAspectRatio="none"
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
    >
      <g
        fill="none"
        stroke="#fff"
        strokeWidth={THICK}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        <path d={`M ${x0} ${y0 + a} L ${x0} ${y0} L ${x0 + a} ${y0}`} />
        <path d={`M ${x1 - a} ${y0} L ${x1} ${y0} L ${x1} ${y0 + a}`} />
        <path d={`M ${x1} ${y1 - a} L ${x1} ${y1} L ${x1 - a} ${y1}`} />
        <path d={`M ${x0 + a} ${y1} L ${x0} ${y1} L ${x0} ${y1 - a}`} />
      </g>
      <g fill="none" stroke="#fff" strokeWidth={THICK} strokeLinecap="butt">
        <path
          d={`M ${x0 + a} ${y0} L ${x1 - a} ${y0}`}
          strokeDasharray={`${hFit.dash} ${hFit.gap}`}
          strokeDashoffset={hFit.offset}
        />
        <path
          d={`M ${x0 + a} ${y1} L ${x1 - a} ${y1}`}
          strokeDasharray={`${hFit.dash} ${hFit.gap}`}
          strokeDashoffset={hFit.offset}
        />
        <path
          d={`M ${x0} ${y0 + a} L ${x0} ${y1 - a}`}
          strokeDasharray={`${vFit.dash} ${vFit.gap}`}
          strokeDashoffset={vFit.offset}
        />
        <path
          d={`M ${x1} ${y0 + a} L ${x1} ${y1 - a}`}
          strokeDasharray={`${vFit.dash} ${vFit.gap}`}
          strokeDashoffset={vFit.offset}
        />
      </g>
    </svg>
  );
}
