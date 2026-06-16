import { GUIDES } from "../content";
import { notFound } from "next/navigation";
export function generateStaticParams() { return GUIDES.map((g) => ({ slug: g.slug })); }
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) notFound();
  return (
    <article className="mx-auto max-w-3xl p-8 md:p-12">
      <div className="text-xs uppercase tracking-wide text-primary">{g.tagline}</div>
      <h1 className="mt-1 font-serif text-4xl text-foreground">{g.title}</h1>
      <p className="mt-3 text-muted-foreground">{g.intro}</p>
      <ol className="mt-8 space-y-8">
        {g.steps.map((s, i) => (
          <li key={i}>
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
              <p className="pt-0.5 text-foreground/90">{s.text}</p>
            </div>
            {s.shot && (
              <figure className="ml-10 mt-3 overflow-hidden rounded-lg border border-border bg-muted">
                <img src={`/shots/${g.slug}/${s.shot}.png`} alt={s.text} className="w-full" />
              </figure>
            )}
          </li>
        ))}
      </ol>
    </article>
  );
}
