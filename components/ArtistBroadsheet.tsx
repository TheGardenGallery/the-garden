"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { AutoPlayVideo } from "./AutoPlayVideo";

/**
 * ArtistBroadsheet — artist's own statement about the series. Two modes:
 *
 *   1. Plain mode — `paragraphs` is `string[]` containing HTML, rendered
 *      as a centred indexed prose column. Original behaviour.
 *
 *   2. Annotated mode — `paragraphs` is `BroadsheetParagraph[]` (an
 *      array of runs: plain strings, `{em}` italics, or `{pin}` words),
 *      and `pins` + `anchor` are provided. Renders side-by-side: prose
 *      on the left, the anchor artwork sticky on the right with
 *      phosphor reticles that light up over the regions referenced by
 *      hovered or clicked words.
 *
 * Annotated mode is scoped to Split Logic — the page passes a single
 * anchor artwork (the hero) and a pin map; each interactable word in
 * the text references a pin id and reveals its region on the artwork.
 */

export type BroadsheetRun =
  | string
  | { em: string }
  | { pin: string; text: string };

export type BroadsheetParagraph = BroadsheetRun[];

export type BroadsheetRegion = { x: number; y: number; w: number; h: number };
export type BroadsheetPin = {
  region: BroadsheetRegion;
  code: string;
  /** If true, the reticle's interior gets a red multiply-blend overlay
   *  when active — turns bright pixels (the walker dots) red while
   *  leaving dark pixels untouched. Used for `wlk` so the live walker
   *  positions in the video are tinted on hover. */
  tint?: boolean;
  /** Optional cycle — while the pin is active, the reticle slides
   *  between these regions on a timer. Used for `sym` so the box
   *  visits each letterform on the artwork in turn. CSS transitions
   *  on position/size give the motion a sweeping-readout feel. */
  cycle?: BroadsheetRegion[];
};

export type BroadsheetAnchor = {
  video?: string;
  poster?: string;
};

type Props = {
  paragraphs: string[] | BroadsheetParagraph[];
  attribution?: string;
  pins?: Record<string, BroadsheetPin>;
  anchor?: BroadsheetAnchor;
};

export function ArtistBroadsheet({
  paragraphs,
  attribution,
  pins,
  anchor,
}: Props) {
  const { ref, visible } = useScrollReveal<HTMLElement>();
  const isAnnotated = Boolean(
    pins && anchor && paragraphs.length > 0 && Array.isArray(paragraphs[0])
  );

  if (!isAnnotated) {
    // Legacy path — plain HTML paragraphs in a centred column.
    const plain = paragraphs as string[];
    return (
      <section
        ref={ref}
        className={`broadsheet${visible ? " broadsheet--visible" : ""}`}
        aria-label="Artist's note"
      >
        <div className="broadsheet-inner">
          <span className="broadsheet-heading">Artist&rsquo;s note</span>
          <div className="broadsheet-body">
            {plain.map((html, i) => (
              <div key={i} className="broadsheet-entry">
                <span className="broadsheet-idx">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            ))}
          </div>
          {attribution && (
            <span className="broadsheet-attribution">{attribution}</span>
          )}
        </div>
      </section>
    );
  }

  return (
    <AnnotatedBroadsheet
      paragraphs={paragraphs as BroadsheetParagraph[]}
      attribution={attribution}
      pins={pins!}
      anchor={anchor!}
      sectionRef={ref}
      visible={visible}
    />
  );
}

