"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

/**
 * ArtistBroadsheet — a visible section that presents the artist's own
 * description at a different typographic scale from the curatorial prose.
 * Indexed paragraphs in monospace, extreme leading. Designed to sit after
 * the works grid as a closing statement.
 */
export function ArtistBroadsheet({
  paragraphs,
  attribution,
}: {
  paragraphs: string[];
  attribution?: string;
}) {
  const { ref, visible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`broadsheet${visible ? " broadsheet--visible" : ""}`}
      aria-label="Artist's note"
    >
      <div className="broadsheet-inner">
        <span className="broadsheet-heading">Artist&rsquo;s note</span>

        <div className="broadsheet-body">
          {paragraphs.map((html, i) => (
            <div key={i} className="broadsheet-entry">
              <span className="broadsheet-idx">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          ))}
        </div>

        {attribution && (
          <span className="broadsheet-attribution">{attribution}</span>
        )}
      </div>
    </section>
  );
}
