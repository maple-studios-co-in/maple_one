import { GUIDES } from "../content";
import { notFound } from "next/navigation";
import Link from "next/link";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find((x) => x.slug === slug);
  const doc = await (await tenantDb()).doc.findFirst({ where: { slug } }).catch(() => null);
  if (!guide && !doc) notFound();
  const title = doc?.title || guide!.title;
  const tagline = doc?.tagline || guide?.tagline;
  const html = doc?.body || guide?.body;
  return (
    <article className="mx-auto max-w-3xl p-8 md:p-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          {tagline && <div className="text-xs uppercase tracking-wide text-primary">{tagline}</div>}
          <h1 className="mt-1 font-serif text-4xl text-foreground">{title}</h1>
        </div>
        <Link href={`/${slug}/edit`} className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent">Edit</Link>
      </div>
      {html ? (
        <div className="prose-doc mt-6 text-foreground/90" dangerouslySetInnerHTML={{ __html: html }} />
      ) : guide ? (
        <>
          <p className="mt-3 text-muted-foreground">{guide.intro}</p>
          <ol className="mt-8 space-y-8">
            {guide.steps.map((s, i) => (
              <li key={i}>
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                  <p className="pt-0.5 text-foreground/90">{s.text}</p>
                </div>
                {s.shot && (
                  <figure className="ml-10 mt-3 overflow-hidden rounded-lg border border-border bg-muted">
                    <img src={`/shots/${slug}/${s.shot}.png`} alt={s.text} className="w-full" />
                  </figure>
                )}
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </article>
  );
}
