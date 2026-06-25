import { describe, expect, it } from "vitest";
import { createAchievementSchema } from "@/lib/validation/achievement";

describe("achievement validation", () => {
  it("accepts a valid achievement payload", () => {
    const result = createAchievementSchema.safeParse({
      title: "Won inter-school debate competition",
      category: "other",
      issuer: "St. Teresa School",
      achievementDate: "2026-06-25",
      description:
        "Participated in a structured debate competition and secured a winning position.",
      impactSummary:
        "Improved public speaking, argument structure, and communication confidence.",
      visibility: "private",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = createAchievementSchema.safeParse({
      title: "",
      category: "other",
      issuer: "St. Teresa School",
      achievementDate: "2026-06-25",
      description: "Valid description",
      impactSummary: "Valid impact summary",
      visibility: "private",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty category", () => {
    const result = createAchievementSchema.safeParse({
      title: "Published a project",
      category: "",
      issuer: "Personal",
      achievementDate: "2026-06-25",
      description: "Valid description",
      impactSummary: "Valid impact summary",
      visibility: "private",
    });

    expect(result.success).toBe(false);
  });

  it("accepts optional issuer, description, impact summary, and date as empty strings", () => {
    const result = createAchievementSchema.safeParse({
      title: "Built ProofTrail MVP",
      category: "other",
      issuer: "",
      achievementDate: "",
      description: "",
      impactSummary: "",
      visibility: "private",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid visibility values", () => {
    const result = createAchievementSchema.safeParse({
      title: "Built ProofTrail MVP",
      category: "other",
      issuer: "",
      achievementDate: "",
      description: "",
      impactSummary: "",
      visibility: "hidden",
    });

    expect(result.success).toBe(false);
  });
});