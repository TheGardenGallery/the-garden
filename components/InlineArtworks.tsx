"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Exhibition } from "@/lib/types";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { iframeMeasurementCssVars } from "@/lib/iframe-measurements";

type Group = NonNullable<Exhibition["inlineArtworks"]>[number];
type Item = Group["items"][number];

/**
 * Inline artwork block that fades in when scrolled into view, matching
 * the homepage Reveal behavior (opacity 0 + translateY(28px) → 0, 0.8s
 * ease-out). Adds `.reveal` directly to the existing container rather
 * than wrapping, so sibling-based CSS selectors on `.ex-inline-artworks`
 * keep working.
 *
 * Each item may be (in priority order):
 *   - `iframe` → live-rendered generative artwork (e.g., Verse's
 *     iframeUrl). Rendered without an <a> wrapper so clicks land on
 *     the artwork's own controls, not a link.
 *   - `video` → muted-loop video, scroll-gated so it only plays when
 *     visible (resumes from currentTime, not the beginning).
 *   - `image` → static asset via next/image.
 */
export function InlineArtworks({
  group,
  fallbackUrl,
  fallbackYear,
  fallbackWorkCount,
}: {
  group: Group;
  fallbackUrl?: string;
  fallbackYear?: number;
  fallbackWorkCount?: number;
}) {
  const { ref, state } = useScrollReveal<HTMLDivElement>();

  // Play/pause each video based on its own visibility. Videos don't
  // autoplay on mount — they only start when scrolled into view, then
  // pause when scrolled off so they resume from currentTime (not the
  // beginning) when the user scrolls back. Also frees the decoder so the
  // other inline videos stay smooth.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const videos = Array.from(el.querySelectorAll("video"));
    if (videos.length === 0) return;
    if (typeof IntersectionObserver === "undefined") {
      videos.forEach((v) => v.play().catch(() => {}));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.25 }
    );
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  const cls = `ex-inline-artworks reveal${state === "hidden" ? " reveal--hidden" : state === "visible" ? " reveal--visible" : ""}`;

  return (
    <div ref={ref} className={cls}>
      {group.items.map((item, j) => (
        <InlineArtworkItem
          key={j}
          item={item}
          fallbackUrl={fallbackUrl}
          fallbackYear={fallbackYear}
          fallbackWorkCount={fallbackWorkCount}
        />
      ))}
    </div>
  );
}

function InlineArtworkItem({
  item,
  fallbackUrl,
  fallbackYear,
  fallbackWorkCount,
}: {
  item: Item;
  fallbackUrl?: string;
  fallbackYear?: number;
  fallbackWorkCount?: number;
}) {
  // Figure exposes the full measurement vocabulary as CSS variables so
  // any per-piece CSS can use them:
  //  - measurement vars from `npm run measure-iframes` (viewport, px
  //    insets, % insets, art W/H) — the cached visible-artwork bounding
  //    box from the pixel-scan pipeline
  //  - `--art-aspect` auto-derived from `item.aspectRatio`
  //  - per-item `cssVars` overrides (the 3-knob tuning system:
  //    `--art-scale`, `--cap-x`, `--cap-y`) — applied last so they win
  const measurementVars = item.iframe
    ? iframeMeasurementCssVars(item.iframe)
    : undefined;
  const figureStyle = {
    ...measurementVars,
    ...(item.aspectRatio !== undefined
      ? { ["--art-aspect" as string]: String(item.aspectRatio) }
      : undefined),
    ...item.cssVars,
  } as React.CSSProperties;

  const figure = (
    <figure
      className="ex-inline-figure"
      style={figureStyle}
    >
      {item.iframe ? (
        <div
          className="ex-inline-iframe"
          style={{
            aspectRatio: String(item.aspectRatio ?? 1),
            ["--inline-iframe-aspect" as string]: String(item.aspectRatio ?? 1),
          }}
        >
          <iframe
            src={item.iframe}
            title={item.alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            allow="autoplay; fullscreen"
            sandbox="allow-scripts allow-same-origin"
          />
          {item.linkable && (item.verseUrl ?? fallbackUrl) && (
            <a
              className="ex-inline-iframe-link"
              href={item.verseUrl ?? fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${item.title ?? item.alt} on Verse`}
            />
          )}
        </div>
      ) : item.video ? (
        <div className="ex-inline-plate">
          <div className="ex-inline-media">
            <video
              src={item.video}
              poster={item.image}
              muted
              loop
              playsInline
              preload="auto"
              aria-label={item.alt}
            />
          </div>
        </div>
      ) : (
        <div className="ex-inline-image">
          <Image
            src={item.image}
            alt={item.alt}
            width={1800}
            height={2250}
            sizes="(min-width: 900px) 48vw, 92vw"
            quality={100}
            // Per-item `unoptimized` escape hatch for high-fidelity
            // pieces (grain/noise textures that Next.js's WebP pipeline
            // softens even at q95). GIFs/WebPs always pass through raw.
            unoptimized={item.unoptimized ?? /\.(gif|webp)$/i.test(item.image)}
          />
        </div>
      )}
      {item.title && (
        <figcaption className="ex-inline-caption">
          {item.iframe && (item.verseUrl ?? fallbackUrl) ? (
            <a
              className="ex-inline-caption-link"
              href={item.verseUrl ?? fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <em>{item.title}</em>
            </a>
          ) : (
            <em>{item.title}</em>
          )}
          {(() => {
            // Optional second line: year · edition. Year falls back to
            // the exhibition's year so every captioned work carries at
            // least one piece of metadata "for free". The edition
            // string is derived automatically from a "#N" suffix in
            // the title (e.g. "Piezo #18") combined with the
            // exhibition's `workCount` (e.g. → "ed. 18 of 20"), unless
            // the item provides its own explicit `edition`.
            const year = item.year ?? fallbackYear;
            let edition: string | null = item.edition ?? null;
            if (!edition && item.title && fallbackWorkCount) {
              const m = item.title.match(/#(\d+)\s*$/);
              if (m) edition = `ed. ${m[1]} of ${fallbackWorkCount}`;
            }
            const parts = [
              year != null ? String(year) : null,
              edition,
            ].filter((p): p is string => Boolean(p));
            if (parts.length === 0) return null;
            return (
              <span className="ex-inline-caption-meta">
                {parts.join(" · ")}
              </span>
            );
          })()}
        </figcaption>
      )}
    </figure>
  );

  // Iframes host interactive generative art — skip the <a> wrapper so
  // clicks land on the artwork's own controls, not a link. The
  // figcaption title above is a link instead, so the work still has
  // a path out to its Verse page.
  if (item.iframe) {
    return <div className="ex-inline-artwork">{figure}</div>;
  }
  const href = item.verseUrl ?? fallbackUrl;
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="ex-inline-artwork"
    >
      {figure}
    </a>
  ) : (
    <div className="ex-inline-artwork">{figure}</div>
  );
}
