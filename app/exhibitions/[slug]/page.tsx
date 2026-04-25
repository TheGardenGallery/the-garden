import { notFound } from "next/navigation";
import { fetchExhibition, fetchExhibitions } from "@/lib/verse-api";
import { WorksGrid } from "@/components/WorksGrid";
import { FeaturedArtworks } from "@/components/FeaturedArtworks";
import { ExploreRow } from "@/components/ExploreRow";
import { ArtistQuote } from "@/components/ArtistQuote";
import { ExhibitionDetails } from "@/components/ExhibitionDetails";
import { ExhibitionHero } from "@/components/ExhibitionHero";
import { ExhibitionOverview } from "@/components/ExhibitionOverview";
import { ExhibitionColophon } from "@/components/ExhibitionColophon";
import { ExhibitionNav } from "@/components/ExhibitionNav";
import { Reveal } from "@/components/Reveal";
import type { Exhibition } from "@/lib/types";

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

      <ExhibitionHero exhibition={exhibition} />

      <ExhibitionOverview exhibition={exhibition} />

      {exhibition.exploreArtworks && exhibition.exploreArtworks.length > 0 && (
        <Reveal>
          <ExploreRow items={exhibition.exploreArtworks} />
        </Reveal>
      )}

      {exhibition.details && exhibition.details.crops.length > 0 && (
        <Reveal>
          <ExhibitionDetails
            details={exhibition.details}
            title={exhibition.title}
          />
        </Reveal>
      )}

      {exhibition.featuredArtworks && exhibition.featuredArtworks.length > 0 && (
        <Reveal>
          <FeaturedArtworks items={exhibition.featuredArtworks} />
        </Reveal>
      )}

      {exhibition.works && exhibition.works.length > 0 && (
        <WorksSection works={exhibition.works} />
      )}

      {/* Artist quote sits after the work study — gives the artist the
          last word before colophon, lets the typewriter animation land
          as the page's closing moment rather than a mid-scroll pause. */}
      {exhibition.artistQuote && (
        <ArtistQuote quote={exhibition.artistQuote} />
      )}

      <Reveal>
        <ExhibitionColophon exhibition={exhibition} />
      </Reveal>

      {(exhibition.prev || exhibition.next) && (
        <ExhibitionNav exhibition={exhibition} />
      )}
    </div>
  );
}

function WorksSection({ works }: { works: NonNullable<Exhibition["works"]> }) {
  return (
    <section className="ex-works" aria-labelledby="worksHead">
      <div className="ex-works-inner">
        <header className="ex-works-head">
          <h2 className="ex-works-head-title" id="worksHead">
            Selected works
          </h2>
        </header>
        <WorksGrid works={works} />
      </div>
    </section>
  );
}

