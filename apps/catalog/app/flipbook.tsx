"use client";
import React, { useCallback, useEffect, useState } from "react";

export function Flipbook({ token, pageCount }: { token: string; pageCount: number }) {
  const [i, setI] = useState(1);
  const go = useCallback((d: number) => setI((p) => Math.min(pageCount, Math.max(1, p + d))), [pageCount]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);

  if (!pageCount) return <div className="flex h-full items-center justify-center text-white/60">No pages yet.</div>;
  const src = (n: number) => `/api/public/c/${token}/page/${n}`;

  return (
    <div className="relative flex h-full w-full select-none items-center justify-center">
      {i > 1 && <img src={src(i - 1)} alt="" className="hidden" />}
      <img src={src(i)} alt={`Page ${i}`} className="max-h-full max-w-full object-contain shadow-2xl" />
      {i < pageCount && <img src={src(i + 1)} alt="" className="hidden" />}

      <button onClick={() => go(-1)} disabled={i <= 1}
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-20">‹</button>
      <button onClick={() => go(1)} disabled={i >= pageCount}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-20">›</button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur tabular-nums">{i} / {pageCount}</div>
    </div>
  );
}
