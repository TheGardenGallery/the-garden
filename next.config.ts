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
    "*": ["public/images/**", "public/hold-me/**"],
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
      // Hold Me (public/hold-me/) is a static page served as-is. Its
      // HTML, CSS and JS revalidate on every visit so a redeploy shows
      // at once; the artwork files are content-stable and cache for a
      // day. Never immutable: these URLs are not versioned.
      {
        source: "/exhibitions/hold-me",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/hold-me/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/hold-me/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
  // Hold Me is a static page whose CSS, JS, fetches and media are all
  // relative. Its <base href="/hold-me/"> resolves them to public/hold-me/,
  // so the page itself can live at /exhibitions/hold-me like every other
  // show. beforeFiles so it wins over the app/exhibitions/[slug] route.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/exhibitions/hold-me",
          destination: "/hold-me/index.html",
        },
      ],
    };
  },
  // The Interview section moved from /journal → /interviews so its URL
  // structure matches /artists and /exhibitions (list at plural, detail
  // at plural/[slug]). Permanent 308 redirect so old shares + Google's
  // existing /journal index entries land cleanly on the new path
  // without breaking POST bodies if any ever existed.
  async redirects() {
    return [
      // Hold Me launched at /hold-me before moving under /exhibitions.
      // Only the page itself moves; its assets stay at /hold-me/*.
      {
        source: "/hold-me",
        destination: "/exhibitions/hold-me",
        permanent: true,
      },
      {
        source: "/journal",
        destination: "/interviews",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
