import { randomBytes } from "node:crypto";
export function kebab(s: string) {
  return (s || "collection").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "collection";
}
export function randomHex(n = 8) {
  return randomBytes(n).toString("hex");
}
