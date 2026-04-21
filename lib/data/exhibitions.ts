import type { Exhibition, Work } from "@/lib/types";

const imaginedWreckageWorks: Work[] = [
  {
    id: "xerox-bouquet",
    title: "Xerox Bouquet",
    year: 2024,
    number: "№ 07",
    edition: "1/1 edition",
    image: "/images/chuck-anderson/xerox-bouquet.jpg",
    alt: "Chuck Anderson, Xerox Bouquet, 2024",
    coord: "A,01",
  },
  {
    id: "cathode-moth",
    title: "Cathode Moth",
    year: 2024,
    number: "№ 14",
    edition: "1/1 edition",
    image: "/images/chuck-anderson/cathode-moth.jpg",
    alt: "Chuck Anderson, Cathode Moth, 2024",
    coord: "A,02",
  },
  {
    id: "wiring-harness",
    title: "Wiring Harness",
    year: 2024,
    number: "№ 22",
    edition: "1/1 edition",
    image: "/images/chuck-anderson/wiring-harness.jpg",
    alt: "Chuck Anderson, Wiring Harness, 2024",
    coord: "A,03",
  },
  {
    id: "viewfinder",
    title: "Viewfinder",
    year: 2024,
    number: "№ 31",
    edition: "1/1 edition",
    image: "/images/chuck-anderson/viewfinder.jpg",
    alt: "Chuck Anderson, Viewfinder, 2024",
    coord: "B,01",
  },
  {
    id: "engine-garden",
    title: "Engine / Garden",
    year: 2024,
    number: "№ 44",
    edition: "1/1 edition",
    image: "/images/chuck-anderson/engine-garden.jpg",
    alt: "Chuck Anderson, Engine / Garden, 2024",
    coord: "B,02",
  },
  {
    id: "latent-daydream",
    title: "Latent Daydream",
    year: 2024,
    number: "№ 89",
    edition: "1/1 edition",
    image: "/images/chuck-anderson/latent-daydream.jpg",
    alt: "Chuck Anderson, Latent Daydream, 2024",
    coord: "B,03",
  },
];

