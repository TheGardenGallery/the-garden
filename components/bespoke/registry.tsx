import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Exhibition } from "@/lib/types";

/**
 * Bespoke module registry.
 *
 * Each entry maps a module key (the `component` field on a `bespoke`
 * ExhibitionModule) to its React component. Components are dynamically
 * imported so they only ship in the bundle for shows that actually use
 * them — the BASALT controls don't load on Yoshi's page, etc.
 *
 * Bespoke components live under `components/bespoke/{slug}/Name.tsx`
 * where {slug} is the exhibition slug. They receive the full
 * Exhibition object plus an opaque `config` object whose shape they
 * validate internally.
 *
 * Constraints (enforced by review, not by code):
 *   - Bespoke modules ride on existing type stack and tokens.
 *   - They never replace nav, footer, or the paper baseline.
 *   - They occupy <= ⅓ of viewport height as a standalone block.
 *   - One accent per show, threaded from `exhibition.theme.accent`.
 */
export type BespokeProps = {
  exhibition: Exhibition;
  config: Record<string, unknown>;
};

type RegistryEntry = ComponentType<BespokeProps>;

export const BESPOKE_REGISTRY: Record<string, RegistryEntry> = {
  "split-logic/intermission": dynamic(() =>
    import("./split-logic/Intermission").then((m) => m.Intermission),
  ),
};
