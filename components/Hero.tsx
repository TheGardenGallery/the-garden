import Link from "next/link";
import Image from "next/image";
import type { Exhibition } from "@/lib/types";

type HeroProps = { exhibition: Exhibition };

export function Hero({ exhibition }: HeroProps) {
  const heroImage = exhibition.homepageHero ?? exhibition.hero;

  return (
    <section className="hero">
      <div className="hero-slides">
        <div className="slide active">
          {heroImage && (
            <Image
              src={heroImage}
              alt={`${exhibition.artistName}, ${exhibition.title}`}
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "contain",
                maxWidth: "100%",
                maxHeight: "100%",
                position: "absolute",
              }}
            />
          )}
        </div>
      </div>

      <div className="hero-card">
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
      </div>
    </section>
  );
}
