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

export const metadata: Metadata = {
  title: "Next.js Pokédex",
  description: "A Pokédex app built with Next.js",
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
