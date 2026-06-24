import Link from "next/link";
import { redirect } from "next/navigation";
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
    <main className="min-h-screen bg-[#08090d] px-6 py-10 text-white sm:px-10 lg:px-16">
      <section className="mx-auto max-w-4xl">
        <Link href="/vault" className="text-sm font-medium text-cyan-200">
          ← Back to vault
        </Link>

        <div className="mt-10 rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/30 sm:p-10">
          <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
            New record
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
            Create an achievement record.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
            Start with the core claim. Evidence, QR identity, and public proof
            controls will be added after the record exists.
          </p>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <form action={createAchievement} className="mt-10 space-y-7">
            <div>
              <label htmlFor="title" className="text-sm font-medium text-white/70">
                Achievement title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="ChronoForge MVP Completion"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-white/70"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue="project"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
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
                  className="text-sm font-medium text-white/70"
                >
                  Visibility
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  defaultValue="private"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
                >
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="issuer"
                  className="text-sm font-medium text-white/70"
                >
                  Issuer / organization
                </label>
                <input
                  id="issuer"
                  name="issuer"
                  type="text"
                  placeholder="Self-built / KIIT / School / Event name"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40"
                />
              </div>

              <div>
                <label
                  htmlFor="achievementDate"
                  className="text-sm font-medium text-white/70"
                >
                  Achievement date
                </label>
                <input
                  id="achievementDate"
                  name="achievementDate"
                  type="date"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium text-white/70"
              >
                Context
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe what this achievement represents and why it matters."
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40"
              />
            </div>

            <div>
              <label
                htmlFor="impactSummary"
                className="text-sm font-medium text-white/70"
              >
                Impact summary
              </label>
              <textarea
                id="impactSummary"
                name="impactSummary"
                rows={3}
                placeholder="Summarize the outcome, effort, responsibility, or measurable impact."
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40"
              />
            </div>

            <button
              type="submit"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Create record
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}