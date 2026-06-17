import { getSession } from "@maple/core/lib/auth";
import { can } from "@maple/core/lib/rbac";
import { tenantDb } from "@maple/core/lib/tenant-db";
import { GUIDES, guideToHtml } from "../../content";
import { Editor } from "./Editor";
export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getSession();
  if (!user || !(user.perms.includes("*") || can(user.perms, "manage_roles"))) {
    return <div className="p-12 text-center text-muted-foreground">Sign in as an admin (at admin.maplefurnishers.com) to edit this page.</div>;
  }
  const guide = GUIDES.find((g) => g.slug === slug);
  const doc = await (await tenantDb()).doc.findFirst({ where: { slug } }).catch(() => null);
  return (
    <Editor
      slug={slug}
      title={doc?.title || guide?.title || slug}
      tagline={doc?.tagline || guide?.tagline || ""}
      body={doc?.body || (guide ? guideToHtml(guide) : "")}
    />
  );
}
