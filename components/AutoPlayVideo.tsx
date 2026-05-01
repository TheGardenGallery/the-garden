"use client";

import { useEffect, useRef, type ComponentProps } from "react";

/**
 * Client video wrapper that forces autoplay on iOS Safari.
 *
 * iOS ignores `autoPlay` on dynamically mounted / SSR-hydrated videos.
 * This component:
 *  1. Ensures `muted` + `playsInline` (required by iOS for autoplay)
 *  2. Calls `.play()` once the video has enough data (`loadeddata`)
 *  3. Retries on `canplay` if the first attempt fails
 *  4. Uses IntersectionObserver to play when scrolled into view
 */
export function AutoPlayVideo(props: ComponentProps<"video">) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tryPlay = () => {
      if (el.paused) {
        el.muted = true;           // Belt-and-suspenders: ensure muted
        el.play().catch(() => {});
      }
    };

    // Try immediately (covers already-cached videos)
    tryPlay();

    // Try again when data is ready
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);

    // Also try when the video scrolls into view
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) tryPlay();
      },
      { threshold: 0.1 }
    );
    io.observe(el);

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      io.disconnect();
    };
  }, []);

  return (
    <video
      {...props}
      ref={ref}
      muted
      playsInline
      autoPlay
    />
  );
}
