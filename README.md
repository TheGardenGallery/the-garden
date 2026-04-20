# The Garden — Next.js

A Next.js 15 + Tailwind v4 port of the hand-coded prototype in `../the-garden/`.

## Prerequisites

Node.js was not installed when this project was scaffolded, so files were written by hand. Install Node before running:

```bash
# Install Node via Homebrew (recommended)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node

# Or download from https://nodejs.org (LTS)
```

## Run

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Structure

- `app/` — App Router pages
  - `/` — homepage (hero, past exhibitions, journal)
  - `/artists` — coordinate plot grid
  - `/artists/[slug]` — placeholder artist page
  - `/exhibitions` — current / upcoming / past
  - `/exhibitions/[slug]` — exhibition detail (the `imagined-wreckage` slug has full content)
  - `/journal`, `/about` — placeholders
- `components/` — Logo, Nav, Footer, cards, rows, plot cells
- `lib/` — types, seed data, and a Verse Works API stub (`verse-api.ts`)
- `app/globals.css` — Tailwind v4 `@theme` design tokens (colors, spacing, fonts, motion)

## Verse Works API

All pages currently call `lib/verse-api.ts`, which re-exports seed data from `lib/data/*`. When Verse gives you API access, replace the stubs in `verse-api.ts` with real fetch calls — everything else stays put.

## Tweaking the logo font

One line: change `--font-logo` in `app/globals.css`:

```css
--font-logo: var(--font-barlow-condensed), sans-serif;  /* default */
--font-logo: var(--font-cormorant), serif;              /* try italic */
--font-logo: var(--font-jetbrains-mono), monospace;     /* try mono */
```
