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
    qualities: [45, 75, 90, 100],
  },
  // Aggressive Cache-Control on the long-lived static media tree so
  // Vercel's CDN + browser caches keep a single copy per asset for a
  // year and repeat visitors don't re-download the multi-megabyte
  // videos and posters. `immutable` is acceptable here because the
  // public URLs are paired with deploy-pinned content (Vercel
  // re-deploys the full /public tree on every build) and any
  // re-encode propagates to returning users after their browser TTL.
  // /_next/static/* already gets long-cache headers from Next itself.
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
