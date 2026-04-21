import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React 19's <ViewTransition> plumbed through the App Router. Modern
    // Chromium/Safari get a native crossfade when navigating between
    // pages; browsers without the View Transitions API fall back to the
    // existing motion fade in app/template.tsx.
    viewTransition: true,
  },
};

export default nextConfig;
