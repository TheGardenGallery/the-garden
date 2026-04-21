"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Exhibition } from "@/lib/types";
import { HeroCardReveal } from "./HeroCardReveal";
import { HeroArtwork } from "./HeroArtwork";

type HeroProps = {
  exhibitions: Exhibition[];
};

const DWELL_MS = 10000;
const CROSSFADE_S = 2.6;
const CARD_FADE_S = 1.4;
const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ exhibitions }: HeroProps) {
  const reduced = useReducedMotion();
  const slides = useMemo(
    () => exhibitions.filter((e) => (e.homepageHero ?? e.hero) != null),
    [exhibitions]
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || slides.length < 2 || paused) return;
    const id = window.setInterval(
      () => setIndex((n) => (n + 1) % slides.length),
      DWELL_MS
    );
    return () => window.clearInterval(id);
  }, [reduced, slides.length, paused]);

  if (slides.length === 0) return null;
  const ex = slides[index % slides.length];
  const heroImage = ex.homepageHero ?? ex.hero!;
  const theme = ex.heroTheme ?? "dark";

  return (
    <section
      className="hero"
      data-theme={theme}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-slides">
        <AnimatePresence initial={false}>
          <motion.div
            key={ex.slug}
            className="slide active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: CROSSFADE_S, ease: EASE }}
          >
            <HeroArtwork
              src={heroImage}
              alt={`${ex.artistName}, ${ex.title}`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <Link
        href={`/exhibitions/${ex.slug}`}
        className="hero-full-link"
        aria-label={`View ${ex.artistName}, ${ex.title}`}
      />

      <div className="hero-card">
        <HeroCardReveal>
          <div className="hero-card-stage">
            <AnimatePresence initial={false}>
              <motion.div
                key={ex.slug}
                className="hero-card-slide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: CARD_FADE_S, ease: EASE }}
              >
                <div className="hero-headline">
                  <div className="hero-artist">{ex.artistName}</div>
                  <div className="hero-title">{ex.title}</div>
                </div>
                <div className="hero-meta">{ex.date}</div>
                <Link
                  href={`/exhibitions/${ex.slug}`}
                  className="hero-link"
                >
                  <span className="hero-link-label">View Exhibition</span>
                  <span className="hero-link-arrow">→</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </HeroCardReveal>
      </div>
    </section>
  );
}
