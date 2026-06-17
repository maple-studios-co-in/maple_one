"use client";
import React, { useState } from "react";
import { Card } from "@maple/core/ui/card";
import { Input } from "@maple/core/ui/input";
import { Label } from "@maple/core/ui/label";
import { Button } from "@maple/core/ui/button";

type Initial = { brandName: string; logoUrl: string | null; primaryColor: string; watermarkEnabled: boolean };

export function BrandingForm({ initial }: { initial: Initial }) {
  const [brandName, setBrandName] = useState(initial.brandName);
  const [primaryColor, setPrimaryColor] = useState(initial.primaryColor);
  const [watermark, setWatermark] = useState(initial.watermarkEnabled);
  const [logo, setLogo] = useState(initial.logoUrl);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const uploadLogo = async (file: File) => {
    setMsg("Uploading logo…");
    const r = await fetch("/api/branding/logo", { method: "POST", headers: { "Content-Type": file.type }, body: file });
    if (r.ok) { const reader = new FileReader(); reader.onload = () => setLogo(reader.result as string); reader.readAsDataURL(file); setMsg("Logo updated."); }
    else { const j = await r.json().catch(() => ({})); setMsg(j.error || "Upload failed."); }
  };
  const save = async () => {
    setBusy(true);
    const r = await fetch("/api/branding", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brandName, primaryColor, watermarkEnabled: watermark }) });
    setMsg(r.ok ? "Saved." : "Save failed."); setBusy(false);
  };

  return (
    <div className="mx-auto max-w-2xl p-6 md:p-10">
      <h1 className="font-serif text-3xl text-foreground md:text-4xl">Branding</h1>
      <p className="mt-1 text-muted-foreground">Your logo and brand — used in the app, on PDFs, and (optionally) as a watermark.</p>

      <Card className="mt-6 p-6">
        <Label>Logo</Label>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex h-20 w-40 items-center justify-center rounded-md border border-border bg-muted">
            {logo ? <img src={logo} alt="logo" className="max-h-16 max-w-full object-contain" /> : <span className="text-xs text-muted-foreground">No logo</span>}
          </div>
          <label className="inline-flex h-9 cursor-pointer items-center rounded-md border border-border bg-card px-3 text-sm hover:bg-accent">
            Upload logo<input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }} />
          </label>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">PNG with transparency works best. Max 1.5MB.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><Label>Brand name</Label><Input value={brandName} onChange={(e) => setBrandName(e.target.value)} /></div>
          <div><Label>Accent color (hex)</Label><Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#702119" /></div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
          <input type="checkbox" checked={watermark} onChange={(e) => setWatermark(e.target.checked)} className="accent-[var(--primary)]" />
          Watermark generated images & videos with the logo
        </label>

        {msg && <p className="mt-4 text-sm text-primary">{msg}</p>}
        <div className="mt-4"><Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save branding"}</Button></div>
      </Card>
    </div>
  );
}
