import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React 19's <ViewTransition> plumbed through the App Router. Modern
    // Chromium/Safari get a native crossfade when navigating between
    // pages; browsers without the View Transitions API fall back to the
    // existing motion fade in app/template.tsx.
    viewTransition: true,
  },
  // `lib/palette.ts` reads /public/images/* via fs at runtime. Next's
  // file tracer sees the dynamic public-folder access and conservatively
  // pulls the entire /public/images tree (~285MB) into every server
  // function bundle, blowing past Vercel's 250MB unzipped limit. The
  // images don't need to live inside the function — Vercel serves them
  // straight from the CDN — so we exclude them from the trace.
  outputFileTracingExcludes: {
    "*": ["public/images/**"],
  },
  // Several call sites pass `quality={90}` to next/image (the artwork
  // posters, in particular). Next 16 will require these qualities to be
  // declared up-front; registering both the default 75 and the 90 we
  // actually use clears the dev-server warning and keeps production
  // forward-compatible.
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
