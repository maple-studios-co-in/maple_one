export const ROLES = ["admin", "sales", "accounts", "hr"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  sales: "Sales",
  accounts: "Accounts",
  hr: "HR",
};

// which roles may access each tool path (admin always allowed)
export const TOOL_ACCESS: Record<string, Role[]> = {
  "/leads": ["admin", "sales"],
  "/crm": ["admin", "sales", "accounts"],
  "/quotations": ["admin", "sales"],
  "/orders": ["admin", "sales"],
  "/invoices": ["admin", "sales", "accounts"],
  "/payments": ["admin", "accounts"],
  "/catalog": ["admin", "sales"],
  "/photoshoot": ["admin", "sales"],
  "/price-list": ["admin", "sales"],
  "/inventory": ["admin", "accounts", "sales"],
  "/finance": ["admin", "accounts"],
  "/hr": ["admin", "hr"],
  "/purchase-orders": ["admin", "accounts"],
  "/challans": ["admin", "sales"],
  "/expenses": ["admin", "accounts"],
  "/users": ["admin"],
};

export function canAccess(role: string, path: string): boolean {
  if (role === "admin") return true;
  const entry = Object.entries(TOOL_ACCESS).find(([p]) => path === p || path.startsWith(p + "/"));
  if (!entry) return true; // dashboard + non-gated pages
  return entry[1].includes(role as Role);
}
