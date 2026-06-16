import "server-only";
import { prisma } from "./prisma";
/** Resolve a role name to its permission keys (for embedding in the session JWT). */
export async function permsForRole(roleName: string): Promise<string[]> {
  try {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    return role?.permissions ?? [];
  } catch {
    return [];
  }
}
