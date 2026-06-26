import Link from "next/link";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
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
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--text-primary)] sm:px-10 lg:px-16">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Trust Command Center
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-5xl">
              Welcome back, {fullName}.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
              Review your private proof vault, identify records that need
              stronger evidence, and control which achievements receive active
              public proof identities.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ThemeToggle />

            <PrimaryButton href="/vault/new">Create record</PrimaryButton>

            <SecondaryButton href="/vault">Open vault</SecondaryButton>

            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-muted)] shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <GlassCard className="mt-12 overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.2fr]">
            <div className="border-b border-[var(--border)] p-8 lg:border-b-0 lg:border-r lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Vault health
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                  {vaultHealth}
                </h2>

                <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  {totalRecords} record{totalRecords === 1 ? "" : "s"}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
                A strong ProofTrail vault keeps records structured, evidence
                attached, proof links intentional, and public access limited to
                records that are ready to be shared.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs text-[var(--text-muted)]">Records</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                    {totalRecords}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs text-[var(--text-muted)]">Evidence</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                    {evidenceCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs text-[var(--text-muted)]">
                    Active proof IDs
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                    {proofIdentityCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Recommended action
              </p>

              {totalRecords === 0 ? (
                <>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    Start your vault with one meaningful record.
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
                    Create an achievement record with a clear title, context,
                    date, and enough detail to support evidence later.
                  </p>
                  <PrimaryButton href="/vault/new" className="mt-8">
                    Create first record
                  </PrimaryButton>
                </>
              ) : recordsWaitingForEvidence.length > 0 ? (
                <>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    Strengthen records that have no evidence yet.
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
                    {recordsWaitingForEvidence.length} record
                    {recordsWaitingForEvidence.length === 1 ? "" : "s"} still
                    need supporting evidence before they can become meaningful
                    proof entries.
                  </p>
                  <PrimaryButton
                    href={`/vault/${recordsWaitingForEvidence[0].id}`}
                    className="mt-8"
                  >
                    Attach evidence
                  </PrimaryButton>
                </>
              ) : recordsReadyForProof.length > 0 ? (
                <>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    Evidence-backed records are ready for controlled sharing.
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
                    These records already contain evidence and can now receive a
                    ProofTrail ID with QR-backed public access when you are
                    ready.
                  </p>
                  <PrimaryButton
                    href={`/vault/${recordsReadyForProof[0].id}`}
                    className="mt-8"
                  >
                    Review proof readiness
                  </PrimaryButton>
                </>
              ) : (
                <>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    Your proof vault is in good shape.
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
                    Continue preserving new achievements or review existing
                    proof identities for clarity, public evidence, and access
                    control.
                  </p>
                  <PrimaryButton href="/vault" className="mt-8">
                    Review vault
                  </PrimaryButton>
                </>
              )}
            </div>
          </div>
        </GlassCard>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Recent records
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-[var(--text-primary)]">
                  Latest vault entries
                </h2>
              </div>

              <Link
                href="/vault"
                className="text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--accent)]"
              >
                View all →
              </Link>
            </div>

            {recentRecords.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  No records have been created yet.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Once you create an achievement record, it will appear here as
                  part of your private proof vault.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {recentRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/vault/${record.id}`}
                    className="block rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {record.title}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                          {record.category}
                        </p>
                      </div>

                      <span className="w-fit rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                        {formatStatus(record.verification_status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Trust events
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-[var(--text-primary)]">
              Recent audit trail
            </h2>

            {recentLogs.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  No trust events recorded yet.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Record creation, evidence changes, proof generation, and proof
                  withdrawal events will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
                  >
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {getAuditActionLabel(log.action)}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      {getAuditActionDescription(log.action)}
                    </p>

                    <p className="mt-3 text-xs text-[var(--text-muted)]">
                      {formatDateTime(log.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </section>
    </main>
  );
}