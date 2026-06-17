"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@maple/core/ui/card";
import { Input } from "@maple/core/ui/input";
import { Label } from "@maple/core/ui/label";
import { Button } from "@maple/core/ui/button";
import { safeNext } from "@maple/core/lib/sso";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) setError(j.error || "Login failed");
      else {
        const next = safeNext(new URLSearchParams(window.location.search).get("next"), "/");
        if (next.startsWith("/")) { router.push(next); router.refresh(); }
        else window.location.assign(next); // cross-subdomain return
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="font-serif text-3xl text-primary">MapleOne</div>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to the team workspace</p>
        </div>
        <Card className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@maplefurnishers.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
          </form>
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">Seeded admin: admin@maplefurnishers.com · maple@123</p>
      </div>
    </div>
  );
}
