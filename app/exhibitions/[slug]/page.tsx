import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { fetchExhibition, fetchExhibitions } from "@/lib/verse-api";
import type { Exhibition } from "@/lib/types";
import { WorksGrid } from "@/components/WorksGrid";
import { FeaturedArtworks } from "@/components/FeaturedArtworks";

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

  return (
    <div className="exhibition-detail">
      {/* 01 · TITLE BAR */}
      <header className="ex-title-bar" aria-labelledby="exTitle">
        <h1 className="ex-title-line" id="exTitle">
          <span className="artist">{exhibition.artistName}</span>
          <span className="slash" aria-hidden="true">/</span>
          <span className="title"><em>{exhibition.title}</em></span>
        </h1>
      </header>

      {/* 02 · HERO */}
      <section className="ex-hero" aria-label="Featured artwork">
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
      </section>

      {/* 03 · OVERVIEW */}
      <section className="ex-overview">
        <aside className="ex-overview-aside" aria-label="Exhibition details">
          <AsideRow
            label="Artist"
            value={
              <Link href={`/artists/${exhibition.artistSlug}`}>
                {exhibition.artistName}
              </Link>
            }
          />
          {exhibition.presentedBy && (
            <AsideRow label="Presented by" value={exhibition.presentedBy} />
          )}
          {exhibition.workCount && (
            <AsideRow
              label="Works"
              value={`${exhibition.workCount} artwork${exhibition.workCount === 1 ? "" : "s"}`}
            />
          )}
          <AsideRow label="Location" value={exhibition.location} />
        </aside>

        <div className="ex-overview-body">
          {exhibition.descriptionMarkdown ? (
            <ReactMarkdown>{exhibition.descriptionMarkdown}</ReactMarkdown>
          ) : (
            exhibition.description?.map((para, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
            ))
          )}
        </div>
      </section>

      {/* 04 · FEATURED */}
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

function AsideRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="aside-row">
      <span className="aside-key">{label}</span>
      <span className="aside-val">{value}</span>
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
              href: "https://verse.works",
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
