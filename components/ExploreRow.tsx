"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FeaturedArtwork } from "@/lib/types";

type ExploreRowProps = {
  items: FeaturedArtwork[];
  title?: string;
  /** Year fallback for the caption meta line — typically `exhibition.year`. */
  fallbackYear?: number;
  /** Edition denominator for auto-derived "ed. N of M" — typically `exhibition.workCount`. */
  fallbackWorkCount?: number;
};

/**
 * Horizontal row of "other works from this series" shown below the
 * exhibition overview. Each thumbnail is a link out to the artwork's
 * Verse page.
 *
 * Hover behavior: each cell renders as a static first-frame preview by
 * default (via next/image optimization) and swaps to the raw animated
 * GIF while hovered. On mouseleave the GIF unmounts and the static
 * preview returns, so the next hover plays from frame 0 — consistent
 * "beginning" each time rather than resuming from a mid-animation
 * position.
 */
export function ExploreRow({
  items,
  title = "Explore",
  fallbackYear,
  fallbackWorkCount,
}: ExploreRowProps) {
  if (!items.length) return null;
  return (
    <section className="ex-explore" aria-labelledby="exploreHead">
      <div className="ex-explore-inner">
        <header className="ex-explore-head">
          <h2 className="ex-explore-head-title" id="exploreHead">
            {title}
          </h2>
        </header>
        <div className="ex-explore-row">
          {items.map((item) => (
            <ExploreItem
              key={item.id}
              item={item}
              fallbackYear={fallbackYear}
              fallbackWorkCount={fallbackWorkCount}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Build the optional "year · ed. N of M" meta line shown under each
 * explore-row caption. Same auto-derivation rules as InlineArtworks:
 * year falls back to the exhibition year, edition is parsed from a
 * `#N` suffix in the title combined with workCount, and the explicit
 * `edition` field overrides if set.
 */
function buildMetaLine(
  item: FeaturedArtwork,
  fallbackYear?: number,
  fallbackWorkCount?: number
): string | null {
  const year = item.year ?? fallbackYear;
  let edition: string | null = item.edition ?? null;
  if (!edition && fallbackWorkCount) {
    const m = item.title.match(/#(\d+)\s*$/);
    if (m) edition = `ed. ${m[1]} of ${fallbackWorkCount}`;
  }
  const parts = [
    year != null ? String(year) : null,
    edition,
  ].filter((p): p is string => Boolean(p));
  return parts.length > 0 ? parts.join(" · ") : null;
}

function ExploreItem({
  item,
  fallbackYear,
  fallbackWorkCount,
}: {
  item: FeaturedArtwork;
  fallbackYear?: number;
  fallbackWorkCount?: number;
}) {
  const [animating, setAnimating] = useState(false);
  // Iframe-poster fade gate: true once the iframe's genart has
  // actually inserted its canvas into the iframe DOM, detected via
  // MutationObserver below. That's the precise moment to fade the
  // static-frame poster overlay away to reveal the live version —
  // not a guess-timeout after onLoad.
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Watch the iframe's contentDocument for a <canvas> element to
  // appear. The `/api/genart/*` proxy makes the iframe same-origin
  // so we can access its DOM. MutationObserver fires only on actual
  // DOM changes (cheap, not a polling loop). Fallback timeout at
  // 4s in case detection misses (cross-origin error, genart fails,
  // etc.) so the poster doesn't get stuck overlaying a working
  // iframe forever.
  useEffect(() => {
    if (!item.iframe) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    let observer: MutationObserver | null = null;
    let fallbackTimer: number | null = null;
    let settled = false;

    const settle = () => {
      if (settled) return;
      settled = true;
      setIframeReady(true);
      if (observer) observer.disconnect();
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
    };

    const tryWatch = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return false;
        // If canvas is already there, settle immediately.
        const existing = doc.querySelector("canvas");
        if (existing && existing.width > 0 && existing.height > 0) {
          settle();
          return true;
        }
        // Otherwise observe future DOM changes.
        observer = new MutationObserver(() => {
          const c = doc.querySelector("canvas");
          if (c && c.width > 0 && c.height > 0) settle();
        });
        observer.observe(doc.documentElement, {
          childList: true,
          subtree: true,
        });
        return true;
      } catch {
        // Cross-origin or other access error — caller will fall back
        // to the timeout below.
        return false;
      }
    };

    const onLoad = () => {
      tryWatch();
    };
    iframe.addEventListener("load", onLoad);
    // Some browsers may not fire `load` again if the iframe is
    // already loaded by the time this effect runs (cached); try
    // immediately as well.
    tryWatch();

    fallbackTimer = window.setTimeout(settle, 4000);

    return () => {
      iframe.removeEventListener("load", onLoad);
      if (observer) observer.disconnect();
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
    };
  }, [item.iframe]);
  const isGif = /\.gif$/i.test(item.image);
  const hasPoster = isGif && Boolean(item.poster);
  const staticSrc = item.poster ?? item.image;
  const meta = buildMetaLine(item, fallbackYear, fallbackWorkCount);
  const itemRef = useRef<HTMLAnchorElement | null>(null);

  // IntersectionObserver-driven autoplay for GIF+poster cells.
  //   - Touch devices (`(hover: none)`): always on. Hover doesn't
  //     fire on phones/tablets, so without this the cell would sit
  //     static forever.
  //   - Desktop: opt-in per-item via `item.autoplayOnView`. The
  //     default desktop UX is hover-to-play (so a 5-item explore row
  //     doesn't decode five GIFs simultaneously), but kinetic series
  //     like Mazin's Phantasmagoria mis-represent themselves at rest
  //     and benefit from autoplay regardless of pointer.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasPoster) return;
    const isTouch = !!window.matchMedia?.("(hover: none)")?.matches;
    if (!isTouch && !item.autoplayOnView) return;
    const el = itemRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setAnimating(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasPoster, item.autoplayOnView]);

  // Live iframes (e.g. BASALT RT) are interactive, so wrapping the
  // whole figure in a single <a> doesn't get the click-through —
  // iframes consume their own clicks. Render the iframe inside the
  // image cell and overlay a transparent anchor on top so the link
  // still routes to verseUrl. While the iframe's underlying genart
  // bundle is loading (~2MB JS + shaders from IPFS for BASALT RT,
  // multi-second on mobile), the static `item.image` is rendered as
  // a positioned overlay above the iframe so the user sees the
  // artwork's still-frame instantly.
  //
  // The fade-out timing watches for a <canvas> element to appear in
  // the iframe's contentDocument via MutationObserver — the precise
  // moment the genart starts rendering, no guess-timeout. The
  // iframe is same-origin (loaded via /api/genart/* proxy) so DOM
  // access works. Fallback timeout at 4s in case the genart fails
  // or the canvas detection misses.
  //
  // Eager loading (no loading="lazy"): the page is structurally
  // dedicated to these iframes (artist statement + 3 explore
  // artworks); start fetching bytes on page mount so by the time
  // the user reaches the explore section the genart is already
  // running, not still bootstrapping.
  if (item.iframe) {
    return (
      <div className="ex-explore-item">
        <figure className="ex-explore-figure">
          <div className="ex-explore-image">
            <iframe
              ref={iframeRef}
              className="ex-explore-iframe"
              src={item.iframe}
              title={item.alt}
              referrerPolicy="no-referrer"
              allow="autoplay; fullscreen"
              sandbox="allow-scripts allow-same-origin"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="ex-explore-iframe-poster"
              src={item.image}
              alt=""
              draggable={false}
              loading="eager"
              decoding="async"
              style={{ opacity: iframeReady ? 0 : 1 }}
              aria-hidden="true"
            />
            <a
              className="ex-explore-iframe-link"
              href={item.verseUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${item.title} on Verse`}
            />
          </div>
          <figcaption className="ex-explore-caption">
            <a
              className="ex-explore-caption-link"
              href={item.verseUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <em>{item.title}</em>
            </a>
            {meta && <span className="ex-inline-caption-meta">{meta}</span>}
          </figcaption>
        </figure>
      </div>
    );
  }

  // Hover-to-play is the default desktop interaction for GIF+poster
  // cells, but on `autoplayOnView` items the IntersectionObserver
  // already keeps the GIF looping while in view — and the mouseleave
  // handler would otherwise flip `animating` back to false the
  // moment the cursor exited the cell, stopping the loop even though
  // the item is still visible. Skip the hover wiring for those
  // items so the IO state stays authoritative.
  const useHoverPlay = hasPoster && !item.autoplayOnView;
  return (
    <a
      ref={itemRef}
      href={item.verseUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="ex-explore-item"
      onMouseEnter={useHoverPlay ? () => setAnimating(true) : undefined}
      onMouseLeave={useHoverPlay ? () => setAnimating(false) : undefined}
    >
      <figure className="ex-explore-figure">
        <div className="ex-explore-image">
          {item.video ? (
            // Autoplay loop — used when per-item animated GIFs aren't
            // available but a transcoded video is. The static image
            // doubles as the poster frame so the cell isn't empty
            // before the video buffers.
            <video
              src={item.video}
              poster={item.image}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label={item.alt}
              ref={(el) => {
                if (!el) return;
                el.muted = true;
                const go = () => { if (el.paused) el.play().catch(() => {}); };
                go();
                el.addEventListener("loadeddata", go, { once: true });
                el.addEventListener("canplay", go, { once: true });
              }}
            />
          ) : animating ? (
            // Raw <img> so the browser plays the GIF natively from
            // frame 0. Re-mounts on each hover (unmounted on leave)
            // to reset playback.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.alt} />
          ) : (
            <Image
              src={staticSrc}
              alt={item.alt}
              width={600}
              height={600}
              sizes="(min-width: 1200px) 18vw, (min-width: 720px) 30vw, 45vw"
              // Pass GIFs through unoptimized (when no poster is set);
              // static posters are JPGs, let Next.js optimize those.
              unoptimized={isGif && !item.poster}
            />
          )}
        </div>
        <figcaption className="ex-explore-caption">
          <em>{item.title}</em>
          {meta && <span className="ex-inline-caption-meta">{meta}</span>}
        </figcaption>
      </figure>
    </a>
  );
}

