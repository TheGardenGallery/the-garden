import type { Exhibition } from "@/lib/types";

/** Where links to an exhibition go: its standalone page when it has one. */
export function exhibitionHref(ex: Pick<Exhibition, "slug" | "pageUrl">) {
  return ex.pageUrl ?? `/exhibitions/${ex.slug}`;
}
