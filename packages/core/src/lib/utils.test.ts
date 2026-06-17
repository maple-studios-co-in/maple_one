import { describe, it, expect } from "vitest";
import { money } from "./utils";

describe("money", () => {
  it("formats with the rupee symbol and grouping", () => {
    const s = money(125000);
    expect(s).toContain("₹");
    expect(s.replace(/\s/g, "")).toContain("1,25,000");
  });
});
