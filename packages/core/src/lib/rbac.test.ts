import { describe, it, expect } from "vitest";
import { canAccessTool, can } from "./rbac";

describe("canAccessTool", () => {
  it("admin wildcard opens any tool", () => {
    expect(canAccessTool(["*"], "quotations")).toBe(true);
  });
  it("explicit tool perm grants only that tool", () => {
    expect(canAccessTool(["tool:leads"], "leads")).toBe(true);
    expect(canAccessTool(["tool:leads"], "crm")).toBe(false);
  });
  it("empty perms fall back to the legacy role map", () => {
    expect(canAccessTool([], "leads", "sales")).toBe(true);   // sales had leads
    expect(canAccessTool([], "hr", "sales")).toBe(false);     // sales never had hr
  });
  it("no perms and no role => denied", () => {
    expect(canAccessTool([], "leads")).toBe(false);
  });
});

describe("can(action)", () => {
  it("wildcard and explicit action grant", () => {
    expect(can(["*"], "delete")).toBe(true);
    expect(can(["act:export"], "export")).toBe(true);
  });
  it("missing action denied", () => {
    expect(can(["tool:leads"], "delete")).toBe(false);
    expect(can([], "delete")).toBe(false);
  });
});
