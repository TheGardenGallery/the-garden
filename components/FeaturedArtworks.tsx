import Image from "next/image";
import type { FeaturedArtwork } from "@/lib/types";

type FeaturedArtworksProps = {
  items: FeaturedArtwork[];
};

/**
 * Curated selection of specific artworks for sharing on the exhibition
 * page. Renders as a two-column grid of images on desktop, single column
 * on mobile. Each image links to its Verse item page in a new tab.
 */
export function FeaturedArtworks({ items }: FeaturedArtworksProps) {
  if (!items.length) return null;
  return (
    <section className="ex-featured" aria-label="Featured artworks">
      <div className="ex-featured-inner">
        <div className="ex-featured-grid">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.verseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ex-featured-item"
            >
              <figure className="ex-featured-figure">
                <div className="ex-featured-image">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={1200}
                    height={1500}
                    sizes="(min-width: 960px) 46vw, 92vw"
                  />
                </div>
                <figcaption className="ex-featured-caption">
                  <em>{item.title}</em>
                </figcaption>
              </figure>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
