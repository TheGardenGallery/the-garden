export type Artist = {
  slug: string;
  name: string;
  coord: { row: string; col: number };
  /** Editorial bio for the artist page. Paragraphs separated by
      double-newlines (`\n\n`); the renderer splits on render. When
      present, the artist page renders the refined bio layout in
      place of the "coming soon" placeholder. */
  bio?: string;
  /** Verse profile slug. Use only when it differs from the local
      `slug` (e.g. our `sp-gelsesmaskinen` vs Verse's `spogelsesmaskinen`).
      Defaults to `slug` at the call site when unset. */
  verseSlug?: string;
  /** External social links rendered as a small italic line beneath
      the artist name on the bio page. Order matters — listed left
      to right with middle-dot separators. */
  socials?: { label: string; href: string }[];
  /** Override for the half-clipped artwork shown on the artist page.
      Defaults to the showcase exhibition's hero. Useful when the
      exhibition's hero is correct for its detail page but a different
      piece reads better as the artist's signature work — e.g. John
      Provencher, whose exhibition leads with HAHA but whose artist
      page should display *over-time* running. Animated formats
      (WebP/GIF) work for "live"-feeling renders. */
  showcaseImage?: string;
  /** Override for the live iframe shown on the artist page. Takes
      precedence over `showcaseImage` when set. Use when the artist's
      signature work runs as a JavaScript canvas (e.g. John Provencher's
      *over-time* — same iframe URL as the exhibition's inline artwork
      cells, so both surfaces render at full WebGL/canvas resolution
      instead of via a low-res webp capture). */
  showcaseIframe?: string;
  /** Aspect ratio (w/h) of the iframe canvas, e.g. "1" for square. */
  showcaseIframeAspect?: string;
  /** Override for a showcase video on the artist page. Takes precedence
      over `showcaseImage`. Use when the work's motion is essential
      (e.g. Yoshi's *The Flood: Orchestrated* — the simulation IS the
      piece). Plays auto/muted/looped like the exhibition heroes. */
  showcaseVideo?: string;
  /** Optional poster frame for the video. */
  showcaseVideoPoster?: string;
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
  /** Optional video URL (mp4). If set, the Explore row autoplays the
      video on loop in place of the static image — used when per-item
      animated GIFs aren't available but a transcoded video is. */
  video?: string;
  /** Optional iframe URL — used for live generative artwork pieces
      (e.g. Verse-hosted JS bundles). When set, the Explore row embeds
      the iframe and overlays a transparent anchor for the click-through
      so the link still routes to verseUrl. */
  iframe?: string;
  /** Catalogue metadata for the explore-row caption's second line.
      Year falls back to `exhibition.year`; edition is auto-derived
      from a `#N` suffix in the title combined with `exhibition.workCount`
      (or set explicitly here to override). */
  year?: number;
  edition?: string;
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
  artistBioOverride?: boolean;   // when true, prefer local artistBio over the Verse-fetched one
  hero?: string;                 // used on exhibition detail page
  heroVideo?: string;            // if set, the detail hero renders this muted autoplay loop instead of the hero image
  heroVideoPoster?: string;      // poster frame for heroVideo, if different from `hero`. Prevents a visible frame-jump when the video starts playing from a still that isn't its first frame.
  heroIframe?: string;           // if set, the detail hero renders this live generative artwork iframe instead of the hero image/video. Use Verse's S3 genart URL.
  heroIframeAspect?: string;     // aspect ratio for the heroIframe slot, e.g. "1" (default), "4/5"
  heroIframeRandomize?: boolean; // when true, the client replaces the payload's `hash` field with a fresh 64-char hex value on every mount, so the genart re-rolls visibly on every page load (most generative bundles are hash-deterministic — bumping just a cache-buster won't visibly change the output).
  heroVerseUrl?: string;         // override for the hero plate's outbound link; falls back to `verseSeriesUrl`. Use when the hero presents a single specific work distinct from the series page.
  homepageHero?: string;         // used on homepage hero — may differ from detail hero
  homepageHeroVideo?: string;    // if set, the homepage hero renders this muted autoplay loop instead of homepageHero/hero
  homepageHeroVideoPoster?: string; // poster frame for homepageHeroVideo
  releaseDate?: string;          // ISO timestamp for upcoming exhibitions — drives the flip-clock countdown on the detail page
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
    items: { image: string; alt: string; title?: string; verseUrl?: string; video?: string; iframe?: string; aspectRatio?: number; unoptimized?: boolean; linkable?: boolean; cssVars?: Record<string, string | number>; year?: number; edition?: string }[];
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
  /** Physical exhibition metadata. If set, renders an "Exhibited at"
      colophon block with venue, address, and run dates. Used for shows
      that ran (or run) in a brick-and-mortar gallery alongside the
      Verse-hosted online exhibition. Past shows show just the run
      range — opening event details are intentionally omitted as
      ephemeral metadata. */
  physicalExhibition?: {
    venue: string;
    venueUrl?: string;
    address: string;
    dates: string;       // e.g. "17 – 27 July 2024"
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
