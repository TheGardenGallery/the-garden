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
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  // Two-tier visibility handling for inline videos:
  //
  //   1. PRELOAD (rootMargin: 800px) — when a video is within 800px
  //      of the viewport, inject `<link rel="preload" as="video">`
  //      so the browser fetches the bytes into HTTP cache before the
  //      user actually reaches the artwork. Yoshi's inline videos
  //      are 17-21MB each with the default preload="metadata"; without
  //      this pre-warm, play() would fire and the browser would
  //      still be fetching megabytes — visible on mobile as a 1-3s
  //      poster-stall stutter before the first frame finally paints.
  //
  //   2. PLAY/PAUSE (threshold: 0.25) — actual playback toggle.
  //      Resumes from currentTime so the user re-entering an artwork
  //      sees the loop continue, not restart. Retries play() on
  //      canplay/loadeddata events because iOS Safari's first
  //      autoplay attempt silently fails when data isn't decoded yet.
  //
  //   SPLIT LOGIC OVERRIDE: when this block is rendered inside the
  //   split-logic exhibition page (detected at mount via closest()),
  //   bypass the IO-gated preload and eagerly fetch on mount — the
  //   curator wants those inline spreads to play instantly with no
  //   buffer on mobile. Other exhibitions keep the conservative
  //   IO-gated behaviour so a tab that opens to a Yoshi page doesn't
  //   chew through 60-100 MB of inline-video bytes on first paint.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const videos = Array.from(el.querySelectorAll("video"));
    if (videos.length === 0) return;

    const eagerLoadAll = !!el.closest(
      '.exhibition-detail[data-slug="split-logic"]',
    );

    // Tracks which videos the play IO has marked as currently in-view.
    // tryPlay() gates on this so the canplay/loadeddata retry handlers
    // can't accidentally start an off-screen video if its data
    // finishes loading after the user has already scrolled past.
    // Without this gate, a video out of view but whose buffer just
    // resolved would silently start playing — violating the "play
    // only while watching" rule.
    const inView = new Set<HTMLVideoElement>();

    const tryPlay = (v: HTMLVideoElement) => {
      if (!inView.has(v)) return;
      v.muted = true;
      if (v.paused) v.play().catch(() => {});
    };

    if (typeof IntersectionObserver === "undefined") {
      videos.forEach((v) => {
        inView.add(v);
        tryPlay(v);
      });
      return;
    }

    // Preload links — added once per video so the unmount cleanup
    // can remove them. For Split Logic, inject immediately on mount
    // (no IO gating) + flip preload to "auto" so the browser starts
    // fetching the full video bytes before the user scrolls anywhere
    // near the spread. For other exhibitions, IO-gate at 800px to
    // avoid blowing through bandwidth on pages with 17-21MB clips.
    const preloadLinks = new Map<HTMLVideoElement, HTMLLinkElement>();
    const addPreloadLink = (v: HTMLVideoElement) => {
      if (preloadLinks.has(v) || !v.src) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = v.src;
      document.head.appendChild(link);
      preloadLinks.set(v, link);
    };

    let preloadIO: IntersectionObserver | null = null;
    if (eagerLoadAll) {
      videos.forEach((v) => {
        addPreloadLink(v);
        // Flip the element's own preload hint from "metadata" (the
        // SSR default) to "auto" and re-kick the network so the
        // browser commits to fetching frames, not just the moov box.
        v.preload = "auto";
        try {
          v.load();
        } catch {
          // Safari can throw if load() races a teardown; harmless.
        }
      });
    } else {
      preloadIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const v = entry.target as HTMLVideoElement;
            addPreloadLink(v);
            preloadIO?.unobserve(entry.target);
          });
        },
        { rootMargin: "800px 0px" }
      );
      videos.forEach((v) => preloadIO!.observe(v));
    }

    // Retry play on data-ready events — iOS Safari often silently
    // fails the first autoplay attempt on a fresh element when data
    // isn't yet decoded.
    const retryHandlers = new Map<HTMLVideoElement, () => void>();
    videos.forEach((v) => {
      const onReady = () => tryPlay(v);
      v.addEventListener("loadedmetadata", onReady);
      v.addEventListener("loadeddata", onReady);
      v.addEventListener("canplay", onReady);
      retryHandlers.set(v, onReady);
    });

    const playIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            inView.add(v);
            tryPlay(v);
          } else {
            inView.delete(v);
            v.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    videos.forEach((v) => playIO.observe(v));

    return () => {
      preloadIO?.disconnect();
      playIO.disconnect();
      preloadLinks.forEach((link) => link.remove());
      retryHandlers.forEach((handler, v) => {
        v.removeEventListener("loadedmetadata", handler);
        v.removeEventListener("loadeddata", handler);
        v.removeEventListener("canplay", handler);
      });
    };
  }, []);

  const cls = `ex-inline-artworks reveal${visible ? " reveal--visible" : ""}`;

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
              preload="metadata"
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
