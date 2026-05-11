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
 *  5. **Pauses** when scrolled out of view or tab is hidden (power savings)
 */
export function AutoPlayVideo(props: ComponentProps<"video">) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Track visibility — starts null (unknown) so the initial eager
    // play() isn't blocked.  IO sets the real value on first callback.
    let isVisible: boolean | null = null;

    const tryPlay = () => {
      // Allow play when: visibility unknown (first mount) OR confirmed visible
      if (el.paused && isVisible !== false && !document.hidden) {
        el.muted = true;           // Belt-and-suspenders: ensure muted
        el.play().catch(() => {});
      }
    };

    const pauseIfSafe = () => {
      if (!el.paused) el.pause();
    };

    // Try immediately (covers already-cached videos + iOS autoplay window)
    tryPlay();

    // Try again when data is ready
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);

    // Play/pause when the video enters/exits the viewport
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
        if (isVisible) tryPlay();
        else pauseIfSafe();
      },
      { threshold: 0.1 }
    );
    io.observe(el);

    // Pause when the tab goes hidden, resume when visible
    const onVisibility = () => {
      if (document.hidden) pauseIfSafe();
      else if (isVisible !== false) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisibility);
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
