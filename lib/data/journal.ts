import type { JournalEntry } from "@/lib/types";

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
  {
    slug: "distrakted-essay",
    headline: "DistraKted: On Glitch, Fragmentation, and the Aesthetics of Refusal",
    byline: "Mark Webster",
    date: "December 2024",
  },
  {
    slug: "phantasmagoria-essay",
    headline: "Phantasmagoria: Slow Images and the Residue of Attention",
    byline: "Mazin",
    date: "October 2024",
  },
  {
    slug: "bully-essay",
    headline: "bully: RIIIIS on Confrontation as Compositional Principle",
    byline: "RIIIIS",
    date: "October 2024",
  },
];

export const getJournalHero = () => journalEntries[0];
export const getJournalSidebar = () => journalEntries.slice(1, 4);
