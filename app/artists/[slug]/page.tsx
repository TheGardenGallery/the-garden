import { notFound } from "next/navigation";
import { fetchArtists } from "@/lib/verse-api";

export async function generateStaticParams() {
  const artists = await fetchArtists();
  return artists.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artists = await fetchArtists();
  const artist = artists.find((a) => a.slug === slug);
  return {
    title: artist ? `${artist.name} | The Garden` : "Not found | The Garden",
  };
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artists = await fetchArtists();
  const artist = artists.find((a) => a.slug === slug);
  if (!artist) notFound();

  return (
    <div className="coming-soon">
      <div className="coming-soon-inner">
        <div className="artist-page-name">{artist.name}</div>
        <div className="artist-page-coord">
          {artist.coord.row},{String(artist.coord.col).padStart(2, "0")}
        </div>
        <div className="coming-soon-title">Artist page — coming soon.</div>
      </div>
    </div>
  );
}
