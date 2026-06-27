import Link from "next/link";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { createAchievement } from "@/app/vault/actions";
import { createClient } from "@/lib/supabase/server";

type NewAchievementPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
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

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
      {children}
    </p>
  );
}

function PrimarySubmitButton({ children }: { children: React.ReactNode }) {
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

export default async function NewAchievementPage({
  searchParams,
}: NewAchievementPageProps) {
  const { error } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

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
                New record
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <SecondaryButton href="/vault">Vault</SecondaryButton>
          </div>
        </nav>

        <div className="mt-8">
          <Link
            href="/vault"
            className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
          >
            ← Back to vault archive
          </Link>
        </div>

        <header className="grid gap-8 py-10 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:py-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Create proof record
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Add one achievement with context before evidence.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
              Start with the core achievement details. Evidence, audit history,
              proof identity, and QR-backed public access can be managed after
              the record is created.
            </p>
          </div>

          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Record principle
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
              Private first. Public only after review.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              Keep visibility private while preparing your certificate,
              project, publication, award, leadership role, or course evidence.
            </p>
          </GlassCard>
        </header>

        <section className="grid gap-6 pb-16 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-4">
            <GlassCard className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Entry flow
              </p>

              <div className="mt-6 space-y-3">
                {[
                  [
                    "01",
                    "Identity",
                    "Title, category, visibility, issuer, and date.",
                  ],
                  [
                    "02",
                    "Context",
                    "Why the achievement matters and what it represents.",
                  ],
                  [
                    "03",
                    "Impact",
                    "Outcome, effort, contribution, or visible result.",
                  ],
                  [
                    "04",
                    "Evidence later",
                    "Attach certificates, links, files, or supporting proof.",
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
                Best practice
              </p>

              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                Use clear titles and honest context. A record becomes powerful
                later when the evidence ledger supports the story without
                needing exaggeration.
              </p>
            </GlassCard>
          </aside>

          <GlassCard className="overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                New archive entry
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
                Create a structured proof record.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                Fill the foundation carefully. You can add evidence and generate
                public proof identity later from the record dossier.
              </p>

              {error ? (
                <div className="mt-8 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-sm text-[var(--danger)]">
                  <p className="font-semibold">Record could not be created.</p>
                  <p className="mt-2 leading-7">{error}</p>
                </div>
              ) : null}
            </div>

            <form action={createAchievement} className="space-y-7 p-8 sm:p-10">
              <div>
                <FieldLabel htmlFor="title">Achievement title</FieldLabel>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Certificate of Training in C, C++, Java, and Python"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
                <FieldHint>
                  Make the title specific enough that the record is easy to
                  recognize later.
                </FieldHint>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <select
                    id="category"
                    name="category"
                    defaultValue="certificate"
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
                    defaultValue="private"
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                  >
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="public">Public</option>
                  </select>
                  <FieldHint>
                    Private is safest while the record is still being prepared.
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
                    placeholder="Lalani Computer Academy Pvt. Ltd."
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
                  placeholder="Describe what this record represents, how it happened, and why it matters."
                  className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
                <FieldHint>
                  Add the background, learning, role, or circumstances behind
                  the achievement.
                </FieldHint>
              </div>

              <div>
                <FieldLabel htmlFor="impactSummary">Impact summary</FieldLabel>
                <textarea
                  id="impactSummary"
                  name="impactSummary"
                  rows={3}
                  placeholder="Summarize the outcome, effort, responsibility, contribution, or visible result."
                  className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-7">
                <PrimarySubmitButton>Create record</PrimarySubmitButton>

                <Link
                  href="/vault"
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