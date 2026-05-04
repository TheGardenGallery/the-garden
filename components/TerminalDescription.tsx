import { Fragment } from "react";
import type { Exhibition } from "@/lib/types";
import { InlineArtworks } from "@/components/InlineArtworks";

/**
 * Terminal-styled description: monospace + on-dark colors via the
 * `ex-overview-body-terminal` class. Plain text only (no HTML in
 * source paragraphs); for prose with markup, use the standard
 * OverviewSegments path.
 *
 * When `labels` is provided, each paragraph renders with a small code
 * header above the prose. When `inlineArtworks` is provided, an
 * artwork row inserts after the matching `afterParagraphIndex`
 * paragraph — same component as the standard prose path, so the
 * visible-on-scroll video logic carries over. */
export function TerminalDescription({
  paragraphs,
  labels,
  inlineArtworks,
  fallbackUrl,
  fallbackYear,
  fallbackWorkCount,
}: {
  paragraphs: string[];
  labels?: string[];
  inlineArtworks?: NonNullable<Exhibition["inlineArtworks"]>;
  fallbackUrl?: string;
  fallbackYear?: number;
  fallbackWorkCount?: number;
}) {
  const hasLabels = !!labels && labels.length > 0;
  return (
    <div
      className={`ex-overview-body ex-overview-body-terminal${
        hasLabels ? " ex-overview-body-terminal--stations" : ""
      }`}
    >
      {paragraphs.map((para, pi) => {
        const breakAt = inlineArtworks?.find(
          (g) => g.afterParagraphIndex === pi,
        );
        return (
          <Fragment key={pi}>
            <div className="term-station" data-station-index={pi}>
              {hasLabels && labels?.[pi] && (
                <span className="term-station-label">{labels[pi]}</span>
              )}
              <p dangerouslySetInnerHTML={{ __html: para }} />
            </div>
            {breakAt && (
              <InlineArtworks
                group={breakAt}
                fallbackUrl={fallbackUrl}
                fallbackYear={fallbackYear}
                fallbackWorkCount={fallbackWorkCount}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
