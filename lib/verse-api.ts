/**
 * Verse Works API integration.
 *
 * Local seed data (images, works grid, presented-by, prev/next) stays the
 * source of truth for layout. At fetch time we pull the curator's 27
 * exhibitions from Verse and overlay the editorial text (description,
 * artist bio) by matching on a normalized title.
 *
 * Next.js caches the fetch across the request and revalidates hourly.
 */

import { cache } from "react";
import { artists } from "@/lib/data/artists";
import { exhibitions as seedExhibitions } from "@/lib/data/exhibitions";
import { journalEntries } from "@/lib/data/journal";
import type { Artist, Exhibition, JournalEntry } from "@/lib/types";

const VERSE_ENDPOINT = "https://verse.works/query";
const CURATOR_PERSON_ID =
  process.env.VERSE_PERSON_ID ?? "8933862f-da37-4de3-bacc-49fd33f81dd2";

type VerseCollection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  artists: { name: string; slug: string; bio: string | null }[];
};

const VERSE_QUERY = `
  query CuratorExhibitions($id: ID!) {
    explore(
      filter: { personIds: [$id] }
      sorting: { sort: RECENCY, direction: DESC }
      first: 50
    ) {
      nodes {
        id
        name
        slug
        description
        artists { name slug bio }
      }
    }
  }
`;

/**
 * Normalize a title for matching. Lowercase, collapse whitespace/punct to
 * single dashes. Matches "ISO/IEC 10646" against "iso-iec-10646".
 */
function normalize(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const fetchVerseCollections = cache(async (): Promise<VerseCollection[]> => {
  try {
    const res = await fetch(VERSE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: VERSE_QUERY,
        variables: { id: CURATOR_PERSON_ID },
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: { explore?: { nodes?: VerseCollection[] } };
      errors?: unknown;
    };
    return json.data?.explore?.nodes ?? [];
  } catch {
    return [];
  }
});

const getVerseByNormalizedTitle = cache(async () => {
  const nodes = await fetchVerseCollections();
  const map = new Map<string, VerseCollection>();
  for (const node of nodes) map.set(normalize(node.name), node);
  return map;
});

function mergeExhibitionWithVerse(
  ex: Exhibition,
  verse: VerseCollection | undefined
): Exhibition {
  if (!verse) return ex;
  return {
    ...ex,
    descriptionMarkdown: verse.description ?? ex.descriptionMarkdown,
    artistBio: verse.artists[0]?.bio ?? ex.artistBio,
  };
}

export async function fetchArtists(): Promise<Artist[]> {
  const verseMap = await getVerseByNormalizedTitle();
  const bioByArtistSlug = new Map<string, string>();
  for (const node of verseMap.values()) {
    for (const a of node.artists) {
      if (a.bio && !bioByArtistSlug.has(normalize(a.name))) {
        bioByArtistSlug.set(normalize(a.name), a.bio);
      }
    }
  }
  return artists.map((a) => ({
    ...a,
    bio: bioByArtistSlug.get(normalize(a.name)) ?? a.bio,
  }));
}

export async function fetchExhibitions(): Promise<Exhibition[]> {
  const verseMap = await getVerseByNormalizedTitle();
  return seedExhibitions.map((ex) =>
    mergeExhibitionWithVerse(ex, verseMap.get(normalize(ex.title)))
  );
}

export async function fetchExhibition(
  slug: string
): Promise<Exhibition | undefined> {
  const ex = seedExhibitions.find((e) => e.slug === slug);
  if (!ex) return undefined;
  const verseMap = await getVerseByNormalizedTitle();
  return mergeExhibitionWithVerse(ex, verseMap.get(normalize(ex.title)));
}

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  return journalEntries;
}
