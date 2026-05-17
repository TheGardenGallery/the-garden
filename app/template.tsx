"use client";

import { motion } from "motion/react";
import { EASE_SLOW } from "@/lib/motion";

/**
 * Page transition wrapper. Next.js App Router mounts <Template> on every
 * route change. When experimental.viewTransition is enabled in
 * next.config.ts, the router layers on the browser's View Transitions
 * API for a native crossfade on top of this motion fade.
 *
 * Note: only `opacity` is animated. A `y` transform would leave an
 * inline `transform: translate(...)` on this wrapper after the
 * animation settled — which would establish a containing block for
 * every `position: fixed` descendant, scrolling fixed page chrome
 * (e.g. the About page's Principles link) with the content instead
 * of pinning it to the viewport. The 4px slide-in wasn't load-
 * bearing; opacity-only fade keeps the transition without the
 * containing-block side effect.
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: EASE_SLOW }}
    >
      {children}
    </motion.div>
  );
}
