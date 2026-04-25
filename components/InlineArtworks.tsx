"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Exhibition } from "@/lib/types";
import { useScrollReveal } from "@/lib/useScrollReveal";

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
}: {
  group: Group;
  fallbackUrl?: string;
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

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

  const cls = `ex-inline-artworks reveal${visible ? " is-visible" : ""}`;

  return (
    <div ref={ref} className={cls}>
      {group.items.map((item, j) => (
        <InlineArtworkItem key={j} item={item} fallbackUrl={fallbackUrl} />
      ))}
    </div>
  );
}

function InlineArtworkItem({
  item,
  fallbackUrl,
}: {
  item: Item;
  fallbackUrl?: string;
}) {
  const figure = (
    <figure className="ex-inline-figure">
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
            loading="eager"
            referrerPolicy="no-referrer"
            allow="autoplay; fullscreen"
            sandbox="allow-scripts allow-same-origin"
          />
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
            width={1200}
            height={1500}
            sizes="(min-width: 900px) 40vw, 92vw"
            quality={95}
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
