"use client";
import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";

type Shoot = { id: string; title: string; product: string | null; colorway: string | null; style: string | null; status: string; hasSource: boolean; hasVideo: boolean; shareToken: string; published: boolean };

export default function PhotoshootPage() {
  const [rows, setRows] = useState<Shoot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", product: "", colorway: "", style: "Cinematic" });
  const [prog, setProg] = useState<Record<string, string>>({});
  const srcRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const vidRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shoots");
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || "Could not load shoots."); setRows([]); }
      else { setError(null); setRows(await res.json()); }
    } catch { setError("Could not reach the server."); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const res = await fetch("/api/shoots", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ title: "", product: "", colorway: "", style: "Cinematic" }); load(); }
  };
  const patch = async (id: string, data: Partial<Shoot>) => { await fetch(`/api/shoots/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); load(); };
  const remove = async (id: string) => { if (confirm("Delete this shoot and its files?")) { await fetch(`/api/shoots/${id}`, { method: "DELETE" }); load(); } };

  const send = (id: string, kind: "source" | "video", file: File) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/shoots/${id}/${kind}`);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProg((p) => ({ ...p, [id]: `Uploading ${kind} ${Math.round((e.loaded / e.total) * 100)}%` })); };
    xhr.upload.onload = () => setProg((p) => ({ ...p, [id]: kind === "video" ? "Finishing…" : "Saving…" }));
    xhr.onload = () => { setProg((p) => { const n = { ...p }; delete n[id]; return n; }); load(); };
    xhr.onerror = () => { setProg((p) => { const n = { ...p }; delete n[id]; return n; }); alert("Upload failed."); };
    xhr.send(file);
  };
  const importUrl = async (id: string) => {
    const url = prompt("Paste a video URL (e.g. from your AI render pipeline):");
    if (!url) return;
    setProg((p) => ({ ...p, [id]: "Importing…" }));
    const res = await fetch(`/api/shoots/${id}/import`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    setProg((p) => { const n = { ...p }; delete n[id]; return n; });
    if (!res.ok) { const j = await res.json().catch(() => ({})); alert(j.error || "Import failed."); } else load();
  };
  const copyLink = (s: Shoot) => { const url = `${window.location.origin}/s/${s.shareToken}`; navigator.clipboard.writeText(url); alert("Public link copied:\n\n" + url); };

  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Photoshoot Studio" description="Turn product renders into cinematic videos — preview, share a public link, or push to the site.">
        <Badge variant="neutral">{rows.length} shoots</Badge>
        <Badge variant="success">{rows.filter((r) => r.published).length} live</Badge>
      </PageHeader>

      <Card className="mb-6 p-4">
        <form onSubmit={create} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <Input placeholder="Shoot title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Product (e.g. Vareno Sofa)" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
          <Input placeholder="Colorway (e.g. Teal)" value={form.colorway} onChange={(e) => setForm({ ...form, colorway: e.target.value })} />
          <Input placeholder="Style" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} />
          <div className="sm:col-span-4"><Button type="submit">Create shoot</Button></div>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">Create a shoot, optionally add a source render, then upload the generated video or import it by URL from your AI pipeline.</p>
      </Card>

      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

      {loading ? <div className="py-8 text-center text-muted-foreground">Loading…</div>
        : rows.length === 0 ? <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No shoots yet.</div>
        : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((s) => (
            <Card key={s.id} className="flex flex-col overflow-hidden p-0">
              <div className="relative aspect-video bg-black">
                {s.hasVideo
                  ? <video src={`/api/public/shoot/${s.shareToken}/video`} poster={`/api/public/shoot/${s.shareToken}/poster`} controls preload="metadata" className="h-full w-full object-contain" />
                  : s.hasSource
                    ? <img src={`/api/public/shoot/${s.shareToken}/poster`} alt={s.title} className="h-full w-full object-cover opacity-80" />
                    : <div className="flex h-full w-full items-center justify-center text-sm text-white/40">No media yet</div>}
                <div className="absolute right-2 top-2">{s.published ? <Badge variant="success">Live</Badge> : <Badge variant="neutral">Draft</Badge>}</div>
                {prog[s.id] && <div className="absolute inset-x-0 bottom-0 bg-primary/90 py-1.5 text-center text-xs font-medium text-primary-foreground">{prog[s.id]}</div>}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="font-semibold text-foreground">{s.title}</div>
                <div className="flex flex-wrap gap-1 text-xs">
                  {s.product && <Badge variant="info">{s.product}</Badge>}
                  {s.colorway && <Badge variant="purple">{s.colorway}</Badge>}
                  {s.style && <Badge variant="neutral">{s.style}</Badge>}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                  <input ref={(el) => { srcRefs.current[s.id] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) send(s.id, "source", f); e.target.value = ""; }} />
                  <input ref={(el) => { vidRefs.current[s.id] = el; }} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) send(s.id, "video", f); e.target.value = ""; }} />
                  <Button size="sm" variant="outline" onClick={() => srcRefs.current[s.id]?.click()}>{s.hasSource ? "Replace render" : "Source render"}</Button>
                  <Button size="sm" onClick={() => vidRefs.current[s.id]?.click()}>{s.hasVideo ? "Replace video" : "Upload video"}</Button>
                  <Button size="sm" variant="ghost" onClick={() => importUrl(s.id)}>Import URL</Button>
                  {s.hasVideo && <Button size="sm" variant={s.published ? "secondary" : "outline"} onClick={() => patch(s.id, { published: !s.published })}>{s.published ? "Unpublish" : "Publish"}</Button>}
                  {s.hasVideo && s.published && <button onClick={() => copyLink(s)} className="text-xs font-medium text-primary hover:underline">Copy link</button>}
                  {s.hasVideo && <a href={`/api/public/shoot/${s.shareToken}/video`} download className="text-xs text-muted-foreground hover:text-foreground">Download</a>}
                  <button onClick={() => remove(s.id)} className="ml-auto text-muted-foreground/50 hover:text-destructive">×</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
