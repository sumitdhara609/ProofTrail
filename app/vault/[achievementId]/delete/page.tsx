import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { deleteAchievement } from "@/app/vault/[achievementId]/actions";
import { createClient } from "@/lib/supabase/server";
import {
  AchievementRecord,
  EvidenceItem,
  PublicProofLink,
} from "@/lib/proof/types";
import { formatDate, formatStatus } from "@/lib/proof/format";

type DeleteAchievementPageProps = {
  params: Promise<{
    achievementId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

function DangerMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
        {detail}
      </p>
    </div>
  );
}

export default async function DeleteAchievementPage({
  params,
  searchParams,
}: DeleteAchievementPageProps) {
  const { achievementId } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: achievement, error: achievementError } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", achievementId)
    .eq("user_id", user.id)
    .single();

  if (achievementError || !achievement) {
    notFound();
  }

  const { data: evidenceItems } = await supabase
    .from("evidence_items")
    .select("*")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id);

  const { data: proofLinkData } = await supabase
    .from("public_proof_links")
    .select("*")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  const record = achievement as AchievementRecord;
  const evidence = (evidenceItems || []) as EvidenceItem[];
  const proofLink = proofLinkData as PublicProofLink | null;
  const mediaEvidenceCount = evidence.filter((item) =>
    Boolean(item.file_path)
  ).length;
  const publicEvidenceCount = evidence.filter((item) => item.is_public).length;

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
                Delete record
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <SecondaryButton href="/vault" className="hidden sm:inline-flex">
              Vault
            </SecondaryButton>

            <SecondaryButton href={`/vault/${record.id}`}>
              Keep record
            </SecondaryButton>
          </div>
        </nav>

        <div className="mt-8">
          <Link
            href={`/vault/${record.id}`}
            className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
          >
            ← Back to record dossier
          </Link>
        </div>

        <header className="grid gap-8 py-10 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:py-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--danger)]">
              Destructive action
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Permanently remove this proof record?
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
              This will remove the achievement record from your private vault.
              Attached evidence and active public proof access connected to this
              record will also be removed.
            </p>
          </div>

          <GlassCard className="border-[var(--danger-border)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--danger)]">
              Removal warning
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
              This action cannot be undone from the app.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              Continue only if this record was created by mistake, duplicated,
              or no longer belongs in your proof archive.
            </p>
          </GlassCard>
        </header>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-sm text-[var(--danger)]">
            <p className="font-semibold">Record could not be removed.</p>
            <p className="mt-2 leading-7">{error}</p>
          </div>
        ) : null}

        <section className="grid gap-6 pb-16 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-4">
            <GlassCard className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--danger)]">
                What will be affected
              </p>

              <div className="mt-6 space-y-3">
                {[
                  [
                    "01",
                    "Private record",
                    "The achievement title, context, issuer, impact, and metadata will be removed.",
                  ],
                  [
                    "02",
                    "Evidence ledger",
                    "Attached evidence items connected to this record will no longer belong to the vault entry.",
                  ],
                  [
                    "03",
                    "Public proof",
                    "Any active public ProofTrail identity for this record will stop representing this achievement.",
                  ],
                  [
                    "04",
                    "Other records",
                    "Your account and all other vault records will remain unaffected.",
                  ],
                ].map(([number, title, description]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
                  >
                    <div className="flex gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--danger-border)] bg-[var(--danger-soft)] font-mono text-xs font-semibold text-[var(--danger)]">
                        {number}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="border-[var(--danger-border)] bg-[var(--danger-soft)] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--danger)]">
                Safer alternative
              </p>

              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                If the record is real but incomplete, keep it private and edit
                it later instead of deleting it permanently.
              </p>
            </GlassCard>
          </aside>

          <GlassCard className="overflow-hidden border-[var(--danger-border)]">
            <div className="border-b border-[var(--danger-border)] bg-[var(--danger-soft)] p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--danger)]">
                Record selected for removal
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
                {record.title}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                Review the connected proof data below before confirming
                deletion.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-[var(--danger-border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--danger)]">
                  {formatStatus(record.verification_status)}
                </span>

                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                  {record.category}
                </span>

                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                  {record.visibility}
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DangerMetric
                  label="Evidence"
                  value={evidence.length}
                  detail="Attached support items"
                />

                <DangerMetric
                  label="Media"
                  value={mediaEvidenceCount}
                  detail="Uploaded files or certificates"
                />

                <DangerMetric
                  label="Public"
                  value={publicEvidenceCount}
                  detail="Public evidence items"
                />

                <DangerMetric
                  label="Proof ID"
                  value={proofLink ? "Active" : "Private"}
                  detail={proofLink ? proofLink.proof_code : "No active proof"}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5">
                <p className="text-sm font-semibold text-[var(--danger)]">
                  Final confirmation
                </p>

                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  Delete this record only if you are sure it should no longer
                  exist in the vault. This does not affect your account or other
                  achievement records.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <form action={deleteAchievement.bind(null, record.id)}>
                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--danger)] bg-[var(--danger)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto"
                  >
                    Remove record permanently
                  </button>
                </form>

                <Link
                  href={`/vault/${record.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
                >
                  Keep record
                </Link>
              </div>
            </div>
          </GlassCard>
        </section>
      </section>
    </main>
  );
}