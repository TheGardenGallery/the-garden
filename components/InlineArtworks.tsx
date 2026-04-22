"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Exhibition } from "@/lib/types";

type Group = NonNullable<Exhibition["inlineArtworks"]>[number];

/**
 * Inline artwork block that fades in when scrolled into view, matching
 * the homepage Reveal behavior (opacity 0 + translateY(28px) → 0, 0.8s
 * ease-out). Adds `.reveal` directly to the existing container rather
 * than wrapping, so sibling-based CSS selectors on `.ex-inline-artworks`
 * keep working.
 */
export function InlineArtworks({
  group,
  fallbackUrl,
}: {
  group: Group;
  fallbackUrl?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      {group.items.map((item, j) => {
        const href = item.verseUrl ?? fallbackUrl;
        const figure = (
          <figure className="ex-inline-figure">
            {item.video ? (
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
                />
              </div>
            )}
            {item.title && (
              <figcaption className="ex-inline-caption">
                <em>{item.title}</em>
              </figcaption>
            )}
          </figure>
        );
        return href ? (
          <a
            key={j}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="ex-inline-artwork"
          >
            {figure}
          </a>
        ) : (
          <div key={j} className="ex-inline-artwork">
            {figure}
          </div>
        );
      })}
    </div>
  );
}
