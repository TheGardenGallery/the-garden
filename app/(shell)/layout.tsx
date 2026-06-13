import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { VisitMarker } from "@/components/VisitMarker";

/**
 * (shell) layout — wraps all the main Garden routes with the site nav + footer.
 * The standalone /gamers route lives OUTSIDE this group, so it renders without
 * the Garden chrome (its own immersive full-bleed experience). Route groups are
 * URL-invisible, so every route's path is unchanged (e.g. /about stays /about).
 */
export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VisitMarker />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
