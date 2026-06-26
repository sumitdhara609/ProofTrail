export function getAuditActionLabel(action: string) {
  const labels: Record<string, string> = {
    "evidence.added": "Evidence attached",
    "evidence.updated": "Evidence updated",
    "evidence.deleted": "Evidence removed",
    "proof_link.generated": "Public proof generated",
    "proof_link.deactivated": "Public proof withdrawn",
    "achievement.updated": "Record updated",
    "achievement.deleted": "Record removed",
    "achievement.created": "Record created",
  };

  return labels[action] || formatUnknownAuditAction(action);
}

export function getAuditActionDescription(action: string) {
  const descriptions: Record<string, string> = {
    "evidence.added": "A supporting evidence item was added to this record.",
    "evidence.updated":
      "An evidence item was edited, including its details or visibility.",
    "evidence.deleted": "A supporting evidence item was removed from this record.",
    "proof_link.generated":
      "A public ProofTrail identity was generated for controlled sharing.",
    "proof_link.deactivated": "Public access to this proof identity was withdrawn.",
    "achievement.updated": "The record details were updated.",
    "achievement.deleted": "The record was permanently removed from the vault.",
    "achievement.created": "The record was created inside the vault.",
  };

  return descriptions[action] || "A trust-related activity was recorded.";
}

function formatUnknownAuditAction(action: string) {
  return action
    .replaceAll("_", " ")
    .replaceAll(".", " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}