import { PlotGrid } from "@/components/PlotGrid";
import { fetchArtists } from "@/lib/verse-api";

export const metadata = {
  title: "Artists | The Garden",
};

export default async function ArtistsPage() {
  const artists = await fetchArtists();

  return (
    <>
      <h1 className="sr-only">Artists — The Garden</h1>
      <PlotGrid artists={artists} />
    </>
  );
}
