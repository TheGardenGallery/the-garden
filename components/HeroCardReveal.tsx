"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { EASE_SLOW } from "@/lib/motion";

type WelcomeWindow = Window & { __gardenWelcome?: string };

/* the welcome gate is about to play on this load (set before first paint
   by app/layout.tsx, cleared by WelcomeOverlay's release) */
const gatePending = () =>
  typeof window !== "undefined" &&
  (window as WelcomeWindow).__gardenWelcome === "pending";

/* never wait on a gate that never lets go */
const RELEASE_TIMEOUT_MS = 6000;

/**
 * Thin client wrapper that reveals the hero card on mount.
 *
 * Kept as its own component so the parent <Hero> can stay a server
 * component (lets Next.js statically render the hero image).
 *
 * On a first visit the reveal used to finish under the welcome gate, so
 * nobody saw it. While the gate is pending the card holds at its start
 * state and rises when the gate releases, together with the header.
 * The SSR markup is identical either way (motion renders `initial`).
 */
export function HeroCardReveal({ children }: { children: ReactNode }) {
  const [hold, setHold] = useState(gatePending);

  useEffect(() => {
    if (!hold) return;
    const release = () => setHold(false);
    if (!gatePending()) { release(); return; }
    window.addEventListener("garden:welcome-release", release, { once: true });
    const t = window.setTimeout(release, RELEASE_TIMEOUT_MS);
    return () => {
      window.removeEventListener("garden:welcome-release", release);
      window.clearTimeout(t);
    };
  }, [hold]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={hold ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.15,
        ease: EASE_SLOW,
      }}
    >
      {children}
    </motion.div>
  );
}
