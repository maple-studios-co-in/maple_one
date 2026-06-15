"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Flipbook } from "../../flipbook";

type Meta = { title: string; theme: string | null; description: string | null; spaces: string[]; categories: string[]; pageCount: number; hasPdf: boolean; published: boolean; error?: string };

export default function PublicCollectionPage() {
  const { token } = useParams<{ token: string }>();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/public/c/${token}`);
        if (!res.ok) { setState("missing"); return; }
        const j: Meta = await res.json();
        if (!j.published || !j.hasPdf) { setState("missing"); return; }
        setMeta(j); setState("ok");
      } catch { setState("missing"); }
    })();
  }, [token]);

  if (state === "loading") return <div className="flex min-h-screen items-center justify-center bg-[#0c0a09] text-white/50">Loading…</div>;
  if (state === "missing" || !meta) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[#0c0a09] text-center text-white">
      <div className="font-serif text-3xl">Maple Furnishers</div>
      <p className="text-white/50">This collection isn’t available.</p>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0a09]">
      <header className="flex items-center justify-between px-5 py-4 text-white md:px-8">
        <div>
          <div className="font-serif text-xl tracking-tight">Maple<span className="text-white/50"> Furnishers</span></div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">{meta.title}{meta.theme ? ` · ${meta.theme}` : ""}</div>
        </div>
        {meta.hasPdf && <a href={`/api/public/c/${token}/pdf`} className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10">Download PDF</a>}
      </header>
      <main className="min-h-0 flex-1 px-2 pb-6 md:px-6">
        <div className="h-[calc(100vh-9rem)]"><Flipbook token={token} pageCount={meta.pageCount} /></div>
      </main>
      {(meta.spaces.length > 0 || meta.categories.length > 0) && (
        <footer className="flex flex-wrap items-center gap-2 px-5 pb-5 md:px-8">
          {meta.spaces.map((s) => <span key={s} className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/50">{s}</span>)}
          {meta.categories.map((s) => <span key={s} className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/50">{s}</span>)}
        </footer>
      )}
    </div>
  );
}
