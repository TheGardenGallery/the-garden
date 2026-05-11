import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React 19's <ViewTransition> plumbed through the App Router. Modern
    // Chromium/Safari get a native crossfade when navigating between
    // pages; browsers without the View Transitions API fall back to the
    // existing motion fade in app/template.tsx.
    viewTransition: true,
  },
  images: {
    // AVIF is ~20-30% smaller than WebP at equivalent quality. Next.js
    // tries formats in order — browsers that support AVIF get it, others
    // fall back to WebP, then the original.
    formats: ["image/avif", "image/webp"],
    // Matches the breakpoints we actually use in the site's CSS/sizes.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2400],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 600],
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
};

export default nextConfig;
