import Link from "next/link";
import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { fetchExhibition, fetchExhibitions } from "@/lib/verse-api";
import type { Exhibition } from "@/lib/types";
import { WorksGrid } from "@/components/WorksGrid";
import { FeaturedArtworks } from "@/components/FeaturedArtworks";
import { ExhibitionDetails } from "@/components/ExhibitionDetails";

/**
 * Light typographic cleanup on exhibition prose:
 *   - Hyphens between letters/digits become U+2011 (non-breaking hyphen) so
 *     compound words like "dot-matrix" don't break across lines.
 *   - Spaces inside <em>…</em> titles become U+00A0 (non-breaking space) so
 *     an italic title like "The Flood: Orchestrated" never breaks — and in
 *     particular, the colon can't strand at the end of a line.
 * Skips HTML tags so attribute values are unaffected.
 */
function preserveHyphens(html: string): string {
  const hyphenated = html.replace(/(<[^>]*>)|([^<]+)/g, (_m, tag, text) => {
    if (tag) return tag;
    return (text as string).replace(/(\p{L}|\d)-(\p{L}|\d)/gu, "$1\u2011$2");
  });
  return hyphenated.replace(/<em>([^<]*)<\/em>/g, (_m, content) =>
    `<em>${(content as string).replace(/ /g, "\u00A0")}</em>`
  );
}

export async function generateStaticParams() {
  const all = await fetchExhibitions();
  return all.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ex = await fetchExhibition(slug);
  if (!ex) return { title: "Not found | The Garden" };
  return { title: `${ex.title} · ${ex.artistName} | The Garden` };
}

export default async function ExhibitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exhibition = await fetchExhibition(slug);
  if (!exhibition) notFound();

  const heroTheme = exhibition.heroTheme ?? "paper";
  return (
    <div className="exhibition-detail" data-slug={exhibition.slug}>
      {/* Kick off the hero video fetch during HTML parse so the browser
          starts buffering before React hydrates the <video>. Without
          this, autoplay begins with an empty buffer on slow connections
          and the first seconds stutter. */}
      {exhibition.heroVideo && (
        <link
          rel="preload"
          as="video"
          href={exhibition.heroVideo}
          type="video/mp4"
        />
      )}
      {/* 01 · HERO — full-viewport, mirrors the homepage Hero: paper
          backdrop, artwork centered, title card pinned bottom-left, so
          clicking a hero card reads as the same element settling into
          place. */}
      <section
        className="ex-hero"
        data-theme={heroTheme}
        data-slug={exhibition.slug}
        aria-label="Featured artwork"
      >
        <div className="ex-hero-frame">
          <HeroMedia exhibition={exhibition} />
        </div>

        <header className="ex-title-bar" aria-labelledby="exTitle">
          <div className="ex-title-headline" id="exTitle">
            <div className="ex-title-artist">{exhibition.artistName}</div>
            <h1 className="ex-title-title">{exhibition.title}</h1>
          </div>
        </header>
      </section>

      {/* 03 · OVERVIEW — single centered column. Exhibition facts sit
          as a vertical sidenote in the right margin (museum wall-card)
          rather than as a plate above the essay. */}
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

      {/* 04 · DETAILS — hi-fidelity crops of a single work. */}
      {exhibition.details && exhibition.details.crops.length > 0 && (
        <ExhibitionDetails
          details={exhibition.details}
          title={exhibition.title}
        />
      )}

      {/* 05 · FEATURED */}
      {exhibition.featuredArtworks && exhibition.featuredArtworks.length > 0 && (
        <FeaturedArtworks items={exhibition.featuredArtworks} />
      )}

      {/* 04b · WORKS */}
      {exhibition.works && exhibition.works.length > 0 && (
        <WorksSection works={exhibition.works} />
      )}

      {/* 05 · COLOPHON */}
      <Colophon exhibition={exhibition} />

      {/* 06 · PREV / NEXT */}
      {(exhibition.prev || exhibition.next) && (
        <PrevNext exhibition={exhibition} />
      )}
    </div>
  );
}

