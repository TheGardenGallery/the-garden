import type { JournalEntry } from "@/lib/types";

/**
 * Journal entries surface on the homepage: the first entry renders as
 * `JournalHero` (large image + headline + excerpt), entries [1..4) fill
 * the `JournalSidebar` on the right, and everything else is reachable
 * via the "View all articles" link.
 *
 * The homepage Interview section reads from here. The FIRST entry is the
 * main featured interview (currently Ricky Retouch's Split Logic
 * conversation, routing to our internal /interviews/[slug] page).
 * Subsequent entries become the sidebar stack — Paul Prudence's
 * external Verse journal piece currently lives there.
 */
export const journalEntries: JournalEntry[] = [
  {
    slug: "ricky-retouch",
    kicker: "Split Logic",
    headline: "Ricky Retouch: Unknown Variables",
    byline: "Ivan Zhyzhkevych, Curator",
    date: "May 2026",
    excerpt:
      "Grids, loops, typography, and the ghost of a system that could have existed.",
    hero: "/images/ricky-retouch/unknown-variables-hero.png",
    heroVideo: "/images/ricky-retouch/unknown-variables-hero.mp4",
    heroAspect: "1958/1124",
    disableHoverZoom: true,
    // Internal routing — omitting externalUrl makes JournalHero link to
    // /journal/<slug> by default. We override that below with a custom
    // href in the rendering component via `internalUrl` — but the
    // existing component only supports `/journal/[slug]` or `externalUrl`.
    // Since `/interviews/ricky-retouch` is our target, we set externalUrl
    // to the local path (still Next-routable, just forces an `<a>`).
    externalUrl: "/interviews/ricky-retouch",
  },
  {
    slug: "weaving-the-digital-a-celebration-of-unicode-textiles-and-computing",
    headline: "Weaving the Digital: A Celebration of Unicode, Textiles, and Computing",
    byline: "Paul Prudence",
    date: "November 12, 2024",
    excerpt:
      "Prudence discusses how the Unicode character encoding standard, a bureaucratic artifact meant to catalogue every written symbol in human history, became the source material for a body of generative pattern work that treats data structures as ornamental grammars.",
    hero: "/images/paul-prudence/iso-iec-10646-journal.jpg",
    externalUrl: "https://verse.works/journal/weaving-the-digital-a-celebration-of-unicode-textiles-and-computing",
    disableHoverZoom: true,
  },
];

export const getJournalHero = () => journalEntries[0];
export const getJournalSidebar = () => journalEntries.slice(1, 4);
