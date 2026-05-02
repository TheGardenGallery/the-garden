"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const ARTWORK_SELECTOR =
  '.exhibition-detail[data-slug="split-logic"] .ex-hero-plate, ' +
  '.exhibition-detail[data-slug="split-logic"] .ex-inline-media, ' +
  '.exhibition-detail[data-slug="split-logic"] .piece-cell';

const ZOOM = 1.6;
const SIZE = 32;

function lookupTone(
  tones: Record<string, string> | undefined,
  src: string
): string | null {
  if (!tones || !src) return null;
  if (tones[src]) return tones[src];
  try {
    const url = new URL(src, window.location.origin);
    return tones[url.pathname] ?? null;
  } catch {
    return null;
  }
}

type Hidden = { visible: false };
type Visible = {
  visible: true;
  x: number;
  y: number;
  videoSrc: string;
  imgSrc: string;
  tone: string;
  w: number;
  h: number;
  ox: number;
  oy: number;
};
type State = Hidden | Visible;

/**
 * Split Logic — magnifying glass cursor.
 *
 * Tracks the pointer over hero / inline / piece-grid artworks and
 * renders a small "glass tile" that shows a 1.6× detail of the area
 * directly under it. The lens hosts a *live* clone of the source
 * video (not the poster), so what's magnified is the same animated
 * frame the viewer is already watching, kept in sync via currentTime
 * on entry and on every src change.
 */
