import React from "react";
import ReactMarkdown from "react-markdown";
import type { Exhibition } from "@/lib/types";
import { preserveHyphens } from "@/lib/typography";
import { InlineArtworks } from "@/components/InlineArtworks";
import { TerminalDescription } from "@/components/TerminalDescription";
import { AllowlistMintBeat } from "@/components/AllowlistMintBeat";
import { SL_ALLOWLIST_OPEN_FALLBACK } from "@/lib/split-logic-mint";

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
        exhibition.descriptionTypewriter ? (
          <TerminalDescription
            paragraphs={exhibition.description}
            labels={exhibition.descriptionLabels}
            inlineArtworks={exhibition.inlineArtworks}
            inlineProcess={exhibition.processVideos?.inline}
            fallbackUrl={exhibition.verseSeriesUrl}
            fallbackYear={exhibition.year}
            fallbackWorkCount={exhibition.workCount}
          />
        ) : (
          <OverviewSegments exhibition={exhibition} />
        )
      ) : exhibition.descriptionMarkdown ? (
        <div className="ex-overview-body">
          <ReactMarkdown>{exhibition.descriptionMarkdown}</ReactMarkdown>
        </div>
      ) : null}
    </section>
  );
}

function ExhibitionFacts({ exhibition }: { exhibition: Exhibition }) {
  const facts: { label: string; value: string; href?: string; node?: React.ReactNode }[] = [];
  if (exhibition.workCount) facts.push({ label: "Works", value: String(exhibition.workCount) });
  if (exhibition.allowlistDate && exhibition.publicSaleDate) {
    facts.push({
      label: "Allowlist",
      value: exhibition.allowlistDate,
      // Split Logic's allowlist row goes live during the presale window via
      // the shared phase machinery; other shows keep the static date.
      node:
        exhibition.slug === "split-logic" ? (
          <AllowlistMintBeat
            fallback={SL_ALLOWLIST_OPEN_FALLBACK}
            style="long"
          />
        ) : undefined,
    });
    facts.push({ label: "Public sale", value: exhibition.publicSaleDate });
  } else if (exhibition.date) {
    facts.push({
      label: exhibition.status === "upcoming" ? "Opens" : "Released",
      value: exhibition.date,
    });
  }
  if (exhibition.location)
    facts.push({ label: "Platform", value: exhibition.location, href: exhibition.locationUrl });
  if (exhibition.chain) facts.push({ label: "Chain", value: exhibition.chain });
  if (exhibition.tokenStandard) facts.push({ label: "Token standard", value: exhibition.tokenStandard });
  if (exhibition.storage) facts.push({ label: "Storage", value: exhibition.storage });
  if (!facts.length) return null;
  return (
    <aside className="ex-facts" aria-label="Exhibition facts">
      {facts.map((f) => (
        <div key={f.label} className="ex-fact">
          <span className="ex-fact-label">{f.label}</span>
          {f.href ? (
            <a
              className="ex-fact-value ex-fact-value-link"
              href={f.href}
              target="_blank"
              rel="noopener"
            >
              {f.value}
            </a>
          ) : (
            <span className="ex-fact-value">{f.node ?? f.value}</span>
          )}
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
