import { describe, expect, it } from "vitest";
import { createPublicSlug, generateProofCode } from "@/lib/proof/codes";

describe("proof code helpers", () => {
  it("generates a ProofTrail code with the expected format", () => {
    const code = generateProofCode();

    expect(code).toMatch(/^PT-\d{4}-[A-F0-9]{6}$/);
  });

  it("includes the current year in generated proof codes", () => {
    const code = generateProofCode();
    const year = new Date().getFullYear();

    expect(code.startsWith(`PT-${year}-`)).toBe(true);
  });

  it("creates a lowercase public slug from a proof code", () => {
    expect(createPublicSlug("PT-2026-ABC123")).toBe("pt-2026-abc123");
  });

  it("does not change already lowercase slugs", () => {
    expect(createPublicSlug("pt-2026-abc123")).toBe("pt-2026-abc123");
  });
});