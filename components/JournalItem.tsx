import Link from "next/link";
import type { JournalEntry } from "@/lib/types";

type JournalItemProps = { entry: JournalEntry };

function isInternalPath(url: string | undefined): url is string {
  return typeof url === "string" && url.startsWith("/");
}

export function JournalItem({ entry }: JournalItemProps) {
  const body = (
    <>
      <div className="journal-item-content">
        <h3 className="journal-item-headline">{entry.headline}</h3>
        <div className="journal-item-byline">{entry.byline}</div>
        <div className="journal-item-date">{entry.date}</div>
      </div>
      <div className="journal-item-image">
        {entry.hero && <img src={entry.hero} alt="" />}
      </div>
    </>
  );

  if (isInternalPath(entry.externalUrl)) {
    return (
      <Link href={entry.externalUrl} className="journal-item">
        {body}
      </Link>
    );
  }

  if (entry.externalUrl) {
    return (
      <a href={entry.externalUrl} target="_blank" rel="noopener noreferrer" className="journal-item">
        {body}
      </a>
    );
  }

  return (
    <Link href={`/journal/${entry.slug}`} className="journal-item">
      {body}
    </Link>
  );
}
