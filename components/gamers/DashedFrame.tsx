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

  // ONE dash language for the whole frame — the canonical GAMERS viewfinder
  // rhythm: 12px dash · 10px gap (period 22, ratio 0.55). Using a SINGLE fixed
  // dash + gap on all four sides is what makes the spacing read uniform; the
  // earlier per-side normalisation derived a slightly different period for the
  // (longer) horizontal sides vs the (shorter) vertical sides, so a top dash
  // was a hair longer than a side dash — visibly non-uniform.
  const DASH = 12;
  const GAP = 10;
  const PERIOD = DASH + GAP;

  /**
   * For a dashed segment of pixel length L, keep the dash + gap FIXED (uniform
   * across the whole frame) and only choose the dashoffset so the pattern is
   * CENTERED on the segment — both ends land symmetrically against the bracket
   * arms, so all four corners read identically regardless of L. Centering: the
   * midpoint of the segment should sit at a dash-centre, so offset accounts for
   * how the whole-period count leaves a remainder at the ends.
   */
  function centeredDash(L: number) {
    // distance from the segment start to the first dash CENTRE that keeps the
    // pattern symmetric about the segment midpoint. Half-period phase, minus
    // however the period tiles into L, resolved into the [0,PERIOD) offset.
    const half = L / 2;
    // we want a dash centred at the midpoint; the standard dash starts at a
    // dash-leading-edge, so shift back by (half mod PERIOD) then to the dash
    // centre (DASH/2 before the leading edge).
    const phase = ((half % PERIOD) + PERIOD) % PERIOD;
    const offset = phase - DASH / 2;
    return { dash: DASH, gap: GAP, offset };
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
  // SAME dash + gap on both axes (uniform); only the centering offset differs.
  const hFit = centeredDash(hLen);
  const vFit = centeredDash(vLen);

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
