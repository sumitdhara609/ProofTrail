import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const fullName = user.user_metadata?.full_name || "ProofTrail user";

  return (
    <main className="min-h-screen bg-[#08090d] px-6 py-10 text-white sm:px-10 lg:px-16">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
              Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
              Welcome, {fullName}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
              Your verification command center will soon show vault health,
              proof cards, evidence records, and recent audit activity.
            </p>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-sm text-white/40">Achievement records</p>
            <p className="mt-3 text-3xl font-semibold">0</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-sm text-white/40">Public proof cards</p>
            <p className="mt-3 text-3xl font-semibold">0</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-sm text-white/40">Evidence items</p>
            <p className="mt-3 text-3xl font-semibold">0</p>
          </div>
        </div>
      </section>
    </main>
  );
}