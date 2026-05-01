"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Floating preview that appears beside the cursor while an artist
 * name is hovered. Position math owns three constraints:
 *   1. Anchor on the cursor's right by default; flip to the left when
 *      the right side doesn't have room for the image + offset.
 *   2. After picking a side, clamp X so the image stays at least
 *      `EDGE_PADDING` away from the corresponding viewport edge.
 *   3. Center vertically on the cursor, then clamp Y so the top and
 *      bottom never cross `EDGE_PADDING` either. Together these mean
 *      the artwork is never cut off, in any of the four corners.
 *
 * Display dimensions come from a `ResizeObserver` on the actual <img>
 * element rather than computed from naturalWidth/naturalHeight + a
 * cap. Reading the truth means positioning math can never disagree
 * with what the browser actually paints (e.g. if a CSS cap fails to
 * apply for any reason, the math still tracks the rendered size).
 *
 * Two-layer DOM: the outer wrapper handles instantaneous cursor
 * tracking via `transform: translate(...)`; the inner slider runs the
 * enter/exit fade-and-slide independently so cursor movement doesn't
 * fight the FX timing.
 *
 * The preview is only revealed after both the hover signal AND
 * measured dimensions are ready — gating on measurement prevents the
 * "glitch in" of mounting an unmeasured image at the cursor.
 */
const MAX_DIMENSION = 440;
const EDGE_PADDING = 16;
const CURSOR_OFFSET = 32;

/**
 * Group natural aspect ratios into a few buckets, each with a fixed
 * (max-width, max-height) target so similar-shape artworks always
 * present at a similar size — instead of squares looking huge and
 * elongated pieces looking small (a side-effect of capping both axes
 * at the same value with object-fit:contain).
 *
 * The targets below are tuned around the global 440 cap. A per-artist
 * `maxSize` override scales every bucket dimension proportionally
 * (size / 440), preserving the bucket's relative shape.
 */
function aspectBucket(aspect: number): { w: number; h: number } {
  if (aspect >= 1.6) return { w: 480, h: 300 }; // wide landscape
  if (aspect >= 1.15) return { w: 480, h: 360 }; // landscape
  if (aspect >= 0.85) return { w: 440, h: 440 }; // square-ish
  if (aspect >= 0.6) return { w: 360, h: 480 }; // portrait
  return { w: 300, h: 480 }; // tall portrait
}

/**
 * Toggle the preview's positioning strategy.
 *   "cursor" — follow the pointer with edge-aware side flipping (the
 *              original behaviour).
 *   "fixed"  — pin the preview at viewport center (between the
 *              header and the bottom edge), ignoring the cursor.
 *
 * Easy to flip between the two without touching the rest of the
 * component. Both code paths stay live below.
 */
const PLACEMENT_MODE: "cursor" | "fixed" = "cursor";

