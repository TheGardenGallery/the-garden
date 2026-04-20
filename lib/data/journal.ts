import type { JournalEntry } from "@/lib/types";

export const journalEntries: JournalEntry[] = [
  {
    slug: "encoding-the-unseen",
    headline: "Encoding the Unseen: Paul Prudence on ISO/IEC 10646 and the Poetics of the Character Set",
    byline: "Paul Prudence",
    date: "August 2025",
    excerpt:
      "Prudence discusses how the Unicode character encoding standard, a bureaucratic artifact meant to catalogue every written symbol in human history, became the source material for a body of generative pattern work that treats data structures as ornamental grammars.",
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
