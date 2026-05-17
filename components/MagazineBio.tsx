"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  layoutColumnShaped,
  layoutColumnUniform,
  refineColumn,
  splitParagraphsByChars,
} from "@/lib/bioLayout";

/**
 * Magazine-style two-column bio with shape-aware right column.
 * Paragraphs are split by character count (cheap proxy for line
 * count); the left column flows at uniform `columnWidth`, the right
 * column shapes against the artwork — lines whose vertical position
 * lands beside the work narrow to clear its left edge.
 *
 * Both columns render inside the same flex centering area, so the
 * right column's iterative refinement uses `max(left, right)` as
 * the effective group height — the magazine block centers as one
 * unit.
 */
type MagazineBioProps = {
  paragraphs: string[];
  font: string;
  lineHeight: number;
  paragraphGap: number;
  /** Width of each column. */
  columnWidth: number;
  /** Narrower width for right-column lines beside the artwork. */
  shapedWidth: number;
  artworkTop: number;
  artworkBottom: number;
  flexAreaCenter: number;
  siblingExtent?: number;
  renderEmphasis?: (text: string) => ReactNode[];
  className?: string;
};

// Italics that span a shaped line break (e.g. `*INFINITE PRESSURE*`
// where the break lands between the words) are handled by walking
// the lines statefully — every `*` toggles an in-italic flag, and
// the flag carries across lines so the second half still renders
// inside <em>. Without this crossing, line-by-line renderEmphasis
// sees unbalanced pairs and leaves the asterisks visible.
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
  if (!renderEmphasis) {
    return (
      <p key={i}>
        {lines.map((line, j) => (
          <span key={j} style={{ display: "block" }}>{line}</span>
        ))}
      </p>
    );
  }
  let inItalic = false;
  return (
    <p key={i}>
      {lines.map((line, j) => {
        const parts: ReactNode[] = [];
        let cursor = 0;
        for (let k = 0; k < line.length; k++) {
          if (line[k] !== "*") continue;
          if (cursor < k) {
            const txt = line.slice(cursor, k);
            parts.push(inItalic ? <em key={`${j}-${cursor}`}>{txt}</em> : txt);
          }
          inItalic = !inItalic;
          cursor = k + 1;
        }
        if (cursor < line.length) {
          const txt = line.slice(cursor);
          parts.push(inItalic ? <em key={`${j}-${cursor}`}>{txt}</em> : txt);
        }
        return (
          <span key={j} style={{ display: "block" }}>
            {parts}
          </span>
        );
      })}
    </p>
  );
}

export const MagazineBio = forwardRef<HTMLDivElement, MagazineBioProps>(
  function MagazineBio(
    {
      paragraphs,
      font,
      lineHeight,
      paragraphGap,
      columnWidth,
      shapedWidth,
      artworkTop,
      artworkBottom,
      flexAreaCenter,
      siblingExtent = 0,
      renderEmphasis,
      className,
    },
    ref
  ) {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
      // Pretext shaping is desktop-only — at narrow widths the metric
      // pass measures a column too small for sensible line lengths,
      // collapsing the layout to one or two characters per line.
      // Track the viewport and disable shaping on mobile so the
      // bio falls back to native text flow.
      const mq = window.matchMedia("(max-width:720px)");
      const update = () => setHydrated(!mq.matches);
      update();
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }, []);

    // Internal ref used to read the bio's actual computed font-size
    // for staleness detection (see useMemo). Forwarded ref still
    // points at the same element via the callback below.
    const innerRef = useRef<HTMLDivElement | null>(null);
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    const layout = useMemo<{
      leftPara: string[];
      rightPara: string[];
      leftLines: string[][];
      rightLines: string[][];
    } | null>(() => {
      if (!hydrated) return null;
      // CSS @media breakpoints change the bio's typography ahead of
      // ArtistReveal's RO committing fresh metrics. Skip shaping for
      // the ~1 frame between a breakpoint crossing and the next
      // metrics commit so pretext doesn't lay out at the prior size
      // while the DOM renders the new one. See ShapedBio for the
      // rationale.
      const el = innerRef.current;
      if (el && typeof window !== "undefined") {
        const p = el.querySelector("p") ?? el;
        const actual = parseFloat(window.getComputedStyle(p).fontSize);
        const m = font.match(/(\d+(?:\.\d+)?)px/);
        const expected = m ? parseFloat(m[1]) : NaN;
        if (
          Number.isFinite(actual) &&
          Number.isFinite(expected) &&
          Math.abs(actual - expected) > 0.5
        ) {
          return null;
        }
      }

      const [leftPara, rightPara] = splitParagraphsByChars(paragraphs);

      // Left column: uniform column-width, no shape constraints.
      const left = layoutColumnUniform(
        leftPara,
        font,
        lineHeight,
        paragraphGap,
        columnWidth
      );

      // Right column: shape-aware. Magazine block centers around the
      // taller of the two columns, so floor the iterative refinement
      // at the left column's height.
      const right = refineColumn(
        (bioTop) =>
          layoutColumnShaped(
            rightPara,
            font,
            lineHeight,
            paragraphGap,
            bioTop,
            columnWidth,
            shapedWidth,
            artworkTop,
            artworkBottom
          ),
        flexAreaCenter,
        siblingExtent,
        left.height
      );

      return {
        leftPara,
        rightPara,
        leftLines: left.lines,
        rightLines: right.lines,
      };
    }, [
      hydrated,
      paragraphs,
      font,
      lineHeight,
      paragraphGap,
      columnWidth,
      shapedWidth,
      artworkTop,
      artworkBottom,
      flexAreaCenter,
      siblingExtent,
    ]);

    return (
      <div ref={setRefs} className={className} data-long>
        {layout ? (
          <>
            <div className="magazine-col">
              {layout.leftLines.map((lines, i) =>
                renderParagraph(
                  layout.leftPara[i],
                  i,
                  renderEmphasis,
                  lines
                )
              )}
            </div>
            <div className="magazine-col">
              {layout.rightLines.map((lines, i) =>
                renderParagraph(
                  layout.rightPara[i],
                  i,
                  renderEmphasis,
                  lines
                )
              )}
            </div>
          </>
        ) : (
          paragraphs.map((para, i) =>
            renderParagraph(para, i, renderEmphasis)
          )
        )}
      </div>
    );
  }
);
