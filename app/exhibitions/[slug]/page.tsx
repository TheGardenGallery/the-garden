import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { fetchExhibition, fetchExhibitions } from "@/lib/verse-api";
import type { Exhibition } from "@/lib/types";
import { WorksGrid } from "@/components/WorksGrid";
import { FeaturedArtworks } from "@/components/FeaturedArtworks";
import { ExhibitionDetails } from "@/components/ExhibitionDetails";

/**
 * Replace hyphens between letters/digits with U+2011 (non-breaking hyphen) so
 * compound words like "dot-matrix" don't break across lines. Skips HTML tags so
 * attribute values (hrefs, class names) are unaffected.
 */
function preserveHyphens(html: string): string {
  return html.replace(/(<[^>]*>)|([^<]+)/g, (_m, tag, text) => {
    if (tag) return tag;
    return (text as string).replace(/(\p{L}|\d)-(\p{L}|\d)/gu, "$1\u2011$2");
  });
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
    <div className="exhibition-detail">
      {/* 01 · HERO — full-viewport, mirrors the homepage Hero: paper
          backdrop, artwork centered, title card pinned bottom-left, so
          clicking a hero card reads as the same element settling into
          place. */}
      <section
        className="ex-hero"
        data-theme={heroTheme}
        aria-label="Featured artwork"
      >
        <div className="ex-hero-frame">
          {exhibition.hero ? (
            exhibition.verseSeriesUrl ? (
              <a
                className="ex-hero-plate"
                href={exhibition.verseSeriesUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${exhibition.title} series on Verse`}
              >
                <Image
                  src={exhibition.hero}
                  alt={`${exhibition.artistName}, ${exhibition.title} (featured work)`}
                  width={1240}
                  height={1550}
                  priority
                />
              </a>
            ) : (
              <figure className="ex-hero-plate">
                <Image
                  src={exhibition.hero}
                  alt={`${exhibition.artistName}, ${exhibition.title} (featured work)`}
                  width={1240}
                  height={1550}
                  priority
                />
              </figure>
            )
          ) : (
            <figure className="ex-hero-plate" />
          )}
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
        {exhibition.descriptionMarkdown &&
        !(exhibition.descriptionByArtist && exhibition.description?.length) ? (
          <div className="ex-overview-body">
            <ReactMarkdown>{exhibition.descriptionMarkdown}</ReactMarkdown>
          </div>
        ) : (
          <OverviewSegments exhibition={exhibition} />
        )}
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

function OverviewSegments({ exhibition }: { exhibition: Exhibition }) {
  const paragraphs = exhibition.description ?? [];
  const inline = exhibition.inlineArtworks;
  const breakIndex = inline?.afterParagraphIndex;
  const hasBreak =
    inline && typeof breakIndex === "number" && breakIndex >= 0 && breakIndex < paragraphs.length - 1;

  const before = hasBreak ? paragraphs.slice(0, breakIndex! + 1) : paragraphs;
  const after = hasBreak ? paragraphs.slice(breakIndex! + 1) : [];

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

  return (
    <>
      {renderBody(before, true, "body-before")}
      {hasBreak && <InlineArtworks exhibition={exhibition} />}
      {hasBreak && after.length > 0 && renderBody(after, false, "body-after")}
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

function InlineArtworks({ exhibition }: { exhibition: Exhibition }) {
  const inline = exhibition.inlineArtworks;
  if (!inline) return null;
  const fallback = exhibition.verseSeriesUrl;
  return (
    <div className="ex-inline-artworks">
      {inline.items.map((item, j) => {
        const href = item.verseUrl ?? fallback;
        const figure = (
          <figure className="ex-inline-figure">
            <div className="ex-inline-image">
              <Image
                src={item.image}
                alt={item.alt}
                width={1200}
                height={1500}
                sizes="(min-width: 900px) 40vw, 92vw"
              />
            </div>
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
        <ColBlock
          label="Documents"
          title="Press & reading"
          body="A press release and curator's note accompany the exhibition, including technical notes on the generative process and a conversation with the artist."
          links={[
            { label: "Press release (PDF)", href: "#", icon: "↓" },
            { label: "Artist interview", href: "#", icon: "→" },
          ]}
        />
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
            { label: "Enquire", href: "#", icon: "→" },
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
