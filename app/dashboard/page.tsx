import Link from "next/link";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { AchievementRecord, AuditLog } from "@/lib/proof/types";
import {
  getAuditActionDescription,
  getAuditActionLabel,
} from "@/lib/proof/audit-labels";
import { formatDateTime, formatStatus } from "@/lib/proof/format";

function PrimaryAction({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#171512] bg-[#171512] px-6 py-3 text-sm font-semibold text-[#fffaf1] shadow-[var(--shadow-button)] transition hover:-translate-y-0.5 hover:bg-[#2a251f] dark:border-[#fffaf1] dark:bg-[#fffaf1] dark:text-[#171512] dark:hover:bg-[#eadfce]"
    >
      {children}
    </Link>
  );
}

function SecondaryAction({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
    >
      {children}
    </Link>
  );
}

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
          .select("id, achievement_id, is_public, file_path")
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
  const mediaEvidenceCount =
    evidenceItems?.filter((item) => Boolean(item.file_path)).length || 0;
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

  const recentRecords = records.slice(0, 4);
  const recentLogs = (auditLogs || []) as AuditLog[];

  const vaultHealth =
    totalRecords === 0
      ? "Not started"
      : recordsWaitingForEvidence.length > 0
        ? "Needs evidence"
        : recordsReadyForProof.length > 0
          ? "Ready for proof"
          : "Healthy";

  const recommendedHref =
    totalRecords === 0
      ? "/vault/new"
      : recordsWaitingForEvidence.length > 0
        ? `/vault/${recordsWaitingForEvidence[0].id}`
        : recordsReadyForProof.length > 0
          ? `/vault/${recordsReadyForProof[0].id}`
          : "/vault";

  const recommendedLabel =
    totalRecords === 0
      ? "Create first record"
      : recordsWaitingForEvidence.length > 0
        ? "Attach evidence"
        : recordsReadyForProof.length > 0
          ? "Review proof readiness"
          : "Review vault";

  return (
    <main className="premium-noise relative min-h-screen overflow-hidden bg-[var(--background)] px-5 py-6 text-[var(--text-primary)] sm:px-8 lg:px-10">
      <section className="relative z-10 mx-auto max-w-7xl">
        <nav className="flex items-center justify-between rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--text-primary)] text-xs font-bold tracking-[0.16em] text-[var(--background)]">
              PT
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[-0.02em]">
                ProofTrail
              </p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Command center
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <SecondaryAction href="/vault">Open vault</SecondaryAction>

            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>

        <header className="grid gap-8 py-12 lg:grid-cols-[1fr_0.78fr] lg:items-end lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Trust command center
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Welcome back, {fullName}.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
              Review your private proof vault, strengthen records with evidence,
              and control which achievements receive public proof identities.
            </p>
          </div>

          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Current vault status
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-3xl font-semibold tracking-[-0.04em]">
                {vaultHealth}
              </p>

              <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                {totalRecords} record{totalRecords === 1 ? "" : "s"}
              </span>
            </div>

            <PrimaryAction href={recommendedHref}>
              {recommendedLabel}
            </PrimaryAction>
          </GlassCard>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Records", totalRecords, "Total preserved achievement records"],
            ["Evidence", evidenceCount, "Attached proof and support items"],
            ["Media", mediaEvidenceCount, "Uploaded certificates or files"],
            ["Proof IDs", proofIdentityCount, "Active public proof identities"],
          ].map(([label, value, detail]) => (
            <GlassCard key={label} className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {label}
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                {value}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                {detail}
              </p>
            </GlassCard>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <GlassCard className="overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Recommended action
              </p>

              {totalRecords === 0 ? (
                <>
                  <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
                    Start with one meaningful record.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                    Create an achievement record with a clear title, issuer,
                    date, context, and enough detail to support evidence later.
                  </p>
                </>
              ) : recordsWaitingForEvidence.length > 0 ? (
                <>
                  <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
                    Strengthen records without evidence.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                    {recordsWaitingForEvidence.length} record
                    {recordsWaitingForEvidence.length === 1 ? "" : "s"} still
                    need supporting evidence before they become meaningful proof
                    entries.
                  </p>
                </>
              ) : recordsReadyForProof.length > 0 ? (
                <>
                  <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
                    Evidence-backed records are ready for review.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                    These records already contain evidence and can receive a
                    ProofTrail ID when you decide they are ready for controlled
                    public sharing.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
                    Your proof vault is in good shape.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                    Continue preserving new achievements or review existing
                    proof identities for clarity, public evidence, and access
                    control.
                  </p>
                </>
              )}
            </div>

            <div className="p-7">
              <PrimaryAction href={recommendedHref}>
                {recommendedLabel}
              </PrimaryAction>
            </div>
          </GlassCard>

          <GlassCard className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Recent audit trail
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
                  Trust events.
                </h2>
              </div>
            </div>

            {recentLogs.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
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
        </section>

        <section className="mt-6 pb-16">
          <GlassCard className="p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Recent records
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
                  Latest vault entries.
                </h2>
              </div>

              <SecondaryAction href="/vault">View all records</SecondaryAction>
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
              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                {recentRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/vault/${record.id}`}
                    className="block rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
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
        </section>
      </section>
    </main>
  );
}