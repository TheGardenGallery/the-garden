import type { JournalEntry } from "@/lib/types";

/**
 * Journal entries surface on the homepage: the first entry renders as
 * `JournalHero` (large image + headline + excerpt), entries [1..4) fill
 * the `JournalSidebar` on the right, and everything else is reachable
 * via the "View all articles" link.
 *
 * While there is only one real entry we render the hero solo and
 * centered (see `app/page.tsx`). Add more entries here and the sidebar
 * reappears automatically.
 */
export const journalEntries: JournalEntry[] = [
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
