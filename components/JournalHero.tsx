import Link from "next/link";
import type { JournalEntry } from "@/lib/types";

type JournalHeroProps = { entry: JournalEntry };

export function JournalHero({ entry }: JournalHeroProps) {
  const headline = renderTightColons(entry.headline);

  return (
    <Link href={`/journal/${entry.slug}`} className="journal-hero">
      <div className="journal-hero-image">
        {entry.hero && <img src={entry.hero} alt="" />}
      </div>
      <div className="journal-hero-content">
        <h3 className="journal-hero-headline">{headline}</h3>
        <div className="journal-hero-byline">{entry.byline}</div>
        {entry.excerpt && (
          <p className="journal-hero-excerpt">{entry.excerpt}</p>
        )}
        <div className="journal-hero-meta">
          <span>{entry.date}</span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Cormorant italic colons have wide right-side bearing — tighten space after.
 */
function renderTightColons(text: string) {
  if (!text.includes(":")) return text;
  const parts = text.split(":");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <span className="tight-colon">:</span>}
        </span>
      ))}
    </>
  );
}
