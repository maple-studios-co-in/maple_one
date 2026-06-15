"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input, Select } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";
import { Table, THead, TBody } from "@maple/core/ui/table";

type U = { id: string; name: string; email: string; role: string; active: boolean };
const ROLES = ["admin", "sales", "accounts", "hr"] as const;

export default function UsersPage() {
  const [rows, setRows] = useState<U[]>([]); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "sales" });
  const load = async () => { setLoading(true); try { const r = await fetch("/api/users"); if (!r.ok) { const j = await r.json().catch(() => ({})); setError(j.error || "Could not load."); setRows([]); } else { setError(null); setRows(await r.json()); } } catch { setError("Could not reach the server."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const add = async (e: React.FormEvent) => { e.preventDefault(); if (!form.email || !form.password) return; const r = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const j = await r.json().catch(() => ({})); if (r.ok) { setForm({ name: "", email: "", password: "", role: "sales" }); load(); } else alert(j.error || "Failed"); };
  const patch = async (id: string, d: Partial<U>) => { await fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) }); load(); };
  const resetPw = async (u: U) => { const pw = prompt(`New password for ${u.email}:`); if (pw) { await fetch(`/api/users/${u.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) }); alert("Password updated."); } };
  const remove = async (u: U) => { if (!confirm(`Delete ${u.email}?`)) return; const r = await fetch(`/api/users/${u.id}`, { method: "DELETE" }); const j = await r.json().catch(() => ({})); if (!r.ok) alert(j.error || "Failed"); else load(); };
  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Team & access" description="Create accounts, set roles, and enable or disable access.">
        <Badge variant="neutral">{rows.length} users</Badge>
      </PageHeader>
      <Card className="mb-6 p-3">
        <form onSubmit={add} className="grid grid-cols-1 gap-2 sm:grid-cols-5">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Temp password *" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</Select>
          <Button type="submit">Add user</Button>
        </form>
      </Card>
      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}
      <Card className="overflow-hidden p-0">
        <Table>
          <THead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></THead>
          <TBody>
            {loading ? <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Loading…</td></tr>
              : rows.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium text-foreground">{u.name}</td>
                  <td className="text-muted-foreground">{u.email}</td>
                  <td><Select value={u.role} onChange={(e) => patch(u.id, { role: e.target.value })} className="h-8 w-28">{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</Select></td>
                  <td><button onClick={() => patch(u.id, { active: !u.active })}><Badge variant={u.active ? "success" : "neutral"}>{u.active ? "active" : "disabled"}</Badge></button></td>
                  <td className="text-right"><div className="flex justify-end gap-3"><button onClick={() => resetPw(u)} className="text-xs font-medium text-primary hover:underline">Reset pw</button><button onClick={() => remove(u)} className="text-muted-foreground/50 hover:text-destructive">×</button></div></td>
                </tr>
              ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
