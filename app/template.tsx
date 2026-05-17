"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
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
  const pathname = usePathname();

  // Explicit scroll-reset on every fresh route change. Next's default
  // already scrolls to top on push navigation, but on iOS Safari the
  // URL-bar transition reflows `dvh`-sized heroes *after* the
  // initial paint — by which point the browser's scroll position is
  // stale relative to the new layout, and the page lands a few
  // dozen pixels down ("cut off at the top"). Forcing scroll to 0
  // here on pathname change re-aligns after the motion fade mount,
  // and is a no-op on desktop where the layout doesn't shift.
  // Back/forward navigation runs through Next's own scroll
  // restoration before this fires, so previously-saved scroll
  // positions for the popstate case still take precedence as
  // expected (this effect's reset is idempotent if scroll was
  // already 0).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
