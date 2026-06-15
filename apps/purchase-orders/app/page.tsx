"use client";
import React, { useEffect, useState } from "react";
import { money } from "@maple/core/lib/utils";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input, Select } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";
import { Table, THead, TBody } from "@maple/core/ui/table";

type PO = { id: string; number: string; vendor: string; items: string | null; total: number; status: string; expectedDate: string | null };
const ST = ["draft", "sent", "received"] as const;
const V: Record<string, "neutral" | "info" | "success"> = { draft: "neutral", sent: "info", received: "success" };

export default function PurchaseOrdersPage() {
  const [rows, setRows] = useState<PO[]>([]); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ vendor: "", items: "", total: "", expectedDate: "" });
  const load = async () => { setLoading(true); try { const r = await fetch("/api/purchase-orders"); if (!r.ok) { const j = await r.json().catch(() => ({})); setError(j.error || "Could not load."); setRows([]); } else { setError(null); setRows(await r.json()); } } catch { setError("Could not reach the server."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const add = async (e: React.FormEvent) => { e.preventDefault(); if (!form.vendor.trim()) return; const r = await fetch("/api/purchase-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); if (r.ok) { setForm({ vendor: "", items: "", total: "", expectedDate: "" }); load(); } };
  const patch = async (id: string, d: Partial<PO>) => { await fetch(`/api/purchase-orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) }); load(); };
  const remove = async (id: string) => { await fetch(`/api/purchase-orders/${id}`, { method: "DELETE" }); load(); };
  const open = rows.filter((r) => r.status !== "received").reduce((s, r) => s + r.total, 0);
  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Purchase orders" description={`Open commitments to vendors: ${money(open)}`}>
        {ST.map((s) => <Badge key={s} variant={V[s]}>{s} {rows.filter((r) => r.status === s).length}</Badge>)}
      </PageHeader>
      <Card className="mb-6 p-3">
        <form onSubmit={add} className="grid grid-cols-1 gap-2 sm:grid-cols-5">
          <Input placeholder="Vendor *" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
          <Input placeholder="Items / description" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} />
          <Input placeholder="Total ₹" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />
          <Input type="date" value={form.expectedDate} onChange={(e) => setForm({ ...form, expectedDate: e.target.value })} />
          <Button type="submit">Add PO</Button>
        </form>
      </Card>
      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}
      <Card className="overflow-hidden p-0">
        <Table>
          <THead><tr><th>PO #</th><th>Vendor</th><th>Items</th><th className="text-right">Total</th><th>Expected</th><th>Status</th><th></th></tr></THead>
          <TBody>
            {loading ? <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading…</td></tr>
              : rows.length === 0 ? <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No purchase orders yet.</td></tr>
              : rows.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium text-foreground">{r.number}</td>
                  <td>{r.vendor}</td>
                  <td className="text-muted-foreground">{r.items || "—"}</td>
                  <td className="text-right tabular-nums">{money(r.total)}</td>
                  <td className="text-muted-foreground">{r.expectedDate ? new Date(r.expectedDate).toLocaleDateString() : "—"}</td>
                  <td><Select value={r.status} onChange={(e) => patch(r.id, { status: e.target.value })} className="h-8 w-28">{ST.map((s) => <option key={s} value={s}>{s}</option>)}</Select></td>
                  <td className="text-right"><button onClick={() => remove(r.id)} className="text-muted-foreground/50 hover:text-destructive">×</button></td>
                </tr>
              ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
