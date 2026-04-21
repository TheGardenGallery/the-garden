"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

type HeroArtworkProps = {
  src: string;
  alt: string;
};

/**
 * Hero artwork with a slow Ken Burns breath.
 *
 * Scales 1.000 → 1.035 and back over 44s with an ease-in-out curve, so
 * the artwork appears to be quietly alive without ever announcing the
 * motion itself. 3.5% is deliberately below the threshold of conscious
 * perception — you feel it, you don't see it.
 *
 * Respects prefers-reduced-motion (disabled entirely in that case).
 */
export function HeroArtwork({ src, alt }: HeroArtworkProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="slide-frame"
      initial={{ scale: 1 }}
      animate={reduced ? { scale: 1 } : { scale: 1.035 }}
      transition={
        reduced
          ? undefined
          : {
              duration: 22,
              repeat: Infinity,
              repeatType: "reverse",
              ease: [0.45, 0, 0.55, 1],
            }
      }
      style={{ transformOrigin: "50% 50%", willChange: "transform" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "contain" }}
      />
    </motion.div>
  );
}
