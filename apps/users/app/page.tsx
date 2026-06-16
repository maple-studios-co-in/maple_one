"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input, Select } from "@maple/core/ui/input";
import { Button } from "@maple/core/ui/button";
import { Badge } from "@maple/core/ui/badge";
import { Table, THead, TBody } from "@maple/core/ui/table";
import { TOOLS } from "@maple/core/lib/nav";
import { ACTIONS, ACTION_LABEL, toolPerm, actionPerm } from "@maple/core/lib/rbac";
import { cn } from "@maple/core/lib/cn";

type U = { id: string; name: string; email: string; role: string; active: boolean };
type Role = { id: string; name: string; label: string; permissions: string[]; isSystem: boolean };

export default function UsersPage() {
  const [tab, setTab] = useState<"users" | "roles">("users");
  const [rows, setRows] = useState<U[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "sales" });
  const [roleForm, setRoleForm] = useState({ name: "", label: "" });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/users");
      if (!r.ok) { const j = await r.json().catch(() => ({})); setError(j.error || "Could not load."); setRows([]); }
      else { setError(null); setRows(await r.json()); }
    } catch { setError("Could not reach the server."); } finally { setLoading(false); }
  };
  const loadRoles = async () => { try { const r = await fetch("/api/roles"); if (r.ok) setRoles(await r.json()); } catch {} };
  useEffect(() => { loadUsers(); loadRoles(); }, []);

  const add = async (e: React.FormEvent) => { e.preventDefault(); if (!form.email || !form.password) return; const r = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const j = await r.json().catch(() => ({})); if (r.ok) { setForm({ name: "", email: "", password: "", role: "sales" }); loadUsers(); } else alert(j.error || "Failed"); };
  const patchUser = async (id: string, d: Partial<U>) => { await fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) }); loadUsers(); };
  const resetPw = async (u: U) => { const pw = prompt(`New password for ${u.email}:`); if (pw) { await fetch(`/api/users/${u.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) }); alert("Password updated."); } };
  const removeUser = async (u: U) => { if (!confirm(`Delete ${u.email}?`)) return; const r = await fetch(`/api/users/${u.id}`, { method: "DELETE" }); const j = await r.json().catch(() => ({})); if (!r.ok) alert(j.error || "Failed"); else loadUsers(); };

  const createRole = async (e: React.FormEvent) => { e.preventDefault(); if (!roleForm.name.trim()) return; const r = await fetch("/api/roles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(roleForm) }); const j = await r.json().catch(() => ({})); if (r.ok) { setRoleForm({ name: "", label: "" }); loadRoles(); } else alert(j.error || "Failed"); };
  const saveRole = async (role: Role) => { await fetch(`/api/roles/${role.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ permissions: role.permissions }) }); loadRoles(); alert("Saved. Members must sign in again to get new permissions."); };
  const deleteRole = async (role: Role) => { if (!confirm(`Delete role "${role.label}"?`)) return; const r = await fetch(`/api/roles/${role.id}`, { method: "DELETE" }); const j = await r.json().catch(() => ({})); if (!r.ok) alert(j.error || "Failed"); else loadRoles(); };
  const togglePerm = (roleId: string, key: string) => setRoles((rs) => rs.map((r) => r.id !== roleId ? r : { ...r, permissions: r.permissions.includes(key) ? r.permissions.filter((p) => p !== key) : [...r.permissions, key] }));

  const roleLabel = (name: string) => roles.find((r) => r.name === name)?.label || name;

  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Team & access" description="Manage accounts, roles and what each role can do.">
        <Badge variant="neutral">{rows.length} users</Badge>
        <Badge variant="neutral">{roles.length} roles</Badge>
      </PageHeader>

      <div className="mb-5 flex gap-1 border-b border-border">
        {(["users", "roles"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("border-b-2 px-3 py-2 text-sm font-medium capitalize", tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>{t}</button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}

      {tab === "users" && (
        <>
          <Card className="mb-6 p-3">
            <form onSubmit={add} className="grid grid-cols-1 gap-2 sm:grid-cols-5">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Temp password *" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{roles.map((r) => <option key={r.id} value={r.name}>{r.label}</option>)}</Select>
              <Button type="submit">Add user</Button>
            </form>
          </Card>
          <Card className="overflow-hidden p-0">
            <Table>
              <THead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></THead>
              <TBody>
                {loading ? <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Loading…</td></tr>
                  : rows.map((u) => (
                    <tr key={u.id}>
                      <td className="font-medium text-foreground">{u.name}</td>
                      <td className="text-muted-foreground">{u.email}</td>
                      <td><Select value={u.role} onChange={(e) => patchUser(u.id, { role: e.target.value })} className="h-8 w-32">{roles.map((r) => <option key={r.id} value={r.name}>{r.label}</option>)}</Select></td>
                      <td><button onClick={() => patchUser(u.id, { active: !u.active })}><Badge variant={u.active ? "success" : "neutral"}>{u.active ? "active" : "disabled"}</Badge></button></td>
                      <td className="text-right"><div className="flex justify-end gap-3"><button onClick={() => resetPw(u)} className="text-xs font-medium text-primary hover:underline">Reset pw</button><button onClick={() => removeUser(u)} className="text-muted-foreground/50 hover:text-destructive">×</button></div></td>
                    </tr>
                  ))}
              </TBody>
            </Table>
          </Card>
        </>
      )}

      {tab === "roles" && (
        <>
          <Card className="mb-6 p-3">
            <form onSubmit={createRole} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Input placeholder="Role id (e.g. designer)" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} />
              <Input placeholder="Label (e.g. Designer)" value={roleForm.label} onChange={(e) => setRoleForm({ ...roleForm, label: e.target.value })} />
              <Button type="submit">Create role</Button>
            </form>
          </Card>
          <div className="space-y-4">
            {roles.map((role) => {
              const full = role.permissions.includes("*");
              return (
                <Card key={role.id} className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{role.label}</span>
                      <span className="text-xs text-muted-foreground">{role.name}</span>
                      {role.isSystem && <Badge variant="neutral">system</Badge>}
                      {full && <Badge variant="success">full access</Badge>}
                    </div>
                    <div className="flex gap-3">
                      {!full && <Button size="sm" onClick={() => saveRole(role)}>Save</Button>}
                      {!role.isSystem && <button onClick={() => deleteRole(role)} className="text-muted-foreground/50 hover:text-destructive">×</button>}
                    </div>
                  </div>
                  {full ? (
                    <p className="text-sm text-muted-foreground">This role can access every tool and perform every action.</p>
                  ) : (
                    <>
                      <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-primary">Tool access</div>
                      <div className="mb-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
                        {TOOLS.map((t) => {
                          const key = toolPerm(t.tool);
                          return (
                            <label key={t.tool} className="flex items-center gap-2 text-sm text-foreground/80">
                              <input type="checkbox" checked={role.permissions.includes(key)} onChange={() => togglePerm(role.id, key)} className="accent-[var(--primary)]" />{t.label}
                            </label>
                          );
                        })}
                      </div>
                      <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-primary">Actions</div>
                      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                        {ACTIONS.map((a) => {
                          const key = actionPerm(a);
                          return (
                            <label key={a} className="flex items-center gap-2 text-sm text-foreground/80">
                              <input type="checkbox" checked={role.permissions.includes(key)} onChange={() => togglePerm(role.id, key)} className="accent-[var(--primary)]" />{ACTION_LABEL[a]}
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
