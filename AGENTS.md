# The Garden - Agent Guide

Guidance for AI agents working in this Next.js gallery site.

## Project Shape

- Next.js 15 App Router lives in `app/`.
- Shared React components live in `components/`.
- Editorial seed data lives in `lib/data/exhibitions.ts`, `lib/data/artists.ts`, and `lib/data/journal.ts`.
- Verse API merging lives in `lib/verse-api.ts`. Local data remains the fallback source for static builds.
- Global styling and design tokens live in `app/globals.css`.

## Design And Content Patterns

- Treat this as a curated editorial gallery. Per-exhibition metadata such as selected works, hero media, captions, themes, and colophon data belongs in `lib/data/exhibitions.ts`.
- Keep artist registry data in `lib/data/artists.ts`, including local slug, display name, grid coordinate, social links, and Verse slug aliases.
- Put intentional presentation exceptions in `lib/data/display-rules.ts`. Examples: homepage pinned picks, slug-based hero treatments, artist hover-preview overrides, iframe preview sizing, and preload resources.
- Avoid adding new literal slug checks inside components or CSS. Prefer a named rule or field in `display-rules.ts` or the relevant data file, then have components consume that metadata.
- CSS may target semantic data attributes like `data-hero-treatment`, `data-theme`, or component class names. Avoid selectors like `[data-slug="some-show"]` unless there is no better named treatment.

## Genart And Media

- Live generative artworks use `/api/genart/*` same-origin proxy routes. These routes are artwork-adapter code, not generic fetch utilities.
- Keep adapter-specific behavior documented near the route: base-tag rewrites, synthetic pointer kickstarts, seeded locking, fit resets, caching, and measurement scripts.
- Iframes need to stay interactive. Do not wrap live iframe artwork in a normal anchor unless the component already uses an overlay/link pattern that preserves interaction.
- For GIFs, grainy images, and high-fidelity artwork, preserve existing `unoptimized` escape hatches where Next image optimization would soften the work.

## Implementation Preferences

- Reuse existing components and data fields before inventing a new layout path.
- Keep comments short but preserve rationale for unusual media handling; many exceptions are there for visual fidelity or browser behavior.
- Prefer adding a named data field or treatment over branching on artist/exhibition names in render code.
- Do not refactor editorial copy or reorder exhibitions unless the task asks for it.

## Checks

- Use `npm run build` for compile/type verification.
- `npm run lint` may open Next's interactive ESLint setup if no ESLint config exists; do not let it create unrelated config during a small feature PR.
