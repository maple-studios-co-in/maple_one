"use client";
import React, { useState } from "react";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
import { Input } from "@maple/core/ui/input";
import { Label } from "@maple/core/ui/label";
import { Button } from "@maple/core/ui/button";

export default function AccountPage() {
  const [current, setCurrent] = useState(""); const [next, setNext] = useState(""); const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null); const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);
    if (next !== confirm) { setMsg({ ok: false, t: "New passwords don’t match." }); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/account/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current, next }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) { setMsg({ ok: true, t: "Password updated." }); setCurrent(""); setNext(""); setConfirm(""); }
      else setMsg({ ok: false, t: j.error || "Failed." });
    } finally { setBusy(false); }
  };
  return (
    <div className="p-6 md:p-8">
      <PageHeader title="Account" description="Manage your sign-in." />
      <Card className="max-w-md p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Change password</h3>
        <form onSubmit={submit} className="space-y-4">
          <div><Label>Current password</Label><Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required /></div>
          <div><Label>New password</Label><Input type="password" value={next} onChange={(e) => setNext(e.target.value)} required /></div>
          <div><Label>Confirm new password</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></div>
          {msg && <p className={msg.ok ? "text-sm text-green-600" : "text-sm text-destructive"}>{msg.t}</p>}
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Update password"}</Button>
        </form>
      </Card>
    </div>
  );
}
