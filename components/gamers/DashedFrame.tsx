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
      // Use the EXACT measured (fractional) dimensions for the viewBox so the
      // viewBox aspect equals the element's rendered aspect — then
      // preserveAspectRatio="none" has nothing to stretch (element==viewBox), so
      // strokes and dashes stay uniform on all four sides. (Rounding to integers
      // here was the cause of a ~0.07% aspect mismatch → uneven strokes.)
      const w = r.width;
      const h = r.height;
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

  // GAMERS viewfinder dash rhythm: a ~12px dash · ~10px gap (period ~22). We
  // keep the dash:gap RATIO fixed across the whole frame (so every dash reads the
  // same proportion) but let each side solve for the exact dash/gap that tiles
  // its length in a WHOLE number of cycles, starting AND ending with a FULL dash
  // flush against the corner brackets. That flush-full-dash-at-both-ends is what
  // actually reads as uniform — a fixed period left a ragged partial dash/gap
  // where each side met its bracket, and that fragment differed per corner.
  const TARGET_DASH = 12;
  const TARGET_GAP = 10;
  const RATIO = TARGET_DASH / (TARGET_DASH + TARGET_GAP); // dash share of a period

  /**
   * Tile a segment of length L so it begins and ends with a GAP flush against the
   * corner brackets (bracket = solid arm, then a clean gap, then dashes, …, gap,
   * bracket). N dashes with N+1 gaps tiles as: gap,dash,gap,…,dash,gap. N is
   * chosen to keep the period near the ~22px target; dash/gap solved exactly so
   * the pattern fills L with whole cycles — no ragged partial dash at any corner,
   * and the bracket↔first-dash spacing is the same on all four sides.
   *   L = N*dash + (N+1)*gap, dash = RATIO*period, gap = (1-RATIO)*period
   *   => L = period*(N + (1-RATIO))  ... wait: N*RATIO + (N+1)*(1-RATIO) = N + (1-RATIO)
   * SVG dasharray starts with a dash, so we shift the phase by one gap via
   * dashoffset = +gap to lead with a gap instead.
   */
  function flushDash(L: number) {
    if (L <= TARGET_DASH) return { dash: 0, gap: 9999, offset: 0 };
    const targetPeriod = TARGET_DASH + TARGET_GAP;
    // leading + trailing gap with N dashes: L = period*(N + 1 - RATIO)
    const N = Math.max(1, Math.round(L / targetPeriod));
    const period = L / (N + 1 - RATIO);
    const dash = period * RATIO;
    const gap = period - dash;
    // dasharray draws dash-first; shift the phase by one DASH so the run LEADS
    // with a gap (clean separation from the solid bracket arm) and, by the
    // whole-cycle tiling, also ENDS with a gap before the far bracket.
    return { dash, gap, offset: dash };
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
  // floor at 28px so brackets read on small viewports. Round so the dashed
  // segment endpoints land on whole pixels (clean against the bracket arms).
  const a = Math.round(Math.max(28, Math.min(w, h) * 0.08));

  const hLen = x1 - x0 - 2 * a; // top/bottom dashed length
  const vLen = y1 - y0 - 2 * a; // left/right dashed length
  // SAME dash:gap ratio + flush-gap-at-corners on both axes (uniform); each side
  // solves its own near-22px period so it tiles in whole cycles.
  const hFit = flushDash(hLen);
  const vFit = flushDash(vLen);

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
