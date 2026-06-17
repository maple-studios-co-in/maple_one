"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@maple/core/ui/card";
import { Input, Select, Textarea } from "@maple/core/ui/input";
import { Label } from "@maple/core/ui/label";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";

type Page = { id: string; slug: string; title: string; published: boolean; order: number; _count?: { blocks: number } };
type Block = { id: string; type: string; label: string; enabled: boolean; order: number; data: { heading?: string; body?: string; image?: string } };
const BLOCK_TYPES = ["hero", "ethos", "craft", "materials", "process", "anatomy", "sofa", "table", "collection", "visit", "richtext"];

export function WebsiteManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [pageId, setPageId] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [newPage, setNewPage] = useState({ slug: "", title: "" });
  const [newBlock, setNewBlock] = useState({ type: "richtext", label: "" });
  const [open, setOpen] = useState<string | null>(null);

  const loadPages = async () => { const r = await fetch("/api/site/pages"); if (r.ok) { const p = await r.json(); setPages(p); if (!pageId && p[0]) setPageId(p[0].id); } };
  const loadBlocks = async (pid: string) => { const r = await fetch(`/api/site/pages/${pid}/blocks`); if (r.ok) setBlocks(await r.json()); };
  useEffect(() => { loadPages(); }, []);
  useEffect(() => { if (pageId) loadBlocks(pageId); }, [pageId]);

  const addPage = async (e: React.FormEvent) => { e.preventDefault(); if (!newPage.slug.trim()) return; const r = await fetch("/api/site/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newPage) }); if (r.ok) { setNewPage({ slug: "", title: "" }); loadPages(); } else alert((await r.json()).error || "Failed"); };
  const delPage = async (id: string) => { if (!confirm("Delete this page and its blocks?")) return; await fetch(`/api/site/pages/${id}`, { method: "DELETE" }); setPageId(""); loadPages(); };
  const togglePub = async (p: Page) => { await fetch(`/api/site/pages/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !p.published }) }); loadPages(); };

  const addBlock = async (e: React.FormEvent) => { e.preventDefault(); const r = await fetch(`/api/site/pages/${pageId}/blocks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: newBlock.type, label: newBlock.label || newBlock.type }) }); if (r.ok) { setNewBlock({ type: "richtext", label: "" }); loadBlocks(pageId); } };
  const patchBlock = async (id: string, d: Partial<Block>) => { await fetch(`/api/site/blocks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) }); loadBlocks(pageId); };
  const delBlock = async (id: string) => { if (!confirm("Remove this block?")) return; await fetch(`/api/site/blocks/${id}`, { method: "DELETE" }); loadBlocks(pageId); };
  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= blocks.length) return;
    const a = blocks[i], b = blocks[j];
    await patchBlock(a.id, { order: b.order }); await fetch(`/api/site/blocks/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) }); loadBlocks(pageId);
  };

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">
      <h1 className="font-serif text-3xl text-foreground md:text-4xl">Website</h1>
      <p className="mt-1 text-muted-foreground">Manage the marketing site — pages, and which blocks appear (toggle, reorder, edit).</p>

      <Card className="mt-6 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1"><Label>Page</Label>
            <Select value={pageId} onChange={(e) => setPageId(e.target.value)}>{pages.map((p) => <option key={p.id} value={p.id}>{p.title} (/{p.slug}){p.published ? "" : " — draft"}</option>)}</Select>
          </div>
          {pages.find((p) => p.id === pageId) && <>
            <Button variant="outline" size="sm" onClick={() => togglePub(pages.find((p) => p.id === pageId)!)}>{pages.find((p) => p.id === pageId)!.published ? "Unpublish" : "Publish"}</Button>
            {pages.find((p) => p.id === pageId)!.slug !== "home" && <Button variant="ghost" size="sm" className="text-destructive" onClick={() => delPage(pageId)}>Delete page</Button>}
          </>}
        </div>
        <form onSubmit={addPage} className="mt-3 grid grid-cols-1 gap-2 border-t border-border pt-3 sm:grid-cols-3">
          <Input placeholder="new page slug (e.g. about)" value={newPage.slug} onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })} />
          <Input placeholder="title" value={newPage.title} onChange={(e) => setNewPage({ ...newPage, title: e.target.value })} />
          <Button type="submit" variant="outline">Add page</Button>
        </form>
      </Card>

      <div className="mt-5 space-y-2">
        {blocks.map((bl, i) => (
          <Card key={bl.id} className="p-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">▲</button>
                <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">▼</button>
              </div>
              <input type="checkbox" checked={bl.enabled} onChange={(e) => patchBlock(bl.id, { enabled: e.target.checked })} className="accent-[var(--primary)]" title="Show on site" />
              <span className="font-medium text-foreground">{bl.label}</span>
              <Badge variant="neutral">{bl.type}</Badge>
              <div className="ml-auto flex gap-3">
                <button onClick={() => setOpen(open === bl.id ? null : bl.id)} className="text-xs font-medium text-primary hover:underline">{open === bl.id ? "Close" : "Edit"}</button>
                <button onClick={() => delBlock(bl.id)} className="text-muted-foreground/50 hover:text-destructive">×</button>
              </div>
            </div>
            {open === bl.id && (
              <div className="mt-3 grid grid-cols-1 gap-2 border-t border-border pt-3">
                <div><Label>Heading</Label><Input value={bl.data.heading || ""} onChange={(e) => setBlocks((bs) => bs.map((x) => x.id === bl.id ? { ...x, data: { ...x.data, heading: e.target.value } } : x))} /></div>
                <div><Label>Body</Label><Textarea value={bl.data.body || ""} onChange={(e) => setBlocks((bs) => bs.map((x) => x.id === bl.id ? { ...x, data: { ...x.data, body: e.target.value } } : x))} /></div>
                <div><Label>Image URL (optional)</Label><Input value={bl.data.image || ""} onChange={(e) => setBlocks((bs) => bs.map((x) => x.id === bl.id ? { ...x, data: { ...x.data, image: e.target.value } } : x))} /></div>
                <div><Button size="sm" onClick={() => patchBlock(bl.id, { data: bl.data, label: bl.label })}>Save block</Button></div>
              </div>
            )}
          </Card>
        ))}
        <form onSubmit={addBlock} className="flex flex-wrap items-end gap-2 pt-2">
          <Select value={newBlock.type} onChange={(e) => setNewBlock({ ...newBlock, type: e.target.value })} className="w-40">{BLOCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</Select>
          <Input placeholder="block label" value={newBlock.label} onChange={(e) => setNewBlock({ ...newBlock, label: e.target.value })} className="w-48" />
          <Button type="submit" variant="outline">Add block</Button>
        </form>
      </div>
    </div>
  );
}
