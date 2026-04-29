"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { HeroIframeMedia } from "./HeroIframeMedia";
import { ShapedBio } from "./ShapedBio";
import { MagazineBio } from "./MagazineBio";

/**
 * Bios coming from Verse use markdown-style `*emphasis*` for
 * exhibition titles and the like. The artist page renders bios as
 * plain text (not dangerouslySetInnerHTML), so we have to translate
 * those asterisks into `<em>` ourselves. Single-asterisk pairs only
 * — anything more elaborate (links, bold) isn't in our bios today.
 */
function renderEmphasis(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\*([^*\n]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<em key={m.index}>{m[1]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : [text];
}

type Props = {
  artistSlug: string;
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
  artistSlug,
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
  // columns instead of one centered column. Threshold is purely
  // word-count based — paragraph count alone doesn't tell us whether
  // a bio fills the viewport. 200 words is roughly where single
  // column at the data-long font scaling starts feeling tall against
  // the 100vh stage; below that, single column reads cleaner. Today
  // only Yoshi crosses it (Paolo Čerić is the next-longest at 164).
  const wordCount = paragraphs.reduce(
    (n, p) => n + p.trim().split(/\s+/).filter(Boolean).length,
    0
  );
  const isLongBio = wordCount >= 200;

  // Pretext-driven shape-aware bio applies to every artist that has
  // a showcase artwork half-clipped on the right edge — including
  // long-bio artists like Yoshi (the bio's font scales down via the
  // `data-long` flag so the single-column shaped layout fits inside
  // the viewport-locked deck stage). Static artists (no showcase)
  // keep the plain-paragraph layout — no artwork to shape around.
  const isShapedBio = hasShowcase;
  const bioRef = useRef<HTMLDivElement>(null);
  // Either a div (iframe variant) or anchor (image/video variant) —
  // typed loosely so the callback ref can attach to either.
  const artworkRef = useRef<HTMLElement | null>(null);
  // Live metrics for the shaped bio. All values are derived from
  // STABLE measurements (parent + artwork dimensions, computed CSS
  // on the bio) — never from the bio's own bounding rect, which
  // changes with line count and would feed back into the layout.
  const [shapedMetrics, setShapedMetrics] = useState({
    fullWidth: 540,
    shapedWidth: 540,
    artworkTop: 0,
    artworkBottom: 0,
    flexAreaCenter: 0,
    font: "400 18px Cormorant, serif",
    lineHeight: 28.8,
    paragraphGap: 25.2,
    siblingExtent: 0,
  });

  useEffect(() => {
    if (!isShapedBio) return;
    const bio = bioRef.current;
    const art = artworkRef.current;
    const parent = bio?.parentElement;
    if (!bio || !art || !parent) return;
    // Horizontal gap kept between text's right edge and the artwork's
    // visible left edge.
    const GAP = 28;
    // Vertical buffer extending the exclusion zone above and below
    // the artwork — about one line-height of grace so the line
    // adjacent to the artwork's top/bottom edge stays shaped (no
    // visual touching at the corners), without dragging extra
    // lines into the shaped band that could've stayed full-width.
    const VGAP = 25;
    let rafId: number | null = null;
    type Metrics = {
      fullWidth: number;
      shapedWidth: number;
      artworkTop: number;
      artworkBottom: number;
      flexAreaCenter: number;
      font: string;
      lineHeight: number;
      paragraphGap: number;
      siblingExtent: number;
    };
    let last: Metrics | null = null;
    // Pure measurement — no DOM writes, no commit. Reads parent +
    // artwork dimensions and computed CSS for the bio's typography,
    // returns the resulting metrics.
    const sample = (): Metrics => {
      const parentRect = parent.getBoundingClientRect();
      const aRect = art.getBoundingClientRect();
      // Bio block's rendered width — set by CSS (70ch single, 88ch
      // magazine). Stable; doesn't depend on bio.height.
      const bioWidthPx = bio.clientWidth;
      const bioLeftInParent = (parentRect.width - bioWidthPx) / 2;
      const artLeftInParent = aRect.left - parentRect.left;
      // For magazine layout (isLongBio) the shaped target is the
      // RIGHT column, not the whole bio block. fullWidth becomes
      // per-column width and shapedWidth is measured from the right
      // column's left edge.
      const columnGap = isLongBio
        ? parseFloat(getComputedStyle(bio).columnGap || "0") ||
          parseFloat(getComputedStyle(bio).gap || "0") ||
          32
        : 0;
      const fullWidth = isLongBio
        ? (bioWidthPx - columnGap) / 2
        : bioWidthPx;
      const shapedTargetLeft = isLongBio
        ? bioLeftInParent + fullWidth + columnGap
        : bioLeftInParent;
      const shapedWidth = Math.max(
        140,
        Math.min(fullWidth, artLeftInParent - shapedTargetLeft - GAP)
      );
      // Pull live typography from CSS so pretext's measurement
      // matches whatever the breakpoint is rendering.
      const cs = getComputedStyle(bio);
      const pEl = bio.querySelector("p");
      const pcs = pEl ? getComputedStyle(pEl) : cs;
      const fontSize = parseFloat(pcs.fontSize) || 18;
      const lineHeightCss = parseFloat(pcs.lineHeight);
      const lineHeight = Number.isFinite(lineHeightCss)
        ? lineHeightCss
        : fontSize * 1.6;
      const fontFamily = pcs.fontFamily || "Cormorant, serif";
      const fontWeight = pcs.fontWeight || "400";
      const fontStyle = pcs.fontStyle || "normal";
      const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
      const paragraphGap = fontSize * 1.4;
      let siblingExtent = 0;
      const flexGap = parseFloat(getComputedStyle(parent).rowGap || "0") || 32;
      let visibleSiblings = 0;
      parent.childNodes.forEach((node) => {
        if (node === bio || !(node instanceof HTMLElement)) return;
        const r = node.getBoundingClientRect();
        if (r.height > 0) {
          siblingExtent += r.height;
          visibleSiblings += 1;
        }
      });
      if (visibleSiblings > 0) siblingExtent += flexGap * visibleSiblings;
      // Account for the parent's CSS padding when computing where
      // the flex centering area actually sits — without this the
      // ShapedBio iterative refinement mis-predicts bio.top and
      // misclassifies lines along the artwork's vertical edges.
      const parentCsForCenter = getComputedStyle(parent);
      const padTop =
        parseFloat(parentCsForCenter.paddingTop) || 0;
      const padBottom =
        parseFloat(parentCsForCenter.paddingBottom) || 0;
      const flexAreaHeight = parent.clientHeight - padTop - padBottom;
      const flexAreaCenter = padTop + flexAreaHeight / 2;
      return {
        fullWidth,
        shapedWidth,
        // Vertical buffer on top + bottom so lines whose edges sit
        // exactly at the artwork boundary still classify as
        // "in exclusion" and stay clear of the artwork's corners.
        artworkTop: aRect.top - parentRect.top - VGAP,
        artworkBottom: aRect.bottom - parentRect.top + VGAP,
        flexAreaCenter,
        font,
        lineHeight,
        paragraphGap,
        siblingExtent,
      };
    };
    const close = (a: number, b: number) => Math.abs(a - b) < 0.5;
    const sameMetrics = (a: Metrics, b: Metrics) =>
      close(a.fullWidth, b.fullWidth) &&
      close(a.shapedWidth, b.shapedWidth) &&
      close(a.artworkTop, b.artworkTop) &&
      close(a.artworkBottom, b.artworkBottom) &&
      close(a.flexAreaCenter, b.flexAreaCenter) &&
      close(a.lineHeight, b.lineHeight) &&
      close(a.paragraphGap, b.paragraphGap) &&
      close(a.siblingExtent, b.siblingExtent) &&
      a.font === b.font;
    // Two-frame stability check. Sample once, wait a frame, sample
    // again. Only commit when both samples agree — this catches jank
    // from font-load reflows, scrollbar appearance, and any other
    // mid-resize layout shifts that would otherwise commit a stale
    // frame. If samples disagree we re-schedule (capped to a few
    // attempts so we eventually commit even mid-animation).
    const MAX_ATTEMPTS = 4;
    let attempts = 0;
    const update = () => {
      if (rafId !== null) return;
      attempts += 1;
      rafId = requestAnimationFrame(() => {
        const a = sample();
        rafId = requestAnimationFrame(() => {
          rafId = null;
          const b = sample();
          if (sameMetrics(a, b) || attempts >= MAX_ATTEMPTS) {
            attempts = 0;
            if (last && sameMetrics(last, b)) return;
            last = b;
            setShapedMetrics(b);
          } else {
            update();
          }
        });
      });
    };
    update();
    // Observe ONLY the parent and the artwork — not the bio itself.
    // The bio's bounding rect changes when line count changes, which
    // would create a feedback loop with the layout. Parent + artwork
    // dimensions are stable per viewport, so this only fires on real
    // viewport changes.
    const ro = new ResizeObserver(update);
    ro.observe(parent);
    ro.observe(art);
    return () => {
      ro.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isShapedBio, isLongBio]);

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
        data-slug={artistSlug}
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
              <p key={i}>{renderEmphasis(para)}</p>
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
      data-slug={artistSlug}
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
          {isShapedBio && isLongBio ? (
            <MagazineBio
              ref={bioRef}
              paragraphs={paragraphs}
              font={shapedMetrics.font}
              lineHeight={shapedMetrics.lineHeight}
              paragraphGap={shapedMetrics.paragraphGap}
              columnWidth={shapedMetrics.fullWidth}
              shapedWidth={shapedMetrics.shapedWidth}
              artworkTop={shapedMetrics.artworkTop}
              artworkBottom={shapedMetrics.artworkBottom}
              flexAreaCenter={shapedMetrics.flexAreaCenter}
              siblingExtent={shapedMetrics.siblingExtent}
              renderEmphasis={renderEmphasis}
              className="artist-reveal-bio artist-reveal-bio-shaped"
            />
          ) : isShapedBio ? (
            <ShapedBio
              ref={bioRef}
              paragraphs={paragraphs}
              font={shapedMetrics.font}
              lineHeight={shapedMetrics.lineHeight}
              paragraphGap={shapedMetrics.paragraphGap}
              fullWidth={shapedMetrics.fullWidth}
              shapedWidth={shapedMetrics.shapedWidth}
              artworkTop={shapedMetrics.artworkTop}
              artworkBottom={shapedMetrics.artworkBottom}
              flexAreaCenter={shapedMetrics.flexAreaCenter}
              siblingExtent={shapedMetrics.siblingExtent}
              renderEmphasis={renderEmphasis}
              className="artist-reveal-bio artist-reveal-bio-shaped"
            />
          ) : (
            <div
              ref={bioRef}
              className="artist-reveal-bio"
              data-long={isLongBio || undefined}
            >
              {paragraphs.map((para, i) => (
                <p key={i}>{renderEmphasis(para)}</p>
              ))}
            </div>
          )}
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
            ref={(node) => {
              artworkRef.current = node;
            }}
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
            ref={(node) => {
              artworkRef.current = node;
            }}
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
