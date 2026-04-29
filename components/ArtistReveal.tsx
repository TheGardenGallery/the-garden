"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { HeroIframeMedia } from "./HeroIframeMedia";

type Props = {
  artistName: string;
  paragraphs: string[];
  socials?: { label: string; href: string }[];
  showcaseHref?: string;
  showcaseTitle?: string;
  showcaseYear?: number;
  showcaseAriaLabel?: string;
  showcaseVideo?: string;
  showcaseImage?: string;
  showcasePoster?: string;
  showcaseIframe?: string;
  showcaseIframeAspect?: string;
  showcaseIframeRandomize?: boolean;
  theme?: "dark" | "paper";
};

/**
 * Single-container artist reveal. Horizontal scroll on the deck drives
 * a CSS custom property `--x` (0 → 1) via motion's `useScroll` →
 * `useSpring` smoothing, and every visual transition reads from that
 * one variable:
 *
 *   - Container background: `color-mix` between paper-warm (--x = 0)
 *     and pure black (--x = 1).
 *   - Bio prose: opacity fade between --x ≈ 0.6 → 0.8.
 *   - Editorial cue: opacity fade between --x ≈ 0.5 → 0.7 (lands at
 *     roughly "70% to black" as requested).
 *   - Artwork: transforms from a half-clipped preview centered on the
 *     viewport's right edge (small, scale 1) to a fully centered
 *     enlarged piece (scale ~3) — translate + scale, both linearly
 *     interpolated against --x.
 *
 * The spring smooths fast scrolls so the transition tracks the
 * gesture without feeling jerky. No scroll-snap; the user sees a
 * continuous fade of bg / text / artwork as they scroll right.
 */
