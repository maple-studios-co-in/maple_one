import { getSession } from "@maple/core/lib/auth";
import { canAccessTool } from "@maple/core/lib/rbac";
import { enabledTools } from "@maple/core/lib/flags";
import { can } from "@maple/core/lib/rbac";
import Link from "next/link";
import { TOOLS, toolUrl } from "@maple/core/lib/nav";
import { Card } from "@maple/core/ui/card";

export default async function Launcher() {
  const user = await getSession();
  if (!user) return null;
  const accessible = TOOLS.filter((t) => canAccessTool(user.perms, t.tool, user.role));
  const on = await enabledTools(accessible.map((t) => t.tool));
  const tools = accessible.filter((t) => on.has(t.tool));
  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-foreground">Welcome back, {user.name.split(" ")[0]}.</h1>
          <p className="mt-1 text-muted-foreground">Your Maple Furnishers workspace.</p>
        </div>
        <div className="flex items-center gap-4">{(user.perms.includes("*") || can(user.perms, "manage_roles")) && <Link href="/branding" className="text-sm text-muted-foreground hover:text-foreground">Branding</Link>}<form action="/api/auth/logout" method="post"><button className="text-sm text-muted-foreground hover:text-foreground">Sign out</button></form></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <a key={t.tool} href={toolUrl(t.tool)}>
            <Card className="p-5 transition hover:border-primary/40 hover:shadow-md">
              <div className="font-medium text-foreground">{t.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{t.tool}.maplefurnishers.com</div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
