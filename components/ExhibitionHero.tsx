import Image from "next/image";
import type { Exhibition } from "@/lib/types";

/**
 * Full-viewport exhibition hero. Mirrors the homepage hero so clicking a
 * hero card reads as the same element settling into place on the detail
 * page. Paper backdrop, artwork centered, title card pinned bottom-left —
 * with per-exhibition overrides in globals.css keyed on `data-slug`.
 */
export function ExhibitionHero({ exhibition }: { exhibition: Exhibition }) {
  const heroTheme = exhibition.heroTheme ?? "paper";
  return (
    <section
      className="ex-hero"
      data-theme={heroTheme}
      data-slug={exhibition.slug}
      aria-label="Featured artwork"
    >
      <div className="ex-hero-frame">
        <HeroMedia exhibition={exhibition} />
      </div>

      <header
        className="ex-title-bar"
        aria-labelledby="exTitle"
        style={{ viewTransitionName: "ex-title-bar" }}
      >
        <div className="ex-title-headline" id="exTitle">
          <div className="ex-title-artist">{exhibition.artistName}</div>
          <h1 className="ex-title-title">{exhibition.title}</h1>
        </div>
      </header>
    </section>
  );
}

function HeroMedia({ exhibition }: { exhibition: Exhibition }) {
  const label = `${exhibition.artistName}, ${exhibition.title} (featured work)`;
  // Pairs with the exhibition card on the listings page under the
  // same name, so the card image morphs into the hero position
  // on navigation.
  const transitionStyle = {
    viewTransitionName: `ex-hero-${exhibition.slug}`,
  };
  const media = exhibition.heroVideo ? (
    <video
      className="ex-hero-video"
      src={exhibition.heroVideo}
      poster={exhibition.heroVideoPoster ?? exhibition.hero}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={label}
    />
  ) : exhibition.hero ? (
    <Image
      src={exhibition.hero}
      alt={label}
      width={1240}
      height={1550}
      priority
      unoptimized={exhibition.hero.endsWith(".gif")}
    />
  ) : null;

  if (!media) return <figure className="ex-hero-plate" style={transitionStyle} />;

  if (exhibition.verseSeriesUrl) {
    return (
      <a
        className="ex-hero-plate"
        style={transitionStyle}
        href={exhibition.verseSeriesUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${exhibition.title} series on Verse`}
      >
        {media}
      </a>
    );
  }
  return <figure className="ex-hero-plate" style={transitionStyle}>{media}</figure>;
}
