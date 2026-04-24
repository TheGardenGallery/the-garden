import type { Artist } from "@/lib/types";

export const artists: Artist[] = [
  { slug: "1mposter",          name: "1mposter",          coord: { row: "#", col: 1 } },
  { slug: "aluan-wang",        name: "Aluan Wang",        coord: { row: "A", col: 1 } },
  { slug: "chuck-anderson",    name: "Chuck Anderson",    coord: { row: "C", col: 1 } },
  { slug: "chepertom",         name: "Chepertom",         coord: { row: "C", col: 2 } },
  { slug: "cydr",              name: "Cydr",              coord: { row: "C", col: 3 } },
  { slug: "erik-swahn",        name: "Erik Swahn",        coord: { row: "E", col: 1 } },
  { slug: "earthsample",       name: "Earthsample",       coord: { row: "E", col: 2 } },
  { slug: "eric-andwer",       name: "Eric Andwer",       coord: { row: "E", col: 3 } },
  { slug: "itsgalo",           name: "Itsgalo",           coord: { row: "I", col: 1 } },
  { slug: "john-provencher",   name: "John Provencher",   coord: { row: "J", col: 1 } },
  { slug: "khwampa",           name: "Khwampa",           coord: { row: "K", col: 1 } },
  { slug: "loackme",           name: "Loackme",           coord: { row: "L", col: 1 } },
  { slug: "mazin",             name: "Mazin",             coord: { row: "M", col: 1 } },
  { slug: "mark-webster",      name: "Mark Webster",      coord: { row: "M", col: 2 } },
  { slug: "nikita-diakur",     name: "Nikita Diakur",     coord: { row: "N", col: 1 } },
  { slug: "paul-prudence",     name: "Paul Prudence",     coord: { row: "P", col: 1 } },
  { slug: "perfectl00p",       name: "Perfectl00p",       coord: { row: "P", col: 2 } },
  { slug: "paolo-eri",         name: "Paolo Čerić",       coord: { row: "P", col: 3 } },
  { slug: "riiiis",            name: "Riiiis",            coord: { row: "R", col: 1 } },
  { slug: "rudxane",           name: "Rudxane",           coord: { row: "R", col: 2 } },
  { slug: "sp-gelsesmaskinen", name: "Spøgelsesmaskinen", coord: { row: "S", col: 1 } },
  { slug: "t-k-z",             name: "Tù.Úk'z",           coord: { row: "T", col: 1 } },
  { slug: "yoshi-sodeoka",     name: "Yoshi Sodeoka",     coord: { row: "Y", col: 1 } },
];

// Distinct row labels in the order they should appear
export const artistRows = Array.from(
  new Set(artists.map((a) => a.coord.row))
);

export const getArtistsAtRow = (row: string) =>
  artists.filter((a) => a.coord.row === row);

export const getArtistAt = (row: string, col: number) =>
  artists.find((a) => a.coord.row === row && a.coord.col === col);
