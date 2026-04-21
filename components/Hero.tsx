import Link from "next/link";
import type { Exhibition } from "@/lib/types";
import { HeroCardReveal } from "./HeroCardReveal";
import { HeroArtwork } from "./HeroArtwork";

type HeroProps = { exhibition: Exhibition };

export function Hero({ exhibition }: HeroProps) {
  const heroImage = exhibition.homepageHero ?? exhibition.hero;

  return (
    <section className="hero">
      <div className="hero-slides">
        <div className="slide active">
          {heroImage && (
            <HeroArtwork
              src={heroImage}
              alt={`${exhibition.artistName}, ${exhibition.title}`}
            />
          )}
        </div>
      </div>

      <Link
        href={`/exhibitions/${exhibition.slug}`}
        className="hero-full-link"
        aria-label={`View ${exhibition.artistName}, ${exhibition.title}`}
      />

      <div className="hero-card">
        <HeroCardReveal>
          <div className="hero-headline">
            <div className="hero-artist">{exhibition.artistName}</div>
            <div className="hero-title">{exhibition.title}</div>
          </div>
          <div className="hero-meta">{exhibition.date}</div>
          <Link
            href={`/exhibitions/${exhibition.slug}`}
            className="hero-link"
          >
            <span className="hero-link-label">View Exhibition</span>
            <span className="hero-link-arrow">→</span>
          </Link>
        </HeroCardReveal>
      </div>
    </section>
  );
}
