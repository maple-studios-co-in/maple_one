"use client";
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Input } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { cn } from "@maple/core/lib/cn";

export function Editor({ slug, title: t0, tagline: g0, body }: { slug: string; title: string; tagline: string; body: string }) {
  const [title, setTitle] = useState(t0);
  const [tagline, setTagline] = useState(g0);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: body,
    immediatelyRender: false,
    editorProps: { attributes: { class: "min-h-[320px] focus:outline-none" } },
  });
  const upload = async (file: File) => {
    const r = await fetch("/api/docs/image", { method: "POST", headers: { "Content-Type": file.type }, body: file });
    const j = await r.json().catch(() => ({}));
    if (j.url) editor?.chain().focus().setImage({ src: j.url }).run(); else alert(j.error || "Upload failed");
  };
  const save = async () => {
    setSaving(true);
    const r = await fetch(`/api/docs/${slug}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, tagline, body: editor?.getHTML() }) });
    setMsg(r.ok ? "Saved ✓" : "Save failed"); setSaving(false);
  };
  const Btn = ({ on, active, children }: { on: () => void; active?: boolean; children: React.ReactNode }) => (
    <button type="button" onMouseDown={(e) => { e.preventDefault(); on(); }} className={cn("rounded px-2 py-1 text-sm hover:bg-accent", active && "bg-accent font-semibold")}>{children}</button>
  );
  if (!editor) return null;
  return (
    <div className="mx-auto max-w-3xl p-8 md:p-12">
      <a href={`/${slug}`} className="text-xs text-muted-foreground hover:text-foreground">← Back to page</a>
      <Input className="mt-4 text-lg font-semibold" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <Input className="mt-2" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline" />
      <div className="mt-4 flex flex-wrap items-center gap-1 rounded-md border border-border bg-muted/40 p-1">
        <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><b>B</b></Btn>
        <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><i>i</i></Btn>
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</Btn>
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</Btn>
        <Btn on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>• List</Btn>
        <Btn on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>1. List</Btn>
        <Btn on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>❝</Btn>
        <label className="cursor-pointer rounded px-2 py-1 text-sm hover:bg-accent">Image<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} /></label>
      </div>
      <div className="prose-doc mt-3 rounded-md border border-border p-4"><EditorContent editor={editor} /></div>
      <div className="mt-4 flex items-center gap-3"><Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save page"}</Button>{msg && <span className="text-sm text-primary">{msg}</span>}</div>
    </div>
  );
}
