/**
 * Verse Works API stub.
 *
 * The plan: once curator API access is granted, replace these functions
 * with real fetch calls that map the Verse response onto our types.
 * Pages and components import from here so the swap is purely internal.
 *
 * Until then, these re-export the local seed data so everything works.
 */

import { artists } from "@/lib/data/artists";
import { exhibitions } from "@/lib/data/exhibitions";
import { journalEntries } from "@/lib/data/journal";
import type { Artist, Exhibition, JournalEntry } from "@/lib/types";

export async function fetchArtists(): Promise<Artist[]> {
  return artists;
}

export async function fetchExhibitions(): Promise<Exhibition[]> {
  return exhibitions;
}

export async function fetchExhibition(slug: string): Promise<Exhibition | undefined> {
  return exhibitions.find((e) => e.slug === slug);
}

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  return journalEntries;
}
