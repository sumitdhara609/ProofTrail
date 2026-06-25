import { describe, expect, it } from "vitest";
import {
  getAuditActionDescription,
  getAuditActionLabel,
} from "@/lib/proof/audit-labels";

describe("audit label helpers", () => {
  it("returns readable labels for known audit actions", () => {
    expect(getAuditActionLabel("evidence.added")).toBe("Evidence attached");
    expect(getAuditActionLabel("evidence.deleted")).toBe("Evidence removed");
    expect(getAuditActionLabel("proof_link.generated")).toBe(
      "Public proof generated"
    );
    expect(getAuditActionLabel("proof_link.deactivated")).toBe(
      "Public proof withdrawn"
    );
    expect(getAuditActionLabel("achievement.updated")).toBe("Record updated");
    expect(getAuditActionLabel("achievement.created")).toBe("Record created");
  });

  it("returns readable fallback labels for unknown audit actions", () => {
    expect(getAuditActionLabel("custom.action_name")).toBe(
      "Custom Action Name"
    );
  });

  it("returns descriptions for known audit actions", () => {
    expect(getAuditActionDescription("evidence.added")).toContain("evidence");
    expect(getAuditActionDescription("proof_link.generated")).toContain(
      "public ProofTrail identity"
    );
  });

  it("returns a safe fallback description for unknown audit actions", () => {
    expect(getAuditActionDescription("unknown.action")).toBe(
      "A trust-related activity was recorded."
    );
  });
});