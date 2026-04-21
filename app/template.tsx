"use client";

import { motion } from "motion/react";

/**
 * Page transition wrapper. Next.js App Router mounts <Template> on every
 * route change. When experimental.viewTransition is enabled in
 * next.config.ts, the router layers on the browser's View Transitions
 * API for a native crossfade on top of this motion fade.
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
