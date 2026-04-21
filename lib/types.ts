export type Artist = {
  slug: string;
  name: string;
  coord: { row: string; col: number };
  bio?: string;
};

export type Work = {
  id: string;
  title: string;
  year: number;
  number: string;        // "№ 07"
  edition: string;       // "1/1 edition"
  image: string;         // /images/...
  alt: string;
  coord: string;         // "A,01"
};

export type FeaturedArtwork = {
  id: string;
  title: string;        // artwork title only, no series name
  image: string;        // local path under /images
  alt: string;
  verseUrl: string;     // absolute URL to the artwork on Verse
};

export type ExhibitionStatus = "current" | "upcoming" | "past";

export type ExhibitionLink = {
  slug: string;
  artistName: string;
  title: string;
};

export type Exhibition = {
  slug: string;
  artistSlug: string;
  artistName: string;
  title: string;
  year: number;
  month: string;         // "Jul" — short, for past archive
  date: string;          // "July 2024" — long form
  location: string;
  status: ExhibitionStatus;
  description?: string[];        // paragraphs (HTML allowed in prose)
  descriptionMarkdown?: string;  // markdown from Verse — takes priority when present
  artistBio?: string;            // plain-text bio from Verse (colophon)
  hero?: string;                 // used on exhibition detail page
  homepageHero?: string;         // used on homepage hero — may differ from detail hero
  heroTheme?: "dark" | "paper";  // hero backdrop — cream for light-surface pieces, dark for digital
  works?: Work[];
  featuredArtworks?: FeaturedArtwork[];
  workCount?: number;            // total works (e.g. 96, even if only some shown)
  presentedBy?: string;
  verseSeriesUrl?: string;       // external link to the exhibition's Verse series page
  prev?: ExhibitionLink;
  next?: ExhibitionLink;
};

export type JournalEntry = {
  slug: string;
  headline: string;
  byline: string;
  date: string;
  excerpt?: string;
  hero?: string;
};
