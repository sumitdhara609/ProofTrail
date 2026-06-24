type ProofStatus =
  | "Claimed"
  | "Evidence Attached"
  | "Source Linked"
  | "Reviewed"
  | "Flagged";

type ProofStatusBadgeProps = {
  status: ProofStatus;
};

export function ProofStatusBadge({ status }: ProofStatusBadgeProps) {
  return (
    <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
      {status}
    </span>
  );
}