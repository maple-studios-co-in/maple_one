import { redirect } from "next/navigation";
import { getSession } from "@maple/core/lib/auth";
import { can } from "@maple/core/lib/rbac";
import { WebsiteManager } from "./WebsiteManager";
export const dynamic = "force-dynamic";
export default async function WebsitePage() {
  const u = await getSession();
  if (!u) redirect("/login");
  if (!(u.perms.includes("*") || can(u.perms, "manage_roles"))) return <div className="p-12 text-center text-muted-foreground">You don’t have access to website management.</div>;
  return <WebsiteManager />;
}
