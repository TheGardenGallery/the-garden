import React from "react";
import ReactMarkdown from "react-markdown";
import type { Exhibition } from "@/lib/types";
import { preserveHyphens } from "@/lib/typography";
import { InlineArtworks } from "@/components/InlineArtworks";

/**
 * Exhibition overview section: facts sidebar + prose column. Prose is
 * either an array of paragraph HTML strings (segmented by inline
 * artwork breaks) or a single markdown block when `descriptionMarkdown`
 * is provided instead.
 */
export function ExhibitionOverview({ exhibition }: { exhibition: Exhibition }) {
  return (
    <section className="ex-overview">
      <ExhibitionFacts exhibition={exhibition} />
      {exhibition.description && exhibition.description.length > 0 ? (
        <OverviewSegments exhibition={exhibition} />
      ) : exhibition.descriptionMarkdown ? (
        <div className="ex-overview-body">
          <ReactMarkdown>{exhibition.descriptionMarkdown}</ReactMarkdown>
        </div>
      ) : null}
    </section>
  );
}

function ExhibitionFacts({ exhibition }: { exhibition: Exhibition }) {
  const facts: { label: string; value: string }[] = [];
  if (exhibition.workCount) facts.push({ label: "Works", value: String(exhibition.workCount) });
  if (exhibition.date)
    facts.push({
      label: exhibition.status === "upcoming" ? "Opens" : "Released",
      value: exhibition.date,
    });
  if (exhibition.location) facts.push({ label: "Platform", value: exhibition.location });
  if (!facts.length) return null;
  return (
    <aside className="ex-facts" aria-label="Exhibition facts">
      {facts.map((f) => (
        <div key={f.label} className="ex-fact">
          <span className="ex-fact-label">{f.label}</span>
          <span className="ex-fact-value">{f.value}</span>
        </div>
      ))}
    </aside>
  );
}

function OverviewSegments({ exhibition }: { exhibition: Exhibition }) {
  const paragraphs = exhibition.description ?? [];
  const breaks = (exhibition.inlineArtworks ?? [])
    .filter(
      (b) =>
        b.afterParagraphIndex >= 0 && b.afterParagraphIndex < paragraphs.length
    )
    .sort((a, b) => a.afterParagraphIndex - b.afterParagraphIndex);

  const renderBody = (paras: string[], includeHeader: boolean, key: string) => (
    <div key={key} className="ex-overview-body">
      {includeHeader && exhibition.descriptionByArtist && (
        <p className="ex-description-byline">(Text by {exhibition.artistName})</p>
      )}
      {paras.map((para, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: preserveHyphens(para) }} />
      ))}
    </div>
  );

  const segments: { paras: string[]; breakAt?: typeof breaks[number] }[] = [];
  let cursor = 0;
  for (const br of breaks) {
    segments.push({
      paras: paragraphs.slice(cursor, br.afterParagraphIndex + 1),
      breakAt: br,
    });
    cursor = br.afterParagraphIndex + 1;
  }
  if (cursor < paragraphs.length) {
    segments.push({ paras: paragraphs.slice(cursor) });
  }

  return (
    <>
      {segments.map((seg, i) => (
        <React.Fragment key={i}>
          {renderBody(seg.paras, i === 0, `body-${i}`)}
          {seg.breakAt && (
            <InlineArtworks
              group={seg.breakAt}
              fallbackUrl={exhibition.verseSeriesUrl}
              fallbackYear={exhibition.year}
              fallbackWorkCount={exhibition.workCount}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
}
