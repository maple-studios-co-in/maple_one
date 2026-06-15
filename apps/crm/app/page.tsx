"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input, Select } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";
import { Table, THead, TBody } from "@maple/core/ui/table";

type Client = { id: string; name: string; company: string | null; type: string; gstin: string | null; phone: string | null; email: string | null; status: string; _count: { leads: number; orders: number; invoices: number; quotations: number } };
const STATUSES = ["lead", "active", "dormant"] as const;
const SV: Record<string, "info" | "success" | "neutral"> = { lead: "info", active: "success", dormant: "neutral" };

export default function CrmPage() {
  const [rows, setRows] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", company: "", type: "b2c", phone: "", gstin: "" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm");
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || "Could not load clients."); setRows([]); }
      else { setError(null); setRows(await res.json()); }
    } catch { setError("Could not reach the server."); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const res = await fetch("/api/crm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ name: "", company: "", type: "b2c", phone: "", gstin: "" }); load(); }
  };
  const patch = async (id: string, data: Partial<Client>) => { await fetch(`/api/crm/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); load(); };
  const remove = async (id: string) => { if (confirm("Delete this client?")) { await fetch(`/api/crm/${id}`, { method: "DELETE" }); load(); } };

  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Clients" description="B2B & B2C client directory — the hub linking leads, quotes, orders and invoices.">
        <Badge variant="info">B2B {rows.filter((r) => r.type === "b2b").length}</Badge>
        <Badge variant="purple">B2C {rows.filter((r) => r.type === "b2c").length}</Badge>
      </PageHeader>

      <Card className="mb-6 p-3">
        <form onSubmit={add} className="grid grid-cols-1 gap-2 sm:grid-cols-6">
          <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="b2c">B2C</option><option value="b2b">B2B</option></Select>
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input placeholder="GSTIN" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
          <Button type="submit">Add client</Button>
        </form>
      </Card>

      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

      <Card className="overflow-hidden p-0">
        <Table>
          <THead><tr><th>Name</th><th>Type</th><th>Contact</th><th>GSTIN</th><th>Activity</th><th>Status</th><th></th></tr></THead>
          <TBody>
            {loading ? <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading…</td></tr>
              : rows.length === 0 ? <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No clients yet.</td></tr>
              : rows.map((c) => (
                <tr key={c.id}>
                  <td><div className="font-medium text-foreground">{c.name}</div>{c.company && <div className="text-xs text-muted-foreground">{c.company}</div>}</td>
                  <td><Badge variant={c.type === "b2b" ? "info" : "purple"}>{c.type.toUpperCase()}</Badge></td>
                  <td className="text-muted-foreground">{c.phone || c.email || "—"}</td>
                  <td className="text-muted-foreground">{c.gstin || "—"}</td>
                  <td className="text-xs text-muted-foreground">{c._count.leads}L · {c._count.quotations}Q · {c._count.orders}O · {c._count.invoices}I</td>
                  <td><Select value={c.status} onChange={(e) => patch(c.id, { status: e.target.value })} className="h-8 w-28">{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</Select></td>
                  <td className="text-right"><button onClick={() => remove(c.id)} className="text-muted-foreground/50 hover:text-destructive">×</button></td>
                </tr>
              ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
