"use client";
import React, { useEffect, useState } from "react";
import { money } from "@maple/core/lib/utils";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input, Select } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";
import { Table, THead, TBody } from "@maple/core/ui/table";

type Item = { id: string; name: string; category: string | null; sku: string | null; unit: string; quantity: number; reorderLevel: number; cost: number | null; location: string | null };
const CATS = ["timber", "fabric", "hardware", "finished", "other"] as const;

export default function InventoryPage() {
  const [rows, setRows] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", category: "timber", unit: "nos", quantity: "", reorderLevel: "" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inventory");
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || "Could not load inventory."); setRows([]); }
      else { setError(null); setRows(await res.json()); }
    } catch { setError("Could not reach the server."); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const res = await fetch("/api/inventory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ name: "", category: "timber", unit: "nos", quantity: "", reorderLevel: "" }); load(); }
  };
  const adjust = async (it: Item, delta: number) => { await fetch(`/api/inventory/${it.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quantity: Math.max(0, it.quantity + delta) }) }); load(); };
  const remove = async (id: string) => { if (confirm("Delete this item?")) { await fetch(`/api/inventory/${id}`, { method: "DELETE" }); load(); } };

  const low = rows.filter((r) => r.quantity <= r.reorderLevel).length;

  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Inventory" description="Timber, fabric, hardware & finished-goods stock.">
        <Badge variant="neutral">{rows.length} items</Badge>
        {low > 0 && <Badge variant="danger">{low} low / reorder</Badge>}
      </PageHeader>

      <Card className="mb-6 p-3">
        <form onSubmit={add} className="grid grid-cols-1 gap-2 sm:grid-cols-6">
          <Input placeholder="Item name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATS.map((c) => <option key={c} value={c}>{c}</option>)}</Select>
          <Select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}><option value="nos">nos</option><option value="sqft">sqft</option><option value="rft">rft</option><option value="mtr">mtr</option><option value="set">set</option></Select>
          <Input placeholder="Qty" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <Input placeholder="Reorder level" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} />
          <Button type="submit">Add item</Button>
        </form>
      </Card>

      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

      <Card className="overflow-hidden p-0">
        <Table>
          <THead><tr><th>Item</th><th>Category</th><th>Stock</th><th className="text-right">Reorder @</th><th className="text-right">Cost</th><th></th></tr></THead>
          <TBody>
            {loading ? <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Loading…</td></tr>
              : rows.length === 0 ? <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No items yet.</td></tr>
              : rows.map((it) => {
                const lowStock = it.quantity <= it.reorderLevel;
                return (
                  <tr key={it.id}>
                    <td><div className="font-medium text-foreground">{it.name}</div>{it.sku && <div className="text-xs text-muted-foreground">{it.sku}</div>}</td>
                    <td className="text-muted-foreground capitalize">{it.category || "—"}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => adjust(it, -1)} className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent">−</button>
                        <span className={lowStock ? "font-semibold text-destructive tabular-nums" : "font-medium tabular-nums"}>{it.quantity} {it.unit}</span>
                        <button onClick={() => adjust(it, 1)} className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent">+</button>
                        {lowStock && <Badge variant="danger">low</Badge>}
                      </div>
                    </td>
                    <td className="text-right text-muted-foreground">{it.reorderLevel}</td>
                    <td className="text-right text-muted-foreground">{it.cost != null ? money(it.cost) : "—"}</td>
                    <td className="text-right"><button onClick={() => remove(it.id)} className="text-muted-foreground/50 hover:text-destructive">×</button></td>
                  </tr>
                );
              })}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
