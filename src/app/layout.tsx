import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { PokedexCase } from "@/components/pokedex-case";
import { PokedexScreen } from "@/components/pokedex-screen";
import { PokemonOverviewProvider } from "@/components/pokemon-overview-provider";
import { createPageMetadata, POKEDEX_DESCRIPTION } from "@/lib/page-metadata";
import { Footer } from "../components/footer";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...createPageMetadata("National Pokédex", POKEDEX_DESCRIPTION),
  metadataBase: new URL(
    process.env.SITE_URL ||
      process.env.URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelifySans.variable} h-full antialiased`}>
      <body className="flex flex-col py-8 font-sans">
        <PokedexCase>
          <aside className="pokedex-navigation pr-4">
            <Navigation />
          </aside>
          <main className="pokedex-main mt-5 px-16">
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
