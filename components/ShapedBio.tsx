"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { layoutColumnShaped, refineColumn } from "@/lib/bioLayout";

/**
 * Shape-aware single-column bio. Lines whose vertical position
 * overlaps the artwork's range render at `shapedWidth`; lines clear
 * of it render at `fullWidth`. Iterative refinement happens inside
 * `useMemo` so React state never feeds back into measurement.
 *
 * Pretext uses canvas APIs which don't exist server-side; layout is
 * gated on a post-mount `hydrated` flag so SSR / first client render
 * are byte-identical (no hydration mismatch) and the shaped output
 * appears once after mount.
 */
type ShapedBioProps = {
  paragraphs: string[];
  /** Canvas-style font shorthand, must match the bio's CSS. */
  font: string;
  /** Line height in CSS pixels, must match the bio's CSS. */
  lineHeight: number;
  /** Vertical gap between paragraphs (margin-bottom of <p>) in px. */
  paragraphGap: number;
  /** Bio's full reading width — used for lines clear of the artwork. */
  fullWidth: number;
  /** Narrower width — used for lines whose vertical span overlaps
      the artwork. Pass = fullWidth when no shaping is needed. */
  shapedWidth: number;
  /** Artwork's top in parent border-box-relative coords. */
  artworkTop: number;
  /** Artwork's bottom in parent border-box-relative coords. */
  artworkBottom: number;
  /** Y-coordinate (parent border-box-relative) of the center of the
      flex centering area. */
  flexAreaCenter: number;
  /** Vertical extent of any flex sibling beneath the bio. */
  siblingExtent?: number;
  /** Optional emphasis renderer for *asterisk* spans. */
  renderEmphasis?: (text: string) => ReactNode[];
  className?: string;
  /** Pass-through to a `data-long` attribute on the outer div so
      the long-bio typography hooks can target shaped bios too. */
  long?: boolean;
};

/** Render a paragraph's lines as `display: block` spans. Shared
    between the shaped layout and the SSR fallback. */
function renderParagraph(
  para: string,
  i: number,
  renderEmphasis: ((t: string) => ReactNode[]) | undefined,
  lines?: string[]
) {
  if (!lines) {
    return (
      <p key={i}>{renderEmphasis ? renderEmphasis(para) : para}</p>
    );
  }
  return (
    <p key={i}>
      {lines.map((line, j) => (
        <span key={j} style={{ display: "block" }}>
          {renderEmphasis ? renderEmphasis(line) : line}
        </span>
      ))}
    </p>
  );
}

export const ShapedBio = forwardRef<HTMLDivElement, ShapedBioProps>(
  function ShapedBio(
    {
      paragraphs,
      font,
      lineHeight,
      paragraphGap,
      fullWidth,
      shapedWidth,
      artworkTop,
      artworkBottom,
      flexAreaCenter,
      siblingExtent = 0,
      renderEmphasis,
      className,
      long,
    },
    ref
  ) {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
      // Pretext shaping is desktop-only — at narrow widths the metric
      // pass measures a column too small for sensible line lengths,
      // and the resulting display:block spans tile a vertical run of
      // 1–2 character fragments. Track the viewport and disable
      // shaping on mobile so the bio falls back to native text flow.
      const mq = window.matchMedia("(max-width:720px)");
      const update = () => setHydrated(!mq.matches);
      update();
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }, []);

    const layout = useMemo<string[][] | null>(() => {
      if (!hydrated) return null;
      const { lines } = refineColumn(
        (bioTop) =>
          layoutColumnShaped(
            paragraphs,
            font,
            lineHeight,
            paragraphGap,
            bioTop,
            fullWidth,
            shapedWidth,
            artworkTop,
            artworkBottom
          ),
        flexAreaCenter,
        siblingExtent
      );
      return lines;
    }, [
      hydrated,
      paragraphs,
      font,
      lineHeight,
      paragraphGap,
      fullWidth,
      shapedWidth,
      artworkTop,
      artworkBottom,
      flexAreaCenter,
      siblingExtent,
    ]);

    return (
      <div
        ref={ref}
        className={className}
        data-long={long || undefined}
      >
        {layout
          ? layout.map((lines, i) =>
              renderParagraph(paragraphs[i], i, renderEmphasis, lines)
            )
          : paragraphs.map((para, i) =>
              renderParagraph(para, i, renderEmphasis)
            )}
      </div>
    );
  }
);
