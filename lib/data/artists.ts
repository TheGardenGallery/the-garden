import type { Artist } from "@/lib/types";

export const artists: Artist[] = [
  {
    slug: "1mposter",
    name: "1mposter",
    coord: { row: "#", col: 1 },
    socials: [
      { label: "Website", href: "https://www.1mposter.com/" },
      { label: "X", href: "https://x.com/_1mposter" },
    ],
  },
  { slug: "aluan-wang",        name: "Aluan Wang",        coord: { row: "A", col: 1 } },
  {
    slug: "chuck-anderson",
    name: "Chuck Anderson",
    coord: { row: "C", col: 1 },
    socials: [
      { label: "Website", href: "https://nopattern.com/" },
      { label: "Instagram", href: "https://www.instagram.com/nopattern/" },
      { label: "X", href: "https://x.com/NoPattern" },
    ],
  },
  { slug: "chepertom",         name: "Chepertom",         coord: { row: "C", col: 2 } },
  { slug: "cydr",              name: "cydr",              coord: { row: "C", col: 3 } },
  { slug: "erik-swahn",        name: "Erik Swahn",        coord: { row: "E", col: 1 } },
  { slug: "earthsample",       name: "earthsample",       coord: { row: "E", col: 2 } },
  { slug: "eric-andwer",       name: "Eric Andwer",       coord: { row: "E", col: 3 } },
  { slug: "itsgalo",           name: "Itsgalo",           coord: { row: "I", col: 1 } },
  { slug: "jeres",             name: "Jeres",             coord: { row: "J", col: 1 } },
  { slug: "john-provencher",   name: "John Provencher",   coord: { row: "J", col: 2 } },
  { slug: "khwampa",           name: "Khwampa",           coord: { row: "K", col: 1 } },
  { slug: "loackme",           name: "loackme",           coord: { row: "L", col: 1 } },
  { slug: "mazin",             name: "Mazin",             coord: { row: "M", col: 1 } },
  { slug: "mark-webster",      name: "Mark Webster",      coord: { row: "M", col: 2 } },
  { slug: "nikita-diakur",     name: "Nikita Diakur",     coord: { row: "N", col: 1 } },
  { slug: "paul-prudence",     name: "Paul Prudence",     coord: { row: "P", col: 1 } },
  { slug: "perfectl00p",       name: "PERFECTL00P",       coord: { row: "P", col: 2 } },
  { slug: "paolo-eri",         name: "Paolo Čerić",       coord: { row: "P", col: 3 }, verseSlug: "paolo-ceric" },
  { slug: "riiiis",            name: "riiiis",            coord: { row: "R", col: 1 } },
  { slug: "rudxane",           name: "rudxane",           coord: { row: "R", col: 2 } },
  {
    slug: "ricky-retouch",
    name: "Ricky Retouch",
    coord: { row: "R", col: 3 },
    bio: [
      "Based in Atlanta, Ricky Retouch works with procedural systems and graphic design, primarily using Houdini to develop his visual language. His practice is rooted in a self-taught exploration of typography and motion design, shaped by the shifting nature of online image culture.",
      "Retouch constructs systems in which images emerge gradually through variation and adjustment. Large numbers of possible outcomes are refined through selection, guided by balance, repetition, and open space — though certain works are retained for the way they resist these tendencies altogether.",
      "Point fields, grids, and layered gradients recur throughout the work. Across both static and generative formats, distortion and spatial drift unsettle the digital image, producing compositions that balance graphic order with density and restraint.",
    ].join("\n\n"),
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/rickyretouch/" },
      { label: "X", href: "https://x.com/rickyretouch" },
    ],
  },
  { slug: "sp-gelsesmaskinen", name: "Spøgelsesmaskinen", coord: { row: "S", col: 1 }, verseSlug: "spogelsesmaskinen" },
  { slug: "t-k-z",             name: "Tù.úk'z",           coord: { row: "T", col: 1 }, verseSlug: "tkz" },
  {
    slug: "ves3l",
    name: "VES3L",
    coord: { row: "V", col: 1 },
    verseSlug: "VES3L",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/ves3l/" },
      { label: "X", href: "https://x.com/VES3L" },
    ],
  },
  { slug: "yoshi-sodeoka",     name: "Yoshi Sodeoka",     coord: { row: "Y", col: 1 }, verseSlug: "yoshi-sodeoka-" },
];

// Distinct row labels in the order they should appear
export const artistRows = Array.from(
  new Set(artists.map((a) => a.coord.row))
);

export const getArtistsAtRow = (row: string) =>
  artists.filter((a) => a.coord.row === row);

export const getArtistAt = (row: string, col: number) =>
  artists.find((a) => a.coord.row === row && a.coord.col === col);