export function SplitLogicMagnifier({
  tones,
}: {
  tones?: Record<string, string>;
}) {
  const [m, setM] = useState<State>({ visible: false });
  const sourceVideoRef = useRef<HTMLVideoElement | null>(null);
  const lensVideoRef = useRef<HTMLVideoElement | null>(null);
  // Last viewport-space pointer position — used to re-evaluate the
  // magnifier when something *other* than a pointermove changes the
  // page (e.g. the lightbox closing while the pointer hasn't moved).
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  // True between the moment we detect lightbox-dismissal (click on
  // backdrop / Escape) and the moment the overlay element is fully
  // removed from the DOM. Lets the magnifier reappear during the
  // 250ms fade-out instead of waiting for the unmount.
  const dismissedRef = useRef(false);

  useEffect(() => {
    const overlaySelector =
      '.exhibition-detail[data-slug="split-logic"] .piece-grid-overlay';
    const isLightboxOpen = () => {
      if (dismissedRef.current) return false;
      return !!document.querySelector(overlaySelector);
    };

    // When dismissing during the fade, document.elementFromPoint still
    // returns the overlay (it's painted on top). elementsFromPoint
    // gives us the full stack so we can pick the topmost artwork.
    const targetUnderPointer = (x: number, y: number): Element | null => {
      const elements = document.elementsFromPoint(x, y);
      return (
        elements.find((el) => !el.closest(".piece-grid-overlay")) ?? null
      );
    };

    const evaluate = (
      clientX: number,
      clientY: number,
      target: Element | null
    ) => {
      // While the expanded-artwork lightbox is open, the magnifier is
      // out of context — keep it hidden regardless of where the pointer
      // happens to land.
      if (isLightboxOpen()) {
        sourceVideoRef.current = null;
        setM((s) => (s.visible ? { visible: false } : s));
        return;
      }
      const root = target?.closest(ARTWORK_SELECTOR);
      if (!root) {
        sourceVideoRef.current = null;
        setM((s) => (s.visible ? { visible: false } : s));
        return;
      }

      const sourceVideo = root.querySelector(
        "video"
      ) as HTMLVideoElement | null;
      const sourceImg = root.querySelector("img") as HTMLImageElement | null;
      const videoSrc =
        sourceVideo?.currentSrc || sourceVideo?.src || "";
      const imgSrc = sourceImg?.src || "";
      if (!videoSrc && !imgSrc) {
        sourceVideoRef.current = null;
        setM((s) => (s.visible ? { visible: false } : s));
        return;
      }

      sourceVideoRef.current = sourceVideo;

      const rect = root.getBoundingClientRect();
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;
      if (
        relX < 0 ||
        relY < 0 ||
        relX > rect.width ||
        relY > rect.height
      ) {
        setM((s) => (s.visible ? { visible: false } : s));
        return;
      }

      const w = rect.width * ZOOM;
      const h = rect.height * ZOOM;
      const ox = SIZE / 2 - relX * ZOOM;
      const oy = SIZE / 2 - relY * ZOOM;

      const tone =
        lookupTone(tones, videoSrc) ?? lookupTone(tones, imgSrc) ?? "#ffffff";

      setM({
        visible: true,
        x: clientX,
        y: clientY,
        videoSrc,
        imgSrc,
        tone,
        w,
        h,
        ox,
        oy,
      });
    };

    const onMove = (e: PointerEvent) => {
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      evaluate(e.clientX, e.clientY, e.target as Element | null);
    };

    const onLeave = () => {
      sourceVideoRef.current = null;
      setM((s) => (s.visible ? { visible: false } : s));
    };

    // While the page is scrolling, no pointermove fires — but the
    // artwork is sliding under the magnifier, so its rendered detail
    // would go stale. Hide the magnifier and reveal the native cursor
    // on the artwork surface (via an html class) until the user
    // moves the pointer again.
    let scrollTimerId: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      sourceVideoRef.current = null;
      setM((s) => (s.visible ? { visible: false } : s));
      document.documentElement.classList.add("sl-scrolling");
      if (scrollTimerId) clearTimeout(scrollTimerId);
      scrollTimerId = setTimeout(() => {
        document.documentElement.classList.remove("sl-scrolling");
      }, 140);
    };

    const reEvaluateAtLastPointer = () => {
      if (!lastPointerRef.current) return;
      const { x, y } = lastPointerRef.current;
      evaluate(x, y, targetUnderPointer(x, y));
    };

    // Detect lightbox dismissal (click backdrop / Escape) at the
    // input itself, so we can re-show the magnifier *during* the
    // fade-out rather than waiting for the overlay to unmount.
    const onClick = (e: MouseEvent) => {
      sourceVideoRef.current = null;
      setM((s) => (s.visible ? { visible: false } : s));
      const overlay = document.querySelector(overlaySelector);
      if (overlay && e.target === overlay) {
        dismissedRef.current = true;
        requestAnimationFrame(reEvaluateAtLastPointer);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const overlay = document.querySelector(overlaySelector);
      if (!overlay) return;
      dismissedRef.current = true;
      requestAnimationFrame(reEvaluateAtLastPointer);
    };

    // Watch for the lightbox unmounting — when it closes while the
    // pointer hasn't moved (Esc, click-out, swipe-dismiss), no
    // pointermove fires. Re-evaluate at the last known pointer
    // position so the magnifier reappears immediately if the cursor
    // is still over an artwork.
    const detail = document.querySelector(
      '.exhibition-detail[data-slug="split-logic"]'
    );
    let wasOverlayInDom = !!document.querySelector(overlaySelector);
    let lightboxObserver: MutationObserver | null = null;
    if (detail) {
      lightboxObserver = new MutationObserver(() => {
        const inDom = !!document.querySelector(overlaySelector);
        if (wasOverlayInDom && !inDom) {
          // Overlay actually unmounted. If we already detected the
          // dismissal early (click/Escape) we've re-evaluated; just
          // clear the flag. Otherwise (swipe-dismiss, prog. close)
          // re-evaluate now.
          if (!dismissedRef.current) reEvaluateAtLastPointer();
          dismissedRef.current = false;
        }
        wasOverlayInDom = inDom;
      });
      lightboxObserver.observe(detail, { childList: true, subtree: true });
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (scrollTimerId) clearTimeout(scrollTimerId);
      lightboxObserver?.disconnect();
      document.documentElement.classList.remove("sl-scrolling");
    };
  }, [tones]);

  // Sync the lens video's playhead to the source whenever the source
  // (re)connects. The magnifier video then keeps step on its own loop;
  // both videos are short, so accumulated drift over a single hover
  // session is imperceptible.
  const videoSrc = m.visible ? m.videoSrc : "";
  useEffect(() => {
    const lens = lensVideoRef.current;
    const source = sourceVideoRef.current;
    if (!lens || !source || !videoSrc) return;
    const sync = () => {
      try {
        lens.currentTime = source.currentTime;
      } catch {
        /* readyState too low — wait for loadedmetadata */
      }
      if (!source.paused) lens.play().catch(() => {});
    };
    if (lens.readyState >= 1) sync();
    else lens.addEventListener("loadedmetadata", sync, { once: true });
  }, [videoSrc]);

  const innerStyle = m.visible
    ? {
        position: "absolute" as const,
        width: `${m.w}px`,
        height: `${m.h}px`,
        left: `${m.ox}px`,
        top: `${m.oy}px`,
      }
    : { display: "none" as const };

  const wrapperStyle: CSSProperties = m.visible
    ? {
        opacity: 1,
        left: m.x,
        top: m.y,
        ["--mag-tone" as string]: m.tone,
      }
    : { opacity: 0, left: -9999, top: -9999 };

  return (
    <div
      className="sl-magnifier"
      style={wrapperStyle}
      aria-hidden="true"
    >
      <div className="sl-magnifier-lens">
        {m.visible && m.videoSrc ? (
          <video
            ref={lensVideoRef}
            key={m.videoSrc}
            src={m.videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={innerStyle}
          />
        ) : m.visible && m.imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.imgSrc} alt="" style={innerStyle} draggable={false} />
        ) : null}
      </div>
    </div>
  );
}
