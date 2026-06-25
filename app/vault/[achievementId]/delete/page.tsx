import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteAchievement } from "@/app/vault/[achievementId]/actions";
import { createClient } from "@/lib/supabase/server";
import {
  AchievementRecord,
  EvidenceItem,
  PublicProofLink,
} from "@/lib/proof/types";

type DeleteAchievementPageProps = {
  params: Promise<{
    achievementId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

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

  return (
    <main className="min-h-screen bg-[#08090d] px-6 py-10 text-white sm:px-10 lg:px-16">
      <section className="mx-auto max-w-3xl">
        <Link
          href={`/vault/${record.id}`}
          className="text-sm font-medium text-cyan-200"
        >
          ← Back to dossier
        </Link>

        <div className="mt-10 rounded-[2.5rem] border border-red-400/20 bg-red-400/[0.06] p-8 shadow-2xl shadow-black/30 sm:p-10">
          <p className="text-sm uppercase tracking-[0.22em] text-red-200/80">
            Destructive action
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
            Permanently remove this record?
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
  This action will permanently remove the achievement record from your
  private vault. Any attached evidence and active public proof identity will
  also be removed from active access.
</p>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/20 p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">
              Record scheduled for removal
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
              {record.title}
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/35">Evidence items</p>
                <p className="mt-2 text-2xl font-semibold">
                  {evidence.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/35">Proof identity</p>
                <p className="mt-2 text-sm font-semibold">
                  {proofLink ? proofLink.proof_code : "Not generated"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/35">Visibility</p>
                <p className="mt-2 text-sm font-semibold">
                  {record.visibility}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-red-400/20 bg-black/20 p-5">
  <p className="text-sm font-medium text-red-100">
    This is a permanent vault action.
  </p>
  <p className="mt-2 text-sm leading-7 text-white/45">
    Continue only if this record was created by mistake, duplicated, or no
    longer belongs in your proof archive. This does not affect your account.
  </p>
</div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <form action={deleteAchievement.bind(null, record.id)}>
              <button
                type="submit"
                className="w-full rounded-full bg-red-200 px-6 py-3 text-sm font-semibold text-black transition hover:bg-red-100 sm:w-auto"
              >
                Remove record permanently
              </button>
            </form>

            <Link
              href={`/vault/${record.id}`}
              className="inline-flex justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06] hover:text-white"
            >
              Keep record
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}