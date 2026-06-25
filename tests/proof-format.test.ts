import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatEvidenceType,
  formatStatus,
} from "@/lib/proof/format";

describe("proof format helpers", () => {
  it("formats status values into readable labels", () => {
    expect(formatStatus("evidence_attached")).toBe("Evidence Attached");
    expect(formatStatus("source_linked")).toBe("Source Linked");
    expect(formatStatus("draft")).toBe("Draft");
  });

  it("formats evidence type values into readable labels", () => {
    expect(formatEvidenceType("certificate_link")).toBe("Certificate Link");
    expect(formatEvidenceType("project_url")).toBe("Project Url");
    expect(formatEvidenceType("publication")).toBe("Publication");
  });

  it("formats missing dates safely", () => {
    expect(formatDate(null)).toBe("Not dated");
    expect(formatDateTime(null)).toBe("Not available");
  });

  it("formats valid dates using the India locale", () => {
    expect(formatDate("2026-06-25")).toContain("2026");
    expect(formatDateTime("2026-06-25T10:30:00.000Z")).toContain("2026");
  });
});