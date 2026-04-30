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
  const coverImage =
    exhibition.cardImage ?? exhibition.hero ?? exhibition.works?.[0]?.image;

  return (
    <Link href={href} className="exhibition-card" data-slug={exhibition.slug}>
      <div className="exhibition-card-image">
        <div className="exhibition-card-media">
          {exhibition.cardVideo ? (
            <video
              className="exhibition-card-video"
              src={exhibition.cardVideo}
              poster={coverImage}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={`${exhibition.artistName}, ${exhibition.title}`}
            />
          ) : coverImage ? (
            <Image
              src={coverImage}
              alt={`${exhibition.artistName}, ${exhibition.title}`}
              width={1200}
              height={1500}
              sizes="(min-width: 960px) 30vw, (min-width: 600px) 46vw, 92vw"
              quality={90}
            />
          ) : null}
        </div>
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
