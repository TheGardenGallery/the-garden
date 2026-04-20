import Link from "next/link";
import Image from "next/image";
import type { Exhibition } from "@/lib/types";
import { DisplayName, DisplayTitle, MetaLine, Stack } from "@/components/ds";

/**
 * Homepage past-exhibition card.
 *
 * Demonstrates DS composition: the card layout (image plate, hover scale,
 * stack spacing) lives here; typography and meta tones come from primitives.
 * To change how an artist name looks, change <DisplayName>'s CSS once.
 */
export function ExhibitionCard({ exhibition }: { exhibition: Exhibition }) {
  const href = `/exhibitions/${exhibition.slug}`;
  const coverImage = exhibition.hero ?? exhibition.works?.[0]?.image;

  return (
    <Link href={href} className="exhibition-card">
      <div className="exhibition-card-image">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`${exhibition.artistName}, ${exhibition.title}`}
            width={600}
            height={750}
          />
        ) : null}
      </div>
      <Stack gap={1}>
        <DisplayName as="h3" size="md">
          {exhibition.artistName}
        </DisplayName>
        <DisplayTitle size="md">{exhibition.title}</DisplayTitle>
      </Stack>
      <MetaLine tone="whisper" className="exhibition-card-meta">
        {exhibition.date}
      </MetaLine>
    </Link>
  );
}
