"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Same as ArtistHoverPreview's iframe path, but the <iframe> is
 * mounted on the component's own mount (page load) and stays mounted
 * for the page's lifetime — visibility is toggled via opacity/offset
 * rather than by mounting/unmounting. The trade is intentional:
 *
 *   • Iframe bundles for itsgalo / VES3L take ~1–2s to parse, set up
 *     the canvas, and render their first frame. Mounting on hover
 *     means the user waits that whole time before any artwork shows.
 *   • Mounting persistently on page load shifts that wait into the
 *     first few seconds of the page being open — by the time the
 *     user hovers, first frame has already painted and the reveal is
 *     instant.
 *
 * `sandbox="allow-scripts"` (no `allow-same-origin`) gives the iframe
 * an opaque origin so the browser isolates it into its own process —
 * the persistent rAF loop runs on a separate thread and the parent
 * page's hover-state CSS updates stay snappy. PlotGrid renders one
 * of these per iframe-type artist; toggle `visible` on the matching
 * one when the hover artist changes.
 */
const MAX_DIMENSION = 440;
const EDGE_PADDING = 16;
const CURSOR_OFFSET = 32;

function aspectBucket(aspect: number): { w: number; h: number } {
  if (aspect >= 1.6) return { w: 480, h: 300 };
  if (aspect >= 1.15) return { w: 480, h: 360 };
  if (aspect >= 0.85) return { w: 440, h: 440 };
  if (aspect >= 0.6) return { w: 360, h: 480 };
  return { w: 300, h: 480 };
}

export function PersistentIframePreview({
  src,
  aspectHint = 1,
  sizeScale,
  visible,
  cursorX,
  cursorY,
}: {
  src: string;
  aspectHint?: number;
  sizeScale?: number;
  visible: boolean;
  cursorX: number;
  cursorY: number;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [viewport, setViewport] = useState<{ w: number; h: number }>({
    w: 1024,
    h: 768,
  });
  const [headerBottom, setHeaderBottom] = useState(70);
  // First-paint gate: even though the iframe mounts on page load and
  // typically finishes well before the first hover, on a fresh visit
  // the user could hover before the bundle's first frame has landed.
  // We hold the reveal until `load` + a 250ms canvas grace, then
  // never lower it again (the iframe is persistent, so it's "ready"
  // for the rest of the page's life).
  const [iframeEverReady, setIframeEverReady] = useState(false);

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

  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;
    let timer: number | undefined;
    const onLoad = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => setIframeEverReady(true), 250);
    };
    el.addEventListener("load", onLoad);
    return () => {
      el.removeEventListener("load", onLoad);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const bucket = useMemo(() => aspectBucket(aspectHint), [aspectHint]);
  const scale = sizeScale ?? 1;
  const width = bucket.w * scale;
  const height = bucket.h * scale;

  const placement = useMemo(() => {
    const rightSpace = viewport.w - cursorX - EDGE_PADDING;
    const sideRightFits = rightSpace >= width + CURSOR_OFFSET;
    const side: "right" | "left" = sideRightFits ? "right" : "left";

    let x =
      side === "right" ? cursorX + CURSOR_OFFSET : cursorX - CURSOR_OFFSET - width;
    x = clamp(x, EDGE_PADDING, viewport.w - width - EDGE_PADDING);

    const topBound = headerBottom + EDGE_PADDING;
    let y = cursorY - height / 2;
    y = clamp(y, topBound, viewport.h - height - EDGE_PADDING);

    return { x, y, side };
  }, [width, height, cursorX, cursorY, viewport, headerBottom]);

  const ready = Boolean(visible && iframeEverReady);

  return (
    <div
      className="artist-hover-preview"
      data-visible={ready || undefined}
      data-side={placement.side}
      style={{
        transform: `translate(${placement.x}px, ${placement.y}px)`,
        ["--preview-max-w" as string]: `${width}px`,
        ["--preview-max-h" as string]: `${height}px`,
      }}
      aria-hidden="true"
    >
      <div className="artist-hover-preview-slide">
        <iframe
          ref={iframeRef}
          src={src}
          title="Artist preview"
          loading="eager"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  if (hi < lo) return lo;
  return Math.max(lo, Math.min(hi, v));
}
