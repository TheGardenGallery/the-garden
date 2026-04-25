import type { Exhibition } from "@/lib/types";

export const exhibitions: Exhibition[] = [
  // === CURRENT ===
  {
    slug: "iso-iec-10646",
    artistSlug: "paul-prudence",
    artistName: "Paul Prudence",
    title: "ISO/IEC 10646",
    year: 2024,
    month: "Nov",
    date: "November 2024",
    location: "Verse",
    status: "current",
    hero: "/images/paul-prudence/iso-iec-10646-hero.jpg",
    heroTheme: "paper",
    descriptionByArtist: true,
    disableListHoverZoom: true,
    listImageScale: 1.12,
    verseSeriesUrl: "https://verse.works/series/iso-iec-10646-by-paul-prudence",
    workCount: 70,
    details: {
      sourceImage: "/images/paul-prudence/iso-iec-10646-detail-source.png",
      title: "ISO/IEC 10646 #70",
      verseUrl: "https://verse.works/items/ethereum/0x67f56e7a4a5f071a46f13e67d467f78c34df3051/69",
      aspectRatio: "1",
      artworkInset: { top: 5, right: 6, bottom: 5, left: 6 },
      crops: [
        { id: "upper-texture", x: 40, y: 25, zoom: 2.6 },
        { id: "mid-bands",     x: 50, y: 50, zoom: 2.6 },
        { id: "lower-weave",   x: 55, y: 75, zoom: 2.6 },
      ],
    },
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/paul-prudence/iso-iec-10646-inline-1.png",
            alt: "Paul Prudence, ISO/IEC 10646 #45",
            title: "ISO/IEC 10646 #45",
            verseUrl:
              "https://verse.works/items/ethereum/0x67f56e7a4a5f071a46f13e67d467f78c34df3051/44",
          },
          {
            image: "/images/paul-prudence/iso-iec-10646-inline-2.png",
            alt: "Paul Prudence, ISO/IEC 10646 #34",
            title: "ISO/IEC 10646 #34",
            verseUrl:
              "https://verse.works/items/ethereum/0x67f56e7a4a5f071a46f13e67d467f78c34df3051/33",
          },
        ],
      },
    ],
    description: [
      `<em>ISO/IEC 10646</em>* marks a culmination in a series of works exploring the use of text and signs as a material from which to weave fabrics of encoded patterns. The collection explores the historical links between weaving and computing, and their shared history of punched-card programming.`,
      `Using solely the Unicode block elements as a base material, the generated patterns evoke a nostalgia for the age of teletype and early dot-matrix printers while simultaneously referencing early computational aesthetics such as arcade games and command-line interfaces. Now no longer tied to their original utility for use in software terminal emulation these special characters, which are today index fossils from the early era of computing, have been transcoded into weave patterns that define larger pictorial systems. Just as there are ancient tapestries depicting scenes from culturally significant events, some outputs of <em>ISO/IEC 10646</em> recall images of our earliest arcade games with scenes of partly-destroyed fortresses and floating space debris, rockets and asteroids. But among the many permutations of the collection you will also find the traces of cartographic systems, the rubrics of ciphers and the aesthetics of MS DOS&rsquo;s Defrag program.`,
      `<em>ISO/IEC 10646</em> is a homage to the computational universality of the grid for mapping and as a tool for notation. It celebrates grids as encoders of transferable intelligence and is a paean to the grid&rsquo;s universal interactions which &mdash; as intimated by Turing&rsquo;s revolutionary thesis &mdash; culminates in the proposition that that universality could be used to reconstruct all human knowledge.`,
      `My earliest memories of computer science lessons at school involved using a machine with a dial-up modem. I used to spend school breaks writing programs in BASIC using trigonometry functions to plot visual patterns which I would then print out on a dot-matrix printer. <em>ISO/IEC 10646</em> touches on my nostalgia for those early dialogues with machines and the grid-based formatting of information that we relied on to communicate with one another.`,
      `<span class="ex-footnote">*The title of the series <em>ISO/IEC 10646</em> is the international standard reference that specifies the Universal Coded Character Set of which the block elements are a small subset.</span>`,
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
    status: "past",
    hero: "/images/chuck-anderson/imagined-wreckage-hero.jpg",
    homepageHero: "/images/chuck-anderson/homepage-hero.jpg",
    frameColor: "#000000",
    presentedBy: "Ivan Zhyzhkevych",
    workCount: 96,
    verseSeriesUrl: "https://verse.works/series/imagined-wreckage-by-chuck-anderson",
    details: {
      sourceImage: "/images/chuck-anderson/featured/raw-digital-materials.jpg",
      title: "Raw Digital Materials",
      verseUrl:
        "https://verse.works/items/ethereum/0x74f41f4d43c064f69958c56536381a235be906c4/87",
      aspectRatio: "1",
      artworkInset: { top: 0, right: 0, bottom: 0, left: 0 },
      crops: [
        { id: "engine-black",  x: 28, y: 75, zoom: 2.6 },
        { id: "flame-bridge",  x: 48, y: 50, zoom: 2.6 },
        { id: "blue-field",    x: 60, y: 24, zoom: 2.6 },
      ],
    },
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/chuck-anderson/featured/scratch-disk-amnesia.jpg",
            alt: "Chuck Anderson, Scratch Disk Amnesia",
            title: "Scratch Disk Amnesia",
            verseUrl:
              "https://verse.works/items/ethereum/0x74f41f4d43c064f69958c56536381a235be906c4/0",
          },
          {
            image:
              "/images/chuck-anderson/featured/completely-legal-esoteric-scrabble-strategy.jpg",
            alt: "Chuck Anderson, Completely Legal Esoteric Scrabble Strategy",
            title: "Completely Legal Esoteric Scrabble Strategy",
            verseUrl:
              "https://verse.works/items/ethereum/0x74f41f4d43c064f69958c56536381a235be906c4/44",
          },
        ],
      },
    ],
    description: [
      `The Garden is pleased to present <em>Imagined Wreckage</em>, a series of photo collage and generative AI works by Chicago-based artist Chuck Anderson. Known for his multidisciplinary approach, Anderson's work is characterised by his distinctive use of colour, light, and foregrounding of digital technology.`,
      `Described by the artist as a collection &ldquo;about amalgamation,&rdquo; the series dissects the boundaries between an artist's life and work in a post-internet, AI-focused era. The use of generative AI echoes across the works not simply in the output of the models, but through the way their processes parallel Anderson's own assembly of aggregated experience.`,
      `Elements of the digital process lie embedded in the pieces. Wires, circuit boards, screens, and viewfinders are scattered throughout, eroding the line between the work and the working practice. The inclusion of photography gives the series an almost autobiographical quality, humanising the use of AI and embedding Anderson directly into the fabric of the collection.`,
      `Engine parts alongside nods to hardcore and punk tropes are bathed in iridescence, balanced against flowers and butterflies, breaking down traditional aesthetic associations. Hard edges become surprisingly softened; crystalline textures feel malleable; opaque fogs settle into almost structural components. The pieces resist easy categorisation &mdash; equal parts virtual, sculptural, and photographic &mdash; giving <em>Imagined Wreckage</em> a dream-like quality that speaks to the AI hallucinations and latent dreaming informing so much of contemporary digital art.`,
    ],
    prev: { slug: "deluge", artistName: "CHEPERTOM", title: "Deluge" },
    next: { slug: "new-life-to-still-life", artistName: "Cydr", title: "New-Life, to Still-Life" },
  },

  // === PAST — 2025 ===
  {
    slug: "pictography",
    artistSlug: "1mposter",
    artistName: "1mposter",
    title: "Pictography",
    year: 2025,
    month: "Apr",
    date: "April 2025",
    location: "Verse",
    status: "past",
    hero: "/images/1mposter/pictography-hero.gif",
    heroTheme: "dark",
    frameColor: "#000000",
    disableListHoverZoom: true,
    descriptionByArtist: true,
    verseSeriesUrl: "https://verse.works/series/pictography-by-1mposter",
    description: [
      `Even though these animated pictograms are fairly high resolution (1575x1575px), they are all rendered in a 45x45 character grid as ASCII art.`,
      `In a way, they are very low resolution depictions of ideas and feelings.`,
    ],
    // Order is significant: index 2 sits in the center of the quincunx
    // layout, with indices 0/1/3/4 anchoring the four corners.
    exploreArtworks: [
      {
        id: "pictography-home",
        title: "Home",
        image: "/images/1mposter/pictography-home.gif",
        poster: "/images/1mposter/pictography-home-poster.png",
        alt: "1mposter, Pictography — Home",
        verseUrl: "https://verse.works/items/ethereum/0xb9d36b839fac842d90d2857102ce1c1bedd59695/1",
      },
      {
        id: "pictography-work",
        title: "Work",
        image: "/images/1mposter/pictography-work.gif",
        poster: "/images/1mposter/pictography-work-poster.png",
        alt: "1mposter, Pictography — Work",
        verseUrl: "https://verse.works/items/ethereum/0xb9d36b839fac842d90d2857102ce1c1bedd59695/2",
      },
      {
        id: "pictography-power",
        title: "Power",
        image: "/images/1mposter/pictography-power.gif",
        poster: "/images/1mposter/pictography-power-poster.png",
        alt: "1mposter, Pictography — Power",
        verseUrl: "https://verse.works/items/ethereum/0xb9d36b839fac842d90d2857102ce1c1bedd59695/3",
      },
      {
        id: "pictography-social-climbers",
        title: "Social Climbers",
        image: "/images/1mposter/pictography-social-climbers.gif",
        poster: "/images/1mposter/pictography-social-climbers-poster.png",
        alt: "1mposter, Pictography — Social Climbers",
        verseUrl: "https://verse.works/items/ethereum/0xb9d36b839fac842d90d2857102ce1c1bedd59695/4",
      },
      {
        id: "pictography-flit",
        title: "Flit",
        image: "/images/1mposter/pictography-flit.gif",
        poster: "/images/1mposter/pictography-flit-poster.png",
        alt: "1mposter, Pictography — Flit",
        verseUrl: "https://verse.works/items/ethereum/0xb9d36b839fac842d90d2857102ce1c1bedd59695/5",
      },
    ],
  },

  // === PAST — 2024 ===
  { slug: "distrakted",             artistSlug: "mark-webster",      artistName: "Mark Webster",      title: "DistraKted",             year: 2024, month: "Dec", date: "December 2024", location: "Verse", status: "past" },
  { slug: "trails",                 artistSlug: "perfectl00p",       artistName: "PERFECTL00P",       title: "Trails",                 year: 2024, month: "Nov", date: "November 2024", location: "Verse", status: "past" },
  {
    slug: "phantasmagoria",
    artistSlug: "mazin",
    artistName: "Mazin",
    title: "Phantasmagoria",
    year: 2024,
    month: "Oct",
    date: "October 2024",
    location: "Verse",
    status: "past",
    hero: "/images/mazin/phantasmagoria-hero.gif",
    heroTheme: "dark",
    descriptionByArtist: true,
    verseSeriesUrl: "https://verse.works/series/phantasmagoria-by-mazin",
    description: [
      `<em>Phantasmagoria</em> is a deeply cold and dreamy dark-fantasy world defined by its unique glitch aesthetic.`,
      `Surreal gothscape&rsquo;s are composed of experimental, grotesque and glyptic architectural elements.`,
      `The series blends AI, generative art, data-bending and glitch techniques to craft a purely digital universe. Mazin envisions himself as a &ldquo;realm photojournalist&rdquo; in this vast, enigmatic world, where every detail reveals its own story. In a land overtaken by corruption, purity endures at its roots. Souls persist amid the decay, while majestic structures stand resilient.`,
    ],
    exploreArtworks: [
      {
        id: "phantasmagoria-cleanse",
        title: "C.L.E.A.N.S.E",
        image: "/images/mazin/phantasmagoria-cleanse.gif",
        poster: "/images/mazin/phantasmagoria-cleanse-poster.png",
        alt: "Mazin, Phantasmagoria — C.L.E.A.N.S.E",
        verseUrl: "https://verse.works/artworks/af919830-5a55-4ca9-ae15-2925955450b8",
      },
      {
        id: "phantasmagoria-rootknight",
        title: "Rootknight",
        image: "/images/mazin/phantasmagoria-rootknight.gif",
        poster: "/images/mazin/phantasmagoria-rootknight-poster.png",
        alt: "Mazin, Phantasmagoria — Rootknight",
        verseUrl: "https://verse.works/artworks/df47ffae-2c49-4222-abec-9d2a8fd4bd57",
      },
      {
        id: "phantasmagoria-phantasmagorian",
        title: "Phantasmagorian",
        image: "/images/mazin/phantasmagoria-phantasmagorian.gif",
        poster: "/images/mazin/phantasmagoria-phantasmagorian-poster.png",
        alt: "Mazin, Phantasmagoria — Phantasmagorian",
        verseUrl: "https://verse.works/artworks/5b94924d-9d89-46f4-9cdf-82dd6e8bc88b",
      },
      {
        id: "phantasmagoria-ruinscape-isometrica",
        title: "Ruinscape Isometrica",
        image: "/images/mazin/phantasmagoria-ruinscape-isometrica.gif",
        poster: "/images/mazin/phantasmagoria-ruinscape-isometrica-poster.png",
        alt: "Mazin, Phantasmagoria — Ruinscape Isometrica",
        verseUrl: "https://verse.works/artworks/e5361967-044e-4069-b4d9-9dde6f872aa8",
      },
      {
        id: "phantasmagoria-obsidian-distantscape",
        title: "Obsidian Distantscape",
        image: "/images/mazin/phantasmagoria-obsidian-distantscape.gif",
        poster: "/images/mazin/phantasmagoria-obsidian-distantscape-poster.png",
        alt: "Mazin, Phantasmagoria — Obsidian Distantscape",
        verseUrl: "https://verse.works/artworks/f6a6c223-86cb-458b-89ed-54a1f3b65350",
      },
    ],
  },
  { slug: "bully",                  artistSlug: "riiiis",            artistName: "RIIIIS",            title: "Bully",                  year: 2024, month: "Oct", date: "October 2024",  location: "Verse", status: "past" },
  {
    slug: "piezo",
    artistSlug: "rudxane",
    artistName: "Rudxane",
    title: "Piezo",
    year: 2024,
    month: "Jul",
    date: "July 2024",
    location: "Verse",
    status: "past",
    hero: "/images/rudxane/piezo-hero.png",
    heroTheme: "dark",
    descriptionByArtist: true,
    verseSeriesUrl: "https://verse.works/exhibitions/piezo",
    description: [
      `<em>For the last year, I&rsquo;ve spent countless hours watching my printer draw my work line-by-line, applying ink while constantly resisting the urge to pull the paper and change the spacing between each line drawn.</em>`,
      `<em>Piezo is inspired by this urge: what if we draw line-by-line like a printer but change the spacing between each drawn line? The movement only happens on the x-axis, where each grid item within a recursive grid gets its own &ldquo;printhead&rdquo; to draw. We then put the x-axis coordinates through a sine function, so it moves in both the positive and the negative directions of the grid block.</em>`,
      `<em>By appointing a separate drawing speed to each grid item, the colors of each grid block are mixed together during the drawing to create gradients and combinations of colors.</em>`,
      `&mdash; Rudxane`,
    ],
  },
  {
    slug: "equinox",
    artistSlug: "aluan-wang",
    artistName: "Aluan Wang",
    title: "春分 ｜ Equinox",
    year: 2024,
    month: "Jul",
    date: "July 2024",
    location: "Verse",
    status: "past",
    hero: "/images/aluan-wang/equinox-hero.jpg",
    heroTheme: "paper",
    descriptionByArtist: true,
    cardImage: "/images/aluan-wang/equinox.jpg",
    verseSeriesUrl: "https://verse.works/series/equinox-by-aluan-wang",
    workCount: 64,
    description: [
      `Mapping is not a mere simulation; it is the transformation of reality.`,
      `In Asian culture, the equinox symbolizes rebirth and renewal, akin to the significance of Easter in the West. For me, this festival holds special meaning as it is an integral part of my rural upbringing and a vessel for my childhood memories and emotions.`,
      `Throughout my artistic journey, I have been exploring invisible pathways and overarching systems. From my audiovisual work <em>Dynamized Center</em> a decade ago to last year&rsquo;s <em>Automatic Messages</em>, each piece delves into the essence of generative systems. I firmly believe that the heart of generative art lies not only in the visual output but also in the comprehensive systems driving these outputs.`,
      `Within this series, I designed several interacting systems whose interplay results in unpredictable outcomes, embodying seasonal transitions and natural cycles whilst aiming to capture subtle emotions that are easily overlooked in our fast-paced world. Rather than serving as an imitation of reality, <em>Equinox</em> is a reinterpretation and creation of it.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/aluan-wang/equinox-inline-1.jpg",
            alt: "Aluan Wang, Equinox #12",
            title: "Equinox #12",
            verseUrl:
              "https://verse.works/items/ethereum/0x909666d671fef2f593ef8c70cbd43abf60e75c24/11",
          },
          {
            image: "/images/aluan-wang/equinox-inline-2.jpg",
            alt: "Aluan Wang, Equinox #13",
            title: "Equinox #13",
            verseUrl:
              "https://verse.works/items/ethereum/0x909666d671fef2f593ef8c70cbd43abf60e75c24/12",
          },
        ],
      },
      {
        afterParagraphIndex: 2,
        items: [
          {
            image: "/images/aluan-wang/equinox-inline-3.jpg",
            alt: "Aluan Wang, Equinox #21",
            title: "Equinox #21",
            verseUrl:
              "https://verse.works/items/ethereum/0x909666d671fef2f593ef8c70cbd43abf60e75c24/20",
          },
        ],
      },
    ],
  },
  { slug: "escapes",                artistSlug: "t-k-z",             artistName: "Tù.úk'z",           title: "Escapes",                year: 2024, month: "Jun", date: "June 2024",     location: "Verse", status: "past" },
  {
    slug: "deluge",
    artistSlug: "chepertom",
    artistName: "CHEPERTOM",
    title: "Deluge",
    year: 2024,
    month: "May",
    date: "May 2024",
    location: "Verse",
    status: "past",
    hero: "/images/chepertom/deluge-hero.png",
    heroTheme: "dark",
    descriptionByArtist: true,
    verseSeriesUrl: "https://verse.works/series/deluge-by-chepertom",
    description: [
      `This series delves into the close relationship between RAW and RAD formats. RAWs are the initial, unprocessed matter that serves as the foundation for the emergence of RAD. These RAWs are 9/16 horizontal video screenshots that capture my attention with their striking colors, patterns, and compositions.`,
      `My first impression while staring at RAWs is similar to acknowledging complex math problems or looking at a shuffled Rubik&rsquo;s cube. At first glance, you may not have the entire solution in mind, but the intriguing nature of the RAWs inspires me to search for more refined details and patterns. I spend days examining these intricate landscapes, looking for the perfect crop and exploring various versions of specific parts. This exercise helps me train my abstract senses and focus on reducing the vast amount of data from the video source into a single, captivating composition. I call this final product RAD.`,
      `The relations between chaos and order, signal and noise are at the core of my artistic practice. For this particular drop, I wanted to create a series centered around the theme of tsunamis, which embodies the chaos theory concept where small details can have significant effects on a larger scale. The collection highlights various signs and stages of tsunamis, from the waters drawback to the aftermath.`,
    ],
  },
  { slug: "basalt-gifs",            artistSlug: "itsgalo",           artistName: "Itsgalo",           title: "Basalt GIFs",            year: 2024, month: "May", date: "May 2024",      location: "Verse", status: "past" },
  {
    slug: "autoscope",
    artistSlug: "erik-swahn",
    artistName: "Erik Swahn",
    title: "Autoscope",
    year: 2024,
    month: "Apr",
    date: "April 2024",
    location: "Verse",
    status: "past",
    hero: "/images/erik-swahn/autoscope-hero.jpg",
    heroTheme: "dark",
    descriptionByArtist: true,
    verseSeriesUrl: "https://verse.works/series/autoscope-by-erik-swahn",
    description: [
      `In <em>Autoscope</em>, Erik Swahn returns to the theme of color as building material from previous series such as <em>Farbteiler</em> (2021), <em>Punktwelt</em> (2022) and <em>Funktor</em> (2023). His new series as a whole describes an abstract universe consisting only of color, with each piece depicting a different scene within that universe.`,
      `Whereas many of Swahn&rsquo;s previous series have had objects as their motifs, <em>Autoscope</em> rather portrays places in the form of configurations of simple geometries. Mountains are implied through pyramids and cones, ocean swell through sine waves, and barren forests through arrays of cylinders. Some places are inhabited by primitive geometries moving through space.`,
      `In a number of different tableaux, rendered in perspectiveless projection, the series evokes a very reduced sense of place, or perhaps recollection of place, sometimes with parts of the images blurred or distorted. In some scenes, even parts of the geometries are subject to erasure. In contrast to this barrenness, each scene is rich in saturation, movement and animated intensity, pulling the viewer into a chromatic world of its own peculiar logic.`,
    ],
  },
  {
    slug: "gwanak-gu",
    artistSlug: "earthsample",
    artistName: "Earthsample",
    title: "gwanak-gu",
    year: 2024,
    month: "Mar",
    date: "March 2024",
    location: "Verse",
    status: "past",
    hero: "/images/earthsample/gwanak-gu-hero.gif",
    heroTheme: "dark",
    descriptionByArtist: true,
    verseSeriesUrl: "https://verse.works/series/gwanak-gu-by-earthsample",
    description: [
      `<em>A collection of digitally collaged pieces made during my multi month long stay in korea. combining photos of my environment, each piece threads memories and experiences held throughout the trip, reflecting the physical and mental landscape i found myself in.</em> &mdash; earthsample`,
    ],
  },
  { slug: "isle-of-alcina",         artistSlug: "t-k-z",             artistName: "Tù.úk'z",           title: "Isle of Alcina",         year: 2024, month: "Mar", date: "March 2024",    location: "Verse", status: "past" },
  {
    slug: "heuristics-of-emotion",
    artistSlug: "jeres",
    artistName: "Jeres",
    title: "Heuristics of Emotion",
    year: 2024,
    month: "Feb",
    date: "February 2024",
    location: "Verse",
    status: "past",
    hero: "/images/jeres/heuristics-of-emotion-hero.jpg",
    heroTheme: "dark",
    descriptionByArtist: true,
    verseSeriesUrl: "https://verse.works/series/heuristics-of-emotion-artist-curated-by-jeres",
    description: [
      `Viscerally digital in aesthetic, yet deliberately static and a fixed aspect ratio, highly blended and textured, embracing the imperfection of handmade physicals while analog static collides with digitally emotive outbursts.`,
      `<em>Heuristics of Emotion</em> seeks to abstract an expression of what it looks like for a machine or AI to learn how to feel. An adolescent finding its emotional intelligence by emulating what it can pick up from humanity, and from what feedback it gets from it.`,
      `Static and optical aberrations showing blind spots in what it means to feel, or to understand one&rsquo;s feelings, mimicking how a person may be learning how to parse and unpack their own feelings as they evolve. It hopes to create empathy between a biological entity and one that&rsquo;s digital.`,
      `With minor variations when rendered across browsers and resolutions&mdash;yet still deterministic in context&mdash;it tries to pull the beauty and volatility of edge conditions in how software and hardware interpret a set of instructions to find unexpected expressions that can only exist by exploring the spaces where interpretations vary. Let&rsquo;s say it&rsquo;s emotional.`,
      `It reflects how pre-digital generative instructions&mdash;like rulesets for how lines should be drawn on a wall&mdash;can be rendered and presented unpredictably because of who may have executed said instructions where. The beauty is in the tension of interpretation and execution, not the final rendering on a pixel level. Context changes how you feel.`,
      `One machine may extract sentiment differently than another based on whatever biases have been programmed in or what their hardware allows. These discrepancies can be the most revealing.`,
      `A snapshot of a machine&mdash;soft or hard&mdash;as it learns to feel by emulating emotion, as we do, in part. All of our becomings.`,
    ],
  },
  { slug: "glitch-garden",          artistSlug: "sp-gelsesmaskinen", artistName: "Spøgelsesmaskinen", title: "Glitch Garden",          year: 2024, month: "Feb", date: "February 2024", location: "Verse", status: "past" },
  { slug: "making-an-egg",          artistSlug: "nikita-diakur",     artistName: "Nikita Diakur",     title: "Making an Egg with Hands", year: 2024, month: "Jan", date: "January 2024", location: "Verse", status: "past" },
  {
    slug: "the-flood",
    artistSlug: "yoshi-sodeoka",
    artistName: "Yoshi Sodeoka",
    title: "The Flood",
    year: 2024,
    month: "Jan",
    date: "January 2024",
    location: "Verse",
    status: "past",
    heroVideo: "/images/yoshi-sodeoka/the-flood-hero.mp4",
    heroVideoPoster: "/images/yoshi-sodeoka/the-flood-hero-poster.jpg",
    hero: "/images/yoshi-sodeoka/the-flood-orchestrated-poster.jpg",
    cardVideo: "/images/yoshi-sodeoka/the-flood-orchestrated.mp4",
    cardImage: "/images/yoshi-sodeoka/the-flood-orchestrated-poster.jpg",
    verseSeriesUrl: "https://verse.works/exhibitions/the-flood",
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/yoshi-sodeoka/the-flood-orchestrated-artwork-poster.jpg",
            video: "/images/yoshi-sodeoka/the-flood-orchestrated-artwork.mp4",
            alt: "Yoshi Sodeoka, The Flood: Orchestrated",
            title: "The Flood: Orchestrated",
            verseUrl: "https://verse.works/artworks/9468ee6a-3421-42d4-bcd7-d4ae58a961f5",
          },
        ],
      },
      {
        afterParagraphIndex: 2,
        items: [
          {
            image: "/images/yoshi-sodeoka/the-flood-chaos-poster.jpg",
            video: "/images/yoshi-sodeoka/the-flood-chaos.mp4",
            alt: "Yoshi Sodeoka, The Flood: Chaos",
            title: "The Flood: Chaos",
            verseUrl: "https://verse.works/artworks/c5c92f89-8ff5-4620-8b08-461404a50871",
          },
        ],
      },
    ],
    description: [
      `Yoshi Sodeoka&rsquo;s <a class="prose-link" href="https://verse.works/artworks/9468ee6a-3421-42d4-bcd7-d4ae58a961f5" target="_blank" rel="noopener"><em>The Flood: Orchestrated</em></a> and <a class="prose-link" href="https://verse.works/artworks/c5c92f89-8ff5-4620-8b08-461404a50871" target="_blank" rel="noopener"><em>The Flood: Chaos</em></a> consist of code-based simulations that juxtapose the organic behavioural patterns of spiders with the inorganic nature of algorithmic animation. While each generative spider in <a class="prose-link" href="https://verse.works/artworks/9468ee6a-3421-42d4-bcd7-d4ae58a961f5" target="_blank" rel="noopener"><em>The Flood: Orchestrated</em></a> is custom coded with unique parameters, those in <a class="prose-link" href="https://verse.works/artworks/c5c92f89-8ff5-4620-8b08-461404a50871" target="_blank" rel="noopener"><em>The Flood: Chaos</em></a> are governed by randomised behaviours generated by diverse parameters, symbolising both the inherent behaviours biological encoded within nature as well as the unpredictability that proliferates within the natural world. The resulting videos fluctuate between ballets and battles, with predator and prey struggling interminably in 13-second loops.`,
      `Sodeoka&rsquo;s fascination with spiders carries a personal resonance, stemming from his late mother&rsquo;s belief in their auspicious presence, they are symbolic of good luck, yet they are simultaneously involved in nature&rsquo;s tumultuous rhythms. The works in these series are not merely visual spectacles, but symphonies of structured chaos. Sodeoka&rsquo;s interest in storytelling even within the abstract realm is apparent in the narrative conflict within these works. For example, the parameters of each work in <a class="prose-link" href="https://verse.works/artworks/c5c92f89-8ff5-4620-8b08-461404a50871" target="_blank" rel="noopener"><em>The Flood: Chaos</em></a> are randomised, yet specified to mirror the hunting behaviours of spiders &mdash; their range of view whilst searching for prey, how eager they are when chasing their prey. Maintaining a sense of progression even within a very limited timeframe was a central aim in his creative process.`,
      `The series began with transforming footage of spiders&rsquo; behaviour into looping animations which were then manipulated using motion graphics softwares. In many of the works the spiders emanate from a central point symbolic of the nest, the origin of the spider&rsquo;s ominous journey. The spiders&rsquo; movements often escape beyond the confines of the digital canvas, leaving eerie trails in their wake. Both series contain auditory elements that adds to the disquieting visual environment, with the amalgamation of sight and sound heightening the sense of conflict and the viewer&rsquo;s experience of the works.`,
      `While the predator-prey interactions in <a class="prose-link" href="https://verse.works/artworks/9468ee6a-3421-42d4-bcd7-d4ae58a961f5" target="_blank" rel="noopener"><em>The Flood: Orchestrated</em></a> are meticulously coded to mirror the calculated movements of spiders, <a class="prose-link" href="https://verse.works/artworks/c5c92f89-8ff5-4620-8b08-461404a50871" target="_blank" rel="noopener"><em>The Flood: Chaos</em></a> embraces spontaneity, presenting a less scripted and more impromptu exploration. In the latter series, each iteration yields a new result utilising from the same initial parameters, utilising algorithmic spontaneity to create organic, unpredictable, and free-flowing depictions of arachnid-inspired behaviours. Together, these artworks provide viewers with a dual perspective that mirrors both the natural world and algorithmic creative possibilities, with <a class="prose-link" href="https://verse.works/artworks/9468ee6a-3421-42d4-bcd7-d4ae58a961f5" target="_blank" rel="noopener"><em>The Flood: Orchestrated</em></a> showcasing orchestrated precision, while <a class="prose-link" href="https://verse.works/artworks/c5c92f89-8ff5-4620-8b08-461404a50871" target="_blank" rel="noopener"><em>The Flood: Chaos</em></a> unveils the untamed beauty of disorder.`,
    ],
  },

  // === PAST — 2023 ===
  {
    slug: "solve-un-solve",
    artistSlug: "ves3l",
    artistName: "VES3L",
    title: "Solve-Un-Solve",
    year: 2023,
    month: "Nov",
    date: "November 2023",
    location: "Verse",
    status: "past",
    hero: "/images/ves3l/solve-un-solve-hero.png",
    heroTheme: "dark",
    descriptionByArtist: true,
    verseSeriesUrl: "https://verse.works/series/solve-un-solve-by-ves3l",
    description: [
      `It&rsquo;s the toy you played with as a kid. You don&rsquo;t remember who gave it to you&mdash;maybe it was your dad&rsquo;s. You held the block in your hand, rotated the parts randomly and scrambled it into a mess of color. The game was built for logical reasoning but there was no logic in your motions&mdash;you were having fun. Then came the desire to solve it; with the absence of the internet or a guide, you didn&rsquo;t know the algorithm required and it was beyond you to derive it. You could solve one side, maybe two, but never the entire thing; for that you need to know the seemingly random motions&mdash;but actually a calculated algorithm. So the block was left on the shelf in the closet.`,
      `Then you return to it one day, older and wiser. Now you have the internet and a computer science degree, you go through the motions and put the algorithm into practice. Sometimes you mess up, break the algorithm, and you get frustrated and start over. Suddenly you become like a robot making ever precise movements, and you finally solve it. You put the block down, satisfied and smug, you feel smart even though the solution is well known. You decide never to scramble it again since, to be fair, the solving process wasn&rsquo;t as fun as the un-solving. So it goes back onto the shelf in the closet.`,
      `Then you return to it one day resolving to make a generative art collection that captures the feeling you had when you solved it and realized your childhood was over.`,
      `<em>Solve-Un-Solve</em> mirrors the uncleanliness of life. It&rsquo;s a puzzle that creates problems for itself. It&rsquo;s a puzzle that tries to solve itself.`,
    ],
  },
  {
    slug: "constraint",
    artistSlug: "eric-andwer",
    artistName: "Eric Andwer",
    title: "Constraint",
    year: 2023,
    month: "Nov",
    date: "November 2023",
    location: "Verse",
    status: "past",
    workCount: 231,
    hero: "/images/eric-andwer/constraint-hero.jpg",
    verseSeriesUrl: "https://verse.works/series/constraint-by-eric-andwer",
    description: [
      `For so many artists, their work is a way of processing emotion. The inherent humanity of creative expression does not cease when a computer is introduced. In many cases, just like pencils, paint, paper, clay: code is merely a tool with which to bring these emotions to life. Eric Andwer&rsquo;s <em>Constraint</em> is evidence of this.`,
      `The works battle with the constraints we experience as we move through life. They visualise the emotions that can overwhelm us, and provide a therapeutic outlet.`,
      `Eric&rsquo;s imagination has always been awash with images that he wanted to bring into existence, but believing his drawing skills were inadequate, it wasn&rsquo;t until he found generative art that he had a medium that allowed him to do so. Upon discovering Art Blocks, a door was opened, and in 2020 Eric began creating art through code.`,
      `Eric holds transparency in high regard &mdash; he&rsquo;s struggled with depression, and he recognises that sometimes life is messy. For him creating art is like opening the pressure valve on the emotions that build up within. It is somewhere to deposit anger, frustration, anxiety and depression to create something beautiful. It is a transformative, expressive alchemy. It allows people to take raw emotion and connect with others through a shared passion, the love of art.`,
      `Life is full of constraints. We are governed by social norms that dictate what is and isn&rsquo;t acceptable. Sometimes we must mask our emotions, but in the process of creation Eric felt he was able to shed the mask and break through the ties that bind us, embracing imperfections.`,
      `It is tempting to ask the interminable question, which came first, the chicken or the egg? Are these outputs steeped in emotion because it was hard coded into their algorithm by Eric, or do the outputs stir our emotions because the impulse to connect and feel deeply is hard coded into us?`,
      `These imperfections can be seen in the sometimes scribbled, gritty texture of the outputs, and the drops and drips that proliferate, scattering across the images like life&rsquo;s essence bursting out beyond repressive boundaries. Some outputs are dominated by bold blacks and reds and yellows, conveying aggression or confidence, and some have more muted colour palettes, just as we can feel subdued and defeated at times. Some outputs are chaotic and others minimal, conveying feelings of being overwhelmed and isolated respectively.`,
    ],
    details: {
      sourceImage: "/images/eric-andwer/featured/constraint-details-source.jpg",
      title: "Constraint #143",
      verseUrl:
        "https://verse.works/items/ethereum/0x6de9E8644dF88312632CAB82a3C0e773D8C55412/617321169",
      aspectRatio: "1",
      crops: [
        { id: "upper-burst",     x: 33, y: 32, zoom: 2.6 },
        { id: "right-form",      x: 68, y: 48, zoom: 2.6 },
        { id: "lower-spectrum",  x: 68, y: 76, zoom: 2.6 },
      ],
    },
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/eric-andwer/featured/constraint-feature-1.jpg",
            alt: "Eric Andwer, Constraint #145",
            title: "Constraint #145",
            verseUrl:
              "https://verse.works/items/ethereum/0x6de9E8644dF88312632CAB82a3C0e773D8C55412/1403191220",
          },
          {
            image: "/images/eric-andwer/featured/constraint-feature-2.jpg",
            alt: "Eric Andwer, Constraint #160",
            title: "Constraint #160",
            verseUrl:
              "https://verse.works/items/ethereum/0x6de9E8644dF88312632CAB82a3C0e773D8C55412/2340282753",
          },
        ],
      },
    ],
  },
  {
    slug: "haha-over-time",
    artistSlug: "john-provencher",
    artistName: "John Provencher",
    title: "HAHA, over-time",
    year: 2023,
    month: "Nov",
    date: "November 2023",
    location: "Verse",
    status: "past",
    hero: "/images/john-provencher/haha-hero.jpg",
    heroTheme: "paper",
    cardImage: "/images/john-provencher/haha.jpg",
    verseSeriesUrl: "https://verse.works/exhibitions/haha-over-time",
    description: [
      `The Garden is delighted to present John Provencher&rsquo;s <em>HAHA</em> and <em>over-time</em>, which are both inherently digital. Provencher is a designer, educator, and artist working primarily with generative systems.`,
      `His work is largely inspired by net-art, art about the web composed of its constituent elements - and is embedded with the physicality of the internet. He often uses web interfaces as his canvas, and the rudimentary building blocks of the web such as check boxes and dot matrices as his medium.`,
      `<em>HAHA</em> and <em>over-time</em>, illustrate the elements of the web that Provencher is most enamoured with; the ability to self-publish and self-curate, the permanence of digital activity enabled by web3 technology, the power of chance within generative systems. These works visualise the intangible. Generative work is about iteration; <em>over-time</em> visualises iteration. The blockchain is about recording transactions; <em>HAHA</em> visualises and plays on the transactional nature of NFTs by physically printing generative receipts. The internet itself is an ever-evolving, ever-adapting entity, just as <em>over-time</em> adapts to each browser it is rendered in.`,
      `Both of these series are evidence of Provencher&rsquo;s determination to master his medium, having spent recent years learning to program and manipulate the perfect circle, coding lissajous forms through dot matrices while thinking about how they can occupy space both on and offline.`,
      `Provencher&rsquo;s love for technology has been a pillar throughout his life. He never felt like he had to decide between physical or digital art, there was no internal debate necessary, the choice always seemed obvious. He always related more to digital artists and their work, and he believes that the ability to create images with a computer changed the trajectory of his life.`,
      `Since creating his first myspace, Provencher has been fascinated with the web as a publishing tool - anyone can publish anything, for better or for worse. He has always been drawn to digital communication, computers, and the opportunities they presented, and with the advent of the blockchain the idea that self-curated, self-published work could be online permanently was a game changer.`,
      `Provencher has spent the past few years coding scripts focused on using pixel grids to depict light and form. In these grids, he&rsquo;s been working with a form called the Lissajou, creating circular and DNA-like shapes on the canvas. By adding programmatic tweaks to these shapes, he aims to introduce imperfections in the hopes of creating something new. In projects like <em>HAHA</em> and <em>over-time</em>, Provencher combines lissajous forms with dot matrices and dithering to create generative artworks that explore what he loves most about the web and technological evolution, without shying away from its inherent humour.`,
      `Both of these series employ text, which is rare in digital art as text can&rsquo;t be embedded in generative scripts, and fonts are difficult to render across browsers. In <em>HAHA</em>, Provencher uses his own typeface, inspired by typefaces based on dot matrices consisting of 2D patterned arrays representing characters, symbols and images.`,
      `Across both of these series you can see circles and lissajous forms. These are patterns created by the intersection of two sinusoidal curves that are perpendicular to each other. They are mathematically challenging to program, but incredibly rewarding, you can keep iterating on the algorithm, manipulating the forms. After spending a year learning to program and manipulate circles, matrices and pixel grids, the possibilities now feel endless, and have led to the creation of these two series.`,
      `When you push the algorithm for generative lissajous forms to an extreme, you create concrete poetry. Concrete poems are objects composed of words, letters, typefaces, that often incorporate visual, verbal, kinetic or sonic elements. The form of the poem tends to be more important than its constituent words or characters, it is visually rather than linguistically evocative.`,
      `<em>HAHA</em>&rsquo;s outputs consist of circular and lissajous forms composed of &lsquo;h&rsquo;s and &lsquo;a&rsquo;s.`,
      `The title is a play on the way that NFTs are seen as a joke by many, and the way that terminology can be misused, for example in relation to NFTs being transactions, or receipts, rather than the artworks themselves. <em>HAHA</em> outputs are visual representations of the conflation of the artworks and the receipts.`,
      `Provencher has been working on <em>over-time</em> for the past two years, continuously tweaking it. It was inspired by Alexei Shulgin&rsquo;s <em>Form Art</em> from 1997 which hugely influenced John&rsquo;s artistic practice and attitude towards creating digital art. <em>Form Art</em> was an interactive website that utilised the components of the web to create a conceptual work of art that navigated aimlessly through HTML forms composed of text boxes, check boxes and radio buttons. It was one of the first examples of net-art and fascinated Provencher.`,
      `The works in <em>over-time</em> make use of the same elements as <em>Form Art</em>, and similarly employ the colours of the internet, specifically back when computer screens could only display a finite number of colours. Provencher&rsquo;s works tend to adhere to distinct bold colour palettes that are limited to 2-4 colours each, differing according to the idea he is exploring in the work.`,
      `<em>over-time</em> works show two algorithms colliding, bringing together dithering and lissajous forms interacting. Provencher wanted the works to create a friction between smooth animation and random breaks. The work is meant to highlight the fragile nature of the web and how it is meant to form and respond within different browsers and standards. In the piece, the web becomes a canvas designed to break.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/john-provencher/haha-installation.jpg",
            alt: "HAHA installation view",
            title: "HAHA, installation",
            verseUrl: "https://verse.works/artworks/2e99c816-6168-4d2a-a70a-9db13383f847",
          },
          {
            image: "/images/john-provencher/over-time-installation-portrait.jpg",
            alt: "over-time installation view",
            title: "over-time, installation",
            verseUrl: "https://verse.works/artworks/2bc887df-8a90-418e-8def-abc8576b32c9",
          },
        ],
      },
      {
        afterParagraphIndex: 4,
        items: [
          {
            image: "/images/john-provencher/over-time-installation-wide.webp",
            alt: "over-time gallery installation — blue lissajous artwork on left wall",
          },
        ],
      },
      {
        afterParagraphIndex: 6,
        items: [
          {
            image: "/images/john-provencher/haha-artwork.jpg",
            alt: "HAHA artwork detail — lissajous composed of 'h's and 'a's",
            title: "HAHA",
          },
        ],
      },
      {
        afterParagraphIndex: 11,
        items: [
          {
            image: "/images/john-provencher/over-time-doc-1.webp",
            alt: "over-time generative artwork — live render (variation one)",
            title: "over-time, i",
            iframe: "https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com/genart/over-time-final%2010302023/index.html?payload=eyJoYXNoIjoicm9zZS1wZXRhbC0wMSJ9",
            aspectRatio: 1,
            verseUrl: "https://verse.works/series/over-time-by-john-provencher",
          },
          {
            image: "/images/john-provencher/over-time-doc-2.webp",
            alt: "over-time generative artwork — live render (variation two)",
            title: "over-time, ii",
            iframe: "https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com/genart/over-time-final%2010302023/index.html?payload=eyJoYXNoIjoiYXVyb3JhLWJsdWUtMDIifQ==",
            aspectRatio: 1,
            verseUrl: "https://verse.works/series/over-time-by-john-provencher",
          },
          {
            image: "/images/john-provencher/over-time-doc-1.webp",
            alt: "over-time generative artwork — live render (variation three)",
            title: "over-time, iii",
            iframe: "https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com/genart/over-time-final%2010302023/index.html?payload=eyJoYXNoIjoibWVhZG93LWdyZWVuLTAzIn0=",
            aspectRatio: 1,
            verseUrl: "https://verse.works/series/over-time-by-john-provencher",
          },
        ],
      },
    ],
  },
  {
    slug: "new-life-to-still-life",
    artistSlug: "cydr",
    artistName: "Cydr",
    title: "New-life, to Still-life",
    year: 2023,
    month: "Sep",
    date: "September 2023",
    location: "Verse",
    status: "past",
    hero: "/images/cydr/new-life-to-still-life-hero.jpg",
    heroTheme: "paper",
    verseSeriesUrl: "https://verse.works/series/new-life-to-still-life-by-cydr",
    description: [
      `The Garden is thrilled to bring you <em>New-life, to Still-life</em>, a series by Brazilian artist cydr. Like a tapestry, it weaves together his personal history, inspirations, and experiences, from his background in video games to his unique form of synesthesia.`,
      `<em>New-life, to Still-life</em> exudes a nostalgic charm reminiscent of old video games, capturing the essence of a bygone era while embracing modern digital techniques. Using fruit as his focal point, these works provide a commentary on the juxtaposition of natural forms and digital aesthetics. With each pixel, cydr invites us to reconsider our perceptions and embrace the beauty that exists within distortion.`,
      `Cydr first began making digital art when he was encouraged by artist Omentejovem in 2020. Until then, his work had always been experimental, typically blending elements of photographic manipulation and collage, but this was a pivotal moment in cydr&rsquo;s artistic practice. He had previously been a physical creator and digital admirer, but beyond early experiments in Photoshop, this marked the beginning of his path to digital creation.`,
      `Cydr&rsquo;s work playfully teeters on the boundary of low-poly, an art form originating from early gaming designs when processing capabilities reduced the level of detail and texture that could be achieved visually. It is nostalgic and reminiscent of <span class="num-lining">2</span>D pixel art, but has remained popular over time. Cydr incorporated these elements into this series of work, which blends organic elements with a pixelated aesthetic and low-resolution textures. However, in contrast to the muted colour palette of many old video games such as Call of Duty (COD) which cydr grew up playing, the works in <em>New-life, to Still-life</em> are hyper saturated &mdash; he&rsquo;s flipped the script.`,
      `The use of colour in these works is striking, and absolutely fascinating given that cydr is colour blind. If cydr puts a green next to an orange, and they are the exact same tone, he can&rsquo;t tell which one is which. He says, &lsquo;Both of them are orange, both of them are green&rsquo;.`,
      `Cydr&rsquo;s unique relationship with colour has another element too: he has a form of synesthesia where he feels certain colours and emotions when he eats. He&rsquo;s compared this to a scene from <em>Ratatouille</em> when Remy sees bursts of bright colours when eating a strawberry. Just as eating is a multi-sensory experience for cydr, he has tried to create one for viewers of his work using an interplay of colours and textures.`,
      `Cydr&rsquo;s art is characterized by its deliberate distortion and pixelation, a nod to his digital roots and a somewhat philosophical questioning of personal perspectives. &lsquo;I see distortion as a way to portray how people may view the world; sometimes they don&rsquo;t quite remember certain aspects of things, sometimes they may have been told something looks like a certain thing, but in reality it may be something else&hellip;the distortion may often represent how people see themselves and their surroundings; perceive flaws or imperfections that others might not notice.&rsquo;`,
      `The use of organic forms is a new element in cydr&rsquo;s practice, inspired by the work of Scratch Williams who introduced him to the still-life genre. Where the tradition is concerned with organic subjects, cydr has historically focused on digital ones, and in this series he has brought them together in a harmonious fusion that reflects contemporary life. Some of the fruits depicted in these works (such as the grapes, the watermelon, the pitaya) seem painterly despite their digital distortion &mdash; it is almost as if you can see brush strokes. This painterly essence is only present in the foreground of the works, creating the textures of the fruits, whereas the backgrounds are flatter, more overtly pixelated.`,
      `Some of the backgrounds almost have a horizon line, yet despite the fruits being placed within interior environments (they are not outside), the backgrounds read as flat planes in contrast to the fruits, which have more prominent shadows. Each work also has scratches on the surface, which adds further texture and once more recalls traditional paintings, playfully blending the physical with the digital.`,
      `Cydr believes in the freedom of interpretation and the necessity of play in artistic practice; it is important to him to create work that is both fun and pushes boundaries.`,
    ],
    // One artwork from the series at the end of every second paragraph
    // (after ¶1, ¶3, ¶5, ¶7). Each links to its specific Verse item URL
    // with the title shown beneath. Selections walk through the series
    // — opening still-life, low-poly composition, color-driven piece,
    // and closing on Fruit Bowl beside the still-life-tradition prose.
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/cydr/new-life-5.jpg",
            alt: "cydr, New-life, to Still-life #5",
            title: "New-life, to Still-life #5",
            verseUrl: "https://verse.works/items/ethereum/0x49bBA3DA4541713284F59a1417c94Ea3a07D472d/1398530935",
          },
        ],
      },
      {
        afterParagraphIndex: 3,
        items: [
          {
            image: "/images/cydr/new-life-2.jpg",
            alt: "cydr, New-life, to Still-life #2",
            title: "New-life, to Still-life #2",
            verseUrl: "https://verse.works/items/ethereum/0x49bBA3DA4541713284F59a1417c94Ea3a07D472d/4028700374",
          },
        ],
      },
      {
        afterParagraphIndex: 5,
        items: [
          {
            image: "/images/cydr/new-life-6.jpg",
            alt: "cydr, New-life, to Still-life #6",
            title: "New-life, to Still-life #6",
            verseUrl: "https://verse.works/items/ethereum/0x49bBA3DA4541713284F59a1417c94Ea3a07D472d/2762143216",
          },
        ],
      },
      {
        afterParagraphIndex: 7,
        items: [
          {
            image: "/images/cydr/fruit-bowl.jpg",
            alt: "cydr, Fruit Bowl",
            title: "Fruit Bowl",
            verseUrl: "https://verse.works/items/ethereum/0x49bBA3DA4541713284F59a1417c94Ea3a07D472d/3555399755",
          },
        ],
      },
    ],
    // Closing artist statement — restores cydr's own first-person
    // voice to the page after the curatorial description above. Read
    // as the artist's commentary on the work, not a re-description.
    artistQuote: {
      paragraphs: [
        `The series started from me wanting to capture a way of making something very organic digital; from that, I searched for elements that could possibly come into play, from trees to mountains to animals, but fruits came as the best fit for the idea.`,
        `This approach would then lead me to challenge myself as to how to digitalize them while still maintaining their essence of “being alive”.`,
        `In my eyes, fruits symbolize a quick cycle — they grow, and not so long after they start to die; within that, the feeling of having to eternalize something that goes away fast would also be found symbolic when creating <em>New-life, to Still-life</em>.`,
        `Therefore, one of the objectives was also to merge the idea of eternalizing something that dies fast, while portraying it when it was in its peak of desirability/life. While still giving the usual touch of playfulness of capturing a distorted reality (of the viewer, or the image itself).`,
        `Also, in the collection, an empty bowl is shown; could be to place the fruits somewhere…although I see a bigger meaning in that.`,
      ],
      attribution: "cydr",
    },
  },
  {
    slug: "space-time",
    artistSlug: "loackme",
    artistName: "Loackme",
    title: "SPACE\\TIME",
    year: 2023,
    month: "Aug",
    date: "August 2023",
    location: "Verse",
    status: "past",
    hero: "/images/loackme/space-time-hero.gif",
    heroTheme: "paper",
    verseSeriesUrl: "https://verse.works/series/space-time-by-loackme",
    workCount: 100,
    description: [
      `The Garden was pleased to present <em>SPACE\\TIME</em>, a culminating series in loackme&rsquo;s decade-long engagement with motion-based dithering, <span class="num-lining">2</span>D signed distance functions, Voronoï diagrams, and code.`,
      `Where loackme typically works in short impulsive bursts, <em>SPACE\\TIME</em> unfolded over three months beginning on 10 May 2023 &mdash; the longest-running project of his practice to date. Pixelated, monochromatic, and looped, the works distill his longstanding preoccupations with geometry and animation. Dithering opens an illusory tonal range within the strict black-and-white palette, summoning shades of grey from binary inputs.`,
      `<em>SPACE\\TIME</em> sits between two paradigms in generative art: it neither produces an open algorithmic edition nor relies on the post-hoc curation of mass-generated outputs. The series began as a response to the work of François Vogel, refracted through dithering.`,
      `Looping is central to loackme&rsquo;s practice &mdash; a fixation he frames as both obsessive and meditative. Each work returns precisely to its starting position, the seam invisible; for the artist, achieving that seamlessness was the work&rsquo;s principal reward.`,
      `Code typically permits unlimited revision; loackme imposed a counter-rule. Each piece was hand-tuned to completion, with no return to earlier states &mdash; a deliberate fragility he regards as essential to the series. The codebase itself grew untidy across iterations, an analogue to a painter&rsquo;s studio that left room for accident. The works can be explored at the artist&rsquo;s dedicated gallery-website, <a class="prose-link" href="https://loack.me/spacetime/" target="_blank" rel="noopener">here</a>.`,
      `An early iteration omitted the white frame and pixels strayed beyond the GIF&rsquo;s edge; the works share a fixed digital resolution, a constraint loackme treated as generative. Diagonal motion, paired with the dithering algorithms, produced the most pronounced patterns, and he settled on a top-left-to-bottom-right axis. Reconciling the components into a single fluid composition was, in his words, a mathematical challenge he sets himself.`,
      `Monochrome has been part of loackme&rsquo;s practice from the outset. The high-contrast palette pairs structurally with pixel art&rsquo;s blocky logic and &mdash; more crucially for him &mdash; removes a paralyzing degree of choice. Constraint is what permits him to work.`,
    ],
    // Inline artwork breaks mirror Verse's original exhibition layout
    // (solo, pair, trio, pair). Indices are remapped to the condensed
    // 7-paragraph Hufkens-style description: solo before the looping
    // paragraph, pair after it, trio after the code/gallery-website
    // paragraph, final pair after the resolution/motion paragraph.
    // All 8 are square 1:1 animated GIFs pulled from Verse's static CDN.
    inlineArtworks: [
      {
        afterParagraphIndex: 2,
        items: [
          {
            image: "/images/loackme/space-time-2d77dc3a-ac66-45b1-a373-5778404b1d20.gif",
            alt: "loackme, SPACE\\TIME #44",
            title: "SPACE\\TIME #44",
            verseUrl: "https://verse.works/items/ethereum/0xb4a0C535564A4edc96c543e4864DDd6291a704e4/3079081754",
          },
        ],
      },
      {
        afterParagraphIndex: 3,
        items: [
          {
            image: "/images/loackme/space-time-a852446b-cdb0-486d-ab60-8a44ab291daf.gif",
            alt: "loackme, SPACE\\TIME #50",
            title: "SPACE\\TIME #50",
            verseUrl: "https://verse.works/items/ethereum/0xb4a0C535564A4edc96c543e4864DDd6291a704e4/799281838",
          },
          {
            image: "/images/loackme/space-time-53d6e785-5ac3-4dc7-bc96-b294fc080e38.gif",
            alt: "loackme, SPACE\\TIME #18",
            title: "SPACE\\TIME #18",
            verseUrl: "https://verse.works/items/ethereum/0xb4a0C535564A4edc96c543e4864DDd6291a704e4/400589723",
          },
        ],
      },
      {
        afterParagraphIndex: 4,
        items: [
          {
            image: "/images/loackme/space-time-06bc8641-f973-45ad-83db-1455a518b0f9.gif",
            alt: "loackme, SPACE\\TIME #67",
            title: "SPACE\\TIME #67",
            verseUrl: "https://verse.works/items/ethereum/0xb4a0C535564A4edc96c543e4864DDd6291a704e4/2427497049",
          },
          {
            image: "/images/loackme/space-time-e02ffa6d-3182-48a8-b513-46301a3b84c4.gif",
            alt: "loackme, SPACE\\TIME #43",
            title: "SPACE\\TIME #43",
            verseUrl: "https://verse.works/items/ethereum/0xb4a0C535564A4edc96c543e4864DDd6291a704e4/1783980217",
          },
          {
            image: "/images/loackme/space-time-dcba5cd8-9d2b-4267-8f53-a3d7cfd05d4b.gif",
            alt: "loackme, SPACE\\TIME #27",
            title: "SPACE\\TIME #27",
            verseUrl: "https://verse.works/items/ethereum/0xb4a0C535564A4edc96c543e4864DDd6291a704e4/2672136761",
          },
        ],
      },
      {
        afterParagraphIndex: 5,
        items: [
          {
            image: "/images/loackme/space-time-cc0143bb-da05-49bd-8ba0-c4a5f79f464c.gif",
            alt: "loackme, SPACE\\TIME #23",
            title: "SPACE\\TIME #23",
            verseUrl: "https://verse.works/items/ethereum/0xb4a0C535564A4edc96c543e4864DDd6291a704e4/538947078",
          },
          {
            image: "/images/loackme/space-time-d40a1444-216c-4a38-adf3-d2ad535e2f4b.gif",
            alt: "loackme, SPACE\\TIME #22",
            title: "SPACE\\TIME #22",
            verseUrl: "https://verse.works/items/ethereum/0xb4a0C535564A4edc96c543e4864DDd6291a704e4/1788913394",
          },
        ],
      },
    ],
  },
  {
    slug: "simple-thoughts",
    artistSlug: "khwampa",
    artistName: "Khwampa",
    title: "Simple Thoughts",
    year: 2023,
    month: "Jun",
    date: "June 2023",
    location: "Verse",
    status: "past",
    hero: "/images/khwampa/simple-thoughts-hero.jpg",
    heroTheme: "paper",
    verseSeriesUrl: "https://verse.works/series/simple-thoughts-by-khwampa",
    details: {
      sourceImage: "/images/khwampa/simple-thoughts-01-elements-of-a-tree-near-prayag.png",
      title: "Elements of a Tree Near Prayag",
      verseUrl: "https://verse.works/items/ethereum/0x804a976FE7A5ba4303E75B3B7af98349b8FEac59/140299077",
      aspectRatio: "1",
      artworkInset: { top: 0, right: 0, bottom: 0, left: 0 },
      // Three crops triangulate across the left-of-center half of
      // the panorama, each sitting in its own horizontal slice with
      // no shared elements: the red starburst at upper-left, the pink
      // fill at lower-center, the yellow Star of David at right.
      // Zoom 6 gives a ~16.7% wide window per crop, so x focal points
      // must differ by ≥ 16.7% to stay disjoint. Zoom must also be ≥
      // 3.087 (the source aspect) so a square crop fully covers the
      // viewport — below that, the image's rendered height falls
      // short of the container and gray bars show top/bottom.
      crops: [
        { id: "red-starburst", x: 10, y: 25, zoom: 6 },
        { id: "pink-fill",     x: 28, y: 72, zoom: 6 },
        { id: "yellow-star",   x: 55, y: 42, zoom: 6 },
      ],
    },
    description: [
      `<em>Simple Thoughts</em> is a series of MS Paint paintings, brought to life through the marriage of physical touch and digital programs &mdash; envisioning tales of new worlds and their various environments &amp; biomes.`,
      `Khwampa captures transmissions from the microscopic view of cells, sending us signals back via various interstellar terrariums where energy from their histories unfold in real time. Unearthed within the mind, it is an archival of the journey of our imaginations reaching further than ever before.`,
      `Each piece is a chronicle of its time, a bird-eyes view of morphed structures caught in various streams of abstract direction. Without collision, every element holds its ground in permanent suspension.`,
      `Exploring the aesthetics of digital compression artifacts from the use of different paint brush sizes in MS Paint. At particular brush size to canvas ratios, the program functions differently in characteristic ways; at one ratio it causes pixelation between the fill and the outlines, at another the fill and the outlines are clean.`,
      `Painting is an experimental and ever-changing expression for Khwampa, never a process with predefined steps.`,
      `This series delves into the concept of minimalist thought, where thoughts serve as the foundation for the artistic process. When the excessive array of inputs provided by digital tools are condensed to just 4 or 5, what form does thought take?`,
      `Embracing the constraints and possibilities offered by MS Paint and its limited toolset, Khwampa produces dynamic, harmoniously composed works that excel in exploring a diverse range of colors. This collection truly comes to life when viewed alongside his other bodies of work, such as <em>Expressions</em> or <em>Ashes</em>, providing a comprehensive understanding of his artistic vision.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 2,
        items: [
          {
            image: "/images/khwampa/simple-thoughts-03-blue-in-the-void.png",
            alt: "Khwampa, Simple Thoughts — Blue in the Void",
            title: "Blue in the Void",
            verseUrl: "https://verse.works/items/ethereum/0x804a976FE7A5ba4303E75B3B7af98349b8FEac59/3139810391",
          },
        ],
      },
    ],
    // 6 non-hero works in a clean 3-col × 2-row grid via per-slug CSS
    // override. Blue in the Void is featured inline above; Elements of a
    // Tree Near Prayag is featured in the Details block; the hero is
    // the 9th work.
    exploreArtworks: [
      {
        id: "simple-thoughts-deserted-station",
        title: "Deserted Station",
        image: "/images/khwampa/simple-thoughts-02-deserted-station.png",
        alt: "Khwampa, Simple Thoughts — Deserted Station",
        verseUrl: "https://verse.works/items/ethereum/0x804a976FE7A5ba4303E75B3B7af98349b8FEac59/773854289",
      },
      {
        id: "simple-thoughts-folds-within-folds",
        title: "Folds within Folds",
        image: "/images/khwampa/simple-thoughts-04-folds-within-folds.png",
        alt: "Khwampa, Simple Thoughts — Folds within Folds",
        verseUrl: "https://verse.works/items/ethereum/0x804a976FE7A5ba4303E75B3B7af98349b8FEac59/1040013344",
      },
      {
        id: "simple-thoughts-blast-of-colors-and-form",
        title: "Blast of Colors and Form",
        image: "/images/khwampa/simple-thoughts-05-blast-of-colors-and-form.png",
        alt: "Khwampa, Simple Thoughts — Blast of Colors and Form",
        verseUrl: "https://verse.works/items/ethereum/0x804a976FE7A5ba4303E75B3B7af98349b8FEac59/1308575164",
      },
      {
        id: "simple-thoughts-a-window-into-my-soul",
        title: "A Window into my Soul",
        image: "/images/khwampa/simple-thoughts-06-a-window-into-my-soul.png",
        alt: "Khwampa, Simple Thoughts — A Window into my Soul",
        verseUrl: "https://verse.works/items/ethereum/0x804a976FE7A5ba4303E75B3B7af98349b8FEac59/3366526110",
      },
      {
        id: "simple-thoughts-taste-of-cherry",
        title: "Taste of Cherry",
        image: "/images/khwampa/simple-thoughts-07-taste-of-cherry.png",
        alt: "Khwampa, Simple Thoughts — Taste of Cherry",
        verseUrl: "https://verse.works/items/ethereum/0x804a976FE7A5ba4303E75B3B7af98349b8FEac59/3164423123",
      },
      {
        id: "simple-thoughts-through-the-olive-trees",
        title: "Through the Olive Trees",
        image: "/images/khwampa/simple-thoughts-08-through-the-olive-trees.png",
        alt: "Khwampa, Simple Thoughts — Through the Olive Trees",
        verseUrl: "https://verse.works/items/ethereum/0x804a976FE7A5ba4303E75B3B7af98349b8FEac59/778242064",
      },
    ],
    artistQuote: {
      paragraphs: [
        `I mostly follow the line, try to hear and see where it is taking me. Every being that manifests wants to communicate in one way or another. As an artist I want to hear the lines, the images, and the medium better. Hear what it wants to communicate, add something of my experiences, and present it to the viewer.`,
      ],
      attribution: "Khwampa",
    },
  },
  {
    slug: "drift",
    artistSlug: "paolo-eri",
    artistName: "Paolo Čerić",
    title: "Drift",
    year: 2023,
    month: "May",
    date: "May 2023",
    location: "Verse",
    status: "past",
    hero: "/images/paolo-eri/drift-hero.jpg",
    heroTheme: "paper",
    verseSeriesUrl: "https://verse.works/series/drift-by-paolo-ceric-1",
    details: {
      sourceImage: "/images/paolo-eri/drift-detail-source.jpg",
      title: "Drift #346",
      verseUrl: "https://verse.works/items/ethereum/0x3a476c1f8CEFB29360E02f19EbB579632eB3287B/974182424",
      aspectRatio: "3/4",
      artworkInset: { top: 0, right: 0, bottom: 0, left: 0 },
      crops: [
        // All three crops sit within the middle-right band of the
        // composition where the cream-on-black diagonals, branching
        // outlines, and emerging figure cluster — the piece's most
        // active gesture-zone. Following the visual diagonal down-
        // left through this band: upper slash → branching edge →
        // figure's shoulder. Same edge quality, same scale, same
        // neighbourhood — three frames of one sustained mark.
        { id: "upper-slash",     x: 62, y: 33, zoom: 2.6 },
        { id: "branching-edge",  x: 78, y: 47, zoom: 2.6 },
        { id: "figure-shoulder", x: 58, y: 61, zoom: 2.6 },
      ],
    },
    description: [
      `Graphite, Dust, Ash, Embers, Sand, Snow.`,
      `There are emotions attached to witnessing the aesthetic and form of these in the real world. One similarity connects them all, at their core each being comprised of tiny particles.`,
      `<em>Drift</em> is a journey into creatively expressing physical phenomena in a digital setting through the use of particle systems algorithmically. Coded within, an underlying simulation dictates the physics and drag of the particles; akin to wind blowing across sand or the crumbling of pencil-tip as it comes into contact with paper.`,
      `The behavior of particles interacting with their environment entrances Paolo from the detail and patterns which emerge.`,
      `Within <em>Drift</em> memories of movement are caught and preserved on digital canvas. Upon viewing textures so intricate you can almost feel them through a screen, Paolo builds upon each scene through the use of rectangles, squares, and circles &mdash; at times depicted in a literal sense, others morphing and melting into one another. <em>Drift</em> expands in its varied focus of abstract shape composition and positioning alongside the use of bold colors. The empty space in each output holds equal weight, telling a story of the algorithm&rsquo;s intended gestures and paths &mdash; creating a juxtaposition between silence and the jubilation of shapes coming together.`,
      `The rush of water over algae, the imprints of waves washing up on a beach, the carefree nature of a breeze on a Winter&rsquo;s day &mdash; its invisible force animated to life by snow being lifted away and floating in specific directions; <em>Drift</em> encompasses the rhythm of life and beauty of existence all expressed through code.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 3,
        items: [
          {
            image: "/images/paolo-eri/drift-inline-multicolor.jpg",
            alt: "Paolo Čerić, Drift #9",
            title: "Drift #9",
            unoptimized: true,
            verseUrl: "https://verse.works/items/ethereum/0x3a476c1f8CEFB29360E02f19EbB579632eB3287B/2883276227",
          },
          {
            image: "/images/paolo-eri/drift-inline-red.jpg",
            alt: "Paolo Čerić, Drift #158",
            title: "Drift #158",
            unoptimized: true,
            verseUrl: "https://verse.works/items/ethereum/0x3a476c1f8CEFB29360E02f19EbB579632eB3287B/3852321030",
          },
        ],
      },
    ],
    artistQuote: {
      paragraphs: [
        `Particle systems have always held a special place in my heart. The inherent simplicity of each particle and the complexity of what emerges is a theme I have always enjoyed exploring.`,
        `With <em>Drift</em>, I continue this exploration and delve deeper into the intricacies of one such system, to see what emotions it can evoke.`,
      ],
      attribution: "Paolo Čerić",
    },
  },
];

export const getExhibitionsByStatus = (status: Exhibition["status"]) =>
  exhibitions.filter((e) => e.status === status);

export const getExhibitionBySlug = (slug: string) => {
  const idx = exhibitions.findIndex((e) => e.slug === slug);
  if (idx === -1) return undefined;
  const ex = exhibitions[idx];
  const toLink = (e: Exhibition) => ({
    slug: e.slug,
    artistName: e.artistName,
    title: e.title,
  });
  return {
    ...ex,
    prev: ex.prev ?? (idx > 0 ? toLink(exhibitions[idx - 1]) : undefined),
    next:
      ex.next ??
      (idx < exhibitions.length - 1 ? toLink(exhibitions[idx + 1]) : undefined),
  };
};

export const getExhibitionSlugs = () => exhibitions.map((e) => e.slug);
