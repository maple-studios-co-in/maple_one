"use client";
import React, { useEffect, useState } from "react";
import { money } from "@maple/core/lib/utils";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";

type Order = { id: string; code: string; title: string; stage: string; value: number; deliveryDate: string | null; client: { name: string } | null };
const STAGES = [
  { id: "accepted", label: "Accepted" },
  { id: "production", label: "In production" },
  { id: "delivery", label: "Out for delivery" },
  { id: "installed", label: "Installed" },
] as const;

export default function OrdersPage() {
  const [rows, setRows] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", value: "", deliveryDate: "" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || "Could not load orders."); setRows([]); }
      else { setError(null); setRows(await res.json()); }
    } catch { setError("Could not reach the server."); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ title: "", value: "", deliveryDate: "" }); load(); }
  };
  const move = async (o: Order, stage: string) => { await fetch(`/api/orders/${o.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage }) }); load(); };
  const remove = async (id: string) => { if (confirm("Delete this order?")) { await fetch(`/api/orders/${id}`, { method: "DELETE" }); load(); } };

  const pipeline = rows.filter((o) => o.stage !== "installed").reduce((s, o) => s + o.value, 0);
  const idx = (s: string) => STAGES.findIndex((x) => x.id === s);

  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Orders & projects" description={`Active project value: ${money(pipeline)} · ${rows.length} orders`} />

      <Card className="mb-6 p-3">
        <form onSubmit={add} className="grid grid-cols-1 gap-2 sm:grid-cols-4">
          <Input placeholder="Order title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Value ₹" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <Input type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
          <Button type="submit">Create order</Button>
        </form>
      </Card>

      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STAGES.map((st) => {
            const col = rows.filter((o) => o.stage === st.id);
            return (
              <div key={st.id} className="flex flex-col rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{st.label}</span>
                  <span className="rounded-full bg-card px-2 py-0.5 text-[11px] text-muted-foreground">{col.length}</span>
                </div>
                <div className="flex-1 space-y-2 p-2">
                  {col.length === 0 && <div className="px-2 py-6 text-center text-xs text-muted-foreground/60">—</div>}
                  {col.map((o) => (
                    <Card key={o.id} className="group p-3">
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">{o.code}</span>
                        <button onClick={() => remove(o.id)} className="text-muted-foreground/40 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100">×</button>
                      </div>
                      <div className="mt-1 text-sm font-medium text-foreground">{o.title}</div>
                      {o.client && <div className="text-xs text-muted-foreground">{o.client.name}</div>}
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground tabular-nums">{money(o.value)}</span>
                        {o.deliveryDate && <span className="text-muted-foreground">{new Date(o.deliveryDate).toLocaleDateString()}</span>}
                      </div>
                      <div className="mt-2 flex gap-1">
                        {idx(o.stage) > 0 && <button onClick={() => move(o, STAGES[idx(o.stage) - 1].id)} className="flex-1 rounded border border-border py-1 text-[11px] text-muted-foreground hover:bg-accent">←</button>}
                        {idx(o.stage) < STAGES.length - 1 && <button onClick={() => move(o, STAGES[idx(o.stage) + 1].id)} className="flex-1 rounded border border-border py-1 text-[11px] font-medium text-foreground hover:bg-accent">Advance →</button>}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
