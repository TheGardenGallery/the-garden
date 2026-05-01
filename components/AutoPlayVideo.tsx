"use client";

import { type ComponentProps } from "react";

/** Thin client wrapper that calls .play() on mount — iOS Safari
 *  often ignores the autoPlay attribute on server-rendered video. */
export function AutoPlayVideo(props: ComponentProps<"video">) {
  return (
    <video
      {...props}
      ref={(el) => { if (el) el.play().catch(() => {}); }}
    />
  );
}
