"use client";
import React, { useEffect, useState } from "react";
import { money } from "@maple/core/lib/utils";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input, Select } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";
import { Table, THead, TBody } from "@maple/core/ui/table";

type Payment = { id: string; label: string | null; amount: number; method: string | null; dueDate: string | null; paidAt: string | null; status: string; client: { name: string } | null; invoice: { number: string } | null };

function fmt(d: string | null) { return d ? new Date(d).toLocaleDateString() : "—"; }
function isOverdue(p: Payment) { return p.status === "due" && p.dueDate != null && new Date(p.dueDate) < new Date(); }

export default function PaymentsPage() {
  const [rows, setRows] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ label: "", amount: "", method: "upi", dueDate: "" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments");
      if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error || "Could not load payments."); setRows([]); }
      else { setError(null); setRows(await res.json()); }
    } catch { setError("Could not reach the server."); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount) return;
    const res = await fetch("/api/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ label: "", amount: "", method: "upi", dueDate: "" }); load(); }
  };
  const markPaid = async (id: string) => { await fetch(`/api/payments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ markPaid: true }) }); load(); };
  const remove = async (id: string) => { await fetch(`/api/payments/${id}`, { method: "DELETE" }); load(); };
  const reminder = (p: Payment) => {
    const who = p.client?.name || "there";
    const txt = `Hi ${who}, a gentle reminder that the ${p.label || "payment"} of ${money(p.amount)}${p.invoice ? ` for invoice ${p.invoice.number}` : ""} is due${p.dueDate ? ` on ${fmt(p.dueDate)}` : ""}. Kindly arrange at your convenience. — Maple Furnishers`;
    navigator.clipboard.writeText(txt); alert("Reminder copied to clipboard:\n\n" + txt);
  };

  const due = rows.filter((p) => p.status === "due").reduce((s, p) => s + p.amount, 0);
  const overdue = rows.filter(isOverdue).reduce((s, p) => s + p.amount, 0);

  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Payments & reminders" description={`Outstanding: ${money(due)}${overdue ? ` · Overdue: ${money(overdue)}` : ""}`}>
        <Badge variant="warning">{rows.filter((p) => p.status === "due").length} due</Badge>
        <Badge variant="success">{rows.filter((p) => p.status === "paid").length} paid</Badge>
      </PageHeader>

      <Card className="mb-6 p-3">
        <form onSubmit={add} className="grid grid-cols-1 gap-2 sm:grid-cols-5">
          <Input placeholder="Label (Advance / Balance…)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <Input placeholder="Amount ₹ *" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}><option value="upi">UPI</option><option value="bank">Bank</option><option value="cash">Cash</option><option value="cheque">Cheque</option></Select>
          <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <Button type="submit">Add payment</Button>
        </form>
      </Card>

      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

      <Card className="overflow-hidden p-0">
        <Table>
          <THead><tr><th>Label</th><th>Client / Invoice</th><th className="text-right">Amount</th><th>Method</th><th>Due</th><th>Status</th><th></th></tr></THead>
          <TBody>
            {loading ? <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading…</td></tr>
              : rows.length === 0 ? <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No payments tracked yet.</td></tr>
              : rows.map((p) => {
                const od = isOverdue(p);
                return (
                  <tr key={p.id}>
                    <td className="font-medium text-foreground">{p.label || "Payment"}</td>
                    <td className="text-muted-foreground">{p.client?.name || "—"}{p.invoice ? ` · ${p.invoice.number}` : ""}</td>
                    <td className="text-right font-medium tabular-nums">{money(p.amount)}</td>
                    <td className="text-muted-foreground uppercase">{p.method || "—"}</td>
                    <td className="text-muted-foreground">{fmt(p.dueDate)}</td>
                    <td><Badge variant={p.status === "paid" ? "success" : od ? "danger" : "warning"}>{p.status === "paid" ? "paid" : od ? "overdue" : "due"}</Badge></td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {p.status === "due" && <button onClick={() => reminder(p)} className="text-xs font-medium text-primary hover:underline">Remind</button>}
                        {p.status === "due" && <button onClick={() => markPaid(p.id)} className="text-xs font-medium text-green-600 hover:underline">Mark paid</button>}
                        <button onClick={() => remove(p.id)} className="text-muted-foreground/50 hover:text-destructive">×</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
