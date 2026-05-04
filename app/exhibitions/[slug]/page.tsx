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
import { PieceGrid } from "@/components/PieceGrid";
import { SplitLogicSystem } from "@/components/SplitLogicSystem";
import { ZoomCatcher } from "@/components/ZoomCatcher";
import { Reveal } from "@/components/Reveal";
import { SplitLogicMagnifier } from "@/components/SplitLogicMagnifier";
import { ArtistBroadsheet } from "@/components/ArtistBroadsheet";
import {
  getSplitLogicPalette,
  getSplitLogicMagnifierTones,
} from "@/lib/split-logic-palette";
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

  // Unified zoomable artwork collection for split-logic — hero +
  // inline-artwork videos + piece-grid items, in that document order.
  // ZoomCatcher uses this to drive prev/next navigation across every
  // artwork on the page (left/right arrows + keyboard cycle through
  // all 20 in sequence regardless of which one was clicked first).
  const heroItem = exhibition.heroVideo
    ? [
        {
          video: exhibition.heroVideo,
          poster:
            exhibition.heroVideoPoster ??
            exhibition.hero ??
            exhibition.heroVideo,
          alt: `${exhibition.artistName}, ${exhibition.title}`,
        },
      ]
    : [];
  const inlineItemsFlat = (exhibition.inlineArtworks ?? []).flatMap((g) =>
    g.items
      .filter((i) => i.video)
      .map((i) => ({
        video: i.video as string,
        poster: i.image,
        alt: i.alt,
      })),
  );
  const allArtworks = [
    ...heroItem,
    ...inlineItemsFlat,
    ...(exhibition.pieceGrid ?? []),
  ];

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

      {exhibition.slug === "split-logic" && (
        <SplitLogicMagnifier tones={await getSplitLogicMagnifierTones()} />
      )}

      <ExhibitionHero exhibition={exhibition} />

      {exhibition.slug === "split-logic" && allArtworks.length > 0 && (
        <ZoomCatcher
          items={allArtworks}
          scope='.exhibition-detail[data-slug="split-logic"]'
        />
      )}

      {exhibition.slug === "split-logic" ? (
        <Reveal>
          <ExhibitionOverview exhibition={exhibition} />
        </Reveal>
      ) : (
        <ExhibitionOverview exhibition={exhibition} />
      )}

      {exhibition.pieceGrid && exhibition.pieceGrid.length > 0 && (
        exhibition.slug === "split-logic" ? (
          <Reveal>
            <SplitLogicSystem
              cells={await getSplitLogicPalette()}
              gridItems={exhibition.pieceGrid}
            />
          </Reveal>
        ) : (
          <PieceGrid items={exhibition.pieceGrid} />
        )
      )}

      {exhibition.slug === "split-logic" && (
        <ArtistBroadsheet
          paragraphs={RICKY_TEXT}
          attribution="Ricky Retouch"
        />
      )}

      {exhibition.exploreArtworks && exhibition.exploreArtworks.length > 0 && (
        <Reveal>
          <ExploreRow
            items={exhibition.exploreArtworks}
            fallbackYear={exhibition.year}
            fallbackWorkCount={exhibition.workCount}
          />
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

// ── Ricky's artist description of the series ──────────────────────────
const RICKY_TEXT = [
  `<em>Split Logic</em> is a collection of procedural terminal works built from screen partitions, grid structures, moving fields, coded labels, and rule-based color. The series begins with layout as a kind of logic, dividing the frame into zones that hold fragments of data, measurements, symbols, and empty space.`,
  `Across the works, motion is found through grid walkers, directional noise, and shifting points that respond to various constraints within the algorithm. Some pieces feel like transit diagrams or stock tickers. Others resemble diagnostic screens or monitoring systems from an imagined machine. The information is partly legible and partly invented, sitting somewhere between data, interface, and decoration.`,
  `The series moves away from the paper-like texture of my earlier collections and toward a more digital surface. Its imperfections come from glow, blur, density, compression, and instability. It suggests a functioning system designed for clarity, but still shaped by drift, interference, and human selection.`,
  `The pieces are meant to feel like screens from an unknown system that could have existed in a more advanced version of the 1980s, where modern computation is filtered through older display language.`,
];

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

