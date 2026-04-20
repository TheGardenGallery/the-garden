"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Thin client wrapper that reveals the hero card on mount.
 *
 * Kept as its own component so the parent <Hero> can stay a server
 * component (lets Next.js statically render the hero image).
 */
export function HeroCardReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
