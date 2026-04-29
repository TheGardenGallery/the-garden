/**
 * Curatorial and presentation exceptions that are intentionally pinned by
 * slug. Keeping them here makes the site's hardcoded choices discoverable
 * without hunting through components, CSS, or utility modules.
 */

export const homepagePastPicks = [
  "the-flood",
  "equinox",
  "haha-over-time",
] as const;

export type HeroTreatment = "full-bleed-video";

export const heroTreatments: Record<string, HeroTreatment> = {
  // Split Logic's homepage MP4 is authored against pure black; overlays
  // and the default dark surface create visible bands around the video.
  "split-logic": "full-bleed-video",
};

export function getHeroTreatment(slug: string): HeroTreatment | undefined {
  return heroTreatments[slug];
}

export type ArtistPreviewOverride = {
  src: string;
  /** Aspect-ratio hint for iframe previews, which have no intrinsic size. */
  aspect?: number;
  /** Uniform multiplier on the hover-preview's bucket dimensions. */
  sizeScale?: number;
  /** Cross-origin resources to warm before the first hover reveal. */
  preloadResources?: string[];
};

export const artistPreviewOverrides: Record<string, ArtistPreviewOverride> = {
  chepertom: {
    src: "/images/chepertom/deluge-undertow-preview.png",
  },
  // John's HAHA card has a Verse-style metadata band baked into the
  // original; this preview asset crops that band away.
  "john-provencher": {
    src: "/images/john-provencher/haha-preview.jpg",
  },
  // Itsgalo: live generative artwork, proxied so the bundle's padding
  // can be stripped and the synthetic-pointer kickstart can autoplay it.
  itsgalo: {
    src: "/api/genart/itsgalo?payload=eyJoYXNoIjoiMHg1ZTllYmY1Y2NlMDZlMWRiMmM4M2JiZmU1MDU4OTlhMjY4ODEzMjQwMmNhMWMxZmVlNDg5MTliMTEzMmU1ZjhjIiwiZWRpdGlvbk51bWJlciI6MzQsInRvdGFsRWRpdGlvbnMiOjY1LCJpbnB1dCI6eyIkdXNlcm5hbWUiOiJoYW5uYWgyMTA2In19",
    aspect: 0.7,
    preloadResources: [
      "https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com/genart/itsgalo-jun-2024-v4/style.css",
      "https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com/genart/itsgalo-jun-2024-v4/script.js",
    ],
  },
  // VES3L: locked iframe of Solve-Un-Solve #173. `fit=1` removes the
  // bundle's body padding so the cream canvas fills the iframe.
  ves3l: {
    src: "/api/genart/ves3l?payload=eyJoYXNoIjoiMHhlMGM1YzUyZThmM2QyN2IxOTVhZmQ0ZDBmODc2YWQ0OWY4NzAxN2JiNmJhYzYzN2Y1YmEyNGU2ODM5N2YzNzdlIiwiZWRpdGlvbk51bWJlciI6MTczLCJ0b3RhbEVkaXRpb25zIjoxODksImlucHV0Ijp7IiR1c2VybmFtZSI6ImNoZW44ODEyIn19&lock=1&fit=1",
    aspect: 1.2,
  },
  // Pin to "Betula lenta / Sweet Birch" from Glitch Garden rather than
  // the generic series hero.
  "sp-gelsesmaskinen": {
    src: "/images/sp-gelsesmaskinen/glitch-garden-sweet-birch.gif",
  },
};

export const artistPreviewSizeScales: Record<string, number> = {
  khwampa: 1.2,
};
