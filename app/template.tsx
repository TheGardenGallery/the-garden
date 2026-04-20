"use client";

import { motion } from "motion/react";

/**
 * Page transition wrapper. Next.js App Router mounts <Template> on every
 * route change, so this gives a quiet fade + 4px lift as routes swap.
 *
 * Easing matches --ease-slow in globals.css for visual consistency with
 * the mobile nav panel and image hover transitions.
 */
export default function Template({ children }: { children: React.ReactNode }) {
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
