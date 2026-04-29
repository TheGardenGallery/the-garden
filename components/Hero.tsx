"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Exhibition } from "@/lib/types";
import type { Palette } from "@/lib/palette";
import { HeroCardReveal } from "./HeroCardReveal";
import { HeroArtwork } from "./HeroArtwork";
import { EASE_SLOW } from "@/lib/motion";

export type HeroSlide = {
  exhibition: Exhibition;
  palette: Palette;
};

type HeroProps = { slides: HeroSlide[] };

const DWELL_MS = 10000;
// Upcoming-exhibition video slides hold for 2 minutes — the piece
// commands the homepage when a viewer first lands, before the
// rotation moves on to other works.
const VIDEO_DWELL_MS = 120000;
const CROSSFADE_S = 2.0;
// Card uses AnimatePresence mode="wait" — old fully exits before new
// enters — so each phase is half the total. With CARD_FADE_S = 1.0
// per phase, the full out+in cycle takes 2.0s, matching the slide's
// parallel crossfade. The "pure-bg moment" between the old card
// leaving and the new arriving reads as a deliberate beat rather than
// a half-faded mash of two artists' names.
const CARD_FADE_S = 1.0;
const EASE = EASE_SLOW;

export function Hero({ slides }: HeroProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [arrowZone, setArrowZone] = useState<null | "left" | "right">(null);

  useEffect(() => {
    if (reduced || slides.length < 2 || paused) return;
    const currentSlide = slides[index % slides.length];
    const dwell = currentSlide.exhibition.homepageHeroVideo
      ? VIDEO_DWELL_MS
      : DWELL_MS;
    const id = window.setTimeout(
      () => setIndex((n) => (n + 1) % slides.length),
      dwell
    );
    return () => window.clearTimeout(id);
  }, [reduced, slides, paused, index]);

  if (slides.length === 0) return null;
  const current = slides[index % slides.length];
  const { exhibition: ex } = current;
  const theme = ex.heroTheme ?? (current.palette.isDark ? "dark" : "paper");

  const prev = () =>
    setIndex((n) => (n - 1 + slides.length) % slides.length);
  const next = () => setIndex((n) => (n + 1) % slides.length);

  return (
    <section
      className="hero"
      data-theme={theme}
      data-slug={ex.slug}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setArrowZone(null);
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const frac = (e.clientX - rect.left) / rect.width;
        if (frac < 0.22) setArrowZone("left");
        else if (frac > 0.78) setArrowZone("right");
        else setArrowZone(null);
      }}
    >
      <div className="hero-slides">
        {slides.map((s, i) => {
          const video = s.exhibition.homepageHeroVideo;
          const img = s.exhibition.homepageHero ?? s.exhibition.hero;
          return (
            <motion.div
              key={s.exhibition.slug}
              className="slide"
              initial={false}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: CROSSFADE_S, ease: EASE }}
            >
              <Link
                href={`/exhibitions/${s.exhibition.slug}`}
                className="slide-link"
                tabIndex={i === index ? 0 : -1}
                aria-label={`View ${s.exhibition.artistName}, ${s.exhibition.title}`}
              >
                {video ? (
                  <video
                    className="slide-video"
                    src={video}
                    poster={s.exhibition.homepageHeroVideoPoster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label={`${s.exhibition.artistName}, ${s.exhibition.title}`}
                  />
                ) : (
                  <HeroArtwork
                    src={img!}
                    alt={`${s.exhibition.artistName}, ${s.exhibition.title}`}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="hero-card">
        <HeroCardReveal>
          <div className="hero-card-stage">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={ex.slug}
                className="hero-card-slide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: CARD_FADE_S, ease: EASE }}
              >
                <Link
                  href={`/exhibitions/${ex.slug}`}
                  className="hero-card-link"
                >
                  <div className="hero-headline">
                    <div className="hero-artist">{ex.artistName}</div>
                    <div className="hero-title">{ex.title}</div>
                  </div>
                  <div className="hero-meta">
                    {ex.status === "upcoming"
                      ? `Upcoming · ${ex.date}`
                      : ex.date}
                  </div>
                  <span className="hero-link">
                    <span className="hero-link-label">
                      {ex.status === "upcoming"
                        ? "Get notified"
                        : "View Exhibition"}
                    </span>
                    <span className="hero-link-arrow">→</span>
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </HeroCardReveal>
      </div>

      {slides.length > 1 && (
        <div className="hero-nav" aria-label="Hero navigation">
          <button
            type="button"
            className="hero-nav-btn hero-nav-prev"
            data-visible={arrowZone === "left"}
            onClick={prev}
            aria-label="Previous exhibition"
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 5 L8 12 L15 19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="hero-nav-btn hero-nav-next"
            data-visible={arrowZone === "right"}
            onClick={next}
            aria-label="Next exhibition"
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9 5 L16 12 L9 19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
