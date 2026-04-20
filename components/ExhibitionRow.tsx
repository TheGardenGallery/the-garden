import Link from "next/link";
import Image from "next/image";
import type { Exhibition } from "@/lib/types";

type ExhibitionRowProps = {
  exhibition: Exhibition;
  mirror?: boolean;
};

export function ExhibitionRow({ exhibition, mirror = false }: ExhibitionRowProps) {
  const href = `/exhibitions/${exhibition.slug}`;
  const image = exhibition.hero ?? exhibition.works?.[0]?.image;

  return (
    <article className={mirror ? "exhibition-row mirror" : "exhibition-row"}>
      <div className="row-image">
        {image && (
          <Image
            src={image}
            alt={`${exhibition.artistName}, ${exhibition.title}`}
            width={800}
            height={600}
          />
        )}
      </div>
      <div className="row-body">
        <div className="row-headline">
          <div className="row-artist">{exhibition.artistName}</div>
          <div className="row-title">{exhibition.title}</div>
        </div>
        <div className="row-meta">
          <div className="row-dates">{exhibition.date}</div>
          <div className="row-meta-sep"></div>
          <div className="row-location">{exhibition.location}</div>
        </div>
        {exhibition.description?.[0] && (
          <p
            className="row-description"
            dangerouslySetInnerHTML={{ __html: exhibition.description[0] }}
          />
        )}
        <Link href={href} className="row-cta">
          <span className="row-cta-label">Explore now</span>
          <span className="row-cta-arrow">→</span>
        </Link>
      </div>
    </article>
  );
}
