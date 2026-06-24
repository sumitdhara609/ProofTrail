import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AchievementRecord } from "@/lib/proof/types";

function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function VaultPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: achievements, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const records = (achievements || []) as AchievementRecord[];

  return (
    <main className="min-h-screen bg-[#08090d] px-6 py-10 text-white sm:px-10 lg:px-16">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
              Vault
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
              Your achievement records.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
              Create structured records first. Then attach evidence, generate
              proof cards, and control how each record is shared.
            </p>
          </div>

          <Link
            href="/vault/new"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            New record
          </Link>
        </div>

        {records.length === 0 ? (
          <div className="mt-14 rounded-[2.5rem] border border-dashed border-white/15 bg-white/[0.025] p-10 text-center">
            <p className="text-sm uppercase tracking-[0.22em] text-white/35">
              Empty vault
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
              Start with one record worth preserving.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/50">
              Your first record could be a project, certificate, publication,
              competition, leadership role, or award.
            </p>
            <Link
              href="/vault/new"
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Create first record
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-4">
            {records.map((record) => (
              <Link
                key={record.id}
                href={`/vault/${record.id}`}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 transition hover:border-cyan-300/25 hover:bg-white/[0.055]"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-3">
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                        {formatStatus(record.verification_status)}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/50">
                        {record.visibility}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/50">
                        {record.category}
                      </span>
                    </div>

                    <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white">
                      {record.title}
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-white/50">
                      {record.description || "No context added yet."}
                    </p>
                  </div>

                  <span className="text-sm font-medium text-white/35 transition group-hover:text-cyan-200">
                    Open →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}