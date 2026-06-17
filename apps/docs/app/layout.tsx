import type { Metadata } from "next";
import { Outfit, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { GUIDES } from "./content";
import { getBrand } from "@maple/core/lib/brand";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", weight: "400", subsets: ["latin"] });
export const metadata: Metadata = { title: "MapleOne Docs" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const brand = await getBrand();
  return (
    <html lang="en" className={`${outfit.variable} ${instrument.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full">
        <div className="flex min-h-screen">
          <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar p-5 md:flex">
            <Link href="/"><div className="font-serif text-2xl text-primary">{brand.name}</div><div className="text-[11px] text-muted-foreground">Team documentation</div></Link>
            <nav className="mt-6 space-y-0.5 overflow-y-auto">
              {GUIDES.map((g) => (
                <Link key={g.slug} href={`/${g.slug}`} className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">{g.title}</Link>
              ))}
            </nav>
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