export function ArtistReveal({
  artistName,
  paragraphs,
  socials,
  showcaseHref,
  showcaseTitle,
  showcaseYear,
  showcaseAriaLabel,
  showcaseVideo,
  showcaseImage,
  showcasePoster,
  showcaseIframe,
  showcaseIframeAspect,
  showcaseIframeRandomize,
  theme = "dark",
}: Props) {
  // The deck's horizontal-scroll reveal only earns its keep when
  // there's a showcase artwork waiting on the right. Without one, all
  // the --x-driven motions (parallax, fades, drifts) just play into
  // nothing — pointless animation. Render a static bio in that case.
  // A live iframe, video, or still image all qualify.
  const hasShowcase = Boolean(
    showcaseHref && (showcaseIframe || showcaseVideo || showcaseImage)
  );

  // Long bios get the monograph/wall-text treatment: two narrow
  // columns instead of one centered column. Halving the column height
  // is what lets a 400+ word bio fit inside the viewport without
  // internal scrollbars or font-size shrinkage. Threshold trips on
  // either ≥250 words or ≥4 paragraphs — short bios (Ricky's 3
  // paragraphs) stay in the intimate single-column setting.
  const wordCount = paragraphs.reduce(
    (n, p) => n + p.trim().split(/\s+/).filter(Boolean).length,
    0
  );
  const isLongBio = wordCount >= 250 || paragraphs.length >= 4;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollerRef });
  // Spring smoothing — high stiffness + damping keeps the spring
  // tight enough that scrolling feels free and direct, with just a
  // tiny lag to refine fast wheel deltas into a smooth transition.
  const smoothX = useSpring(scrollXProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.4,
  });

  useMotionValueEvent(smoothX, "change", (v) => {
    if (!hasShowcase) return;
    scrollerRef.current?.style.setProperty("--x", v.toFixed(4));
  });

  // Track the deck's actual visible width (excluding any vertical
  // scrollbar gutter) and publish it as `--canvas-w`. Lets the
  // artwork's translate use real pixels instead of `50vw`, which on
  // systems with always-visible scrollbars is offset by ~17px from
  // the true visible center. Only matters when there's a showcase
  // artwork to position.
  useEffect(() => {
    if (!hasShowcase) return;
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      el.style.setProperty("--canvas-w", `${el.clientWidth}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasShowcase]);

  // Static branch: no deck, no track, no scroll, no --x animation —
  // just the bio composition rendered as a plain page. Reuses the
  // existing class names so all typography/colour/spacing rules carry
  // over; the missing track/sticky-stage means nothing reads --x and
  // every transition stays at its `--x = 0` resting state (full
  // opacity, no parallax translate).
  if (!hasShowcase) {
    return (
      <div
        ref={scrollerRef}
        className="artist-reveal artist-reveal-static"
        data-theme={theme}
        style={{ "--x": 0 } as CSSProperties}
      >
        <header className="artist-reveal-header">
          <h1 className="artist-reveal-title">{artistName}</h1>
          {socials && socials.length > 0 && (
            <div className="artist-reveal-socials">
              {socials.map((s, i) => (
                <span key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="artist-reveal-socials-link"
                  >
                    {s.label}
                  </a>
                  {i < socials.length - 1 && (
                    <span
                      className="artist-reveal-socials-sep"
                      aria-hidden="true"
                    >
                      {" · "}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className="artist-reveal-content">
          <div className="artist-reveal-bio" data-long={isLongBio || undefined}>
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollerRef}
      className="artist-reveal"
      data-theme={theme}
      style={{ "--x": 0 } as CSSProperties}
    >
      {/* Track is wider than viewport, providing the horizontal scroll
          distance. Stage uses `position: sticky` inside the track so
          it stays in the viewport's left edge during horizontal
          scroll, but flows normally during vertical page scroll —
          which means scrolling down moves past the artist section to
          the footer like any normal page. */}
      <div className="artist-reveal-track">
        <div className="artist-reveal-stage">
        <header className="artist-reveal-header">
          <h1 className="artist-reveal-title">{artistName}</h1>
          {socials && socials.length > 0 && (
            <div className="artist-reveal-socials">
              {socials.map((s, i) => (
                <span key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="artist-reveal-socials-link"
                  >
                    {s.label}
                  </a>
                  {i < socials.length - 1 && (
                    <span
                      className="artist-reveal-socials-sep"
                      aria-hidden="true"
                    >
                      {" · "}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="artist-reveal-content">
          <div className="artist-reveal-bio" data-long={isLongBio || undefined}>
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {showcaseHref && showcaseTitle && (
            <Link
              href={showcaseHref}
              className="artist-reveal-cue"
              aria-label={showcaseAriaLabel ?? `View ${showcaseTitle}`}
            >
              <span className="artist-reveal-cue-label">
                {showcaseTitle}
                {showcaseYear !== undefined && `, ${showcaseYear}`}
              </span>
              <span className="artist-reveal-cue-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          )}
        </div>

        {showcaseHref && showcaseIframe ? (
          // Live iframe must stay interactive so the genart can accept
          // mouse/keyboard input — wrapping it in an anchor would
          // swallow those events. Navigation to the exhibition still
          // happens via the editorial cue beneath the bio.
          <div
            className="artist-reveal-artwork artist-reveal-artwork-iframe"
            aria-label={showcaseAriaLabel ?? `View ${showcaseTitle}`}
          >
            <HeroIframeMedia
              src={showcaseIframe}
              title={
                showcaseAriaLabel ??
                `${artistName}, ${showcaseTitle ?? "featured work"}`
              }
              aspect={showcaseIframeAspect}
              randomize={showcaseIframeRandomize}
            />
          </div>
        ) : showcaseHref && (showcaseVideo || showcaseImage) ? (
          <Link
            href={showcaseHref}
            className="artist-reveal-artwork"
            aria-label={showcaseAriaLabel ?? `View ${showcaseTitle}`}
          >
            {showcaseVideo ? (
              <video
                src={showcaseVideo}
                poster={showcasePoster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={showcaseImage} alt="" aria-hidden="true" />
            )}
          </Link>
        ) : null}
        </div>
      </div>
    </div>
  );
}
