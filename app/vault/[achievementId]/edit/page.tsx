import { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { updateAchievement } from "@/app/vault/[achievementId]/actions";
import { createClient } from "@/lib/supabase/server";
import { AchievementRecord } from "@/lib/proof/types";
import { formatDate, formatStatus } from "@/lib/proof/format";

type EditAchievementPageProps = {
  params: Promise<{
    achievementId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-semibold text-[var(--text-primary)]"
    >
      {children}
    </label>
  );
}

function FieldHint({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
      {children}
    </p>
  );
}

function PrimarySubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#171512] bg-[#171512] px-6 py-3 text-sm font-semibold shadow-[var(--shadow-button)] transition hover:-translate-y-0.5 hover:bg-[#2a251f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:border-[#fffaf1] dark:bg-[#fffaf1] dark:hover:bg-[#eadfce]"
    >
      <span className="!text-[#fffaf1] dark:!text-[#171512]">
        {children}
      </span>
    </button>
  );
}

export default async function EditAchievementPage({
  params,
  searchParams,
}: EditAchievementPageProps) {
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

  const record = achievement as AchievementRecord;

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
                Edit record
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
              Dossier
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Record control
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Refine this proof record carefully.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
              Update the record details without changing its evidence ledger.
              ProofTrail records an audit event when important achievement
              details are changed.
            </p>
          </div>

          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Current record
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
              {record.title}
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                {formatStatus(record.verification_status)}
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                {record.category}
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
              Created {formatDate(record.created_at)}. Keep the record clear,
              factual, and easy to verify later.
            </p>
          </GlassCard>
        </header>

        <section className="grid gap-6 pb-16 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-4">
            <GlassCard className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Editing guide
              </p>

              <div className="mt-6 space-y-3">
                {[
                  [
                    "01",
                    "Preserve meaning",
                    "Do not make the title broader than the actual achievement.",
                  ],
                  [
                    "02",
                    "Keep visibility cautious",
                    "Private is safest while the record is still being refined.",
                  ],
                  [
                    "03",
                    "Strengthen context",
                    "Explain what happened, why it matters, and what it shows.",
                  ],
                  [
                    "04",
                    "Separate evidence",
                    "Files, links, and proof items are managed from the dossier.",
                  ],
                ].map(([number, title, description]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
                  >
                    <div className="flex gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] font-mono text-xs font-semibold text-[var(--text-muted)]">
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
                Audit note
              </p>

              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                Editing the record changes the private dossier, but it does not
                delete previous proof history or attached evidence.
              </p>
            </GlassCard>
          </aside>

          <GlassCard className="overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Edit archive entry
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
                Update structured record details.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                Keep the record precise. Evidence, proof identity, and public
                proof behavior remain managed separately from the dossier page.
              </p>

              {error ? (
                <div className="mt-8 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-sm text-[var(--danger)]">
                  <p className="font-semibold">Record could not be updated.</p>
                  <p className="mt-2 leading-7">{error}</p>
                </div>
              ) : null}
            </div>

            <form
              action={updateAchievement.bind(null, record.id)}
              className="space-y-7 p-8 sm:p-10"
            >
              <div>
                <FieldLabel htmlFor="title">Achievement title</FieldLabel>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={record.title}
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
                <FieldHint>
                  Keep the title specific and faithful to the actual record.
                </FieldHint>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <select
                    id="category"
                    name="category"
                    defaultValue={record.category}
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                  >
                    <option value="certificate">Certificate</option>
                    <option value="competition">Competition</option>
                    <option value="project">Project</option>
                    <option value="publication">Publication</option>
                    <option value="leadership">Leadership</option>
                    <option value="volunteering">Volunteering</option>
                    <option value="award">Award</option>
                    <option value="course">Course</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="visibility">Visibility</FieldLabel>
                  <select
                    id="visibility"
                    name="visibility"
                    defaultValue={record.visibility}
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                  >
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="public">Public</option>
                  </select>
                  <FieldHint>
                    Public proof cards only expose selected public evidence, but
                    private is safest while refining a record.
                  </FieldHint>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="issuer">Issuer / origin</FieldLabel>
                  <input
                    id="issuer"
                    name="issuer"
                    type="text"
                    defaultValue={record.issuer || ""}
                    placeholder="Self-built / school / event / organization"
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="achievementDate">
                    Achievement date
                  </FieldLabel>
                  <input
                    id="achievementDate"
                    name="achievementDate"
                    type="date"
                    defaultValue={record.achievement_date || ""}
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="description">Context</FieldLabel>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  defaultValue={record.description || ""}
                  placeholder="Describe what this record represents, how it happened, and why it matters."
                  className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
                <FieldHint>
                  Add background, role, learning, effort, and verification
                  context.
                </FieldHint>
              </div>

              <div>
                <FieldLabel htmlFor="impactSummary">Impact summary</FieldLabel>
                <textarea
                  id="impactSummary"
                  name="impactSummary"
                  rows={3}
                  defaultValue={record.impact_summary || ""}
                  placeholder="Summarize the outcome, effort, responsibility, contribution, or visible result."
                  className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-7">
                <PrimarySubmitButton>Save changes</PrimarySubmitButton>

                <Link
                  href={`/vault/${record.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </GlassCard>
        </section>
      </section>
    </main>
  );
}