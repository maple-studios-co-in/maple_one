import { redirect } from "next/navigation";
import { getSession } from "@maple/core/lib/auth";
import { can } from "@maple/core/lib/rbac";
import { currentTenant } from "@maple/core/lib/brand";
import { BrandingForm } from "./BrandingForm";

export default async function BrandingPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const allowed = user.perms.includes("*") || can(user.perms, "manage_roles");
  if (!allowed) return <div className="p-10 text-center text-muted-foreground">You don’t have access to branding.</div>;
  const t = await currentTenant();
  return <BrandingForm initial={{ brandName: t?.brandName ?? "MapleOne", logoUrl: t?.logoUrl ?? null, primaryColor: t?.primaryColor ?? "", watermarkEnabled: t?.watermarkEnabled ?? false }} />;
}