export const exhibitions: Exhibition[] = [
  // === CURRENT ===
  {
    slug: "iso-iec-10646",
    artistSlug: "paul-prudence",
    artistName: "Paul Prudence",
    title: "ISO/IEC 10646",
    year: 2025,
    month: "Aug",
    date: "August 2025",
    location: "Verse",
    status: "current",
    hero: "/images/paul-prudence/iso-iec-10646-hero.jpg",
    heroTheme: "paper",
    verseSeriesUrl: "https://verse.works/series/iso-iec-10646-by-paul-prudence",
    description: [
      "Generative pattern systems derived from the Unicode character encoding standard. Prudence treats the administrative scaffolding of written language, with its glyph tables, code points, and supplementary planes, as source material, mapping its internal geometries into time-based visual compositions. The release presents a suite of real-time works alongside a printed companion examining the standard's typographic architecture.",
    ],
  },
  {
    slug: "imagined-wreckage",
    artistSlug: "chuck-anderson",
    artistName: "Chuck Anderson",
    title: "Imagined Wreckage",
    year: 2024,
    month: "Jul",
    date: "July 2024",
    location: "Verse",
    status: "current",
    hero: "/images/chuck-anderson/imagined-wreckage-hero.jpg",
    homepageHero: "/images/chuck-anderson/homepage-hero.jpg",
    presentedBy: "Ivan Zhyzhkevych",
    workCount: 96,
    verseSeriesUrl: "https://verse.works/series/imagined-wreckage-by-chuck-anderson",
    works: imaginedWreckageWorks,
    featuredArtworks: [
      {
        id: "scratch-disk-amnesia",
        title: "Scratch Disk Amnesia",
        image: "/images/chuck-anderson/featured/scratch-disk-amnesia.jpg",
        alt: "Chuck Anderson, Scratch Disk Amnesia",
        verseUrl:
          "https://verse.works/items/ethereum/0x74f41f4d43c064f69958c56536381a235be906c4/0",
      },
      {
        id: "completely-legal-esoteric-scrabble-strategy",
        title: "Completely Legal Esoteric Scrabble Strategy",
        image:
          "/images/chuck-anderson/featured/completely-legal-esoteric-scrabble-strategy.jpg",
        alt: "Chuck Anderson, Completely Legal Esoteric Scrabble Strategy",
        verseUrl:
          "https://verse.works/items/ethereum/0x74f41f4d43c064f69958c56536381a235be906c4/44",
      },
    ],
    description: [
      `The Garden is pleased to present <em>Imagined Wreckage</em>, a series of photo collage and generative AI works by Chicago-based artist <a class="prose-link" href="/artists/chuck-anderson">Chuck Anderson</a>. Known for his multidisciplinary approach, Anderson's work is characterised by his distinctive use of colour, light, and foregrounding of digital technology.`,
      `Described by the artist as a collection &ldquo;about amalgamation,&rdquo; the series dissects the boundaries between an artist's life and work in a post-internet, AI-focused era. The use of generative AI echoes across the works not simply in the output of the models, but through the way their processes parallel Anderson's own assembly of aggregated experience.`,
      `Elements of the digital process lie embedded in the pieces. Wires, circuit boards, screens, and viewfinders are scattered throughout, eroding the line between the work and the working practice. The inclusion of photography gives the series an almost autobiographical quality, humanising the use of AI and embedding Anderson directly into the fabric of the collection.`,
      `Engine parts alongside nods to hardcore and punk tropes are bathed in iridescence, balanced against flowers and butterflies, breaking down traditional aesthetic associations. Hard edges become surprisingly softened; crystalline textures feel malleable; opaque fogs settle into almost structural components. The pieces resist easy categorisation &mdash; equal parts virtual, sculptural, and photographic &mdash; giving <em>Imagined Wreckage</em> a dream-like quality that speaks to the AI hallucinations and latent dreaming informing so much of contemporary digital art.`,
    ],
    prev: { slug: "deluge", artistName: "CHEPERTOM", title: "Deluge" },
    next: { slug: "new-life-to-still-life", artistName: "Cydr", title: "New-Life, to Still-Life" },
  },

  // === PAST — 2025 ===
  { slug: "pictography",            artistSlug: "1mposter",          artistName: "1mposter",          title: "Pictography",            year: 2025, month: "Apr", date: "April 2025",    location: "Verse", status: "past" },

  // === PAST — 2024 ===
  { slug: "distrakted",             artistSlug: "mark-webster",      artistName: "Mark Webster",      title: "DistraKted",             year: 2024, month: "Dec", date: "December 2024", location: "Verse", status: "past" },
  { slug: "trails",                 artistSlug: "perfectl00p",       artistName: "PERFECTL00P",       title: "Trails",                 year: 2024, month: "Nov", date: "November 2024", location: "Verse", status: "past" },
  { slug: "phantasmagoria",         artistSlug: "mazin",             artistName: "Mazin",             title: "Phantasmagoria",         year: 2024, month: "Oct", date: "October 2024",  location: "Verse", status: "past" },
  { slug: "bully",                  artistSlug: "riiiis",            artistName: "RIIIIS",            title: "Bully",                  year: 2024, month: "Oct", date: "October 2024",  location: "Verse", status: "past" },
  { slug: "piezo",                  artistSlug: "rudxane",           artistName: "Rudxane",           title: "Piezo",                  year: 2024, month: "Jul", date: "July 2024",     location: "Verse", status: "past" },
  { slug: "equinox",                artistSlug: "aluan-wang",        artistName: "Aluan Wang",        title: "春分 ｜ Equinox",        year: 2024, month: "Jul", date: "July 2024",     location: "Verse", status: "past", cardImage: "/images/aluan-wang/equinox.jpg" },
  { slug: "escapes",                artistSlug: "t-k-z",             artistName: "Tù.úk'z",           title: "Escapes",                year: 2024, month: "Jun", date: "June 2024",     location: "Verse", status: "past" },
  { slug: "deluge",                 artistSlug: "chepertom",         artistName: "CHEPERTOM",         title: "Deluge",                 year: 2024, month: "May", date: "May 2024",      location: "Verse", status: "past" },
  { slug: "basalt-gifs",            artistSlug: "itsgalo",           artistName: "Itsgalo",           title: "Basalt GIFs",            year: 2024, month: "May", date: "May 2024",      location: "Verse", status: "past" },
  { slug: "autoscope",              artistSlug: "erik-swahn",        artistName: "Erik Swahn",        title: "Autoscope",              year: 2024, month: "Apr", date: "April 2024",    location: "Verse", status: "past" },
  { slug: "gwanak-gu",              artistSlug: "earthsample",       artistName: "Earthsample",       title: "Gwanak-gu",              year: 2024, month: "Mar", date: "March 2024",    location: "Verse", status: "past" },
  { slug: "isle-of-alcina",         artistSlug: "t-k-z",             artistName: "Tù.úk'z",           title: "Isle of Alcina",         year: 2024, month: "Mar", date: "March 2024",    location: "Verse", status: "past" },
  { slug: "glitch-garden",          artistSlug: "sp-gelsesmaskinen", artistName: "Spøgelsesmaskinen", title: "Glitch Garden",          year: 2024, month: "Feb", date: "February 2024", location: "Verse", status: "past" },
  { slug: "making-an-egg",          artistSlug: "nikita-diakur",     artistName: "Nikita Diakur",     title: "Making an Egg with Hands", year: 2024, month: "Jan", date: "January 2024", location: "Verse", status: "past" },
  { slug: "the-flood",              artistSlug: "yoshi-sodeoka",     artistName: "Yoshi Sodeoka",     title: "The Flood: Orchestrated", year: 2024, month: "Jan", date: "January 2024",  location: "Verse", status: "past", cardVideo: "/images/yoshi-sodeoka/the-flood-orchestrated.mp4", cardImage: "/images/yoshi-sodeoka/the-flood-orchestrated-poster.jpg" },

  // === PAST — 2023 ===
  { slug: "constraint",             artistSlug: "eric-andwer",       artistName: "Eric Andwer",       title: "Constraint",             year: 2023, month: "Nov", date: "November 2023", location: "Verse", status: "past" },
  { slug: "haha-over-time",         artistSlug: "john-provencher",   artistName: "John Provencher",   title: "HAHA, over-time",        year: 2023, month: "Nov", date: "November 2023", location: "Verse", status: "past", cardImage: "/images/john-provencher/haha.jpg" },
  { slug: "new-life-to-still-life", artistSlug: "cydr",              artistName: "Cydr",              title: "New-Life, to Still-Life", year: 2023, month: "Sep", date: "September 2023", location: "Verse", status: "past" },
  { slug: "space-time",             artistSlug: "loackme",           artistName: "Loackme",           title: "Space\\Time",            year: 2023, month: "Aug", date: "August 2023",   location: "Verse", status: "past" },
  { slug: "simple-thoughts",        artistSlug: "khwampa",           artistName: "Khwampa",           title: "Simple Thoughts",        year: 2023, month: "Jun", date: "June 2023",     location: "Verse", status: "past" },
  { slug: "drift",                  artistSlug: "paolo-eri",         artistName: "Paolo Čerić",       title: "Drift",                  year: 2023, month: "May", date: "May 2023",      location: "Verse", status: "past" },
];

export const getExhibitionsByStatus = (status: Exhibition["status"]) =>
  exhibitions.filter((e) => e.status === status);

export const getExhibitionBySlug = (slug: string) =>
  exhibitions.find((e) => e.slug === slug);

export const getExhibitionSlugs = () => exhibitions.map((e) => e.slug);
