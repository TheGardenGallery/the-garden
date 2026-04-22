import Link from "next/link";
import type { Exhibition } from "@/lib/types";

/**
 * Previous / next exhibition links at the foot of each detail page.
 * Empty `<div />` preserves grid columns when only one side is set.
 */
export function ExhibitionNav({ exhibition }: { exhibition: Exhibition }) {
  return (
    <aside className="ex-nav" aria-label="Exhibition navigation">
      {exhibition.prev ? (
        <Link href={`/exhibitions/${exhibition.prev.slug}`}>
          <span className="ex-nav-label">
            <span aria-hidden="true">←</span> Previous exhibition
          </span>
          <span className="ex-nav-line">
            <span>{exhibition.prev.artistName}</span>{" "}
            <span className="slash">/</span>{" "}
            <em>{exhibition.prev.title}</em>
          </span>
        </Link>
      ) : (
        <div />
      )}
      {exhibition.next ? (
        <Link href={`/exhibitions/${exhibition.next.slug}`}>
          <span className="ex-nav-label">
            Next exhibition <span aria-hidden="true">→</span>
          </span>
          <span className="ex-nav-line">
            <span>{exhibition.next.artistName}</span>{" "}
            <span className="slash">/</span>{" "}
            <em>{exhibition.next.title}</em>
          </span>
        </Link>
      ) : (
        <div />
      )}
    </aside>
  );
}
