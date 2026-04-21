import Link from "next/link";
import type { JournalEntry } from "@/lib/types";

type JournalHeroProps = { entry: JournalEntry };

export function JournalHero({ entry }: JournalHeroProps) {
  const imageClass = entry.disableHoverZoom
    ? "journal-hero-image no-hover-zoom"
    : "journal-hero-image";
  const body = (
    <>
      <div className={imageClass}>
        {entry.hero && <img src={entry.hero} alt="" />}
      </div>
      <div className="journal-hero-content">
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
