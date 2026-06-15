"use client";

import React, { useEffect, useState } from "react";
import { money } from "@maple/core/lib/utils";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input } from "@maple/core/ui/input";
import { Select } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";
import { Table, THead, TBody } from "@maple/core/ui/table";

type Lead = { id: string; name: string; phone: string | null; email: string | null; source: string | null; status: string; value: number | null; updatedAt: string };

const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
const VARIANT: Record<string, "info" | "warning" | "purple" | "success" | "neutral"> = {
  new: "info", contacted: "warning", quoted: "purple", won: "success", lost: "neutral",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", source: "", value: "" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || "Could not load leads."); setLeads([]); }
      else { setError(null); setLeads(await res.json()); }
    } catch { setError("Could not reach the server."); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ name: "", phone: "", source: "", value: "" }); load(); }
  };
  const patch = async (id: string, data: Partial<Lead>) => { await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); load(); };
  const remove = async (id: string) => { await fetch(`/api/leads/${id}`, { method: "DELETE" }); load(); };

  const pipeline = leads.filter((l) => !["won", "lost"].includes(l.status)).reduce((s, l) => s + (l.value || 0), 0);

  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Leads" description={`Open pipeline value: ${money(pipeline)}`}>
        {STATUSES.map((s) => (
          <Badge key={s} variant={VARIANT[s]}>{s} {leads.filter((l) => l.status === s).length}</Badge>
        ))}
      </PageHeader>

      <Card className="mb-6 p-3">
        <form onSubmit={add} className="grid grid-cols-1 gap-2 sm:grid-cols-5">
          <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input placeholder="Source (Instagram, walk-in…)" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          <Input placeholder="Est. value ₹" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <Button type="submit">Add lead</Button>
        </form>
      </Card>

      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

      <Card className="overflow-hidden p-0">
        <Table>
          <THead><tr><th>Name</th><th>Contact</th><th>Source</th><th className="text-right">Value</th><th>Status</th><th></th></tr></THead>
          <TBody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Loading…</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No leads yet.</td></tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id}>
                  <td className="font-medium text-foreground">{l.name}</td>
                  <td className="text-muted-foreground">{l.phone || l.email || "—"}</td>
                  <td className="text-muted-foreground">{l.source || "—"}</td>
                  <td className="text-right">{l.value ? money(l.value) : "—"}</td>
                  <td><Select value={l.status} onChange={(e) => patch(l.id, { status: e.target.value })} className="h-8 w-32">{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</Select></td>
                  <td className="text-right"><button onClick={() => remove(l.id)} className="text-muted-foreground/50 hover:text-destructive">×</button></td>
                </tr>
              ))
            )}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
