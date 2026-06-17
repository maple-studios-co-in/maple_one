import Link from "next/link";
import { GUIDES } from "./content";
import { Card } from "@maple/core/ui/card";
function Group({ title, items }: { title: string; items: typeof GUIDES }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10 first:mt-8">
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((g) => (
          <Link key={g.slug} href={`/${g.slug}`}>
            <Card className="h-full p-5 transition hover:border-primary/40 hover:shadow-md">
              <div className="font-medium text-foreground">{g.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{g.tagline}</div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
export default function Home() {
  return (
    <div className="mx-auto max-w-4xl p-8 md:p-12">
      <div className="text-xs uppercase tracking-wide text-primary">Maple Furnishers</div>
      <h1 className="mt-1 font-serif text-4xl text-foreground md:text-5xl">MapleOne documentation</h1>
      <p className="mt-2 text-muted-foreground">Guides for the team, and developer docs for the suite.</p>
      <Group title="Using the tools" items={GUIDES.filter((g) => g.section !== "dev")} />
      <Group title="For developers" items={GUIDES.filter((g) => g.section === "dev")} />
    </div>
  );
}
