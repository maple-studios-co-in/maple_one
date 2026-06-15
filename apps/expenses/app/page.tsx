"use client";
import React, { useEffect, useState } from "react";
import { money } from "@maple/core/lib/utils";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input, Select } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";
import { Table, THead, TBody } from "@maple/core/ui/table";

type Exp = { id: string; category: string | null; vendor: string | null; amount: number; method: string | null; note: string | null; date: string };
const CATS = ["materials", "labour", "transport", "rent", "utilities", "misc"] as const;

export default function ExpensesPage() {
  const [rows, setRows] = useState<Exp[]>([]); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: "materials", vendor: "", amount: "", method: "cash", date: "" });
  const load = async () => { setLoading(true); try { const r = await fetch("/api/expenses"); if (!r.ok) { const j = await r.json().catch(() => ({})); setError(j.error || "Could not load."); setRows([]); } else { setError(null); setRows(await r.json()); } } catch { setError("Could not reach the server."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const add = async (e: React.FormEvent) => { e.preventDefault(); if (!form.amount) return; const r = await fetch("/api/expenses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); if (r.ok) { setForm({ category: "materials", vendor: "", amount: "", method: "cash", date: "" }); load(); } };
  const remove = async (id: string) => { await fetch(`/api/expenses/${id}`, { method: "DELETE" }); load(); };
  const total = rows.reduce((s, r) => s + r.amount, 0);
  const thisMonth = rows.filter((r) => new Date(r.date).getMonth() === new Date().getMonth() && new Date(r.date).getFullYear() === new Date().getFullYear()).reduce((s, r) => s + r.amount, 0);
  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Expense log" description={`This month: ${money(thisMonth)} · All-time: ${money(total)}`} />
      <Card className="mb-6 p-3">
        <form onSubmit={add} className="grid grid-cols-1 gap-2 sm:grid-cols-6">
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATS.map((c) => <option key={c} value={c}>{c}</option>)}</Select>
          <Input placeholder="Vendor / payee" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
          <Input placeholder="Amount ₹ *" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}><option value="cash">Cash</option><option value="upi">UPI</option><option value="bank">Bank</option><option value="card">Card</option></Select>
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Button type="submit">Log expense</Button>
        </form>
      </Card>
      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}
      <Card className="overflow-hidden p-0">
        <Table>
          <THead><tr><th>Date</th><th>Category</th><th>Vendor</th><th className="text-right">Amount</th><th>Method</th><th></th></tr></THead>
          <TBody>
            {loading ? <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Loading…</td></tr>
              : rows.length === 0 ? <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No expenses logged yet.</td></tr>
              : rows.map((r) => (
                <tr key={r.id}>
                  <td className="text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                  <td><Badge variant="neutral">{r.category || "misc"}</Badge></td>
                  <td>{r.vendor || "—"}</td>
                  <td className="text-right font-medium tabular-nums">{money(r.amount)}</td>
                  <td className="text-muted-foreground uppercase">{r.method || "—"}</td>
                  <td className="text-right"><button onClick={() => remove(r.id)} className="text-muted-foreground/50 hover:text-destructive">×</button></td>
                </tr>
              ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
