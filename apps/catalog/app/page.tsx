"use client";
import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input, Textarea } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";
import { Flipbook } from "./flipbook";

type Collection = { id: string; title: string; theme: string | null; slug: string; shareToken: string; description: string | null; spaces: string[]; categories: string[]; pageCount: number; hasPdf: boolean; published: boolean };

const SPACE_HINTS = ["Living Room", "Dining Room", "Bedroom", "Study", "Outdoor", "Kitchen", "Foyer"];
const CAT_HINTS = ["Chairs", "Tables", "Sofas", "Beds", "Storage", "Lighting", "Accessories"];

export default function CatalogPage() {
  const [rows, setRows] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", theme: "", spaces: "", categories: "", description: "" });
  const [prog, setProg] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<Collection | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/collections");
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || "Could not load collections."); setRows([]); }
      else { setError(null); setRows(await res.json()); }
    } catch { setError("Could not reach the server."); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const res = await fetch("/api/collections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ title: "", theme: "", spaces: "", categories: "", description: "" }); load(); }
  };
  const patch = async (id: string, data: Partial<Collection>) => { await fetch(`/api/collections/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); load(); };
  const remove = async (id: string) => { if (confirm("Delete this collection and its files?")) { await fetch(`/api/collections/${id}`, { method: "DELETE" }); load(); } };

  const upload = (id: string, file: File) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/collections/${id}/pdf`);
    xhr.setRequestHeader("Content-Type", "application/pdf");
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProg((p) => ({ ...p, [id]: `Uploading ${Math.round((e.loaded / e.total) * 100)}%` })); };
    xhr.upload.onload = () => setProg((p) => ({ ...p, [id]: "Processing pages…" }));
    xhr.onload = () => { setProg((p) => { const n = { ...p }; delete n[id]; return n; }); load(); };
    xhr.onerror = () => { setProg((p) => { const n = { ...p }; delete n[id]; return n; }); alert("Upload failed."); };
    xhr.send(file);
  };

  const copyLink = (c: Collection) => {
    const url = `${window.location.origin}/c/${c.shareToken}`;
    navigator.clipboard.writeText(url);
    alert("Public link copied:\n\n" + url);
  };

  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Catalog" description="Theme collections — organised by space & category — with shareable client lookbooks.">
        <Badge variant="neutral">{rows.length} collections</Badge>
        <Badge variant="success">{rows.filter((r) => r.published).length} live</Badge>
      </PageHeader>

      <Card className="mb-6 p-4">
        <form onSubmit={create} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input placeholder="Collection title * (e.g. Nimbus)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Theme / story (e.g. Cloud Dancer 2026)" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} />
          <Input placeholder="Spaces (comma) — Living Room, Dining Room…" list="space-hints" value={form.spaces} onChange={(e) => setForm({ ...form, spaces: e.target.value })} />
          <Input placeholder="Categories (comma) — Chairs, Tables, Sofas…" list="cat-hints" value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} />
          <datalist id="space-hints">{SPACE_HINTS.map((s) => <option key={s} value={s} />)}</datalist>
          <datalist id="cat-hints">{CAT_HINTS.map((s) => <option key={s} value={s} />)}</datalist>
          <Textarea className="sm:col-span-2 min-h-0 h-16" placeholder="Short description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="sm:col-span-2"><Button type="submit">Create collection</Button></div>
        </form>
      </Card>

      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

      {loading ? <div className="py-8 text-center text-muted-foreground">Loading…</div>
        : rows.length === 0 ? <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No collections yet. Create one, then upload its lookbook PDF.</div>
        : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <Card key={c.id} className="flex flex-col overflow-hidden p-0">
              <div className="relative aspect-[16/9] bg-muted">
                {c.hasPdf ? <img src={`/api/public/c/${c.shareToken}/cover`} alt={c.title} className="h-full w-full object-cover" />
                  : <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No lookbook yet</div>}
                <div className="absolute right-2 top-2 flex gap-1">
                  {c.published ? <Badge variant="success">Live</Badge> : <Badge variant="neutral">Draft</Badge>}
                </div>
                {prog[c.id] && <div className="absolute inset-x-0 bottom-0 bg-primary/90 py-1.5 text-center text-xs font-medium text-primary-foreground">{prog[c.id]}</div>}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-foreground">{c.title}</div>
                    {c.theme && <div className="text-xs text-muted-foreground">{c.theme}</div>}
                  </div>
                  {c.hasPdf && <span className="shrink-0 text-[11px] text-muted-foreground">{c.pageCount} pages</span>}
                </div>
                {(c.spaces.length > 0 || c.categories.length > 0) && (
                  <div className="flex flex-wrap gap-1">
                    {c.spaces.map((s) => <Badge key={s} variant="info">{s}</Badge>)}
                    {c.categories.map((s) => <Badge key={s} variant="purple">{s}</Badge>)}
                  </div>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                  <input ref={(el) => { fileRefs.current[c.id] = el; }} type="file" accept="application/pdf" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(c.id, f); e.target.value = ""; }} />
                  {c.hasPdf && <Button size="sm" onClick={() => setPreview(c)}>Preview</Button>}
                  <Button size="sm" variant="outline" onClick={() => fileRefs.current[c.id]?.click()}>{c.hasPdf ? "Replace PDF" : "Upload PDF"}</Button>
                  {c.hasPdf && <Button size="sm" variant={c.published ? "secondary" : "outline"} onClick={() => patch(c.id, { published: !c.published })}>{c.published ? "Unpublish" : "Publish"}</Button>}
                  {c.hasPdf && c.published && <button onClick={() => copyLink(c)} className="text-xs font-medium text-primary hover:underline">Copy link</button>}
                  <button onClick={() => remove(c.id)} className="ml-auto text-muted-foreground/50 hover:text-destructive">×</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
          <div className="flex items-center justify-between px-5 py-3 text-white">
            <div><span className="font-serif text-lg">{preview.title}</span>{preview.theme && <span className="ml-3 text-sm text-white/50">{preview.theme}</span>}</div>
            <div className="flex items-center gap-3">
              {preview.hasPdf && <a href={`/api/public/c/${preview.shareToken}/pdf`} className="text-xs text-white/70 hover:text-white">Download PDF</a>}
              <button onClick={() => setPreview(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">✕</button>
            </div>
          </div>
          <div className="min-h-0 flex-1 p-4"><Flipbook token={preview.shareToken} pageCount={preview.pageCount} /></div>
        </div>
      )}
    </div>
  );
}
