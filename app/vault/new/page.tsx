import Link from "next/link";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { createAchievement } from "@/app/vault/actions";
import { createClient } from "@/lib/supabase/server";

type NewAchievementPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

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
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--text-primary)] sm:px-10 lg:px-16">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/vault"
          className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
        >
          ← Back to vault
        </Link>

        <GlassCard className="mt-10 p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            New record
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Create a structured proof record.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
            Start with the core achievement details. Evidence, audit history,
            proof identity, and QR-backed public access can be managed after the
            record is created.
          </p>

          {error ? (
            <div className="mt-8 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-sm text-[var(--danger)]">
              <p className="font-semibold">Record could not be created.</p>
              <p className="mt-2 leading-7">{error}</p>
            </div>
          ) : null}

          <form action={createAchievement} className="mt-10 space-y-7">
            <div>
              <label
                htmlFor="title"
                className="text-sm font-semibold text-[var(--text-secondary)]"
              >
                Achievement title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Product build milestone"
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="text-sm font-semibold text-[var(--text-secondary)]"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue="project"
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
                <label
                  htmlFor="visibility"
                  className="text-sm font-semibold text-[var(--text-secondary)]"
                >
                  Visibility
                </label>
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
                <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                  Private is safest while the record is still being prepared.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="issuer"
                  className="text-sm font-semibold text-[var(--text-secondary)]"
                >
                  Issuer / origin
                </label>
                <input
                  id="issuer"
                  name="issuer"
                  type="text"
                  placeholder="Self-built / school / event / organization"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label
                  htmlFor="achievementDate"
                  className="text-sm font-semibold text-[var(--text-secondary)]"
                >
                  Achievement date
                </label>
                <input
                  id="achievementDate"
                  name="achievementDate"
                  type="date"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-semibold text-[var(--text-secondary)]"
              >
                Context
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe what this record represents, how it happened, and why it matters."
                className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="impactSummary"
                className="text-sm font-semibold text-[var(--text-secondary)]"
              >
                Impact summary
              </label>
              <textarea
                id="impactSummary"
                name="impactSummary"
                rows={3}
                placeholder="Summarize the outcome, effort, responsibility, contribution, or visible result."
                className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-semibold text-[var(--background)] shadow-[var(--shadow-soft)] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                Create record
              </button>

              <Link
                href="/vault"
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </Link>
            </div>
          </form>
        </GlassCard>
      </section>
    </main>
  );
}