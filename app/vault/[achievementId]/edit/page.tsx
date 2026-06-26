import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { updateAchievement } from "@/app/vault/[achievementId]/actions";
import { createClient } from "@/lib/supabase/server";
import { AchievementRecord } from "@/lib/proof/types";

type EditAchievementPageProps = {
  params: Promise<{
    achievementId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

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
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--text-primary)] sm:px-10 lg:px-16">
      <section className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/vault/${record.id}`}
            className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
          >
            ← Back to dossier
          </Link>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Edit record
          </p>
        </div>

        <GlassCard className="mt-10 p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Record control
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Refine this proof record.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
            Update the record carefully. ProofTrail records an audit event when
            important achievement details are changed.
          </p>

          {error ? (
            <div className="mt-8 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-sm text-[var(--danger)]">
              <p className="font-semibold">Record could not be updated.</p>
              <p className="mt-2 leading-7">{error}</p>
            </div>
          ) : null}

          <form
            action={updateAchievement.bind(null, record.id)}
            className="mt-10 space-y-7"
          >
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
                defaultValue={record.title}
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
                <label
                  htmlFor="visibility"
                  className="text-sm font-semibold text-[var(--text-secondary)]"
                >
                  Visibility
                </label>
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
                <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                  Public proof cards only expose selected public evidence, but
                  private is safest while refining a record.
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
                  defaultValue={record.issuer || ""}
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
                  defaultValue={record.achievement_date || ""}
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
                defaultValue={record.description || ""}
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
                defaultValue={record.impact_summary || ""}
                placeholder="Summarize the outcome, effort, responsibility, contribution, or visible result."
                className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                className="rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-semibold text-[var(--background)] shadow-[var(--shadow-soft)] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                Save changes
              </button>

              <Link
                href={`/vault/${record.id}`}
                className="inline-flex justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
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