import Link from "next/link";
import type { Exhibition } from "@/lib/types";

export function PastCard({ exhibition }: { exhibition: Exhibition }) {
  return (
    <Link href={`/exhibitions/${exhibition.slug}`} className="past-card">
      <div className="past-artist">{exhibition.artistName}</div>
      <div className="past-title">{exhibition.title}</div>
      <div className="past-month">{exhibition.month}</div>
    </Link>
  );
}
