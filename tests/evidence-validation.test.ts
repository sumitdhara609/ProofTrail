import { describe, expect, it } from "vitest";
import { createEvidenceSchema } from "@/lib/validation/evidence";

const achievementId = "550e8400-e29b-41d4-a716-446655440000";

describe("evidence validation", () => {
  it("accepts a valid evidence payload", () => {
    const result = createEvidenceSchema.safeParse({
      achievementId,
      title: "Certificate source link",
      evidenceType: "other",
      sourceUrl: "https://example.com/certificate",
      description: "Official certificate page for the achievement.",
      isPublic: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = createEvidenceSchema.safeParse({
      achievementId,
      title: "",
      evidenceType: "other",
      sourceUrl: "https://example.com/certificate",
      description: "Official certificate page.",
      isPublic: true,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid source URL", () => {
    const result = createEvidenceSchema.safeParse({
      achievementId,
      title: "Certificate source link",
      evidenceType: "other",
      sourceUrl: "not-a-url",
      description: "Official certificate page.",
      isPublic: true,
    });

    expect(result.success).toBe(false);
  });

  it("accepts an empty optional source URL", () => {
    const result = createEvidenceSchema.safeParse({
      achievementId,
      title: "Offline certificate",
      evidenceType: "other",
      sourceUrl: "",
      description: "Certificate exists offline and is documented manually.",
      isPublic: false,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid evidence type values", () => {
    const result = createEvidenceSchema.safeParse({
      achievementId,
      title: "Some evidence",
      evidenceType: "random_type",
      sourceUrl: "",
      description: "Some description.",
      isPublic: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid achievement IDs", () => {
    const result = createEvidenceSchema.safeParse({
      achievementId: "achievement-123",
      title: "Some evidence",
      evidenceType: "other",
      sourceUrl: "",
      description: "Some description.",
      isPublic: false,
    });

    expect(result.success).toBe(false);
  });
});