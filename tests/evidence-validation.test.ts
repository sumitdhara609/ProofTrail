import { describe, expect, it } from "vitest";
import { createEvidenceSchema } from "@/lib/validation/evidence";

describe("evidence validation", () => {
  it("accepts a valid evidence payload", () => {
    const result = createEvidenceSchema.safeParse({
      title: "Certificate source link",
      evidence_type: "certificate_link",
      source_url: "https://example.com/certificate",
      description: "Official certificate page for the achievement.",
      is_public: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = createEvidenceSchema.safeParse({
      title: "",
      evidence_type: "certificate_link",
      source_url: "https://example.com/certificate",
      description: "Official certificate page.",
      is_public: true,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid source URL", () => {
    const result = createEvidenceSchema.safeParse({
      title: "Certificate source link",
      evidence_type: "certificate_link",
      source_url: "not-a-url",
      description: "Official certificate page.",
      is_public: true,
    });

    expect(result.success).toBe(false);
  });

  it("accepts an empty optional source URL", () => {
    const result = createEvidenceSchema.safeParse({
      title: "Offline certificate",
      evidence_type: "certificate_link",
      source_url: "",
      description: "Certificate exists offline and is documented manually.",
      is_public: false,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid evidence type values", () => {
    const result = createEvidenceSchema.safeParse({
      title: "Some evidence",
      evidence_type: "random_type",
      source_url: "",
      description: "Some description.",
      is_public: false,
    });

    expect(result.success).toBe(false);
  });
});