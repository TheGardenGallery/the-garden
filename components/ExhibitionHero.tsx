import Image from "next/image";
import type { Exhibition } from "@/lib/types";
import { HeroIframeMedia } from "./HeroIframeMedia";
import { AutoPlayVideo } from "./AutoPlayVideo";

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
          <div className="ex-title-artist">
            {exhibition.verseSeriesUrl ? (
              <a
                href={exhibition.verseSeriesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ex-title-title-link"
                aria-label={`View ${exhibition.artistName} on Verse`}
              >
                {exhibition.artistName}
              </a>
            ) : (
              exhibition.artistName
            )}
          </div>
          <h1 className="ex-title-title">
            {exhibition.verseSeriesUrl ? (
              <a
                href={exhibition.verseSeriesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ex-title-title-link"
                aria-label={`View ${exhibition.title} series on Verse`}
              >
                {exhibition.title}
              </a>
            ) : (
              exhibition.title
            )}
          </h1>
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
  const media = exhibition.heroIframe ? (
    <HeroIframeMedia
      src={exhibition.heroIframe}
      title={label}
      aspect={exhibition.heroIframeAspect}
      randomize={exhibition.heroIframeRandomize}
    />
  ) : exhibition.heroVideo ? (
    <AutoPlayVideo
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

  // Live iframes must stay interactive, so don't wrap them in an
  // anchor — the artwork itself accepts mouse/keyboard input.
  const heroHref = exhibition.heroVerseUrl ?? exhibition.verseSeriesUrl;
  if (heroHref && !exhibition.heroIframe) {
    const heroLabel = exhibition.heroVerseUrl
      ? `View this work on Verse`
      : `View ${exhibition.title} series on Verse`;
    return (
      <a
        className="ex-hero-plate"
        style={transitionStyle}
        href={heroHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={heroLabel}
      >
        {media}
      </a>
    );
  }
  return <figure className="ex-hero-plate" style={transitionStyle}>{media}</figure>;
}
