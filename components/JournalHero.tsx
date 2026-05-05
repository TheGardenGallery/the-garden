import Link from "next/link";
import type { JournalEntry } from "@/lib/types";

type JournalHeroProps = { entry: JournalEntry };

/** Detect whether an externalUrl is actually an internal path (starts
 *  with "/"). Internal paths should route through Next's `<Link>` (no
 *  full reload) and NOT open in a new tab. External URLs open in a new
 *  tab with the usual rel protections. */
function isInternalPath(url: string | undefined): url is string {
  return typeof url === "string" && url.startsWith("/");
}

export function JournalHero({ entry }: JournalHeroProps) {
  const imageClass = entry.disableHoverZoom
    ? "journal-hero-image no-hover-zoom"
    : "journal-hero-image";
  const body = (
    <>
      <div
        className={imageClass}
        style={entry.heroAspect ? { aspectRatio: entry.heroAspect } : undefined}
      >
        {entry.heroVideo ? (
          <video
            src={entry.heroVideo}
            poster={entry.hero}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          entry.hero && <img src={entry.hero} alt="" />
        )}
      </div>
      <div className="journal-hero-content">
        {entry.kicker && (
          <div className="journal-hero-kicker">{entry.kicker}</div>
        )}
        <h3 className="journal-hero-headline">{entry.headline}</h3>
        <div className="journal-hero-byline">{entry.byline}</div>
        {entry.excerpt && (
          <p className="journal-hero-excerpt">{entry.excerpt}</p>
        )}
        <div className="journal-hero-meta">
          <span>{entry.date}</span>
        </div>
      </div>
    </>
  );

  // Internal path passed via externalUrl — use Link, same-tab.
  if (isInternalPath(entry.externalUrl)) {
    return (
      <Link href={entry.externalUrl} className="journal-hero">
        {body}
      </Link>
    );
  }

  if (entry.externalUrl) {
    return (
      <a href={entry.externalUrl} target="_blank" rel="noopener noreferrer" className="journal-hero">
        {body}
      </a>
    );
  }

  return (
    <Link href={`/journal/${entry.slug}`} className="journal-hero">
      {body}
    </Link>
  );
}
