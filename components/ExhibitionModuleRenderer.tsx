import type { Exhibition, ExhibitionModule } from "@/lib/types";
import { WorksGrid } from "./WorksGrid";
import { FeaturedArtworks } from "./FeaturedArtworks";
import { ExploreRow } from "./ExploreRow";
import { ArtistQuote } from "./ArtistQuote";
import { ExhibitionDetails } from "./ExhibitionDetails";
import { ExhibitionHero } from "./ExhibitionHero";
import { ExhibitionOverview } from "./ExhibitionOverview";
import { ExhibitionColophon } from "./ExhibitionColophon";
import { ExhibitionNav } from "./ExhibitionNav";
import { Reveal } from "./Reveal";

/**
 * Maps a single ExhibitionModule to its rendered output. Each standard
 * module is data-gated — it returns null if the exhibition lacks the
 * data it needs — so a module list can safely include every standard
 * room without producing empty sections.
 *
 * Bespoke modules will dispatch from a registry once we wire one in;
 * the placeholder is silent so an unrecognised key never breaks a page.
 */
export function ExhibitionModuleRenderer({
  module,
  exhibition,
}: {
  module: ExhibitionModule;
  exhibition: Exhibition;
}) {
  switch (module.kind) {
    case "hero":
      return <ExhibitionHero exhibition={exhibition} />;

    case "overview":
      return <ExhibitionOverview exhibition={exhibition} />;

    case "explore":
      if (!exhibition.exploreArtworks?.length) return null;
      return (
        <Reveal>
          <ExploreRow
            items={exhibition.exploreArtworks}
            fallbackYear={exhibition.year}
            fallbackWorkCount={exhibition.workCount}
          />
        </Reveal>
      );

    case "details":
      if (!exhibition.details || exhibition.details.crops.length === 0) {
        return null;
      }
      return (
        <Reveal>
          <ExhibitionDetails
            details={exhibition.details}
            title={exhibition.title}
          />
        </Reveal>
      );

    case "featured":
      if (!exhibition.featuredArtworks?.length) return null;
      return (
        <Reveal>
          <FeaturedArtworks items={exhibition.featuredArtworks} />
        </Reveal>
      );

    case "works":
      if (!exhibition.works?.length) return null;
      return <WorksSection works={exhibition.works} />;

    case "quote":
      if (!exhibition.artistQuote) return null;
      return <ArtistQuote quote={exhibition.artistQuote} />;

    case "colophon":
      return (
        <Reveal>
          <ExhibitionColophon exhibition={exhibition} />
        </Reveal>
      );

    case "nav":
      if (!exhibition.prev && !exhibition.next) return null;
      return <ExhibitionNav exhibition={exhibition} />;

    case "bespoke":
      // Reserved for exhibition-specific modules registered under
      // components/bespoke/{slug}/. No registry wired yet — silent.
      return null;
  }
}

/**
 * Default module sequence — reproduces the exhibition page's layout
 * exactly as it stood before the modulation system. Any exhibition
 * that doesn't define `modules` falls back to this list.
 *
 * Adding to this list affects every exhibition; do that deliberately.
 * For per-show variations, set `exhibition.modules` instead.
 */
export const DEFAULT_EXHIBITION_MODULES: ExhibitionModule[] = [
  { kind: "hero" },
  { kind: "overview" },
  { kind: "explore" },
  { kind: "details" },
  { kind: "featured" },
  { kind: "works" },
  { kind: "quote" },
  { kind: "colophon" },
  { kind: "nav" },
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