export function ArtistHoverPreview({
  src,
  type = "image",
  poster,
  aspectHint,
  sizeScale,
  visible,
  cursorX,
  cursorY,
}: {
  src: string | null;
  type?: "image" | "video" | "iframe";
  poster?: string;
  /** Aspect ratio hint for iframes (which have no intrinsic dims).
      Falls back to 1 (square) if not provided. */
  aspectHint?: number;
  /** Per-artist multiplier on bucket dims. Multiplies w and h
      uniformly so the preview's shape (and clamp behaviour) is
      preserved; only its size changes. */
  sizeScale?: number;
  visible: boolean;
  cursorX: number;
  cursorY: number;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [display, setDisplay] = useState<{ w: number; h: number } | null>(null);
  const [naturalAspect, setNaturalAspect] = useState<number | null>(null);
  // For iframes only: gate the reveal on the actual `load` event +
  // a grace period for the canvas to render its first frame, so the
  // wrapper fades in with finished content rather than a half-rendered
  // bundle. Not used for img/video (their load is handled by `display`).
  const [iframeReady, setIframeReady] = useState(false);
  const [viewport, setViewport] = useState<{ w: number; h: number }>({
    w: 1024,
    h: 768,
  });
  // Read the live header (`nav`) bounding rect so the preview's top
  // boundary tracks responsive nav-height changes — the nav is
  // position:fixed with z-index:200, so a preview that crosses above
  // its bottom edge disappears underneath it.
  const [headerBottom, setHeaderBottom] = useState(70);

  useEffect(() => {
    const update = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      const nav = document.querySelector("nav");
      if (nav) setHeaderBottom(nav.getBoundingClientRect().bottom);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Reset measurement when the source changes — old display dims are
  // stale and would mis-clamp the new image's bounding box.
  useEffect(() => {
    if (!src) {
      setDisplay(null);
      setNaturalAspect(null);
    }
    setIframeReady(false);
  }, [src]);

  // Iframe-only: wait for the load event + a grace period before
  // marking ready, so the canvas has time to draw its first frame
  // before the wrapper fades in.
  useEffect(() => {
    if (type !== "iframe" || !src) return;
    const el = iframeRef.current;
    if (!el) return;
    let timer: number | undefined;
    const onLoad = () => {
      if (timer) window.clearTimeout(timer);
      // 300ms grace gives the bundle's setup script time to size the
      // canvas, run the kickstart click, and paint a stable first
      // frame — the visible reveal then animates a settled image
      // rather than catching mid-rasterization.
      timer = window.setTimeout(() => setIframeReady(true), 300);
    };
    el.addEventListener("load", onLoad);
    return () => {
      el.removeEventListener("load", onLoad);
      if (timer) window.clearTimeout(timer);
    };
  }, [src, type]);

  // Measure the rendered media element directly. Works for <img>
  // (load event), <video> (loadedmetadata), and <iframe> (just rely
  // on ResizeObserver — iframes have no intrinsic load semantics we
  // can read for sizing). ResizeObserver catches any later size
  // changes (CSS cap kicks in, viewport resize).
  useEffect(() => {
    const el =
      type === "video"
        ? videoRef.current
        : type === "iframe"
          ? iframeRef.current
          : imgRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w > 0 && h > 0) setDisplay({ w, h });
    };
    const captureNatural = () => {
      const nw =
        type === "video"
          ? (el as HTMLVideoElement).videoWidth
          : (el as HTMLImageElement).naturalWidth;
      const nh =
        type === "video"
          ? (el as HTMLVideoElement).videoHeight
          : (el as HTMLImageElement).naturalHeight;
      if (nw > 0 && nh > 0) setNaturalAspect(nw / nh);
    };
    if (type === "video") {
      const v = el as HTMLVideoElement;
      if (v.readyState >= 1) {
        captureNatural();
        measure();
      }
      v.addEventListener("loadedmetadata", () => {
        captureNatural();
        measure();
      });
      v.addEventListener("loadeddata", measure);
    } else if (type === "iframe") {
      // Iframes have no intrinsic dims — use `aspectHint` (per-artist,
      // matches the artwork's true composition) so the bucket sizes
      // the slot to the artwork's shape and there's no whitespace.
      setNaturalAspect(aspectHint ?? 1);
      measure();
      (el as HTMLIFrameElement).addEventListener("load", measure);
    } else {
      const i = el as HTMLImageElement;
      // For images, gate `display` on full decode rather than on the
      // `load` event. Some browsers fire `load` once the bytes are
      // in, but the bitmap may still be decoding asynchronously —
      // revealing the preview at that point makes the fade-in
      // animate over an incomplete raster (the user sees the decode
      // complete mid-animation as "chop"). decode() resolves only
      // when the bitmap is paint-ready.
      const onReady = async () => {
        captureNatural();
        try {
          await i.decode();
        } catch {
          // decode() rejects on broken images; fall through to
          // measuring anyway so the slot doesn't get stuck hidden.
        }
        measure();
      };
      if (i.complete && i.naturalWidth > 0) {
        onReady();
      }
      i.addEventListener("load", onReady);
    }
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(measure)
      : null;
    ro?.observe(el);
    return () => {
      if (type === "video") {
        const v = el as HTMLVideoElement;
        v.removeEventListener("loadedmetadata", measure);
        v.removeEventListener("loadeddata", measure);
      } else if (type === "iframe") {
        (el as HTMLIFrameElement).removeEventListener("load", measure);
      } else {
        (el as HTMLImageElement).removeEventListener("load", measure);
      }
      ro?.disconnect();
    };
  }, [src, type, aspectHint]);

  const placement = useMemo(() => {
    if (!display) {
      return { x: cursorX, y: cursorY - 100, side: "right" as const };
    }

    if (PLACEMENT_MODE === "fixed") {
      // Pin to the visual centre of the area below the nav. Side
      // stays "right" so the existing CSS slide direction still works.
      const x = (viewport.w - display.w) / 2;
      const usableTop = headerBottom;
      const usableHeight = viewport.h - headerBottom;
      const y = usableTop + (usableHeight - display.h) / 2;
      return { x, y, side: "right" as const };
    }

    const rightSpace = viewport.w - cursorX - EDGE_PADDING;
    const sideRightFits = rightSpace >= display.w + CURSOR_OFFSET;
    const side: "right" | "left" = sideRightFits ? "right" : "left";

    let x =
      side === "right"
        ? cursorX + CURSOR_OFFSET
        : cursorX - CURSOR_OFFSET - display.w;
    x = clamp(x, EDGE_PADDING, viewport.w - display.w - EDGE_PADDING);

    // Top boundary = header's bottom edge + padding so the preview
    // never slips behind the fixed nav (which has higher z-index).
    const topBound = headerBottom + EDGE_PADDING;
    let y = cursorY - display.h / 2;
    y = clamp(y, topBound, viewport.h - display.h - EDGE_PADDING);

    return { x, y, side };
  }, [display, cursorX, cursorY, viewport, headerBottom]);

  // Reveal once the asset is fully ready: img/video measured;
  // iframe both measured AND past its load+grace gate so canvas has
  // had a chance to render its first frame.
  const ready = Boolean(
    visible && src && display && (type !== "iframe" || iframeReady),
  );

  return (
    <div
      className="artist-hover-preview"
      data-visible={ready || undefined}
      data-side={placement.side}
      style={(() => {
        // Bucket-sized preview: natural aspect determines a fixed
        // (w, h) target so similar shapes always read at similar size.
        // `sizeScale` multiplies the bucket dims uniformly for the
        // few artists whose previews need to read bigger or smaller
        // than the global default.
        const bucket = naturalAspect ? aspectBucket(naturalAspect) : null;
        const scale = sizeScale ?? 1;
        return {
          transform: `translate(${placement.x}px, ${placement.y}px)`,
          ["--preview-max-w" as string]: `${(bucket?.w ?? MAX_DIMENSION) * scale}px`,
          ["--preview-max-h" as string]: `${(bucket?.h ?? MAX_DIMENSION) * scale}px`,
        };
      })()}
      aria-hidden="true"
    >
      <div className="artist-hover-preview-slide">
        {src && type === "iframe" ? (
          <iframe
            ref={iframeRef}
            src={src}
            title="Artist preview"
            loading="eager"
            // `allow-scripts` without `allow-same-origin` gives the
            // iframe an opaque origin, which the browser treats as
            // cross-origin and isolates into its own process/thread.
            // Without this, our same-origin proxy iframes share the
            // parent's main thread, so the bundle's parse + canvas
            // setup blocks the parent's hover-state updates and the
            // gray-on-hover transition lags. Bundle is self-contained
            // (no parent storage/cookies needed) so the sandbox
            // restrictions don't affect rendering.
            sandbox="allow-scripts"
          />
        ) : src && type === "video" ? (
          <video
            ref={(el) => {
              videoRef.current = el;
              if (!el) return;
              el.muted = true;
              const go = () => { if (el.paused) el.play().catch(() => {}); };
              go();
              el.addEventListener("loadeddata", go, { once: true });
              el.addEventListener("canplay", go, { once: true });
            }}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={imgRef} src={src} alt="" />
        ) : null}
      </div>
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  // If hi < lo (image bigger than viewport), prefer the lo bound so
  // the top-left of the image stays visible.
  if (hi < lo) return lo;
  return Math.max(lo, Math.min(hi, v));
}
