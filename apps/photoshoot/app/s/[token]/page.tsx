"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Meta = { title: string; product: string | null; colorway: string | null; style: string | null; hasVideo: boolean; published: boolean };

export default function PublicShootPage() {
  const { token } = useParams<{ token: string }>();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/public/shoot/${token}`);
        if (!res.ok) return setState("missing");
        const j: Meta = await res.json();
        if (!j.published || !j.hasVideo) return setState("missing");
        setMeta(j); setState("ok");
      } catch { setState("missing"); }
    })();
  }, [token]);

  if (state === "loading") return <div className="flex min-h-screen items-center justify-center bg-[#0c0a09] text-white/50">Loading…</div>;
  if (state === "missing" || !meta) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[#0c0a09] text-center text-white">
      <div className="font-serif text-3xl">Maple Furnishers</div>
      <p className="text-white/50">This shoot isn’t available.</p>
    </div>
  );

  const tags = [meta.product, meta.colorway, meta.style].filter(Boolean).join(" · ");
  return (
    <div className="flex min-h-screen flex-col bg-[#0c0a09]">
      <header className="flex items-center justify-between px-5 py-4 text-white md:px-8">
        <div>
          <div className="font-serif text-xl tracking-tight">Maple<span className="text-white/50"> Furnishers</span></div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">{meta.title}{tags ? ` · ${tags}` : ""}</div>
        </div>
        <a href={`/api/public/shoot/${token}/video`} download className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10">Download</a>
      </header>
      <main className="flex min-h-0 flex-1 items-center justify-center px-3 pb-8 md:px-6">
        <video src={`/api/public/shoot/${token}/video`} poster={`/api/public/shoot/${token}/poster`} controls autoPlay muted loop playsInline className="max-h-[80vh] w-auto max-w-full rounded-lg shadow-2xl" />
      </main>
    </div>
  );
}
