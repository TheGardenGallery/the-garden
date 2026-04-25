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
  /** Optional static poster frame. Used by the Explore row to show a
      non-animating first frame by default; the GIF only plays while
      the viewer is hovering. Extract via sharp(src, {animated:false}). */
  poster?: string;
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
  descriptionByArtist?: boolean; // when true, render a "Text by the artist" byline under the description
  artistBio?: string;            // plain-text bio from Verse (colophon)
  hero?: string;                 // used on exhibition detail page
  heroVideo?: string;            // if set, the detail hero renders this muted autoplay loop instead of the hero image
  heroVideoPoster?: string;      // poster frame for heroVideo, if different from `hero`. Prevents a visible frame-jump when the video starts playing from a still that isn't its first frame.
  homepageHero?: string;         // used on homepage hero — may differ from detail hero
  heroTheme?: "dark" | "paper";  // hero backdrop — cream for light-surface pieces, dark for digital
  frameColor?: string;           // background of the exhibitions-list image frame, matched to the artwork's palette
  listImageScale?: number;       // multiplier for the exhibitions-list thumbnail, compensating for mattes baked into the hero file
  disableListHoverZoom?: boolean; // skip the hover scale on the exhibitions-list row when fine patterns in the artwork would shimmer under sub-pixel scaling
  cardImage?: string;            // thumbnail used in homepage ExhibitionCard
  cardVideo?: string;            // if set, ExhibitionCard plays this muted-autoplay loop instead of cardImage
  works?: Work[];
  featuredArtworks?: FeaturedArtwork[];
  /** Horizontal row of other works from the series, shown below the
      editorial overview. Meant for "explore more from this series"
      pieces; thumbnails link out to the work on Verse. */
  exploreArtworks?: FeaturedArtwork[];
  /** A direct quote from the artist about the work, rendered as a
      typographic pull-quote below the editorial overview. Use when
      Verse's exhibition page includes a standalone artist statement
      separate from the main description. */
  artistQuote?: {
    paragraphs: string[];   // quote body, plain text (HTML <em> allowed)
    attribution: string;    // just the artist name; the em-dash is added
  };
  /** A pair (or more) of artworks inserted between description paragraphs.
      `afterParagraphIndex` is 0-based against `description`. If an item
      omits `verseUrl`, it falls back to the exhibition's `verseSeriesUrl`. */
  /** One or more inline artwork groups inserted between description
      paragraphs. Each group has its own `afterParagraphIndex` so multiple
      plates can break up long prose at different points. */
  inlineArtworks?: {
    afterParagraphIndex: number;
    items: { image: string; alt: string; title?: string; verseUrl?: string; video?: string; iframe?: string; aspectRatio?: number; unoptimized?: boolean }[];
  }[];
  /** Hi-fidelity detail crops of a single work, shown as a grid like
      "Selected works" but all derived from the same source image via
      CSS background-position / background-size. `zoom` is the
      magnification factor (e.g., 3 = 3x); `x`/`y` are percentages
      (0–100) giving the focal point of the crop. */
  details?: {
    sourceImage: string;
    title?: string;           // optional work title shown under the heading
    verseUrl?: string;        // if set, the title becomes a link to the work on Verse
    aspectRatio?: string;     // e.g. "1" (default), "4/5"
    /** Percentage inset of the actual artwork inside the source file,
        excluding any cream matte / bleed. Used to clamp each crop so
        the matte never leaks into a detail view. */
    artworkInset?: { top?: number; right?: number; bottom?: number; left?: number };
    crops: {
      id: string;
      x: number;
      y: number;
      zoom: number;
      caption?: string;
      /** When set, render this image directly (object-fit: cover into
          the slot) instead of computing a CSS-zoom crop from the
          shared sourceImage. x/y/zoom are ignored. */
      image?: string;
    }[];
  };
  workCount?: number;            // total works (e.g. 96, even if only some shown)
  presentedBy?: string;
  verseSeriesUrl?: string;       // external link to the exhibition's Verse series page
  /** Documents block on the exhibition page (press release PDF, artist
      interview, etc.). If present, renders the "Press & reading" colophon
      block. Absent for past exhibitions that never had formal docs. */
  documents?: {
    pressPdfUrl?: string;
    interviewUrl?: string;
  };
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
  externalUrl?: string;      // when set, the journal item links out to this URL instead of the internal /journal/[slug] route
  disableHoverZoom?: boolean; // when true, skip the hover scale on the hero image — use for fine-pattern artwork where the scale slices into the grid
};
