import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { PokedexCase } from "@/components/pokedex-case";
import { PokedexScreen } from "@/components/pokedex-screen";
import { PokemonOverviewProvider } from "@/components/pokemon-overview-provider";
import { createPageMetadata, POKEDEX_DESCRIPTION } from "@/lib/page-metadata";
import { SITE_URL } from "@/lib/site-url";
import { Footer } from "../components/footer";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...createPageMetadata("National Pokédex", POKEDEX_DESCRIPTION),
  metadataBase: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelifySans.variable} h-full antialiased`}>
      <body className="flex flex-col py-8 font-sans">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <PokedexCase>
          <aside className="pokedex-navigation pr-4">
            <Navigation />
          </aside>
          <main
            id="main-content"
            tabIndex={-1}
            className="pokedex-main mt-5 px-16"
          >
            <PokemonOverviewProvider>
              <PokedexScreen>{children}</PokedexScreen>
            </PokemonOverviewProvider>
          </main>
        </PokedexCase>
        <Footer />
        <div className="dot-pattern" aria-hidden="true" />
      </body>
    </html>
  );
}
