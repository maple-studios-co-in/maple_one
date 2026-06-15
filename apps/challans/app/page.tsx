"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input, Select } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";
import { Table, THead, TBody } from "@maple/core/ui/table";

type DC = { id: string; number: string; items: string | null; vehicleNo: string | null; driver: string | null; status: string; date: string; client: { name: string } | null };
const ST = ["prepared", "dispatched", "delivered"] as const;
const V: Record<string, "neutral" | "info" | "success"> = { prepared: "neutral", dispatched: "info", delivered: "success" };

export default function ChallansPage() {
  const [rows, setRows] = useState<DC[]>([]); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ items: "", vehicleNo: "", driver: "" });
  const load = async () => { setLoading(true); try { const r = await fetch("/api/challans"); if (!r.ok) { const j = await r.json().catch(() => ({})); setError(j.error || "Could not load."); setRows([]); } else { setError(null); setRows(await r.json()); } } catch { setError("Could not reach the server."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const add = async (e: React.FormEvent) => { e.preventDefault(); if (!form.items.trim()) return; const r = await fetch("/api/challans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); if (r.ok) { setForm({ items: "", vehicleNo: "", driver: "" }); load(); } };
  const patch = async (id: string, d: Partial<DC>) => { await fetch(`/api/challans/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) }); load(); };
  const remove = async (id: string) => { await fetch(`/api/challans/${id}`, { method: "DELETE" }); load(); };
  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Delivery challans" description="Dispatch notes & gate passes for outgoing furniture.">
        {ST.map((s) => <Badge key={s} variant={V[s]}>{s} {rows.filter((r) => r.status === s).length}</Badge>)}
      </PageHeader>
      <Card className="mb-6 p-3">
        <form onSubmit={add} className="grid grid-cols-1 gap-2 sm:grid-cols-4">
          <Input placeholder="Items dispatched *" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} />
          <Input placeholder="Vehicle no." value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value })} />
          <Input placeholder="Driver" value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} />
          <Button type="submit">Add challan</Button>
        </form>
      </Card>
      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}
      <Card className="overflow-hidden p-0">
        <Table>
          <THead><tr><th>Challan #</th><th>Items</th><th>Vehicle</th><th>Driver</th><th>Date</th><th>Status</th><th></th></tr></THead>
          <TBody>
            {loading ? <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading…</td></tr>
              : rows.length === 0 ? <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No challans yet.</td></tr>
              : rows.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium text-foreground">{r.number}</td>
                  <td className="text-muted-foreground">{r.items || "—"}</td>
                  <td>{r.vehicleNo || "—"}</td>
                  <td>{r.driver || "—"}</td>
                  <td className="text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                  <td><Select value={r.status} onChange={(e) => patch(r.id, { status: e.target.value })} className="h-8 w-32">{ST.map((s) => <option key={s} value={s}>{s}</option>)}</Select></td>
                  <td className="text-right"><button onClick={() => remove(r.id)} className="text-muted-foreground/50 hover:text-destructive">×</button></td>
                </tr>
              ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
