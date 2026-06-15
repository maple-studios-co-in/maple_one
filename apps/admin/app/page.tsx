import { getSession } from "@maple/core/lib/auth";
import { canAccess } from "@maple/core/lib/rbac";
import { TOOLS, toolUrl } from "@maple/core/lib/nav";
import { Card } from "@maple/core/ui/card";

export default async function Launcher() {
  const user = await getSession();
  if (!user) return null;
  const tools = TOOLS.filter((t) => canAccess(user.role, `/${t.tool}`));
  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-foreground">Welcome back, {user.name.split(" ")[0]}.</h1>
          <p className="mt-1 text-muted-foreground">Your Maple Furnishers workspace.</p>
        </div>
        <form action="/api/auth/logout" method="post"><button className="text-sm text-muted-foreground hover:text-foreground">Sign out</button></form>
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
