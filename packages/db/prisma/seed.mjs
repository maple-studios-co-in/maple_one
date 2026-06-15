import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
  console.log("seeded", u.email, `(${u.role})`);
}
await prisma.$disconnect();
