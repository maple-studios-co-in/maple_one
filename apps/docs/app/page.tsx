import Link from "next/link";
import { GUIDES } from "./content";
import { Card } from "@maple/core/ui/card";
export default function Home() {
  return (
    <div className="mx-auto max-w-4xl p-8 md:p-12">
      <div className="text-xs uppercase tracking-wide text-primary">Maple Furnishers</div>
      <h1 className="mt-1 font-serif text-4xl text-foreground md:text-5xl">How to use MapleOne</h1>
      <p className="mt-2 text-muted-foreground">Short, illustrated guides for every tool. Pick one to get started.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/${g.slug}`}>
            <Card className="h-full p-5 transition hover:border-primary/40 hover:shadow-md">
              <div className="font-medium text-foreground">{g.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{g.tagline}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
