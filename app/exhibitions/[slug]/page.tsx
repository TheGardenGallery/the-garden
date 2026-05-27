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
import { SplitLogicProcess } from "@/components/SplitLogicProcess";
import { SplitLogicAllowlistCheck } from "@/components/SplitLogicAllowlistCheck";
import {
  SplitLogicHeroAnchor,
  SplitLogicZoomCatcher,
} from "@/components/SplitLogicHero";
import { Reveal } from "@/components/Reveal";
import { SplitLogicMagnifier } from "@/components/SplitLogicMagnifier";
import { ArtistBroadsheet } from "@/components/ArtistBroadsheet";
import {
  getSplitLogicArchetypeSimilarities,
  getSplitLogicFullPalette,
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
    ...(exhibition.pieceGridFull ?? []),
  ];

  return (
    <div className="exhibition-detail" data-slug={exhibition.slug}>
      {/* Hero video downloads start once the <video> element hydrates
          (preload="auto" on the element itself). We used to also emit
          a <link rel="preload" as="video"> here to pre-warm the fetch
          during HTML parse, but that drove a 3–22 MB MP4 onto the
          critical render path, bandwidth-starving the poster image
          (the actual LCP element) — Lighthouse mobile LCP > 5s.
          Trade-off accepted: brief (~300–800ms) interval where the
          poster image holds before motion begins. The poster IS the
          hero composition, so the transition reads as a fade-in
          rather than a broken state. */}

      {exhibition.slug === "split-logic" && (
        <SplitLogicMagnifier tones={await getSplitLogicMagnifierTones()} />
      )}

      <ExhibitionHero exhibition={exhibition} />

      {/* Hero memory: both lightboxes on this page (the page-wide
          ZoomCatcher AND the piece-grid one inside SplitLogicSystem)
          commit their last-viewed item to a shared module-level
          store. SplitLogicHeroAnchor reads from the store and paints
          the anchored artwork over the canonical hero plate via a
          crossfade. In-memory only; resets on unmount so a fresh
          visit always opens on the canonical hero. */}
      {exhibition.slug === "split-logic" && allArtworks.length > 0 && (
        <>
          <SplitLogicHeroAnchor items={allArtworks} />
          <SplitLogicZoomCatcher
            items={allArtworks}
            scope='.exhibition-detail[data-slug="split-logic"]'
          />
        </>
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
              cells={await getSplitLogicFullPalette()}
              archetypeSimilarities={await getSplitLogicArchetypeSimilarities()}
              gridItems={exhibition.pieceGridFull ?? exhibition.pieceGrid}
              allArtworks={allArtworks}
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
          pins={RICKY_PINS}
          anchor={RICKY_ANCHOR}
        />
      )}

      {/* Process docs come after the artist's annotated note — the
          editorial frame closes, then the studio capture plays as a
          coda before the colophon credits. Scoped to split-logic for
          now; theming relies on the dot-lattice + console-plate
          vocabulary unique to that page. */}
      {exhibition.slug === "split-logic" && exhibition.processVideos && (
        <Reveal>
          <SplitLogicProcess process={exhibition.processVideos} />
        </Reveal>
      )}

      {/* Allowlist eligibility check — Split Logic only. Sits after
          the process coda and before any cross-show row, as a quiet
          "now collect" beat ahead of the colophon. Self-contained
          client component; does not share state with
          SplitLogicSystem so the PieceGrid FLIP lock is unaffected. */}
      {exhibition.slug === "split-logic" && (
        <Reveal>
          <SplitLogicAllowlistCheck />
        </Reveal>
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
// Structured as annotated runs so pinned words can be wrapped in
// interactable spans by ArtistBroadsheet. Each `pin` references a
// region on the anchor artwork below; the rest is plain text or `em`
// for italics.
const RICKY_TEXT: import("@/components/ArtistBroadsheet").BroadsheetParagraph[] = [
  [
    { em: "Split Logic" },
    " is a collection of procedural terminal works built from ",
    { pin: "scr", text: "screen partitions" },
    ", ",
    { pin: "grd", text: "grid structures" },
    ", ",
    { pin: "mvf", text: "moving fields" },
    ", ",
    { pin: "cod", text: "coded labels" },
    ", and rule-based color. The series begins with layout as a kind of logic, dividing the frame into zones that hold fragments of data, ",
    { pin: "msr", text: "measurements" },
    ", ",
    { pin: "sym", text: "symbols" },
    ", and ",
    { pin: "emp", text: "empty space" },
    ".",
  ],
  [
    "Across the works, motion is found through ",
    { pin: "wlk", text: "grid walkers" },
    ", directional noise, and ",
    { pin: "shf", text: "shifting points" },
    " that respond to various constraints within the algorithm. Some pieces feel like transit diagrams or stock tickers. Others resemble diagnostic screens or monitoring systems from an imagined machine. The information is partly legible and partly invented, sitting somewhere between data, interface, and decoration.",
  ],
  [
    "The series moves away from the paper-like texture of my earlier collections and toward a more digital surface. Its imperfections come from glow, blur, ",
    { pin: "dns", text: "density" },
    ", compression, and instability. It suggests a functioning system designed for clarity, but still shaped by drift, interference, and human selection.",
  ],
  [
    "The pieces are meant to feel like screens from an unknown system that could have existed in a more advanced version of the 1980s, where modern computation is filtered through older display language.",
  ],
];

// Pin regions on the anchor artwork (sl-099 — large distorted
// wireframe web on the right, column of coded labels on the left,
// "+" symbols and a domino-bar pattern in the bottom strip). Each pin
// is matched to the literal visual feature the word names, not to a
// vague nearby region.
const RICKY_PINS: Record<
  string,
  {
    region: { x: number; y: number; w: number; h: number };
    code: string;
    cycle?: { x: number; y: number; w: number; h: number }[];
    tint?: boolean;
  }
> = {
  // Screen partitions — the major spatial divisions of the composition.
  // The cycle highlights each zone in turn: left data column, wireframe
  // panel, bottom label strip. Gives a sense of the underlying layout
  // logic that organises the piece.
  scr: {
    region: { x: 0.000, y: 0.039, w: 0.181, h: 0.595 },
    code: "SCR",
    cycle: [
      // Left data column — right edge lands between the moving fields bars
      { x: 0.000, y: 0.039, w: 0.181, h: 0.595 },
      // Mid strip — covers both pink data panels (XIE + RLG/KX)
      { x: 0.181, y: 0.039, w: 0.130, h: 0.595 },
      // Bottom label zone — src (0,1010)–(1456,1500)
      { x: 0.000, y: 0.674, w: 1.000, h: 0.326 },
    ],
  },
  // The wireframe panel itself — bounding box of the outer rectangle
  // at source (~395–1400) × (~85–945), padded outward for the corner
  // brackets to land in clean dark space.
  grd: { region: { x: 0.282, y: 0.020, w: 0.686, h: 0.618 }, code: "GRD" },
  // The three horizontal-bar instrument blocks stacked mid-left,
  // detected at source (273,504)-(322,522), (271,569)-(352,589),
  // (271,630)-(352,651). Combined bounding box covers all three.
  mvf: { region: { x: 0.180, y: 0.352, w: 0.068, h: 0.088 }, code: "MVF" },
  // Coded labels — the letter glyphs scattered across the piece (C, B,
  // AM, N, KVV, MUB). The cycle visits each letterform individually,
  // sweeping top-down, left-right. Coordinates from connected-component
  // detection (scripts/detect-sl099-letters.mjs).
  cod: {
    region: { x: 0.276, y: 0.064, w: 0.041, h: 0.041 },
    code: "COD",
    cycle: [
      // C — wireframe interior top-left. Detected (418,124)—(443,165).
      { x: 0.276, y: 0.064, w: 0.041, h: 0.041 },
      // B — wireframe upper-left edge. Detected (426,248)—(442,275).
      { x: 0.279, y: 0.146, w: 0.040, h: 0.040 },
      // AM — wireframe mid-left edge. Detected (383,449)—(442,490).
      { x: 0.257, y: 0.281, w: 0.053, h: 0.053 },
      // N — wireframe lower-left edge. Detected (416,705)—(441,744).
      { x: 0.274, y: 0.463, w: 0.040, h: 0.040 },
      // KVV — left-mid cluster. Detected (96,706)—(163,745).
      { x: 0.060, y: 0.455, w: 0.059, h: 0.059 },
      // MUB — bottom-right of wireframe. Detected (1308,959)—(1386,998).
      { x: 0.892, y: 0.624, w: 0.066, h: 0.066 },
    ],
  },
  // Numerical measurement readings scattered across the left column —
  // small decimal values next to the letter labels. Coordinates from
  // connected-component detection (scripts/detect-sl099-measurements.mjs)
  // — bright-pixel flood-fill filtered for number-shaped blobs (aspect
  // >1.2, area <1000, left 40% of image). The cycle visits each reading
  // top-to-bottom, same sweeping-readout as `sym` visits letterforms.
  msr: {
    region: { x: 0.045, y: 0.089, w: 0.031, h: 0.019 },
    code: "MSR",
    cycle: [
      // Detected (71,158)—(103,172) 33×15
      { x: 0.045, y: 0.089, w: 0.031, h: 0.019 },
      // Detected (276,184)—(329,204) 54×21
      { x: 0.185, y: 0.107, w: 0.045, h: 0.023 },
      // Detected (69,253)—(101,266) 33×14
      { x: 0.043, y: 0.155, w: 0.031, h: 0.018 },
      // Detected (275,285)—(307,299) 33×15
      { x: 0.185, y: 0.177, w: 0.031, h: 0.019 },
      // Detected (68,349)—(100,361) 33×13
      { x: 0.043, y: 0.220, w: 0.031, h: 0.017 },
      // Detected (66,443)—(99,457) 34×15
      { x: 0.041, y: 0.285, w: 0.032, h: 0.019 },
      // Detected (273,503)—(322,522) 50×20
      { x: 0.183, y: 0.326, w: 0.043, h: 0.022 },
      // Detected (272,759)—(321,777) 50×19
      { x: 0.183, y: 0.502, w: 0.043, h: 0.021 },
      // Detected (66,764)—(97,778) 32×15
      { x: 0.041, y: 0.505, w: 0.030, h: 0.019 },
    ],
  },
  // Symbols — the non-textual graphical marks: plus signs (+) scattered
  // across the composition, the horizontal-bar instrument blocks, and
  // the domino dot-matrix pattern. Distinct from the letter codes (COD).
  // Coordinates from connected-component detection
  // (scripts/detect-sl099-symbols.mjs).
  sym: {
    region: { x: 0.123, y: 0.065, w: 0.022, h: 0.022 },
    code: "SYM",
    cycle: [
      // + near LDP — src center (195,132)
      { x: 0.123, y: 0.065, w: 0.022, h: 0.022 },
      // + near F — src center (67,980)
      { x: 0.035, y: 0.647, w: 0.022, h: 0.022 },
      // + near F row — src center (190,980)
      { x: 0.119, y: 0.647, w: 0.022, h: 0.022 },
      // + near RKX area — src center (319,1108)
      { x: 0.208, y: 0.735, w: 0.022, h: 0.022 },
    ],
  },
  // The clean horizontal band between the F row (source y≈1015-1030,
  // frame 0.682-0.692) and the D·T·RKX·SO row (source y≈1085+,
  // frame 0.730+). Detection showed no bright components in source
  // y=1035-1080, frame 0.696-0.726. Box biased right where the
  // emptiness is most contiguous (D row labels live on the left).
  emp: { region: { x: 0.500, y: 0.694, w: 0.420, h: 0.070 }, code: "EMP" },
  // Bright walker dots at grid intersections across the upper half of
  // the wireframe. Box covers the cluster spanning (0.32, 0.12),
  // (0.52, 0.10), (0.74, 0.12), (0.61, 0.18) etc. `tint:true` turns
  // those bright dots red on hover via mix-blend-multiply on the
  // video — the walkers actively glow red while the pin is active.
  wlk: {
    region: { x: 0.300, y: 0.090, w: 0.550, h: 0.140 },
    code: "WLK",
    tint: true,
  },
  // The domino dot-matrix block at bottom-centre. Detected columns:
  // (468,1205)-(489,1248), (468,1274)-(489,1317), (525,1183)-(546,1225)
  // — combined bbox source x=468-546, y=1183-1320 → frame
  // (0.321-0.375, 0.797-0.891), padded outward.
  shf: { region: { x: 0.3157, y: 0.790, w: 0.066, h: 0.108 }, code: "SHF" },
  // The central convergent "lens" of the wireframe — the inner
  // rounded rectangle where radial mesh lines bend most tightly.
  // Box edges sit on the outer lines that bound this central shape.
  // Inner rect source pixels: (640,270)–(1020,590) in 1456×1500
  // source; after 22-px vertical cover-crop → frame (640,248)–
  // (1020,568) in the 1456×1456 visible square.
  dns: { region: { x: 0.500, y: 0.210, w: 0.281, h: 0.240 }, code: "DNS", tint: true },
};

const RICKY_ANCHOR = {
  video: "/images/ricky-retouch/works/sl-099.mp4",
  poster: "/images/ricky-retouch/works/sl-099.jpg",
} as const;

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

