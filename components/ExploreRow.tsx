"use client";

import Image from "next/image";
import { useState } from "react";
import type { FeaturedArtwork } from "@/lib/types";

type ExploreRowProps = {
  items: FeaturedArtwork[];
  title?: string;
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
export function ExploreRow({ items, title = "Explore" }: ExploreRowProps) {
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
            <ExploreItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExploreItem({ item }: { item: FeaturedArtwork }) {
  const [animating, setAnimating] = useState(false);
  const isGif = /\.gif$/i.test(item.image);
  const hasPoster = isGif && Boolean(item.poster);
  const staticSrc = item.poster ?? item.image;

  // Live iframes (e.g. BASALT RT) are interactive, so wrapping the
  // whole figure in a single <a> doesn't get the click-through —
  // iframes consume their own clicks. Render the iframe inside the
  // image cell and overlay a transparent anchor on top so the link
  // still routes to verseUrl. The figcaption below stays a normal
  // link via a separate wrapper.
  if (item.iframe) {
    return (
      <div className="ex-explore-item">
        <figure className="ex-explore-figure">
          <div className="ex-explore-image">
            <iframe
              className="ex-explore-iframe"
              src={item.iframe}
              title={item.alt}
              loading="lazy"
              referrerPolicy="no-referrer"
              allow="autoplay; fullscreen"
              sandbox="allow-scripts allow-same-origin"
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
          </figcaption>
        </figure>
      </div>
    );
  }

  return (
    <a
      href={item.verseUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="ex-explore-item"
      onMouseEnter={() => hasPoster && setAnimating(true)}
      onMouseLeave={() => hasPoster && setAnimating(false)}
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
              preload="auto"
              aria-label={item.alt}
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
        </figcaption>
      </figure>
    </a>
  );
}
