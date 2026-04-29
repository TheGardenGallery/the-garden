"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
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

    const layout = useMemo<{
      leftPara: string[];
      rightPara: string[];
      leftLines: string[][];
      rightLines: string[][];
    } | null>(() => {
      if (!hydrated) return null;

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
      <div ref={ref} className={className} data-long>
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