function HeroMedia({ exhibition }: { exhibition: Exhibition }) {
  const label = `${exhibition.artistName}, ${exhibition.title} (featured work)`;
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
    />
  ) : null;

  if (!media) return <figure className="ex-hero-plate" />;

  if (exhibition.verseSeriesUrl) {
    return (
      <a
        className="ex-hero-plate"
        href={exhibition.verseSeriesUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${exhibition.title} series on Verse`}
      >
        {media}
      </a>
    );
  }
  return <figure className="ex-hero-plate">{media}</figure>;
}

function OverviewSegments({ exhibition }: { exhibition: Exhibition }) {
  const paragraphs = exhibition.description ?? [];
  const breaks = (exhibition.inlineArtworks ?? [])
    .filter(
      (b) =>
        b.afterParagraphIndex >= 0 && b.afterParagraphIndex < paragraphs.length - 1
    )
    .sort((a, b) => a.afterParagraphIndex - b.afterParagraphIndex);

  const renderBody = (paras: string[], includeHeader: boolean, key: string) => (
    <div key={key} className="ex-overview-body">
      {includeHeader && exhibition.descriptionByArtist && (
        <p className="ex-description-byline">Text by {exhibition.artistName}</p>
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
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
}

function ExhibitionFacts({ exhibition }: { exhibition: Exhibition }) {
  const facts: { label: string; value: string }[] = [];
  if (exhibition.workCount) facts.push({ label: "Works", value: String(exhibition.workCount) });
  if (exhibition.date) facts.push({ label: "Released", value: exhibition.date });
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

function InlineArtworks({
  group,
  fallbackUrl,
}: {
  group: NonNullable<Exhibition["inlineArtworks"]>[number];
  fallbackUrl?: string;
}) {
  return (
    <div className="ex-inline-artworks">
      {group.items.map((item, j) => {
        const href = item.verseUrl ?? fallbackUrl;
        const figure = (
          <figure className="ex-inline-figure">
            {item.video ? (
              <div className="ex-inline-plate">
                <div className="ex-inline-media">
                  <video
                    src={item.video}
                    poster={item.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label={item.alt}
                  />
                </div>
              </div>
            ) : (
              <div className="ex-inline-image">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={1200}
                  height={1500}
                  sizes="(min-width: 900px) 40vw, 92vw"
                />
              </div>
            )}
            {item.title && (
              <figcaption className="ex-inline-caption">
                <em>{item.title}</em>
              </figcaption>
            )}
          </figure>
        );
        return href ? (
          <a
            key={j}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="ex-inline-artwork"
          >
            {figure}
          </a>
        ) : (
          <div key={j} className="ex-inline-artwork">{figure}</div>
        );
      })}
    </div>
  );
}

function WorksSection({ works }: { works: Exhibition["works"] }) {
  return (
    <section className="ex-works" aria-labelledby="worksHead">
      <div className="ex-works-inner">
        <header className="ex-works-head">
          <h2 className="ex-works-head-title" id="worksHead">
            Selected works
          </h2>
        </header>
        <WorksGrid works={works!} />
      </div>
    </section>
  );
}

function Colophon({ exhibition }: { exhibition: Exhibition }) {
  return (
    <section className="ex-colophon">
      <div className="ex-colophon-inner">
        <ColBlock
          label="About the artist"
          title={exhibition.artistName}
          body={
            exhibition.artistBio ??
            "Multidisciplinary artist working across digital and generative systems."
          }
          links={[
            {
              label: "Artist profile",
              href: `/artists/${exhibition.artistSlug}`,
              icon: "→",
            },
          ]}
        />
        {exhibition.documents && (
          <ColBlock
            label="Documents"
            title="Press & reading"
            body="A press release and curator's note accompany the exhibition, including technical notes on the generative process and a conversation with the artist."
            links={[
              ...(exhibition.documents.pressPdfUrl
                ? [{ label: "Press release (PDF)", href: exhibition.documents.pressPdfUrl, icon: "↓" }]
                : []),
              ...(exhibition.documents.interviewUrl
                ? [{ label: "Artist interview", href: exhibition.documents.interviewUrl, icon: "→" }]
                : []),
            ]}
          />
        )}
        <ColBlock
          label="Enquiries"
          title="Works available"
          body={`All ${exhibition.workCount ?? "available"} works remain viewable and collectable on Verse, with full provenance and trading history. For press and private enquiries, contact the curator directly.`}
          links={[
            {
              label: "View on Verse",
              href: exhibition.verseSeriesUrl ?? "https://verse.works",
              icon: "↗",
              external: true,
            },
            {
              label: "Enquire",
              href: `mailto:chilltulpa@gmail.com?subject=${encodeURIComponent(
                `Enquiry: ${exhibition.artistName}, ${exhibition.title}`
              )}`,
              icon: "→",
            },
          ]}
        />
      </div>
    </section>
  );
}

function ColBlock({
  label,
  title,
  body,
  links,
}: {
  label: string;
  title: string;
  body: string;
  links: { label: string; href: string; icon: string; external?: boolean }[];
}) {
  return (
    <div className="col-block">
      <span className="col-label">{label}</span>
      <h3 className="col-title">{title}</h3>
      <p className="col-body">{body}</p>
      <div className="col-links">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener" : undefined}
            className="col-link"
          >
            <span className="col-link-txt">{link.label}</span>
            <span className="arrow" aria-hidden="true">{link.icon}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PrevNext({ exhibition }: { exhibition: Exhibition }) {
  return (
    <aside className="ex-nav" aria-label="Exhibition navigation">
      {exhibition.prev ? (
        <Link href={`/exhibitions/${exhibition.prev.slug}`}>
          <span className="ex-nav-label">
            <span aria-hidden="true">←</span> Previous exhibition
          </span>
          <span className="ex-nav-line">
            <span>{exhibition.prev.artistName}</span>{" "}
            <span className="slash">/</span>{" "}
            <em>{exhibition.prev.title}</em>
          </span>
        </Link>
      ) : (
        <div />
      )}
      {exhibition.next ? (
        <Link href={`/exhibitions/${exhibition.next.slug}`}>
          <span className="ex-nav-label">
            Next exhibition <span aria-hidden="true">→</span>
          </span>
          <span className="ex-nav-line">
            <span>{exhibition.next.artistName}</span>{" "}
            <span className="slash">/</span>{" "}
            <em>{exhibition.next.title}</em>
          </span>
        </Link>
      ) : (
        <div />
      )}
    </aside>
  );
}
