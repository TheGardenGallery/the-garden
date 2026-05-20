import { Fragment } from "react";
import type { Exhibition } from "@/lib/types";
import { InlineArtworks } from "@/components/InlineArtworks";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";

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
 * visible-on-scroll video logic carries over.
 *
 * When `inlineProcess` is provided (Split Logic), a single small
 * process clip embeds after its matching paragraph — annotated with a
 * Space Mono `process_log` readout so it reads as documentation, not
 * an artwork. AutoPlayVideo defers play until the element intersects
 * the viewport, so the clip doesn't pull bytes off the wire until the
 * reader scrolls there. */
export function TerminalDescription({
  paragraphs,
  labels,
  inlineArtworks,
  inlineProcess,
  fallbackUrl,
  fallbackYear,
  fallbackWorkCount,
}: {
  paragraphs: string[];
  labels?: string[];
  inlineArtworks?: NonNullable<Exhibition["inlineArtworks"]>;
  inlineProcess?: NonNullable<Exhibition["processVideos"]>["inline"];
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
        const processAt =
          inlineProcess?.afterParagraphIndex === pi ? inlineProcess : null;
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
            {processAt && (
              <figure
                className="sl-inline-process"
                aria-label="Studio process log"
              >
                <div className="sl-inline-process-frame">
                  <AutoPlayVideo
                    className="sl-inline-process-video"
                    src={processAt.src}
                    poster={processAt.poster}
                    preload="metadata"
                    loop
                  />
                </div>
                {processAt.label && (
                  <figcaption className="sl-inline-process-readout">
                    <span className="sl-inline-process-readout-prefix">
                      &gt;&gt;
                    </span>
                    <span className="sl-inline-process-readout-label">
                      {processAt.label}
                    </span>
                    {processAt.duration && (
                      <span className="sl-inline-process-readout-duration">
                        {processAt.duration}
                      </span>
                    )}
                  </figcaption>
                )}
              </figure>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
