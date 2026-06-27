import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { createClient } from "@/lib/supabase/server";
import { deleteEvidenceItem } from "@/app/vault/[achievementId]/actions";
import { EvidenceItem } from "@/lib/proof/types";
import { formatDateTime, formatEvidenceType } from "@/lib/proof/format";

type DeleteEvidencePageProps = {
  params: Promise<{
    achievementId: string;
    evidenceItemId: string;
  }>;
};

function DangerMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-3 break-words text-sm font-semibold text-[var(--text-primary)]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
        {detail}
      </p>
    </div>
  );
}

export default async function DeleteEvidencePage({
  params,
}: DeleteEvidencePageProps) {
  const { achievementId, evidenceItemId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: achievement, error: achievementError } = await supabase
    .from("achievements")
    .select("id, user_id, title")
    .eq("id", achievementId)
    .eq("user_id", user.id)
    .single();

  if (achievementError || !achievement) {
    notFound();
  }

  const { data: evidenceData, error: evidenceError } = await supabase
    .from("evidence_items")
    .select("*")
    .eq("id", evidenceItemId)
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .single();

  if (evidenceError || !evidenceData) {
    notFound();
  }

  const evidence = evidenceData as EvidenceItem;
  const hasMediaFile = Boolean(evidence.file_path);

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
                Delete evidence
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

            <SecondaryButton href={`/vault/${achievementId}`}>
              Keep evidence
            </SecondaryButton>
          </div>
        </nav>

        <div className="mt-8">
          <Link
            href={`/vault/${achievementId}`}
            className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
          >
            ← Back to record dossier
          </Link>
        </div>

        <header className="grid gap-8 py-10 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:py-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--danger)]">
              Delete evidence
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Remove this evidence item?
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
              This will permanently remove the selected evidence from this
              record. The parent achievement record itself will remain in your
              vault.
            </p>
          </div>

          <GlassCard className="border-[var(--danger-border)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--danger)]">
              Evidence removal warning
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
              This action cannot be undone from the app.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              Use deletion only when the evidence is incorrect, duplicated,
              outdated, or should no longer remain attached to this proof
              record.
            </p>
          </GlassCard>
        </header>

        <section className="grid gap-6 pb-16 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-4">
            <GlassCard className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--danger)]">
                What will happen
              </p>

              <div className="mt-6 space-y-3">
                {[
                  [
                    "01",
                    "Evidence removed",
                    "The selected evidence item will be removed from this record.",
                  ],
                  [
                    "02",
                    "Media removed",
                    hasMediaFile
                      ? "The uploaded media file connected to this evidence will also be removed."
                      : "No uploaded media file is connected to this evidence.",
                  ],
                  [
                    "03",
                    "Record preserved",
                    "The parent achievement record will remain in your private vault.",
                  ],
                  [
                    "04",
                    "Proof changes",
                    "If this evidence was public, it will no longer appear on public proof pages.",
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

            <GlassCard className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Parent record
              </p>

              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                {achievement.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                This record will not be deleted. Only the selected evidence item
                will be removed.
              </p>
            </GlassCard>
          </aside>

          <GlassCard className="overflow-hidden border-[var(--danger-border)]">
            <div className="border-b border-[var(--danger-border)] bg-[var(--danger-soft)] p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--danger)]">
                Evidence selected for removal
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
                {evidence.title}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                Review the evidence details below before confirming deletion.
              </p>
            </div>

            <div className="p-8 sm:p-10">
              {evidence.description ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Evidence note
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    {evidence.description}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="text-sm leading-7 text-[var(--text-muted)]">
                    No evidence note was added.
                  </p>
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <DangerMetric
                  label="Type"
                  value={formatEvidenceType(evidence.evidence_type)}
                  detail="Evidence classification"
                />

                <DangerMetric
                  label="Visibility"
                  value={evidence.is_public ? "Public" : "Private"}
                  detail="Current proof-page visibility"
                />

                <DangerMetric
                  label="Source URL"
                  value={evidence.source_url || "None"}
                  detail="External reference attached"
                />

                <DangerMetric
                  label="Added"
                  value={formatDateTime(evidence.created_at)}
                  detail="Evidence creation time"
                />
              </div>

              {hasMediaFile ? (
                <div className="mt-6 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5">
                  <p className="text-sm font-semibold text-[var(--danger)]">
                    Media file will also be deleted.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                    This evidence has an uploaded file attached:{" "}
                    <span className="font-semibold text-[var(--danger)]">
                      {evidence.file_name || "Attached media"}
                    </span>
                    . Deleting this evidence will remove the file from the
                    private storage bucket.
                  </p>
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <form
                  action={deleteEvidenceItem.bind(
                    null,
                    achievementId,
                    evidenceItemId
                  )}
                >
                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--danger)] bg-[var(--danger)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto"
                  >
                    Remove evidence permanently
                  </button>
                </form>

                <Link
                  href={`/vault/${achievementId}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
                >
                  Keep evidence
                </Link>
              </div>
            </div>
          </GlassCard>
        </section>
      </section>
    </main>
  );
}