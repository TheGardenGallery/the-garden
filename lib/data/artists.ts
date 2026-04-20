import type { Artist } from "@/lib/types";

export const artists: Artist[] = [
  { slug: "1mposter",          name: "1MPOSTER",          coord: { row: "#", col: 1 } },
  { slug: "aluan-wang",        name: "ALUAN WANG",        coord: { row: "A", col: 1 } },
  { slug: "chuck-anderson",    name: "CHUCK ANDERSON",    coord: { row: "C", col: 1 } },
  { slug: "chepertom",         name: "CHEPERTOM",         coord: { row: "C", col: 2 } },
  { slug: "cydr",              name: "CYDR",              coord: { row: "C", col: 3 } },
  { slug: "erik-swahn",        name: "ERIK SWAHN",        coord: { row: "E", col: 1 } },
  { slug: "earthsample",       name: "EARTHSAMPLE",       coord: { row: "E", col: 2 } },
  { slug: "eric-andwer",       name: "ERIC ANDWER",       coord: { row: "E", col: 3 } },
  { slug: "itsgalo",           name: "ITSGALO",           coord: { row: "I", col: 1 } },
  { slug: "john-provencher",   name: "JOHN PROVENCHER",   coord: { row: "J", col: 1 } },
  { slug: "khwampa",           name: "KHWAMPA",           coord: { row: "K", col: 1 } },
  { slug: "loackme",           name: "LOACKME",           coord: { row: "L", col: 1 } },
  { slug: "mazin",             name: "MAZIN",             coord: { row: "M", col: 1 } },
  { slug: "mark-webster",      name: "MARK WEBSTER",      coord: { row: "M", col: 2 } },
  { slug: "nikita-diakur",     name: "NIKITA DIAKUR",     coord: { row: "N", col: 1 } },
  { slug: "paul-prudence",     name: "PAUL PRUDENCE",     coord: { row: "P", col: 1 } },
  { slug: "perfectl00p",       name: "PERFECTL00P",       coord: { row: "P", col: 2 } },
  { slug: "paolo-eri",         name: "Paolo Čerić",       coord: { row: "P", col: 3 } },
  { slug: "riiiis",            name: "RIIIIS",            coord: { row: "R", col: 1 } },
  { slug: "rudxane",           name: "RUDXANE",           coord: { row: "R", col: 2 } },
  { slug: "sp-gelsesmaskinen", name: "Spøgelsesmaskinen", coord: { row: "S", col: 1 } },
  { slug: "t-k-z",             name: "TÙ.ÚK'Z",           coord: { row: "T", col: 1 } },
  { slug: "yoshi-sodeoka",     name: "YOSHI SODEOKA",     coord: { row: "Y", col: 1 } },
];

// Distinct row labels in the order they should appear
export const artistRows = Array.from(
  new Set(artists.map((a) => a.coord.row))
);

export const getArtistsAtRow = (row: string) =>
  artists.filter((a) => a.coord.row === row);

export const getArtistAt = (row: string, col: number) =>
  artists.find((a) => a.coord.row === row && a.coord.col === col);