function AnnotatedBroadsheet({
  paragraphs,
  attribution,
  pins,
  anchor,
  sectionRef,
  visible,
}: {
  paragraphs: BroadsheetParagraph[];
  attribution?: string;
  pins: Record<string, BroadsheetPin>;
  anchor: BroadsheetAnchor;
  sectionRef: React.RefObject<HTMLElement | null>;
  visible: boolean;
}) {
  // Two layers of pin state:
  //   - `locked`: clicked by the user; persists until cleared
  //   - `hovered`: transient while pointer/focus is on a pinned word
  // Displayed reticle prefers `hovered` so previewing other pins
  // doesn't drop the user's lock — the lock is restored as soon as
  // hover ends.
  const [locked, setLocked] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? locked;

  // For pins with a `cycle` array, the reticle visits each region in
  // turn while the pin is active. We track only the active pin's
  // cycle index — when the active pin changes, the index resets to 0.
  const [cycleIndex, setCycleIndex] = useState(0);
  useEffect(() => {
    setCycleIndex(0);
    if (!active) return;
    const pin = pins[active];
    if (!pin?.cycle || pin.cycle.length < 2) return;
    const id = setInterval(() => {
      setCycleIndex((i) => (i + 1) % pin.cycle!.length);
    }, 1500);
    return () => clearInterval(id);
  }, [active, pins]);

  useEffect(() => {
    if (!locked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLocked(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked]);

  const onPinClick = useCallback((id: string) => {
    setLocked((cur) => (cur === id ? null : id));
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`broadsheet broadsheet--annotated${visible ? " broadsheet--visible" : ""}`}
      aria-label="Artist's note"
    >
      <div className="broadsheet-inner broadsheet-inner--annotated">
        {/* Heading spans both columns so the prose and the artwork
            share a clean content baseline below it — otherwise the
            artwork's top sits at the heading's top, ~30–40px above
            paragraph 01, and the two columns visibly don't align. */}
        <span className="broadsheet-heading broadsheet-heading--annotated">
          Artist&rsquo;s note
        </span>
        <div className="broadsheet-prose">
          <div className="broadsheet-body">
            {paragraphs.map((runs, pi) => (
              <div key={pi} className="broadsheet-entry">
                <span className="broadsheet-idx">
                  {String(pi + 1).padStart(2, "0")}
                </span>
                <p>
                  {runs.map((run, ri) => {
                    if (typeof run === "string") {
                      return <span key={ri}>{run}</span>;
                    }
                    if ("em" in run) {
                      return <em key={ri}>{run.em}</em>;
                    }
                    const pin = pins[run.pin];
                    if (!pin) {
                      return <span key={ri}>{run.text}</span>;
                    }
                    const isActive = active === run.pin;
                    const isLocked = locked === run.pin;
                    return (
                      <button
                        key={ri}
                        type="button"
                        className="broadsheet-pinword"
                        data-active={isActive ? "true" : undefined}
                        data-locked={isLocked ? "true" : undefined}
                        onMouseEnter={() => setHovered(run.pin)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(run.pin)}
                        onBlur={() => setHovered(null)}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          onPinClick(run.pin);
                        }}
                        aria-label={`Highlight ${run.text} on the artwork`}
                      >
                        {run.text}
                      </button>
                    );
                  })}
                </p>
              </div>
            ))}
          </div>
          {attribution && (
            <span className="broadsheet-attribution">{attribution}</span>
          )}
        </div>

        <div className="broadsheet-anchor">
          <div className="broadsheet-anchor-sticky">
            <div className="broadsheet-anchor-frame">
              {/* Media is clipped by its own container so it can't
                  overflow the frame; the frame itself is overflow-visible
                  so reticle code labels (which sit above the reticle box)
                  can extend past the frame's top edge when a pin sits
                  near the top of the artwork. */}
              <div className="broadsheet-anchor-media">
                {anchor.video ? (
                  <AutoPlayVideo
                    src={anchor.video}
                    poster={anchor.poster}
                    loop
                    muted
                    playsInline
                  />
                ) : anchor.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={anchor.poster} alt="" />
                ) : null}
              </div>

              {/* Reticles — one per pin, positioned in the artwork's
                  normalised coordinate space. `tint`-flagged pins also
                  emit a separate tint element as a SIBLING of the
                  reticle so the multiply blend lives in the frame's
                  stacking context (siblings: media + tint + reticles)
                  and can reach the video underneath. Inside the
                  reticle, the multiply would be trapped by the
                  reticle's own opacity-transition stacking context and
                  flash solid before reaching the video. */}
              {Object.entries(pins).map(([id, pin]) => {
                const isActive = active === id;
                // When the active pin has a cycle, the reticle uses
                // the current cycle entry as its region. Otherwise
                // fall back to the static `region`. CSS handles the
                // smooth glide between cycle positions.
                const activeRegion =
                  isActive && pin.cycle && pin.cycle.length > 0
                    ? pin.cycle[cycleIndex % pin.cycle.length]
                    : pin.region;
                const positionStyle: React.CSSProperties = {
                  left: `${activeRegion.x * 100}%`,
                  top: `${activeRegion.y * 100}%`,
                  width: `${activeRegion.w * 100}%`,
                  height: `${activeRegion.h * 100}%`,
                };
                return (
                  <Fragment key={id}>
                    {pin.tint ? (
                      <div
                        className="broadsheet-reticle-tint"
                        data-active={isActive ? "true" : undefined}
                        style={positionStyle}
                        aria-hidden
                      />
                    ) : null}
                    <div
                      className="broadsheet-reticle"
                      data-active={isActive ? "true" : undefined}
                      style={positionStyle}
                      aria-hidden
                    >
                      <span className="broadsheet-reticle-corner broadsheet-reticle-corner--tl" />
                      <span className="broadsheet-reticle-corner broadsheet-reticle-corner--tr" />
                      <span className="broadsheet-reticle-corner broadsheet-reticle-corner--bl" />
                      <span className="broadsheet-reticle-corner broadsheet-reticle-corner--br" />
                      <span className="broadsheet-reticle-code">{pin.code}</span>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
