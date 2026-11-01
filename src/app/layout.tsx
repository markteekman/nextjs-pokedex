import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { PokedexCase } from "@/components/pokedex-case";
import { PokedexScreen } from "@/components/pokedex-screen";
import { PokemonOverviewProvider } from "@/components/pokemon-overview-provider";
import { Footer } from "../components/footer";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

const title = "Next.js Pokédex App | By Mark Teekman";
const description =
  "Explore 649 Pokémon in a retro Pokédex, with artwork, types, descriptions, footprints, and cries.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL ||
      process.env.URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "Pokédex App",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "PokéDex App showing Bulbasaur, Ivysaur, and Venusaur on a blue display.",
      },
    ],
  },
  // Next.js inherits the title, description, and image from Open Graph.
  twitter: {
    card: "summary_large_image",
  },
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
