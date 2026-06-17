import { describe, it, expect, beforeAll } from "vitest";
import { signSession, verifySession } from "./session";

beforeAll(() => { process.env.AUTH_SECRET = "test-secret-please"; });

describe("session JWT", () => {
  const user = { id: "u1", name: "Ada", email: "ada@x.com", role: "admin", perms: ["*"], tenantId: "t1" };

  it("signs and verifies a roundtrip with all claims", async () => {
    const token = await signSession(user);
    const out = await verifySession(token);
    expect(out).toMatchObject({ id: "u1", email: "ada@x.com", role: "admin", tenantId: "t1" });
    expect(out?.perms).toEqual(["*"]);
  });
  it("rejects a tampered token", async () => {
    const out = await verifySession("not.a.jwt");
    expect(out).toBeNull();
  });
});
