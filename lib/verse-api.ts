/**
 * Verse Works API integration.
 *
 * Source of editorial copy: the Exhibition type on Verse
 * (verse.works/exhibitions/<slug>), whose `about` field holds the
 * curator-authored exhibition text. Matched to local seed data by the
 * shared slug. Artist bios come from the same query's `artists { bio }`.
 *
 * The Collection type (formerly queried via `explore`) returns the
 * artist-authored series text, which is not what the curator's
 * exhibition page is supposed to render.
 */

import { cache } from "react";
import { artists } from "@/lib/data/artists";
import { exhibitions as seedExhibitions } from "@/lib/data/exhibitions";
import { journalEntries } from "@/lib/data/journal";
import type { Artist, Exhibition, JournalEntry } from "@/lib/types";

const VERSE_ENDPOINT = "https://verse.works/query";

type VerseExhibition = {
  id: string;
  slug: string;
  name: string;
  about: string | null;
  artists: { name: string; slug: string; bio: string | null }[];
};

const VERSE_QUERY = `
  query AllExhibitions {
    exhibitions {
      id
      slug
      name
      about
      artists { name slug bio }
    }
  }
`;

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const fetchVerseExhibitions = cache(async (): Promise<VerseExhibition[]> => {
  try {
    const res = await fetch(VERSE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: VERSE_QUERY }),
      // Fetch once at build time and bake the result into the static
      // HTML. `revalidate: false` disables ISR entirely — production
      // serves pure static files and never re-hits the Verse API.
      // Redeploy to pick up any upstream copy changes.
      next: { revalidate: false },
    });
    if (!res.ok) {
      console.warn(`[verse] ${res.status} ${res.statusText}`);
      return [];
    }
    const json = (await res.json()) as {
      data?: { exhibitions?: VerseExhibition[] };
      errors?: unknown;
    };
    if (json.errors) console.warn("[verse] graphql errors:", JSON.stringify(json.errors));
    return json.data?.exhibitions ?? [];
  } catch (err) {
    console.warn("[verse] fetch threw:", err);
    return [];
  }
});

const getVerseBySlug = cache(async () => {
  const nodes = await fetchVerseExhibitions();
  const map = new Map<string, VerseExhibition>();
  for (const node of nodes) map.set(node.slug, node);
  return map;
});

function mergeExhibitionWithVerse(
  ex: Exhibition,
  verse: VerseExhibition | undefined
): Exhibition {
  if (!verse) return ex;
  return {
    ...ex,
    descriptionMarkdown: verse.about ?? ex.descriptionMarkdown,
    artistBio: verse.artists[0]?.bio ?? ex.artistBio,
  };
}

export async function fetchArtists(): Promise<Artist[]> {
  const nodes = await fetchVerseExhibitions();
  const bioByArtistName = new Map<string, string>();
  for (const node of nodes) {
    for (const a of node.artists) {
      if (a.bio && !bioByArtistName.has(normalize(a.name))) {
        bioByArtistName.set(normalize(a.name), a.bio);
      }
    }
  }
  return artists.map((a) => ({
    ...a,
    bio: bioByArtistName.get(normalize(a.name)) ?? a.bio,
  }));
}

export async function fetchExhibitions(): Promise<Exhibition[]> {
  const verseMap = await getVerseBySlug();
  return seedExhibitions.map((ex) =>
    mergeExhibitionWithVerse(ex, verseMap.get(ex.slug))
  );
}

export async function fetchExhibition(
  slug: string
): Promise<Exhibition | undefined> {
  const ex = seedExhibitions.find((e) => e.slug === slug);
  if (!ex) return undefined;
  const verseMap = await getVerseBySlug();
  return mergeExhibitionWithVerse(ex, verseMap.get(slug));
}

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  return journalEntries;
}
