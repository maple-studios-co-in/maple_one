import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const T = (...names) => names.map((n) => `tool:${n}`);
const roles = [
  { name: "admin", label: "Administrator", permissions: ["*"], isSystem: true },
  { name: "sales", label: "Sales", isSystem: true, permissions: [
    ...T("leads","crm","quotations","orders","invoices","catalog","photoshoot","price-list","inventory","challans","tasks"),
    "act:export", "act:publish",
  ]},
  { name: "accounts", label: "Accounts", isSystem: true, permissions: [
    ...T("crm","invoices","payments","inventory","finance","purchase-orders","expenses","tasks"),
    "act:export",
  ]},
  { name: "hr", label: "HR", isSystem: true, permissions: [...T("hr","tasks")] },
];

for (const r of roles) {
  await prisma.role.upsert({
    where: { name: r.name },
    update: { label: r.label, permissions: r.permissions, isSystem: r.isSystem },
    create: r,
  });
  console.log("seeded role", r.name);
}

const users = [
  { name: "Admin", email: process.env.ADMIN_EMAIL || "admin@maplefurnishers.com", password: process.env.ADMIN_PASSWORD || "maple@123", role: "admin" },
  { name: "Sales", email: "sales@maplefurnishers.com", password: "maple@123", role: "sales" },
  { name: "Accounts", email: "accounts@maplefurnishers.com", password: "maple@123", role: "accounts" },
  { name: "HR", email: "hr@maplefurnishers.com", password: "maple@123", role: "hr" },
];
for (const u of users) {
  const passwordHash = await bcrypt.hash(u.password, 10);
  await prisma.user.upsert({
    where: { email: u.email },
    update: { name: u.name, role: u.role },
    create: { name: u.name, email: u.email, passwordHash, role: u.role },
  });
  console.log("seeded user", u.email, `(${u.role})`);
}
await prisma.$disconnect();
