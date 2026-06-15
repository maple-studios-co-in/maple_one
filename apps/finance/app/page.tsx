"use client";

import React, { useEffect, useState } from "react";
import { money } from "@maple/core/lib/utils";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input, Select } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";
import { Table, THead, TBody } from "@maple/core/ui/table";

type Entry = { id: string; type: string; category: string | null; amount: number; note: string | null; date: string };

export default function FinancePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: "income", category: "", amount: "", note: "", date: new Date().toISOString().slice(0, 10) });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/finance");
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || "Could not load entries."); setEntries([]); }
      else { setError(null); setEntries(await res.json()); }
    } catch { setError("Could not reach the server."); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount) return;
    const res = await fetch("/api/finance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ ...form, category: "", amount: "", note: "" }); load(); }
  };
  const remove = async (id: string) => { await fetch(`/api/finance/${id}`, { method: "DELETE" }); load(); };

  const income = entries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const expense = entries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const net = income - expense;

  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Finance" description="Income, expenses and running balance." />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Income" value={money(income)} className="text-green-700" />
        <Stat label="Expense" value={money(expense)} className="text-red-700" />
        <Stat label="Net" value={money(net)} className={net >= 0 ? "text-primary" : "text-red-700"} />
      </div>

      <Card className="mt-6 p-3">
        <form onSubmit={add} className="grid grid-cols-2 gap-2 sm:grid-cols-6">
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="income">Income</option><option value="expense">Expense</option></Select>
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input placeholder="Amount ₹" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <Button type="submit">Add</Button>
        </form>
      </Card>

      {error && <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

      <Card className="mt-5 overflow-hidden p-0">
        <Table>
          <THead><tr><th>Date</th><th>Type</th><th>Category</th><th>Note</th><th className="text-right">Amount</th><th></th></tr></THead>
          <TBody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Loading…</td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No entries yet.</td></tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id}>
                  <td className="text-muted-foreground">{new Date(e.date).toLocaleDateString("en-IN")}</td>
                  <td><Badge variant={e.type === "income" ? "success" : "danger"}>{e.type}</Badge></td>
                  <td className="text-muted-foreground">{e.category || "—"}</td>
                  <td className="text-muted-foreground">{e.note || "—"}</td>
                  <td className={"text-right font-medium " + (e.type === "income" ? "text-green-700" : "text-red-700")}>{e.type === "income" ? "+" : "−"} {money(e.amount)}</td>
                  <td className="text-right"><button onClick={() => remove(e.id)} className="text-muted-foreground/50 hover:text-destructive">×</button></td>
                </tr>
              ))
            )}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <Card className="p-4">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={"mt-1 text-2xl font-semibold " + (className || "")}>{value}</div>
    </Card>
  );
}
