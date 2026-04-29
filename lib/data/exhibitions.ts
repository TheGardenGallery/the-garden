import type { Exhibition } from "@/lib/types";

export const exhibitions: Exhibition[] = [
  // === UPCOMING ===
  {
    slug: "split-logic",
    artistSlug: "ricky-retouch",
    artistName: "Ricky Retouch",
    title: "Split Logic",
    year: 2026,
    month: "May",
    date: "May 2026",
    location: "Verse",
    status: "upcoming",
    homepageHeroVideo: "/images/ricky-retouch/split-logic-hero.mp4",
    heroVideo: "/images/ricky-retouch/split-logic-hero.mp4",
    heroTheme: "dark",
    frameColor: "#000000",
  },
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
    status: "past",
    hero: "/images/paul-prudence/iso-iec-10646-hero.png",
    homepageHero: "/images/paul-prudence/iso-iec-10646-homepage-hero.jpg",
    cardImage: "/images/paul-prudence/iso-iec-10646-homepage-hero.jpg",
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
      `The Garden is pleased to present <em>Imagined Wreckage</em>, a series of photo collage and generative AI works by Chicago-based artist Chuck Anderson. Known for his multidisciplinary approach, Anderson&rsquo;s work is characterised by his distinctive use of colour, light, and foregrounding of digital technology.`,
      `Described by the artist as a collection &ldquo;about amalgamation,&rdquo; the series dissects the boundaries between an artist&rsquo;s life and work in a post-internet, AI-focused era. The use of generative AI echoes across the works not simply in the output of the models, but through the way their processes parallel Anderson&rsquo;s own assembly of aggregated experience.`,
      `Elements of the digital process lie embedded in the pieces. Wires, circuit boards, screens, and viewfinders are scattered throughout, eroding the line between the work and the working practice. The inclusion of photography gives the series an almost autobiographical quality, humanising the use of AI and embedding Anderson directly into the fabric of the collection.`,
      `Engine parts, alongside nods to hardcore and punk tropes, are bathed in iridescence, balanced against flowers and butterflies, breaking down traditional aesthetic associations. Hard edges become surprisingly softened; crystalline textures feel malleable; opaque fogs settle into almost structural components. The pieces resist easy categorisation &mdash; equal parts virtual, sculptural, and photographic &mdash; giving <em>Imagined Wreckage</em> a dream-like quality that speaks to the AI hallucinations and latent dreaming informing so much of contemporary digital art.`,
    ],
    prev: { slug: "deluge", artistName: "Chepertom", title: "Deluge" },
    next: { slug: "new-life-to-still-life", artistName: "cydr", title: "New-life, to Still-life" },
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
    workCount: 6,
    artistBio: "1mposter is a Brazilian digital media artist with over 15 years of experience in motion design and 3D. Drawing from influences in science and mythology, 1mposter explores the intersection of narrative and technology. Their practice focuses on creating contemplative visual experiences that invite repeated viewing, revealing new details over time.",
    description: [
      `Even though these animated pictograms are fairly high resolution (1575 × 1575 px), they are all rendered in a 45 × 45 character grid as ASCII art.`,
      `In a way, they are very low-resolution depictions of ideas and feelings.`,
    ],
    exploreArtworks: [
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
        verseUrl: "https://verse.works/items/ethereum/0xb9d36b839fac842d90d2857102ce1c1bedd59695/1",
      },
      {
        id: "pictography-flit",
        title: "Flit",
        image: "/images/1mposter/pictography-flit.gif",
        poster: "/images/1mposter/pictography-flit-poster.png",
        alt: "1mposter, Pictography — Flit",
        verseUrl: "https://verse.works/items/ethereum/0xb9d36b839fac842d90d2857102ce1c1bedd59695/3",
      },
    ],
  },

  // === PAST — 2024 ===
  {
    slug: "distrakted",
    artistSlug: "mark-webster",
    artistName: "Mark Webster",
    title: "distraKted",
    year: 2024,
    month: "Dec",
    date: "December 2024",
    location: "Verse",
    status: "past",
    workCount: 24,
    hero: "/images/mark-webster/distrakted-hero.png",
    verseSeriesUrl: "https://verse.works/series/distrakted-by-mark-webster",
    artistBio: "Mark Webster was born in Canada, raised in England and currently lives in France. After graduating in London with a modern languages degree in 1997, he moved to Paris and began to orientate his work towards the arts. This has involved an eclectic mix of activities in diverse areas such as animation, sound design, graphic design, teaching and even a stint as a journalist working in the field of motion design. In the last couple of years, his efforts have been devoted to developing a body of personal artistic work that is driven by curiosity to explore and experiment with code based media. He creates art and graphic work primarily using custom-made software tools along with computational and generative strategies as his main approach.",
    descriptionByArtist: true,
    description: [
      `A written language is a complex tissage of signs and symbols. A conventional system of coherent patterns with which one seeks to express meaningful actions, ideas, thoughts and feelings. What happens though when one loses the capacity to decipher these visual constructs?`,
      `My present experience of text has become increasingly fragmentary. Words become a fragile material, at times liquid and forever from my grasp, at other times brittle and disintegrating before my eyes. <em>distraKted</em> takes my work with language to a more radical level. In distorting, displacing and at times pulverising textual elements, the work is an attempt to express the rhapsodic patchwork of these linguistic fragments and their fragility.`,
      `The work is presented as an artist curation of 24 unique digital pieces. These works have been made using custom-made software written in Processing. Each piece has evolved from textual elements for which a special font was also developed in part for some of the iterations.`,
    ],
    exploreArtworks: [
      {
        id: "distrakted-17",
        title: "distraKted #17",
        image: "/images/mark-webster/distrakted-17.png",
        alt: "Mark Webster, distraKted #17",
        verseUrl: "https://verse.works/items/ethereum/0xc70a4423db954ca3b12e24aa96b71cc3415a77e7/16",
      },
      {
        id: "distrakted-14",
        title: "distraKted #14",
        image: "/images/mark-webster/distrakted-14.png",
        alt: "Mark Webster, distraKted #14",
        verseUrl: "https://verse.works/items/ethereum/0xc70a4423db954ca3b12e24aa96b71cc3415a77e7/13",
      },
      {
        id: "distrakted-18",
        title: "distraKted #18",
        image: "/images/mark-webster/distrakted-18.png",
        alt: "Mark Webster, distraKted #18",
        verseUrl: "https://verse.works/items/ethereum/0xc70a4423db954ca3b12e24aa96b71cc3415a77e7/17",
      },
    ],
  },
  {
    slug: "trails",
    artistSlug: "perfectl00p",
    artistName: "PERFECTL00P",
    title: "Trails",
    year: 2024,
    month: "Nov",
    date: "November 2024",
    location: "Verse",
    status: "past",
    hero: "/images/perfectl00p/trails-hero.gif",
    verseSeriesUrl: "https://verse.works/series/trails-by-perfect-l00p",
    workCount: 10,
    artistBio: "A multidisciplinary artist from Colorado in the United States. His art is high saturation, high contrast, looping works. With a retro-computing aesthetic, his work has a focus on human computer interactions and inescapable situations.",
    descriptionByArtist: true,
    description: [
      `<em>Trails</em> is a series born from a fascination with vintage Windows icons and the possibilities of visual feedback loops.`,
      `<em>Trails</em> is designed to be visually overstimulating, yet oddly satisfying.`,
      `<em>Trails</em> was lovingly crafted through a series of experiments on an old MacBook while sitting in a shed nestled in the mountains of Colorado, USA.`,
    ],
    exploreArtworks: [
      {
        id: "trails-cult-ritual",
        title: "Cult Ritual",
        image: "/images/perfectl00p/trails-cult-ritual.jpg",
        video: "https://verse.works/static/curated-projects/PERFECT%20L00P/Trails/Trails%20_%20Cult%20Ritual%20_%20By%20PERFECTL00P.mp4",
        alt: "PERFECTL00P, Cult Ritual",
        verseUrl: "https://verse.works/items/ethereum/0xa3356c8b542a4bf82f3bc8923b63d09fb3285107/0",
      },
      {
        id: "trails-copy",
        title: "Copy",
        image: "/images/perfectl00p/trails-copy.jpg",
        video: "https://verse.works/static/curated-projects/PERFECT%20L00P/Trails/Trails%20_%20Copy%20_%20By%20PERFECTL00P.mp4",
        alt: "PERFECTL00P, Copy",
        verseUrl: "https://verse.works/items/ethereum/0xa3356c8b542a4bf82f3bc8923b63d09fb3285107/4",
      },
      {
        id: "trails-circuit-wars",
        title: "Circuit Wars",
        image: "/images/perfectl00p/trails-circuit-wars.jpg",
        video: "https://verse.works/static/curated-projects/PERFECT%20L00P/Trails/Trails%20_%20Circuit%20Wars%20_%20By%20PERFECTL00P.mp4",
        alt: "PERFECTL00P, Circuit Wars",
        verseUrl: "https://verse.works/items/ethereum/0xa3356c8b542a4bf82f3bc8923b63d09fb3285107/5",
      },
    ],
  },
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
    verseSeriesUrl: "https://verse.works/series/phantasmagoria-by-mazin",
    workCount: 8,
    description: [
      `<em>Phantasmagoria</em> invites you into a fictional universe where religion, technology, and distortion blend together. In this world, the faith revolves around living architecture &mdash; buildings that are alive and form the heart of a unique belief system. Symbols like roots, glyphs, and sigils fill the landscape, creating a mysterious atmosphere. The colour palette, appearing nearly black-and-white at first glance, hides subtle RGB tones, reflecting the deeper layers of this universe where things aren&rsquo;t always what they seem.`,
      `At the center of this world are angelic figures called C.L.E.A.N.S.E, who control the flow of colour, seeing anything other than grayscale as &ldquo;corruption.&rdquo; They act as protectors, erasing colour to maintain balance, but others, known as &ldquo;Corruptors,&rdquo; challenge their rule, believing in a different truth. This conflict over colour and control is a central theme, leaving viewers to question who is truly in the right.`,
      `Inspired by artists like H.R. Giger and filmmakers such as Alex Proyas, <em>Phantasmagoria</em> combines large, surreal landscapes with intricate pixelated details. Glitch art and digital techniques are key to the artist&rsquo;s process, creating distorted, otherworldly visuals that feel both futuristic and ancient. Each piece is layered with meaning, using digital glitches and distortions to explore the tension between control and chaos.`,
      `In this series, the glitch is more than a technique &mdash; it&rsquo;s a way to embrace imperfection and reveal hidden beauty in error. <em>Phantasmagoria</em> challenges viewers to look deeper, uncovering new details with each glance and reflecting on the fine line between order and disruption in both art and life.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/mazin/phantasmagoria-ruinscape-isometrica.gif",
            alt: "Mazin, Ruinscape Isometrica",
            title: "Ruinscape Isometrica",
            verseUrl: "https://verse.works/artworks/e5361967-044e-4069-b4d9-9dde6f872aa8",
          },
        ],
      },
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
    ],
  },
  {
    slug: "bully",
    artistSlug: "riiiis",
    artistName: "riiiis",
    title: "bully",
    year: 2024,
    month: "Oct",
    date: "October 2024",
    location: "Verse",
    status: "past",
    workCount: 12,
    hero: "/images/riiiis/bully-hero.jpg",
    verseSeriesUrl: "https://verse.works/series/bully-by-riiiis",
    artistBio: "Ukrainian-Russian artist based in Buenos Aires. Their artistic practice is deeply rooted in nostalgia of the early internet, focusing on recreating memories with the help of code.",
    descriptionByArtist: true,
    description: [
      `<em>The nuns taught us there are two ways through life, the way of Nature and the way of Grace. You have to choose which one you&rsquo;ll follow. Grace doesn&rsquo;t try to please itself. Accepts being slighted, forgotten, disliked. Accepts insults and injuries. Nature only wants to please itself. Get others to please it too. Likes to lord it over them. To have its own way. It finds reasons to be unhappy when all the world is shining around it. And love is smiling through all things.</em> &mdash; Terrence Malick`,
      `What happens when both paths are denied?`,
      `At the core of <em>bully</em> stands a tree from my family home garden in Slavyansk, Ukraine. Under its branches, I spent countless hours reading books in childhood &mdash; my first sanctuary.`,
      `In the 2000s, I was moved to Russia where I faced heavy bullying in my new school. My yearly summer trips to Slavyansk became my safe haven. In 2014, I lost my home only to regain it months after. In 2022, I lost it all again. When war erupted, I found myself caught between identities: Ukrainian by birth, Russian by passport, welcomed nowhere. The way of Nature screamed for anger; the way of Grace whispered acceptance. I learned both paths were burning me. An inner fire was consuming my personality, my sense of self.`,
      `Split between Discord and Twitter, where I found solace in digital art and generative aesthetics, and WhatsApp, where I checked daily if my family was still alive, I was searching for myself. Just as books under the tree saved me in childhood, art became my new refuge. In my wanderings through South American landscapes, I found echoes of home in local trees and nature &mdash; memories of both difficult and precious childhood moments I&rsquo;ve come to accept.`,
      `The series consists of twelve JPEGs, two based on photographs from Slavyansk and others generated through artificial intelligence, each reflecting longing for home and childhood. Each image is manipulated through data compression, quantization, and generative techniques, mirroring how displacement transforms memory, belonging, and identity.`,
      `There is no hate, I love you.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 2,
        items: [
          {
            image: "/images/riiiis/bully-apocalypse.jpg",
            alt: "riiiis, apocalypse",
            title: "apocalypse",
            verseUrl: "https://verse.works/items/ethereum/0x9833291665ac13b5291c693ab417b20e81a55cdb/6",
          },
          {
            image: "/images/riiiis/bully-genesis.jpg",
            alt: "riiiis, genesis",
            title: "genesis",
            verseUrl: "https://verse.works/items/ethereum/0x9833291665ac13b5291c693ab417b20e81a55cdb/2",
          },
        ],
      },
      {
        afterParagraphIndex: 4,
        items: [
          {
            image: "/images/riiiis/bully-haven.jpg",
            alt: "riiiis, haven",
            title: "haven",
            verseUrl: "https://verse.works/items/ethereum/0x9833291665ac13b5291c693ab417b20e81a55cdb/5",
          },
          {
            image: "/images/riiiis/bully-portent.jpg",
            alt: "riiiis, portent",
            title: "portent",
            verseUrl: "https://verse.works/items/ethereum/0x9833291665ac13b5291c693ab417b20e81a55cdb/11",
          },
        ],
      },
    ],
  },
  {
    slug: "piezo",
    artistSlug: "rudxane",
    artistName: "rudxane",
    title: "Piezo",
    year: 2024,
    month: "Jul",
    date: "July 2024",
    location: "Verse",
    status: "past",
    hero: "/images/rudxane/piezo-10.jpg",
    verseSeriesUrl: "https://verse.works/series/Piezo-by-rudxane",
    workCount: 20,
    physicalExhibition: {
      venue: "Galerie Met",
      venueUrl: "https://galeriemet.com/past-exhibitions/rudxane-piezo",
      address: "Mariannenstrasse 33, 10999 Berlin",
      dates: "17.07 – 27.07.2024",
    },
    description: [
      `For the last year, rudxane has spent countless hours watching printer&rsquo;s draw his work line-by-line, the act of applying ink, constantly resisting the urge to pull the paper and change the spacing between each line drawn.`,
      `<em>Piezo</em> is inspired by this urge: what if we draw line-by-line (like a printer), but change the spacing between each drawn line? All works within the series were curated to exude their own energy, recognizable from each other, while also adding a new particular perspective to the series as a whole.`,
      `rudxane holds a deep admiration for structure and grids, energized by their quintessential standing within generative &amp; net art. While the grid itself is rigid and defined, there are boundless possibilities to experiment within this strict arrangement. Grids come with additional context, where each block contains &ldquo;information&rdquo; and can be made relational in terms of the entire piece.`,
      `Each output in <em>Piezo</em> is composed of lines, which are experienced as a printable surface that does not receive a full/flat layer of paint but a spray-like grain that&rsquo;s based on the size and density specified in each grid block: motivated by how colors bleed through and interact with each other when using a light density layer of paint from a spray-can.`,
      `The makeup of line-based drawing is grounded in reinterpreting printing processes, while the spray-like effect is influenced by the manual chaos that comes with spraying a layer of paint on specific lines. Within the background, dotted structures serve as a foundation, similar to physically drawing grids on paper. Each individual aspect is in conversation with the context around itself. Each grid block is randomly assigned a value of spacing to apply the lines of &ldquo;paint&rdquo;, at times dense (where each line is touching or overlapping the previous one to create a dense color) or heavily spaced apart (to make the line structure for that block more apparent). Additionally, the spacing influences the speed of drawing and how the lines interact with the blocks around it.`,
      `By applying lines in a sine function, the spacing at the edges of each block becomes denser than the middle. This aids in discerning the structure generated by the grid, and causes colors to shine through boldly in relation to the whole piece. Standing close, we witness structure and lines individually &ndash; the depth and variety of spacing, yet from a distance everything slowly starts to fade together. While seemingly linear, there are chaotic aspects of an overlapping element, like the blurring when looking out the window of a bullet-train as buildings pass by.`,
      `The structure is built from a simple recursive grid but instead, mirroring each grid block on the x-axis to the left (effectively doubling its width). Through this, grid blocks overlap each other and start to interact together through palette blending and line speed which is applied to each individual grid block. &ldquo;<em>Piezo</em>&rdquo; was formed from working with a very rigid and structured system, while intending to break it apart through this mirroring.`,
      `All color palettes are entirely generative, selected as a base of 2&ndash;7 colors which are then assigned to individual grid locations. In previous work rudxane often used predetermined palettes, <em>Piezo</em> is a journey to reach out of comfort zones: to use randomness in selecting a base of colors that either contrast or complement each other. Each rectangular section manifests a limited color palette, which is then fused by mixing with different densities to form subtle gradients of color.`,
      `Created in Vanilla JS, through code rudxane has found the perfect combination of using a methodical approach while still focusing on the expressive side of visual work. This process requires him to translate visual ideas back into a system, peeling away all the layers of an idea to find the core concepts that create the final image. Based on an extensive use of math, it may come as a surprise that rudxane doesn&rsquo;t necessarily enjoy it, although it always comes naturally. He constantly thinks in systems, analyzing each individual cog in the machine to understand how it works.`,
      `<em>Piezo</em>, ties to rudxane&rsquo;s prior generative series &ldquo;<em>Fold</em>&rdquo; in terms of intention of process, both works expressing a focus on utilizing particular techniques &amp; aesthetics to birth variety in outputs.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/rudxane/piezo-18.jpg",
            alt: "rudxane, Piezo #18",
            title: "Piezo #18",
            verseUrl: "https://verse.works/items/ethereum/0x457cf39082f586aa29f7f148e1ff036b6d029ff3/17",
          },
          {
            image: "/images/rudxane/piezo-5.jpg",
            alt: "rudxane, Piezo #5",
            title: "Piezo #5",
            verseUrl: "https://verse.works/items/ethereum/0x457cf39082f586aa29f7f148e1ff036b6d029ff3/4",
          },
        ],
      },
      {
        afterParagraphIndex: 2,
        items: [
          {
            image: "/images/rudxane/piezo-1.jpg",
            alt: "rudxane, Piezo #1",
            title: "Piezo #1",
            verseUrl: "https://verse.works/items/ethereum/0x457cf39082f586aa29f7f148e1ff036b6d029ff3/0",
          },
          {
            image: "/images/rudxane/piezo-7.jpg",
            alt: "rudxane, Piezo #7",
            title: "Piezo #7",
            verseUrl: "https://verse.works/items/ethereum/0x457cf39082f586aa29f7f148e1ff036b6d029ff3/6",
          },
        ],
      },
      {
        afterParagraphIndex: 4,
        items: [
          {
            image: "/images/rudxane/piezo-installation.jpg",
            alt: "rudxane, Piezo — installation view at Galerie Met",
            verseUrl: "https://galeriemet.com/past-exhibitions/rudxane-piezo",
          },
        ],
      },
      {
        afterParagraphIndex: 6,
        items: [
          {
            image: "/images/rudxane/piezo-installation-2.jpg",
            alt: "rudxane, Piezo — installation view at Galerie Met",
            verseUrl: "https://galeriemet.com/past-exhibitions/rudxane-piezo",
          },
        ],
      },
      {
        afterParagraphIndex: 9,
        items: [
          {
            image: "/images/rudxane/piezo-hero.jpg",
            alt: "rudxane, Piezo — installation view",
            verseUrl: "https://galeriemet.com/past-exhibitions/rudxane-piezo",
          },
        ],
      },
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
  {
    slug: "escapes",
    artistSlug: "t-k-z",
    artistName: "Tù.úk'z",
    title: "ESCAPES",
    year: 2024,
    month: "Jun",
    date: "June 2024",
    location: "Verse",
    status: "past",
    workCount: 128,
    hero: "/images/t-k-z/escapes-91.jpg",
    verseSeriesUrl: "https://verse.works/series/escapes-tuukz",
    artistBio: "Arthur Machado, known as Tù.úk’z, is a Brazilian digital artist who has been working within the digital arts landscape since 2012. Tù.úk’z’s body of work spans a broad spectrum of digital forms, including glitch art, AI-generated pieces, collage, painting, image, video, and sound. His work explores themes of abstraction and psychedelia, reflecting his journey as a digital nomad and his involvement in the NFT space.",
    descriptionByArtist: true,
    description: [
      `<em>ESCAPES</em> is a collection of ethereal landscapes, crafted to transport viewers into realms where reality merges with the surreal. Each piece within this series acts as a portal to fantastical worlds, defined by enigmatic orbs.`,
    ],
    exploreArtworks: [
      {
        id: "escapes-54",
        title: "ESCAPES #54",
        image: "/images/t-k-z/escapes-54.jpg",
        alt: "Tù.úk'z, ESCAPES #54",
        verseUrl: "https://verse.works/items/ethereum/0x18e0e4c10c6158295a7be03f57712f8667e65dcb/53",
      },
      {
        id: "escapes-53",
        title: "ESCAPES #53",
        image: "/images/t-k-z/escapes-53.jpg",
        alt: "Tù.úk'z, ESCAPES #53",
        verseUrl: "https://verse.works/items/ethereum/0x18e0e4c10c6158295a7be03f57712f8667e65dcb/52",
      },
      {
        id: "escapes-81",
        title: "ESCAPES #81",
        image: "/images/t-k-z/escapes-81.jpg",
        alt: "Tù.úk'z, ESCAPES #81",
        verseUrl: "https://verse.works/items/ethereum/0x18e0e4c10c6158295a7be03f57712f8667e65dcb/80",
      },
    ],
  },
  {
    slug: "basalt-rt",
    artistSlug: "itsgalo",
    artistName: "Itsgalo",
    title: "BASALT RT",
    year: 2024,
    month: "Jun",
    date: "June 2024",
    location: "Verse",
    status: "past",
    workCount: 96,
    hero: "/images/itsgalo/basalt-rt-hero.jpg",
    // Live real-time JS artwork. Edition #28 (token #27 on the
    // Ethereum contract) seeded as the hero specimen — viewers see the
    // BASALT algorithm running in the browser. Click-through is
    // suppressed by the hero plate when heroIframe is set so the
    // iframe stays interactive; the verseSeriesUrl below is what the
    // hero title-bar links use.
    heroIframe: "/api/genart/basalt-rt?payload=eyJoYXNoIjoiMHhlYzAwMmQ3YWJjYTgwMzQ0MjcwNmNkNjI5YWQzNTEwNTM5Yjk4ZTQzNjAzNzJhNWI2OWZjNTgzZTcxMDhjYTRhIiwiZWRpdGlvbk51bWJlciI6MjgsInRvdGFsRWRpdGlvbnMiOjY1LCJpbnB1dCI6eyIkdXNlcm5hbWUiOiJkaWdpdGFsY29sZW1hbiJ9fQ%3D%3D",
    verseSeriesUrl: "https://verse.works/series/basalt-rt-itsgalo",
    artistBio: "Itsgalo is the screen-name for Galo Canizares, a designer, writer, and educator working across various creative fields from architecture to digital art to experimental software. He is currently an assistant professor of architecture at the University of Kentucky’s College of Design where he teaches courses on visualization and representation. Galo’s work interrogates the emerging sociotechnical effects of code, screens, and software culture. He is fascinated by the strange behaviors and aesthetics unique to computing and digital media, an interest that emerged as a kid playing with Flash and other painting software. In 2019, Galo published a collection of essays on computation, art, and design titled Digital Fabrications: Designer Stories for a Software-Based Planet. Many of Galo’s artworks try to leverage computing to produce visually compelling and layered effects. They are often animated or use some kind of real-time motion like simulated physics. Other recurring themes are limited color palettes, dithering, and low-res graphics, concepts and techniques tied to the history of computer-based art.",
    descriptionByArtist: true,
    description: [
      `<em>BASALT RT</em> is a real-time Javascript software artwork that explores the <em>BASALT</em> algorithm in a long-form generative format. It leverages the interactivity of the web browser and provides an interface for walking through the parameter space of the algorithm. Each iteration generates unique gestures and color combinations based on a set of constraints, resulting in a range of abstract <span class="num-lining">2</span>D figures that flow, blend, and dissipate through the canvas forever.`,
    ],
    exploreArtworks: [
      {
        id: "basalt-rt-53",
        title: "BASALT RT #53",
        image: "/images/itsgalo/basalt-rt-53.jpg",
        alt: "Itsgalo, BASALT RT #53",
        verseUrl: "https://verse.works/items/ethereum/0xfcfcf1547b5ef44ac35e260f7c0bba5e307a94c8/52",
        iframe: "/api/genart/basalt-rt?payload=eyJoYXNoIjoiMHgwYTg0MGE1ZjY5OWI5OWFlMWQ1MGE1OWZkZWJhNDg4N2Y4ZmEwNmQ2YzkxZDM0MjA4ZmNiNDEzMzk5OGE2YjJhIiwiZWRpdGlvbk51bWJlciI6NTMsInRvdGFsRWRpdGlvbnMiOjY1LCJpbnB1dCI6eyIkdXNlcm5hbWUiOiJyYWdzbWF0YWdzIn19",
      },
      {
        id: "basalt-rt-34",
        title: "BASALT RT #34",
        image: "/images/itsgalo/basalt-rt-34.jpg",
        alt: "Itsgalo, BASALT RT #34",
        verseUrl: "https://verse.works/items/ethereum/0xfcfcf1547b5ef44ac35e260f7c0bba5e307a94c8/33",
        iframe: "/api/genart/basalt-rt?payload=eyJoYXNoIjoiMHg1ZTllYmY1Y2NlMDZlMWRiMmM4M2JiZmU1MDU4OTlhMjY4ODEzMjQwMmNhMWMxZmVlNDg5MTliMTEzMmU1ZjhjIiwiZWRpdGlvbk51bWJlciI6MzQsInRvdGFsRWRpdGlvbnMiOjY1LCJpbnB1dCI6eyIkdXNlcm5hbWUiOiJoYW5uYWgyMTA2In19",
      },
      {
        id: "basalt-rt-85",
        title: "BASALT RT #85",
        image: "/images/itsgalo/basalt-rt-85.jpg",
        alt: "Itsgalo, BASALT RT #85",
        verseUrl: "https://verse.works/items/ethereum/0xfcfcf1547b5ef44ac35e260f7c0bba5e307a94c8/84",
        iframe: "/api/genart/basalt-rt?payload=eyJoYXNoIjoiMHhmMWEyODdiNWRkMjk5NDg2MTk4NGIwMjY4ODQ4NmExNzJkYzZkODBkZDFmMDQwNmNiMmY0ODE1NTI3NzM4NjI5IiwiZWRpdGlvbk51bWJlciI6ODUsInRvdGFsRWRpdGlvbnMiOjY1LCJpbnB1dCI6eyIkdXNlcm5hbWUiOiJyYWdzbWF0YWdzIn19",
      },
    ],
  },
  {
    slug: "deluge",
    artistSlug: "chepertom",
    artistName: "Chepertom",
    title: "Deluge",
    year: 2024,
    month: "May",
    date: "May 2024",
    location: "Verse",
    status: "past",
    hero: "/images/chepertom/mound-rad.png",
    verseSeriesUrl: "https://verse.works/series/deluge-by-chepertom",
    workCount: 14,
    description: [
      `<em>Deluge</em> presents two distinct styles of work from Chepertom, <em>RAW</em>s and <em>RAD</em>s, which invite viewers to contemplate the chaos of daily life and data-driven overload via the metaphor of the ocean&rsquo;s patterns and behaviours. Inspired by the boundless and tumultuous energy of the ocean, Chepertom utilises this natural force as a metaphor to delve into the complexities of the wider world. His works reflect on themes of chaos and order, digitally reinterpreting natural elements to express global events and personal perceptions. The <em>RAW</em> pieces embody the unrefined, chaotic essence of the ocean and are derived from various sources including video footage. These works are more unpolished than the <em>RAD</em> pieces, natural landscapes that have not yet been tamed by digital tools, in which every pixel plays a crucial role in conveying the overwhelming data of daily life. They set the foundational stage for what evolves into the <em>RAD</em> artworks.`,
      `Transitioning from <em>RAW</em> to <em>RAD</em>, Chepertom engages a meticulous process of selection and compression. The <em>RAD</em> pieces, constructed from both personal and found footage, undergo repeated compressions, each layer distorting and displacing information to create curated snapshots of digital artefacts. These works focus on primary colours and emphasise movement and transformation, where the intense use of specific greens and blues resonate with the hues of the ocean, simultaneously suggesting the voids and spaces where data becomes corrupted yet visually compelling. There is a specific, intense green that recurs, which acts as a nod digital voids and green screens used in visual effects. This green represents areas where colour should exist but does not, instead signifying corruption and alteration, a frequent element in Chepertom&rsquo;s process of creation.`,
      `Central to the <em>RAD</em> series is the concept of noise versus signal. In these artworks, Thomas plays with the balance of too much noise, which obscures the view, and the use of empty space, which creates perspective. This interplay is crucial in forming a visual environment where viewers are invited into a refined window of understanding amidst the chaos.`,
      `<em>Deluge</em> offers a commentary on how digital media can encapsulate and make sense of the sprawling, noisy world we inhabit. The series is a journey through visual disruption that seeks to find clarity and beauty in the chaos, using the ocean as both inspiration and metaphor for the unpredictability of life.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 0,
        items: [
          {
            image: "/images/chepertom/aftermath-raw.jpg",
            alt: "Chepertom, Aftermath.RAW",
            title: "Aftermath.RAW",
            verseUrl: "https://verse.works/items/ethereum/0x43edf75bf205bd8070028b56ad4fa23877f0f010/1276186690",
          },
        ],
      },
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/chepertom/dispersion-raw.jpg",
            alt: "Chepertom, Dispersion.RAW",
            title: "Dispersion.RAW",
            verseUrl: "https://verse.works/items/ethereum/0x43edf75bf205bd8070028b56ad4fa23877f0f010/902259600",
          },
        ],
      },
      {
        afterParagraphIndex: 3,
        items: [
          {
            image: "/images/chepertom/breaker-rad.png",
            alt: "Chepertom, Breaker.RAD",
            title: "Breaker.RAD",
            verseUrl: "https://verse.works/items/ethereum/0x43edf75bf205bd8070028b56ad4fa23877f0f010/586613901",
          },
          {
            image: "/images/chepertom/undertow-rad.png",
            alt: "Chepertom, Undertow.RAD",
            title: "Undertow.RAD",
            verseUrl: "https://verse.works/items/ethereum/0x43edf75bf205bd8070028b56ad4fa23877f0f010/2380242932",
          },
        ],
      },
    ],
  },
  {
    slug: "basalt-gifs",
    artistSlug: "itsgalo",
    artistName: "Itsgalo",
    title: "Basalt GIFs",
    year: 2024,
    month: "May",
    date: "May 2024",
    location: "Verse",
    status: "past",
    workCount: 20,
    hero: "/images/itsgalo/basalt-15-hero.gif",
    verseSeriesUrl: "https://verse.works/series/basalt-by-itsgalo",
    artistBio: "Itsgalo is the screen-name for Galo Canizares, a designer, writer, and educator working across various creative fields from architecture to digital art to experimental software. He is currently an assistant professor of architecture at the University of Kentucky’s College of Design where he teaches courses on visualization and representation. Galo’s work interrogates the emerging sociotechnical effects of code, screens, and software culture. He is fascinated by the strange behaviors and aesthetics unique to computing and digital media, an interest that emerged as a kid playing with Flash and other painting software. In 2019, Galo published a collection of essays on computation, art, and design titled Digital Fabrications: Designer Stories for a Software-Based Planet. Many of Galo’s artworks try to leverage computing to produce visually compelling and layered effects. They are often animated or use some kind of real-time motion like simulated physics. Other recurring themes are limited color palettes, dithering, and low-res graphics, concepts and techniques tied to the history of computer-based art.",
    descriptionByArtist: true,
    description: [
      `<em>BASALT GIFs</em> is a curated series of 20 animated digital paintings made with a custom real-time software built with Processing. Each piece is uniquely generated through a stochastic generative process involving simulated gestures, limited color palettes, video feedback, and graphics quantization algorithms.`,
      `The gestures repeat themselves continuously producing pigmented trails which bleed together and slowly fade out as their lifespan on the canvas diminishes. The animations loop seamlessly and are made of 90 unique individual still frames. Each animation is formatted as a 720&times;960 GIF.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 0,
        items: [
          {
            image: "/images/itsgalo/basalt-8.gif",
            alt: "Itsgalo, BASALT GIFs #8",
            title: "BASALT GIFs #8",
            verseUrl: "https://verse.works/items/ethereum/0x061f20f26842f7257853dce8027af0c8f7c15baf/85824379",
          },
        ],
      },
    ],
    exploreArtworks: [
      {
        id: "basalt-10",
        title: "BASALT GIFs #10",
        image: "/images/itsgalo/basalt-10.gif",
        alt: "Itsgalo, BASALT GIFs #10",
        verseUrl: "https://verse.works/items/ethereum/0x061f20f26842f7257853dce8027af0c8f7c15baf/3016874169",
      },
      {
        id: "basalt-2",
        title: "BASALT GIFs #2",
        image: "/images/itsgalo/basalt-2.gif",
        alt: "Itsgalo, BASALT GIFs #2",
        verseUrl: "https://verse.works/items/ethereum/0x061f20f26842f7257853dce8027af0c8f7c15baf/1090197138",
      },
      {
        id: "basalt-3",
        title: "BASALT GIFs #3",
        image: "/images/itsgalo/basalt-3.gif",
        alt: "Itsgalo, BASALT GIFs #3",
        verseUrl: "https://verse.works/items/ethereum/0x061f20f26842f7257853dce8027af0c8f7c15baf/2725536407",
      },
    ],
  },
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
    heroTheme: "paper",
    verseSeriesUrl: "https://verse.works/series/autoscope-by-erik-swahn",
    workCount: 360,
    description: [
      `The Garden is proud to present <em>Autoscope</em>, by Swedish artist and architect Erik Swahn. In <em>Autoscope</em>, Swahn continues to explore the theme of colour as building material, a concept that runs throughout his practice, including in the series <em>Farbteiler</em> (2021) and <em>Punktwelt</em> (2022). However, in this new collection Swahn ventures into new configurations of space, creating atmospheric landscapes consisting of colour and shape. <em>Autoscope</em> is a new departure for Swahn. In many of his previous works, the artist generates a singular object as a central motif, whereas in this new series, immersive spaces are formulated using colour and configurations of geometric shapes.`,
      `In <em>Autoscope</em>, Swahn has created new universes that suggest pastoral landscapes, modernist abstraction, and deeply coloured textiles. Swahn&rsquo;s background in architecture imbues his work with a deep spatial awareness and the ability to play with space and perspective. In <em>Autoscope</em>, pyramids, cones, cylinders, and waveforms create a shifting topography. Some parts of the image are blurred, distorted, or subjected to erasure, suggesting the recollection of a hazy memory. Each image presents a richly saturated, animated chromatic world.`,
      `Previous bodies of work, such as <em>Punktwelt</em> and <em>Fields</em>, exemplify Swahn&rsquo;s fascination with colour theory and how colours interact to create atmosphere and structure space. His practice often involves an economy of means, for example, abstract objects in a reduced landscape in <em>Punktwelt</em> or irregular grids used to create light and reflections in <em>Fields</em>. This sense of clarity permeates the artist&rsquo;s approach to art. Swahn uses code and computational procedures as creative tools to build artworks characterised by precision and intelligibility. In <em>Funktor</em>, each piece is generated using a sequence of mathematical functions called signed distance functions. The result is a field of points that evolve unexpectedly to enclose space and create form. In <em>Punktwelt</em>, a single rectangular block is transformed using a method called Boolean subtraction, creating illusory or paradoxical abstract geometrical shapes.`,
      `<em>Autoscope</em> builds on Swahn&rsquo;s previous body of work while exploring new possibilities in terms of colour and form. In <em>Autoscope</em> the artist invites you to experience what he terms a &ldquo;chromatopia.&rdquo;`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 0,
        items: [
          {
            image: "/images/erik-swahn/autoscope-111.jpg",
            alt: "Erik Swahn, Autoscope #111",
            title: "Autoscope #111",
            iframe:
              "/api/genart/autoscope?payload=eyJoYXNoIjoiMHgyODhiMTZjNzNiY2JmNDBkNDIxNTkwYTE1ZjQyMmRjMWFhNjYwYTQ3Nzc2NWJiZDc3YTMyOWFkNjc3ZDBlNjc5IiwiZWRpdGlvbk51bWJlciI6MTExLCJ0b3RhbEVkaXRpb25zIjoyNjAsImlucHV0Ijp7IiR1c2VybmFtZSI6InJpY2hsZWVjaCJ9fQ==",
            verseUrl: "https://verse.works/items/ethereum/0xe7ed54673455193f1d4448c88c6544fd93a237c0/1177487004",
            aspectRatio: 1.5,
            cssVars: { "--art-scale": 1, "--cap-x": "0px", "--cap-y": "0px" },
          },
        ],
      },
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/erik-swahn/autoscope-121.jpg",
            alt: "Erik Swahn, Autoscope #121",
            title: "Autoscope #121",
            iframe:
              "/api/genart/autoscope?payload=eyJoYXNoIjoiMHg5Yjk0ODlkMDNlYTdkMjEwMDMwNDljOWI1OGIwNmU3MTE1OWY3MDk5ZDE1MTFkMzQ5NzExMGU3NGI0YmU2N2E2IiwiZWRpdGlvbk51bWJlciI6MTIxLCJ0b3RhbEVkaXRpb25zIjoyNjAsImlucHV0Ijp7IiR1c2VybmFtZSI6ImpheTA2MDUifX0=",
            verseUrl: "https://verse.works/items/ethereum/0xe7ed54673455193f1d4448c88c6544fd93a237c0/832000321",
            aspectRatio: 1.5,
            cssVars: { "--art-scale": 1, "--cap-x": "0px", "--cap-y": "0px" },
          },
        ],
      },
      {
        afterParagraphIndex: 3,
        items: [
          {
            image: "/images/erik-swahn/autoscope-83.jpg",
            alt: "Erik Swahn, Autoscope #83",
            title: "Autoscope #83",
            iframe:
              "/api/genart/autoscope?payload=eyJoYXNoIjoiMHhhNzE3Mjg0NDFjM2Q4YWM5ZjZiMGI5MWEzMWM3MWJlMGUxOGYwODk4ZmJkMjQzYTdkOGQwZjRkMjYyMTAzZGZlIiwiZWRpdGlvbk51bWJlciI6ODMsInRvdGFsRWRpdGlvbnMiOjI2MCwiaW5wdXQiOnsiJHVzZXJuYW1lIjoic2FmZWQifX0=",
            verseUrl: "https://verse.works/items/ethereum/0xe7ed54673455193f1d4448c88c6544fd93a237c0/263500477",
            aspectRatio: 1.5,
            cssVars: { "--art-scale": 1, "--cap-x": "0px", "--cap-y": "0px" },
          },
        ],
      },
    ],
  },
  {
    slug: "gwanak-gu",
    artistSlug: "earthsample",
    artistName: "earthsample",
    title: "gwanak-gu",
    year: 2024,
    month: "Mar",
    date: "March 2024",
    location: "Verse",
    status: "past",
    hero: "/images/earthsample/gwanak-gu-hero.gif",
    heroTheme: "paper",
    verseSeriesUrl: "https://verse.works/series/gwanak-gu-by-earthsample",
    workCount: 10,
    artistBio: "earthsample (b. 1998) is a lens-based artist residing in Canada, taking pieces of the world and making them anew. A digital native who ventures out into the world to collect structures, forms and shapes to be manipulated with and make his own. He creates expressions of an internal makeup using pieces of our shared world.",
    artistBioOverride: true,
    description: [
      `The Garden is proud to present <em>gwanak-gu</em>, a series of digital collages that articulate earthsample&rsquo;s experience of Seoul, Korea. The works are alchemical, transforming personal memories and everyday visual stimuli into surreal portraits of the city. Each GIF is distinguished by nuanced glitches that encourage viewers to pause and reflect, meditating on each work just as creating each work was a cathartic, reflective process for the artist.`,
      `Having never before left the west, when he was 19 earthsample travelled to Hong Kong and felt supercharged by emotion and creativity upon experiencing this new corner of the world. He wanted to document the experience through his art, and ever since then he has been recording his travels by remixing the environments he finds himself in. His process begins with simple point-and-shoot documentation of his surroundings. He then manipulates the digital images, maximising on the high level of precision that is enabled by the digital medium, working pixel by pixel.`,
      `He borrows elements from the everyday which are often overlooked, and positions them as the focal points in his work. This shift in focus creates abstracted scenery with surrealist aesthetics. The GIFs are intuitive. They tap into the texture of the sidewalk, the sounds of the trees, the rich environments that surround us.`,
      `When we walk down a path, how much do we notice, how much do we absorb? When life is busy, we blast through without taking a moment to appreciate the details. In earthsample&rsquo;s GIFs, movements are often infinitesimal and easily overlooked. We are therefore forced to slow down and tune in, pore over the works in search of the glitches, visually digesting the works as we do so.`,
      `Boiling his experience of a place &mdash; in this series&rsquo; case Seoul &mdash; down to its essence and transforming it into compelling visual montages is earthsample&rsquo;s way. The works in <em>gwanak-gu</em> reflect the physical and mental landscapes earthsample found himself in at the point of creation, and simultaneously encourage us to partake in a moment of reflection too.`,
    ],
    details: {
      sourceImage: "/images/earthsample/gwanak-gu-kelp.gif",
      title: "kelp",
      verseUrl: "https://verse.works/items/ethereum/0x2e7055b93c46f61f6010c83ec7ead9dff42d8de8/4137681301",
      aspectRatio: "1",
      crops: [
        { id: "grasses",   x: 17, y: 36, zoom: 3 },
        { id: "porthole",  x: 50, y: 36, zoom: 3 },
        { id: "stippling", x: 83, y: 36, zoom: 3 },
      ],
    },
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/earthsample/gwanak-gu-a-trip-to-osaka.gif",
            alt: "earthsample, a trip to osaka",
            title: "a trip to osaka",
            verseUrl: "https://verse.works/items/ethereum/0x2e7055b93c46f61f6010c83ec7ead9dff42d8de8/687353685",
          },
        ],
      },
      {
        afterParagraphIndex: 2,
        items: [
          {
            image: "/images/earthsample/gwanak-gu-worship.gif",
            alt: "earthsample, worship",
            title: "worship",
            verseUrl: "https://verse.works/items/ethereum/0x2e7055b93c46f61f6010c83ec7ead9dff42d8de8/2499525185",
          },
          {
            image: "/images/earthsample/gwanak-gu-gyeoul.gif",
            alt: "earthsample, gyeoul",
            title: "gyeoul",
            verseUrl: "https://verse.works/items/ethereum/0x2e7055b93c46f61f6010c83ec7ead9dff42d8de8/2544299552",
          },
        ],
      },
      {
        afterParagraphIndex: 3,
        items: [
          {
            image: "/images/earthsample/gwanak-gu-may.gif",
            alt: "earthsample, may",
            title: "may",
            verseUrl: "https://verse.works/items/ethereum/0x2e7055b93c46f61f6010c83ec7ead9dff42d8de8/2474689872",
          },
          {
            image: "/images/earthsample/gwanak-gu-spirit.gif",
            alt: "earthsample, spirit",
            title: "spirit",
            verseUrl: "https://verse.works/items/ethereum/0x2e7055b93c46f61f6010c83ec7ead9dff42d8de8/3089772769",
          },
        ],
      },
    ],
  },
  {
    slug: "isle-of-alcina",
    artistSlug: "t-k-z",
    artistName: "Tù.úk'z",
    title: "Isle of Alcina",
    year: 2024,
    month: "Mar",
    date: "March 2024",
    location: "Verse",
    status: "past",
    hero: "/images/t-k-z/isle-of-alcina-hero.jpg",
    verseSeriesUrl: "https://verse.works/series/isle-of-alcina-by-tuukz",
    workCount: 44,
    artistBio: "Arthur Machado, known as Tù.úk’z, is a Brazilian digital artist who has been working within the digital arts landscape since 2012. Tù.úk’z’s body of work spans a broad spectrum of digital forms, including glitch art, AI-generated pieces, collage, painting, image, video, and sound. His work explores themes of abstraction and psychedelia, reflecting his journey as a digital nomad and his involvement in the NFT space.",
    descriptionByArtist: true,
    description: [
      `In the labyrinthine corridors of imagination, the <em>Isle of Alcina</em> collection stands as a testament to the beguiling interplay between enchantment and peril. Each piece is a portal into the sorceress&rsquo;s dominion, where the verdant allure of eternal spring veils the capricious whims of its mistress.`,
      `The art captures the intoxicating fusion of flora and the arcane, a paradise woven with spells that ensnare the senses and bewitch the mind. Here, in this gallery of wonders, Alcina&rsquo;s sorcery breathes through the canvas, her island&rsquo;s deceptive beauty etched into each stroke and&nbsp;hue &mdash; a&nbsp;siren&rsquo;s call that beckons viewers to gaze deeper, and perhaps, to linger a little too long in the embrace of her creation.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 0,
        items: [
          {
            image: "/images/t-k-z/isle-of-alcina-inline-1.jpg",
            alt: "Tù.úk'z, Isle of Alcina #7",
            title: "Isle of Alcina #7",
            verseUrl: "https://verse.works/items/ethereum/0xcb3440589ea6cc8ebd56505994299f80b0fb13e5/2631625648",
          },
          {
            image: "/images/t-k-z/isle-of-alcina-inline-2.jpg",
            alt: "Tù.úk'z, Isle of Alcina #15",
            title: "Isle of Alcina #15",
            verseUrl: "https://verse.works/items/ethereum/0xcb3440589ea6cc8ebd56505994299f80b0fb13e5/1234091112",
          },
        ],
      },
    ],
  },
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
    hero: "/images/jeres/heuristics-of-emotion-hero-new.png",
    heroTheme: "paper",
    verseSeriesUrl: "https://verse.works/series/heuristics-of-emotion-artist-curated-by-jeres",
    workCount: 1000,
    details: {
      sourceImage: "/images/jeres/heuristics-detail-source.png",
      title: "Heuristics of Emotion #105",
      verseUrl: "https://verse.works/items/solana/A2s1pgifFGm7cgBvB72TAd5xL76GEXwwMHXkNp3ZEiDo/B8zo8LwthNq7pbtWHBExBUViBi7oBNBm4zRLEFLs8Svw",
      aspectRatio: "2/3",
      artworkInset: { top: 0, right: 0, bottom: 0, left: 0 },
      crops: [
        { id: "halftone-stipple", x: 55, y: 12, zoom: 3.2 },
        { id: "scan-grid",        x: 50, y: 42, zoom: 3.2 },
        { id: "pixel-barcode",    x: 58, y: 78, zoom: 3.2 },
      ],
    },
    description: [
      `For many, sentient machines are the ultimate fear, perhaps as they signify the true unknown, a world we can&rsquo;t quite comprehend yet. We fear these nascent technologies as their evolutionary projections are unknown to us, and we can&rsquo;t foresee how their emotional intelligence will progress. In their latest series of work, <em>Heuristics of Emotion</em>, Jeres has endeavoured to visualise the essence of sentient machines, what it would look like if our mechanical creations developed the ability to feel, to experience the emotional highs and lows that we as humans experience.`,
      `Heuristics are strategies employed by humans, animals, and machines to shape judgements, problem solve, arrive at decisions and solutions, navigating through complexity. When considering sentient AI, heuristics could play a pivotal role in artificial intelligence&rsquo;s ability to navigate the world in a more emotionally evolved capacity. Jeres is interested in the dissonance between how we as people relate to each other, and how we relate to machines, as well as machines&rsquo; abilities to relate to us. Algorithms are being taught to extract sentiment from prompts and imitate, or simulate, compassion.`,
      `The works in <em>Heuristics of Emotion</em> are visual representations of how Jeres imagines the predicted emotional intelligence of machines. Every AI carries within it the biases of their human creators. In the words of Jeres, &lsquo;If we think about humans training machines, the ghost of us is instilled in them&rsquo;. Currently, these machines are at an adolescent stage, which Jeres wanted to reflect within the works. They deliberately introduced elements of violence and chaos alongside structure, mirroring the turbulent emotions and experiences of adolescence as we understand it.`,
      `The works portray dramatic spirals, extensions, and static, reflecting the struggle of navigating emotional terrain, experienced by humans and now too machines on their journey toward emotional intelligence. The jagged edges and waves within the works signify the fluidity of emotions over time, while the more static, almost blurry spaces represent unexplored emotions, creating an atmosphere of ambiguity and the unknown. For the machines, these are emotional blindspots, synonymous with their relative immaturity. Colours within the works act as emotional thermometers, representing various temperatures of sentiment. Each hue narrates a different emotional state, adding depth and richness to the abstract canvases, and speaking to the varied temperatures of human emotions.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 0,
        items: [
          {
            image: "/images/jeres/heuristics-inline-1.png",
            alt: "Jeres, Heuristics of Emotion #152",
            title: "Heuristics of Emotion #152",
            verseUrl: "https://verse.works/items/solana/A2s1pgifFGm7cgBvB72TAd5xL76GEXwwMHXkNp3ZEiDo/BwzE7M2LsuB6eVRAdCM7JwG4ZAXRdZMhwZcaCsxWg9K5",
            unoptimized: true,
          },
          {
            image: "/images/jeres/heuristics-inline-2.png",
            alt: "Jeres, Heuristics of Emotion #50",
            title: "Heuristics of Emotion #50",
            verseUrl: "https://verse.works/items/solana/A2s1pgifFGm7cgBvB72TAd5xL76GEXwwMHXkNp3ZEiDo/7Q5UvTUJLFumFKAzmR84afDBH2saTztQwubuqrqhGvUs",
            unoptimized: true,
          },
        ],
      },
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "/images/jeres/heuristics-inline-3.png",
            alt: "Jeres, Heuristics of Emotion #25",
            title: "Heuristics of Emotion #25",
            verseUrl: "https://verse.works/items/solana/A2s1pgifFGm7cgBvB72TAd5xL76GEXwwMHXkNp3ZEiDo/W6z1q6AyeN3ceAZ727ZU1JotFwUAp3geYoUobSrMygX",
            unoptimized: true,
          },
          {
            image: "/images/jeres/heuristics-inline-4.png",
            alt: "Jeres, Heuristics of Emotion #555",
            title: "Heuristics of Emotion #555",
            verseUrl: "https://verse.works/items/solana/A2s1pgifFGm7cgBvB72TAd5xL76GEXwwMHXkNp3ZEiDo/9AhKFY3MwewCHHNXLV2dDobtmd8LTJ2b2Uc5kfwwCZLT",
            unoptimized: true,
          },
        ],
      },
    ],
    artistQuote: {
      paragraphs: [
        `We are in a nascent time when machines are adolescent and have a young understanding of what human emotion is.`,
      ],
      attribution: "Jeres",
    },
  },
  {
    slug: "glitch-garden",
    artistSlug: "sp-gelsesmaskinen",
    artistName: "Spøgelsesmaskinen",
    title: "Glitch Garden",
    year: 2024,
    month: "Feb",
    date: "February 2024",
    location: "Verse",
    status: "past",
    hero: "/images/sp-gelsesmaskinen/glitch-garden-hero.gif",
    verseSeriesUrl: "https://verse.works/series/glitch-garden-by-spogelsesmaskinen",
    workCount: 25,
    artistBio: "Rune Brink Hansen (b. 1979, Odense, Denmark) is a self taught multidisciplinary artist who lives and works in Copenhagen, Denmark. He started working with digital interfaces during the early internet days. Since then he has crafted digital visuals for festivals, designed spaces for museums, and exhibited large scale light installations at various institutions and galleries. In 2021, he adopted the Spøgelsesmaskinen artist name for his 3D and NFT artwork. In the global online art community, he is known simply as “Spogel”.",
    descriptionByArtist: true,
    description: [
      `I always been very fascinated by water and flow patterns and how they are present in shaping nature. Ever since I read the classic <em>Sensitive Chaos</em> by Theodor Schwenk, flow patterns has been a recurring theme in my works beside working with technical heritage studies. The combination of the low res pixels and the mesmerising effects achieved by flow-motion are some of the most beautiful calming phenomenass and I just never get tired of playing around with them.`,
      `When I first discovered how pixels somehow emphasises the ticketing sensation when one emitting light diode takes over from the previous I knew I had to do a garden series.`,
      `<em>Glitch Garden</em> is my attempt to recreate this tickeling effect while studying a range of different plant types, grasses and leaves and their relation to the low resolution of 128x128 pixels.`,
    ],
    inlineArtworks: [
      {
        afterParagraphIndex: 0,
        items: [
          {
            image: "/images/sp-gelsesmaskinen/glitch-garden-thuja.gif",
            alt: "Spøgelsesmaskinen, Glitch Garden — Thuja occidentalis / Thuja",
            title: "Thuja occidentalis / Thuja",
            verseUrl: "https://verse.works/items/ethereum/0x740067ff706c18e1b017e43e4b3b81be787e3d50/1882203025",
          },
        ],
      },
      {
        afterParagraphIndex: 2,
        items: [
          {
            image: "/images/sp-gelsesmaskinen/glitch-garden-common-broom.gif",
            alt: "Spøgelsesmaskinen, Glitch Garden — Cytisus scoparius / Common Broom",
            title: "Cytisus scoparius / Common Broom",
            verseUrl: "https://verse.works/items/ethereum/0x740067ff706c18e1b017e43e4b3b81be787e3d50/2144032293",
          },
          {
            image: "/images/sp-gelsesmaskinen/glitch-garden-butterfly-bush.gif",
            alt: "Spøgelsesmaskinen, Glitch Garden — Buddleia davidi / Butterfly Bush",
            title: "Buddleia davidi / Butterfly Bush",
            verseUrl: "https://verse.works/items/ethereum/0x740067ff706c18e1b017e43e4b3b81be787e3d50/4168578279",
          },
          {
            image: "/images/sp-gelsesmaskinen/glitch-garden-virginia-sweetspire.gif",
            alt: "Spøgelsesmaskinen, Glitch Garden — Itea virginica / Virginia Sweetspire",
            title: "Itea virginica / Virginia Sweetspire",
            verseUrl: "https://verse.works/items/ethereum/0x740067ff706c18e1b017e43e4b3b81be787e3d50/2429716807",
          },
        ],
      },
    ],
  },
  {
    slug: "making-an-egg",
    artistSlug: "nikita-diakur",
    artistName: "Nikita Diakur",
    title: "Making an Egg with Hands",
    year: 2024,
    month: "Jan",
    date: "January 2024",
    location: "Verse",
    status: "past",
    heroVideo: "/images/nikita-diakur/making-an-egg-hero.mp4",
    heroVerseUrl: "https://verse.works/artworks/2737ddd1-55e0-4df4-ba84-bf8533bd9575",
    artistBio: "Nikita Diakur, an artist based in Germany, is known for portraying everyday activities using unconventional computer simulation methods that inherently bring randomness and chaos into his work. This approach allows for unexpected and spontaneous results, which are integral to his animation style. In addition, Diakur shares his expertise through lectures and workshops.",
    description: [
      `<em>Making Eggs with Hands</em> is a trilogy of video works by Nikita Diakur utilising computer simulation software, found footage, and recorded soundscapes to create an aesthetically authentic yet logistically disjointed depiction of a breakfast fry up within the &lsquo;matrix&rsquo; of the digital sphere.`,
      `In a departure from conventional rendering techniques, Diakur embraces the unrendered world inherent to digital spaces. Rejecting the traditional pursuit of hyper-realism in 3D art, he considers the unrendered perspective equally important and valid. This choice aligns with the evolution of art throughout history, moving from realism to abstraction, with Diakur positioning unrendered digital spaces as a unique aesthetic perspective.`,
      `In these simulated videos, detached human hands take centre stage, clamouring around a kitchen, cracking eggs into a pan with varying degrees of success. The surreal nature of the scenes emerge as the simulations introduce variations, such as a hand holding a cigarette, with the outcome dependent on the computer&rsquo;s decisions. Despite the disorienting glitches, the videos retain elements true to life&mdash;the opacity and colours of the eggs as they cook mirror the authenticity of real-world culinary experiences.`,
      `A distinctive aspect of these works is the use of soundscapes recorded in Diakur&rsquo;s own kitchen using a field recorder: the eggs cracking, pan sizzling, kitchen equipment clanging.`,
      `Diakur views his computer as an artistic collaborator, attributing a personality to it, like a computer stumbling home after a night out, hoping to cook a late-night fry-up. He sets the parameters for the simulations, allowing the computer to contribute to the creative process. Diakur then samples moments from each iteration to construct the final pieces.`,
      `The simulated kitchen scenes are based on a photograph sourced from eBay, depicting a kitchen that resonates with Diakur&rsquo;s personal experiences. The authenticity of the kitchen, with its relatable and non-pretentious atmosphere, serves as a canvas for exploring the interplay between the real and the simulated. Diakur&rsquo;s decision to use found footage contributes to the nostalgic and genuine feel of the artworks.`,
      `By exposing viewers to the unrendered landscape of the 3D software, Diakur plays with the boundary between reality and the simulated &lsquo;matrix&rsquo;. Challenging traditional perspectives in filmmaking, he breaks the angle through which viewers experience his art, questioning what exists outside our perceptual horizon. Contemplating the classic question, &ldquo;If a tree falls in a forest and no one is around to hear it, does it make a sound?&rdquo;, Diakur&rsquo;s works do not adhere to the boundaries of the simulated scene. The kitchen does not exist in a vacuum as a complete entity, and the illusion of this is broken by Diakur&rsquo;s disinterest in restricting our frame of perception as viewers.`,
      `Each <em>Making an Egg with Hands</em> work invites viewers to ponder the intersections of reality, simulation, and the inherent aesthetics of the digital world. Through disjointed visuals, authentic sounds, and a collaborative experiment with the computer, Diakur celebrates the authenticity and unique aesthetic of the simulation.`,
    ],
    verseSeriesUrl: "https://verse.works/exhibitions/making-an-egg-with-hands",
    // The trilogy: three distinct video works pulled from Verse's
    // hosted mp4s. One piece per pair of paragraphs (after 2, 4, 6),
    // each muted-loop and scroll-gated by InlineArtworks.
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "",
            alt: "Nikita Diakur, Making an Egg with Hands #1",
            title: "Making an Egg with Hands #1",
            video: "https://verse.works/static%2Fcurated-projects%2FNikita%20Diakur%2FMaking%20an%20Egg%20with%20Hands%2Fegg_with_hands_10_15_1920x1920_240106_01.mp4",
            verseUrl: "https://verse.works/items/ethereum/0x18Ba36AD9ad51DD83420DbD84227d855a88cdB3b/1419191301",
            aspectRatio: 1,
          },
        ],
      },
      {
        afterParagraphIndex: 3,
        items: [
          {
            image: "",
            alt: "Nikita Diakur, Making an Egg with Hands #2",
            title: "Making an Egg with Hands #2",
            video: "https://verse.works/static%2Fcurated-projects%2FNikita%20Diakur%2FMaking%20an%20Egg%20with%20Hands%2Fegg_with_hands_7_5_1920x1920_240106_01.mp4",
            verseUrl: "https://verse.works/items/ethereum/0x18Ba36AD9ad51DD83420DbD84227d855a88cdB3b/373970402",
            aspectRatio: 1,
          },
        ],
      },
      {
        afterParagraphIndex: 5,
        items: [
          {
            image: "",
            alt: "Nikita Diakur, Making an Egg with Hands #3",
            title: "Making an Egg with Hands #3",
            video: "https://verse.works/static%2Fcurated-projects%2FNikita%20Diakur%2FMaking%20an%20Egg%20with%20Hands%2Fegg_with_hands_25_25_1920x1920_240106_01.mp4",
            verseUrl: "https://verse.works/items/ethereum/0x18Ba36AD9ad51DD83420DbD84227d855a88cdB3b/2179281111",
            aspectRatio: 1,
          },
        ],
      },
    ],
  },
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
    heroTheme: "paper",
    // Live generative work — Verse's S3-hosted genart for edition #75,
    // proxied through /api/genart/ves3l so we can inject a synthetic
    // pointer event that kickstarts the puzzle's solve animation
    // (the genart waits for a click by design, and cross-origin embeds
    // can't dispatch events into the iframe).
    heroIframe: "/api/genart/ves3l?payload=eyJoYXNoIjoiMHhhMTYxZTQ1NWVkYTg2YTc3OGM5NzY5YWU5MDNlNGRhOGNhZTBhYjk5ZjFiNGRlYmQxYWNkNTI3YThlZDhlMjdkIiwiZWRpdGlvbk51bWJlciI6NzUsInRvdGFsRWRpdGlvbnMiOjE4OSwiaW5wdXQiOnsiJHVzZXJuYW1lIjoiMHhQaGlpaWwifX0%3D",
    // Re-roll the artwork's hash on every page load and on every
    // refresh-button click. Edition #75 is the SSR seed; once the
    // hero mounts in the browser the payload's hash is replaced with
    // fresh random bytes so the visitor always sees a unique piece.
    heroIframeRandomize: true,
    verseSeriesUrl: "https://verse.works/series/solve-un-solve-by-ves3l",
    workCount: 190,
    description: [
      `The Garden is thrilled to present VES<span class="num-lining">3</span>L&rsquo;s long‑form series, <em>Solve‑Un‑Solve</em>. It is the infinite puzzle: an interactive, generative program which challenges the passivity of traditional art and the perfection of historical generative aesthetics. VES<span class="num-lining">3</span>L believes the pinnacle of generative art is a beautiful algorithm, and with <em>Solve‑Un‑Solve</em> he has created an algorithm that is both visually powerful and incredibly complex, creating structures that can be &lsquo;solved&rsquo; and &lsquo;un‑solved&rsquo; in the manner of a Rubik&rsquo;s cube with indefinite variations.`,
      `The structure of each <em>Solve-Un-Solve</em> artwork begins in a randomised configuration of blocks, which then further scramble before beginning to reconfigure, or &lsquo;solve,&rsquo; themselves into place. Every edition in the collection can be solved from any un-solved state. To achieve a solved state, each side of the structure must become a uniform colour through the rotation of its blocks. The process of configuring blocks is derived from node structures in computer programming. Each node contains a child node which depends on its parent node; any positional change to the parent affects the child. Child blocks can be nested deep within the structure and therefore depend on the states of all of their ancestors (e.g. if a block is translated and rotated, its child block and all other descendants will be translated and rotated as well). Therefore, ancestor blocks must be solved recursively and in the correct order to solve the entire structure.`,
      `<em>Solve-Un-Solve</em> differs from &lsquo;traditional&rsquo; art in many ways. It is interactive, it presents a challenge rather than merely an object for appreciation and contemplation, and it introduces an extra dimension: time. It takes time to solve a puzzle; you can&rsquo;t appreciate it with a cursory glance, you must sit with it, become familiar with it. By creating a dual artwork-puzzle as his latest generative series, VES<span class="num-lining">3</span>L raises important questions about human psychology.`,
      `When you explore a puzzle it can be fun, but when you set your mind to solving it, it often becomes frustrating. A Rubik&rsquo;s cube can be solved in more ways than one, but there&rsquo;s always a way to do it &mdash; and that can haunt the untrained novice. <em>Solve-Un-Solve</em> gives you the option to become either the puzzle&rsquo;s protagonist, or an observer. You can interact with each output and view it from different spatial dimensions as if you&rsquo;re holding the Rubik&rsquo;s cube in your hands &mdash; viewing it from all sides before trying to tackle it &mdash; or you can surrender agency to the artwork itself, allowing it to solve, and un-solve, itself before your eyes.`,
      `Traditionally, art has been a consumptive pursuit for viewers. All it requires from us is our attention, our reaction. <em>Solve-Un-Solve</em> presents us with a choice: will we also give it our action, our effort, our time? And are we willing and ready to upset the perfection of its solved state?`,
      `When you go to a museum you can view a painting or sculpture, but with generative artworks like <em>Solve-Un-Solve</em>, there is an element of control. The viewer can choose to retain or relinquish their agency. The risk is the loss of the mystery, but the reward is the satisfaction of the moment when the pieces fall into place.`,
      `Antithetical to the pursuit of perfection found in Renaissance artworks such as da Vinci&rsquo;s <em>Vitruvian Man</em>, generative art is composed of perfect elements by default. A computer can draw a circle perfectly every time. Perfection is no longer the artistic apogee of the generative artist; rather, a great challenge in generative art is capturing the randomness that defines the aesthetic qualities of our physical reality. Humans inherently enjoy imperfection because we are imperfect (perfection in imperfection, if you ask VES<span class="num-lining">3</span>L). Generative art can be very geometric and polished, but VES<span class="num-lining">3</span>L was drawn to a more sketchy, expressionist aesthetic. The artworks have an almost stop-motion or flip-book quality &mdash; a self-described &lsquo;uncleanliness.&rsquo;`,
      `The shifting of the corner vertices and the off-axis rotation of the blocks, the lines in the foreground, the fading opacity of the blocks &mdash; each of these factors contributes to a level of imperfection that adds a drawn-like warmth, creating a physical/digital visual duality reminiscent of pen plotters, dither patterns, and dot matrices the likes of which were used in the earliest iterations of generative art by artists such as Vera Moln&aacute;r and Harold Cohen.`,
    ],
    // Three locked editions punctuating the prose every two paragraphs.
    // Each iframe goes through the same /api/genart/ves3l proxy as the
    // hero, but with `lock=1` so Math.random is seeded from the payload's
    // hash and the variation reads identically across reloads — these
    // function as fixed "specimens" of the series, where the hero is
    // the open-ended demonstrator that re-rolls on every visit.
    inlineArtworks: [
      {
        afterParagraphIndex: 1,
        items: [
          {
            image: "",
            alt: "VES3L, Solve-Un-Solve #166",
            title: "Solve-Un-Solve #166",
            iframe: "/api/genart/ves3l?payload=eyJoYXNoIjoiMHg3ZWQ3Njk2NTY4N2RhMTc5MDU2MzM5MmFjZTI2OWI2N2NiM2EyYjc3MmM3MmQ4ZDRhYWE0NmY4ZDUzMjI1ODUxIiwiZWRpdGlvbk51bWJlciI6MTY2LCJ0b3RhbEVkaXRpb25zIjoxODksImlucHV0Ijp7IiR1c2VybmFtZSI6ImNoZW44ODEyIn19&lock=1",
            verseUrl: "https://verse.works/items/ethereum/0x1cA2dc07129916F4dDB542bB6124CFa442f40Bb1/2258695220",
            aspectRatio: 1,
            linkable: true,
          },
        ],
      },
      {
        afterParagraphIndex: 3,
        items: [
          {
            image: "",
            alt: "VES3L, Solve-Un-Solve #165",
            title: "Solve-Un-Solve #165",
            iframe: "/api/genart/ves3l?payload=eyJoYXNoIjoiMHhkN2U5Y2JlMjI4YzM0YWE1NjdjYTIzZTAyMGJmYTc3MjgxNzNiOWY0MTNlYTZjNzU0OTZiYWE3NTYyMDFkMzc4IiwiZWRpdGlvbk51bWJlciI6MTY1LCJ0b3RhbEVkaXRpb25zIjoxODksImlucHV0Ijp7IiR1c2VybmFtZSI6ImNoZW44ODEyIn19&lock=1",
            verseUrl: "https://verse.works/items/ethereum/0x1cA2dc07129916F4dDB542bB6124CFa442f40Bb1/2181900128",
            aspectRatio: 1,
            linkable: true,
          },
        ],
      },
      {
        afterParagraphIndex: 5,
        items: [
          {
            image: "",
            alt: "VES3L, Solve-Un-Solve #173",
            title: "Solve-Un-Solve #173",
            iframe: "/api/genart/ves3l?payload=eyJoYXNoIjoiMHhlMGM1YzUyZThmM2QyN2IxOTVhZmQ0ZDBmODc2YWQ0OWY4NzAxN2JiNmJhYzYzN2Y1YmEyNGU2ODM5N2YzNzdlIiwiZWRpdGlvbk51bWJlciI6MTczLCJ0b3RhbEVkaXRpb25zIjoxODksImlucHV0Ijp7IiR1c2VybmFtZSI6ImNoZW44ODEyIn19&lock=1",
            verseUrl: "https://verse.works/items/ethereum/0x1cA2dc07129916F4dDB542bB6124CFa442f40Bb1/3438601325",
            aspectRatio: 1,
            linkable: true,
          },
        ],
      },
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
            verseUrl: "https://verse.works/series/ha-ha-by-john-provencher",
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
    artistName: "cydr",
    title: "New-life, to Still-life",
    year: 2023,
    month: "Sep",
    date: "September 2023",
    location: "Verse",
    status: "past",
    hero: "/images/cydr/new-life-to-still-life-hero.jpg",
    heroTheme: "paper",
    verseSeriesUrl: "https://verse.works/series/new-life-to-still-life-by-cydr",
    workCount: 11,
    artistBio: "cydr is based in Curitiba, Brazil. He works with mixed media and illustrations as a way to express his distorted mind. Although always creating as a child, he only caught up with his passion as he got older and his vision formed — he finally felt ready to put what was learnt…",
    artistBioOverride: true,
    description: [
      `The Garden is thrilled to bring you <em>New-life, to Still-life</em>, a series by Brazilian artist cydr. Like a tapestry, it weaves together his personal history, inspirations, and experiences, from his background in video games to his unique form of synesthesia.`,
      `<em>New-life, to Still-life</em> exudes a nostalgic charm reminiscent of old video games, capturing the essence of a bygone era while embracing modern digital techniques. Using fruit as his focal point, these works provide a commentary on the juxtaposition of natural forms and digital aesthetics. With each pixel, cydr invites us to reconsider our perceptions and embrace the beauty that exists within distortion.`,
      `cydr first began making digital art when he was encouraged by artist Omentejovem in 2020. Until then, his work had always been experimental, typically blending elements of photographic manipulation and collage, but this was a pivotal moment in cydr&rsquo;s artistic practice. He had previously been a physical creator and digital admirer, but beyond early experiments in Photoshop, this marked the beginning of his path to digital creation.`,
      `cydr&rsquo;s work playfully teeters on the boundary of low-poly, an art form originating from early gaming designs when processing capabilities reduced the level of detail and texture that could be achieved visually. It is nostalgic and reminiscent of <span class="num-lining">2</span>D pixel art, but has remained popular over time. cydr incorporated these elements into this series of work, which blends organic elements with a pixelated aesthetic and low-resolution textures. However, in contrast to the muted colour palette of many old video games such as Call of Duty (COD) which cydr grew up playing, the works in <em>New-life, to Still-life</em> are hyper saturated &mdash; he&rsquo;s flipped the script.`,
      `The use of colour in these works is striking, and absolutely fascinating given that cydr is colour blind. If cydr puts a green next to an orange, and they are the exact same tone, he can&rsquo;t tell which one is which. He says, &lsquo;Both of them are orange, both of them are green&rsquo;.`,
      `cydr&rsquo;s unique relationship with colour has another element too: he has a form of synesthesia where he feels certain colours and emotions when he eats. He&rsquo;s compared this to a scene from <em>Ratatouille</em> when Remy sees bursts of bright colours when eating a strawberry. Just as eating is a multi-sensory experience for cydr, he has tried to create one for viewers of his work using an interplay of colours and textures.`,
      `cydr&rsquo;s art is characterized by its deliberate distortion and pixelation, a nod to his digital roots and a somewhat philosophical questioning of personal perspectives. &lsquo;I see distortion as a way to portray how people may view the world; sometimes they don&rsquo;t quite remember certain aspects of things, sometimes they may have been told something looks like a certain thing, but in reality it may be something else&hellip;the distortion may often represent how people see themselves and their surroundings; perceive flaws or imperfections that others might not notice.&rsquo;`,
      `The use of organic forms is a new element in cydr&rsquo;s practice, inspired by the work of Scratch Williams who introduced him to the still-life genre. Where the tradition is concerned with organic subjects, cydr has historically focused on digital ones, and in this series he has brought them together in a harmonious fusion that reflects contemporary life. Some of the fruits depicted in these works (such as the grapes, the watermelon, the pitaya) seem painterly despite their digital distortion &mdash; it is almost as if you can see brush strokes. This painterly essence is only present in the foreground of the works, creating the textures of the fruits, whereas the backgrounds are flatter, more overtly pixelated.`,
      `Some of the backgrounds almost have a horizon line, yet despite the fruits being placed within interior environments (they are not outside), the backgrounds read as flat planes in contrast to the fruits, which have more prominent shadows. Each work also has scratches on the surface, which adds further texture and once more recalls traditional paintings, playfully blending the physical with the digital.`,
      `cydr believes in the freedom of interpretation and the necessity of play in artistic practice; it is important to him to create work that is both fun and pushes boundaries.`,
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
    artistName: "loackme",
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
      `The Garden is pleased to present <em>SPACE\\TIME</em>, a culminating series in loackme&rsquo;s decade-long engagement with motion-based dithering, <span class="num-lining">2</span>D signed distance functions, Voronoï diagrams, and code.`,
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
    workCount: 10,
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
        { id: "red-starburst",   x: 15, y: 30, zoom: 4, image: "/images/khwampa/simple-thoughts-detail-left.png" },
        { id: "octopus",         x: 22, y: 42, zoom: 5.5 },
        { id: "bullseye-tree",   x: 50, y: 23, zoom: 6.5 },
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
    workCount: 938,
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
        { id: "upper-slash",     x: 62, y: 33, zoom: 2.5 },
        { id: "branching-edge",  x: 78, y: 47, zoom: 2.5 },
        { id: "figure-shoulder", x: 58, y: 61, zoom: 2.5 },
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
