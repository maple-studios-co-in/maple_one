"use client";

import React, { useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { HrDocType, HrFields, HR_DOC_LABELS, emptyHr, hrBody, hrSubject } from "@maple/core/lib/hr";
import { HrDocPdf } from "./hr-pdf";
import { Button } from "@maple/core/ui/button";
import { Input } from "@maple/core/ui/input";
import { Label } from "@maple/core/ui/label";
import { cn } from "@maple/core/lib/cn";

const TYPES: HrDocType[] = ["offer", "appointment", "relieving", "experience"];

export default function HrPage() {
  const [type, setType] = useState<HrDocType>("offer");
  const [f, setF] = useState<HrFields>(emptyHr);
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<HrFields>) => setF((x) => ({ ...x, ...patch }));
  const body = useMemo(() => hrBody(type, f), [type, f]);
  const showLast = type === "relieving" || type === "experience";

  const download = async () => {
    setBusy(true);
    try {
      const logo = await fetch("/api/brand").then((r) => r.json()).then((b) => b.logoUrl as string | undefined).catch(() => undefined);
      const blob = await pdf(<HrDocPdf type={type} fields={f} logo={logo} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${HR_DOC_LABELS[type].replace(/\s+/g, "-")}-${(f.employeeName || "doc").replace(/\s+/g, "-")}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } finally { setBusy(false); }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <h2 className="font-serif text-2xl text-foreground">HR documents</h2>
        <Button size="sm" onClick={download} disabled={busy}>{busy ? "Preparing…" : "Download PDF"}</Button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        <div className="overflow-y-auto border-r border-border p-6">
          <div className="mb-5 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setType(t)} className={cn("rounded-full px-3 py-1.5 text-sm transition-colors", type === t ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-accent")}>{HR_DOC_LABELS[t]}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Employee name</Label><Input value={f.employeeName} onChange={(e) => set({ employeeName: e.target.value })} /></div>
            <div><Label>Designation</Label><Input value={f.designation} onChange={(e) => set({ designation: e.target.value })} /></div>
            {!showLast && <div><Label>Compensation (CTC)</Label><Input value={f.salary} onChange={(e) => set({ salary: e.target.value })} placeholder="₹ 6,00,000 p.a." /></div>}
            <div><Label>Joining date</Label><Input type="date" value={f.joiningDate} onChange={(e) => set({ joiningDate: e.target.value })} /></div>
            {showLast && <div><Label>Last working date</Label><Input type="date" value={f.lastDate} onChange={(e) => set({ lastDate: e.target.value })} /></div>}
            <div><Label>Issue date</Label><Input type="date" value={f.issueDate} onChange={(e) => set({ issueDate: e.target.value })} /></div>
            <div><Label>Signatory name</Label><Input value={f.signatory} onChange={(e) => set({ signatory: e.target.value })} /></div>
            <div><Label>Signatory title</Label><Input value={f.signatoryTitle} onChange={(e) => set({ signatoryTitle: e.target.value })} /></div>
            <div><Label>Place</Label><Input value={f.place} onChange={(e) => set({ place: e.target.value })} /></div>
          </div>
        </div>

        <div className="overflow-y-auto bg-muted/40 p-6">
          <div className="mx-auto max-w-[640px] rounded-md bg-white p-10 text-[12px] leading-relaxed text-black shadow-sm">
            <div className="border-b-2 border-primary pb-3 text-lg font-extrabold text-primary">MAPLE FURNISHERS</div>
            <div className="mt-4 text-center text-sm font-bold underline">{hrSubject(type)}</div>
            <div className="mt-5 space-y-3 text-justify">{body.map((p, i) => <p key={i}>{p}</p>)}</div>
            <div className="mt-10"><div>For Maple Furnishers,</div><div className="mt-8 font-semibold">{f.signatory || "____________"}</div><div className="text-black/60">{f.signatoryTitle}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
