import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { AchievementRecord, AuditLog } from "@/lib/proof/types";
import {
  getAuditActionDescription,
  getAuditActionLabel,
} from "@/lib/proof/audit-labels";
import { formatDateTime, formatStatus } from "@/lib/proof/format";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const fullName = user.user_metadata?.full_name || "ProofTrail user";

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const records = (achievements || []) as AchievementRecord[];
  const recordIds = records.map((record) => record.id);

  const { data: evidenceItems } =
    recordIds.length > 0
      ? await supabase
          .from("evidence_items")
          .select("id, achievement_id, is_public")
          .eq("user_id", user.id)
          .in("achievement_id", recordIds)
      : { data: [] };

  const { data: proofLinks } =
    recordIds.length > 0
      ? await supabase
          .from("public_proof_links")
          .select("id, achievement_id")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .in("achievement_id", recordIds)
      : { data: [] };

  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const totalRecords = records.length;
  const evidenceCount = evidenceItems?.length || 0;
  const proofIdentityCount = proofLinks?.length || 0;

  const recordsWaitingForEvidence = records.filter((record) => {
    return !evidenceItems?.some((item) => item.achievement_id === record.id);
  });

  const recordsReadyForProof = records.filter((record) => {
    const hasEvidence = evidenceItems?.some(
      (item) => item.achievement_id === record.id
    );

    const hasProof = proofLinks?.some(
      (link) => link.achievement_id === record.id
    );

    return hasEvidence && !hasProof;
  });

  const recentRecords = records.slice(0, 3);
  const recentLogs = (auditLogs || []) as AuditLog[];

  const vaultHealth =
    totalRecords === 0
      ? "Waiting"
      : recordsWaitingForEvidence.length > 0
        ? "Needs evidence"
        : recordsReadyForProof.length > 0
          ? "Ready for proof"
          : "Healthy";

  return (
    <main className="min-h-screen bg-[#08090d] px-6 py-10 text-white sm:px-10 lg:px-16">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
              Trust Command Center
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Welcome back, {fullName}.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">
              Monitor your proof vault, strengthen incomplete records, review
              evidence coverage, and control which achievements receive public
              proof identities.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/vault/new"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Create record
            </Link>

            <Link
              href="/vault"
              className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/[0.06] hover:text-white"
            >
              Open vault
            </Link>

            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/55 transition hover:bg-white/[0.06] hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035]">
          <div className="grid lg:grid-cols-[1fr_1.2fr]">
            <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
              <p className="text-sm uppercase tracking-[0.24em] text-white/35">
                Vault health
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                  {vaultHealth}
                </h2>

                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  {totalRecords} record{totalRecords === 1 ? "" : "s"}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-white/50">
                A healthy ProofTrail vault has structured records, supporting
                evidence, clear audit activity, and public proof links only for
                records that are ready to be shared.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/35">Records</p>
                  <p className="mt-2 text-2xl font-semibold">{totalRecords}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/35">Evidence</p>
                  <p className="mt-2 text-2xl font-semibold">{evidenceCount}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-white/35">Proof IDs</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {proofIdentityCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-10">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
                Recommended action
              </p>

              {totalRecords === 0 ? (
                <>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                    Create the first record in your proof vault.
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-white/50">
                    Start with one achievement that has a clear story and can
                    later be supported with evidence.
                  </p>
                  <Link
                    href="/vault/new"
                    className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    Create first record
                  </Link>
                </>
              ) : recordsWaitingForEvidence.length > 0 ? (
                <>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                    Strengthen records that still have no evidence.
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-white/50">
                    {recordsWaitingForEvidence.length} record
                    {recordsWaitingForEvidence.length === 1 ? "" : "s"} still
                    need supporting evidence before they become meaningful proof
                    entries.
                  </p>
                  <Link
                    href={`/vault/${recordsWaitingForEvidence[0].id}`}
                    className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    Attach evidence
                  </Link>
                </>
              ) : recordsReadyForProof.length > 0 ? (
                <>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                    Evidence-backed records are ready for proof identity.
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-white/50">
                    These records already contain evidence and can now receive a
                    controlled ProofTrail ID with QR-backed public access.
                  </p>
                  <Link
                    href={`/vault/${recordsReadyForProof[0].id}`}
                    className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    Review proof readiness
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                    Your proof vault is in good shape.
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-white/50">
                    Continue preserving new achievements or review existing
                    proof identities for clarity, evidence quality, and public
                    visibility.
                  </p>
                  <Link
                    href="/vault"
                    className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    Review vault
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
                  Recent records
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                  Latest vault entries
                </h2>
              </div>

              <Link
                href="/vault"
                className="text-sm font-medium text-white/40 transition hover:text-cyan-200"
              >
                View all →
              </Link>
            </div>

            {recentRecords.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
                <p className="text-sm font-medium text-white">
                  No records have been created yet.
                </p>
                <p className="mt-3 text-sm leading-7 text-white/45">
                  Your first record will appear here after you create an
                  achievement inside the vault.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {recentRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/vault/${record.id}`}
                    className="block rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-cyan-300/25 hover:bg-white/[0.045]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {record.title}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/35">
                          {record.category}
                        </p>
                      </div>

                      <span className="w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                        {formatStatus(record.verification_status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
              Trust events
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
              Recent audit trail
            </h2>

            {recentLogs.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
                <p className="text-sm font-medium text-white">
                  No trust events recorded yet.
                </p>
                <p className="mt-3 text-sm leading-7 text-white/45">
                  Actions like creating records, adding evidence, generating
                  proof links, and withdrawing public proof will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <p className="text-sm font-medium text-white">
                      {getAuditActionLabel(log.action)}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/45">
                      {getAuditActionDescription(log.action)}
                    </p>

                    <p className="mt-3 text-xs text-white/30">
                      {formatDateTime(log.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}