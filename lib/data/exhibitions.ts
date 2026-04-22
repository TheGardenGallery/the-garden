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
  { slug: "deluge",                 artistSlug: "chepertom",         artistName: "CHEPERTOM",         title: "Deluge",                 year: 2024, month: "May", date: "May 2024",      location: "Verse", status: "past" },
  { slug: "basalt-gifs",            artistSlug: "itsgalo",           artistName: "Itsgalo",           title: "Basalt GIFs",            year: 2024, month: "May", date: "May 2024",      location: "Verse", status: "past" },
  { slug: "autoscope",              artistSlug: "erik-swahn",        artistName: "Erik Swahn",        title: "Autoscope",              year: 2024, month: "Apr", date: "April 2024",    location: "Verse", status: "past" },
  { slug: "gwanak-gu",              artistSlug: "earthsample",       artistName: "Earthsample",       title: "Gwanak-gu",              year: 2024, month: "Mar", date: "March 2024",    location: "Verse", status: "past" },
  { slug: "isle-of-alcina",         artistSlug: "t-k-z",             artistName: "Tù.úk'z",           title: "Isle of Alcina",         year: 2024, month: "Mar", date: "March 2024",    location: "Verse", status: "past" },
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
  { slug: "constraint",             artistSlug: "eric-andwer",       artistName: "Eric Andwer",       title: "Constraint",             year: 2023, month: "Nov", date: "November 2023", location: "Verse", status: "past" },
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
