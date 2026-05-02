import Link from "next/link";
import type { Exhibition } from "@/lib/types";
import { preserveHyphens } from "@/lib/typography";
import { ArrowRight, ArrowDown, ArrowNE } from "@/components/Arrows";
import { ClampedBody } from "@/components/ClampedBody";
import { artists } from "@/lib/data/artists";

/**
 * Museum-style colophon at the foot of each exhibition page. Up to
 * three blocks: about the artist, supplementary documents (gated on
 * `exhibition.documents`), and enquiries / Verse link.
 */
export function ExhibitionColophon({ exhibition }: { exhibition: Exhibition }) {
  // Look up the artist record so we can prefer our authored bio over
  // anything Verse provides — and link the "Artist profile" CTA to
  // our own artist page rather than offsite to Verse.
  const artist = artists.find((a) => a.slug === exhibition.artistSlug);
  // The local bio is paragraph-separated (\n\n). The colophon body is
  // a single <p> (with line-clamp), so collapse paragraph breaks to
  // single spaces for inline rendering.
  const localBio = artist?.bio?.replace(/\n+/g, " ");
  const colophonBio =
    localBio ??
    exhibition.artistBio ??
    "Multidisciplinary artist working across digital and generative systems.";

  return (
    <section className="ex-colophon">
      <div className="ex-colophon-inner">
        <ColBlock
          label="About the artist"
          title={exhibition.artistName}
          body={colophonBio}
          clampLines={6}
          links={[
            {
              label: "Artist profile",
              href: `/artists/${exhibition.artistSlug}`,
              icon: <ArrowRight />,
            },
          ]}
        />
        {exhibition.documents && (
          <ColBlock
            label="Documents"
            title="Press & Reading"
            body="A press release and curator's note accompany the exhibition, including technical notes on the generative process and a conversation with the artist."
            links={[
              ...(exhibition.documents.pressPdfUrl
                ? [{ label: "Press release (PDF)", href: exhibition.documents.pressPdfUrl, icon: <ArrowDown /> }]
                : []),
              ...(exhibition.documents.interviewUrl
                ? [{ label: "Artist interview", href: exhibition.documents.interviewUrl, icon: <ArrowRight /> }]
                : []),
            ]}
          />
        )}
        {exhibition.physicalExhibition && (
          <div className="col-block">
            <span className="col-label">Exhibited at</span>
            <h3 className="col-title">{exhibition.physicalExhibition.venue}</h3>
            <p className="col-body">
              {exhibition.physicalExhibition.address}
              <br />
              {exhibition.physicalExhibition.dates}
            </p>
            {exhibition.physicalExhibition.venueUrl && (
              <div className="col-links">
                <Link
                  href={exhibition.physicalExhibition.venueUrl}
                  target="_blank"
                  rel="noopener"
                  className="col-link"
                >
                  <span className="col-link-txt">Visit gallery</span>
                  <span className="arrow" aria-hidden="true"><ArrowNE /></span>
                </Link>
              </div>
            )}
          </div>
        )}
        {exhibition.status !== "upcoming" && (
          <ColBlock
            label="Enquiries"
            title="Works Available"
            body={`All ${exhibition.workCount ?? "available"} works remain viewable and collectable on Verse, with full provenance and trading history. For press and private enquiries, contact the curator directly.`}
            links={[
              {
                label: "View on Verse",
                href: exhibition.verseSeriesUrl ?? "https://verse.works",
                icon: <ArrowNE />,
                external: true,
              },
              {
                label: "Enquire",
                href: `mailto:chilltulpa@gmail.com?subject=${encodeURIComponent(
                  `Enquiry: ${exhibition.artistName}, ${exhibition.title}`
                )}`,
                icon: <ArrowRight />,
              },
            ]}
          />
        )}
      </div>
    </section>
  );
}

type ColBlockLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
};

function ColBlock({
  label,
  title,
  body,
  links,
  clampLines,
}: {
  label: string;
  title: string;
  body: string;
  links: ColBlockLink[];
  clampLines?: number;
}) {
  return (
    <div className="col-block">
      <span className="col-label">{label}</span>
      <h3 className="col-title">{title}</h3>
      {clampLines ? (
        <ClampedBody text={body} className="col-body" lines={clampLines} />
      ) : (
        <p
          className="col-body"
          dangerouslySetInnerHTML={{ __html: preserveHyphens(body) }}
        />
      )}
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
