import Link from "next/link";
import type { Exhibition } from "@/lib/types";
import { preserveHyphens } from "@/lib/typography";
import { ArrowRight, ArrowDown, ArrowNE } from "@/components/Arrows";

/**
 * Museum-style colophon at the foot of each exhibition page. Up to
 * three blocks: about the artist, supplementary documents (gated on
 * `exhibition.documents`), and enquiries / Verse link.
 */
export function ExhibitionColophon({ exhibition }: { exhibition: Exhibition }) {
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
              icon: <ArrowRight />,
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
                ? [{ label: "Press release (PDF)", href: exhibition.documents.pressPdfUrl, icon: <ArrowDown /> }]
                : []),
              ...(exhibition.documents.interviewUrl
                ? [{ label: "Artist interview", href: exhibition.documents.interviewUrl, icon: <ArrowRight /> }]
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
}: {
  label: string;
  title: string;
  body: string;
  links: ColBlockLink[];
}) {
  return (
    <div className="col-block">
      <span className="col-label">{label}</span>
      <h3 className="col-title">{title}</h3>
      <p
        className="col-body"
        dangerouslySetInnerHTML={{ __html: preserveHyphens(body) }}
      />
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
