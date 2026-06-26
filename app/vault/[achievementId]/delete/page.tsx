import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
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
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--text-primary)] sm:px-10 lg:px-16">
      <section className="mx-auto max-w-3xl">
        <Link
          href={`/vault/${record.id}`}
          className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
        >
          ← Back to dossier
        </Link>

        <GlassCard className="mt-10 border-[var(--danger-border)] bg-[var(--surface)] p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--danger)]">
            Destructive action
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Permanently remove this record?
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
            This will permanently remove the achievement record from your
            private vault. Attached evidence and any active public proof access
            connected to this record will also be removed.
          </p>

          {error ? (
            <div className="mt-8 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-sm text-[var(--danger)]">
              <p className="font-semibold">Record could not be removed.</p>
              <p className="mt-2 leading-7">{error}</p>
            </div>
          ) : null}

          <div className="mt-8 rounded-[2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Record selected for removal
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              {record.title}
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs text-[var(--text-muted)]">
                  Evidence items
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                  {evidence.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs text-[var(--text-muted)]">
                  Proof identity
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                  {proofLink ? proofLink.proof_code : "Private only"}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs text-[var(--text-muted)]">Visibility</p>
                <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                  {record.visibility}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5">
            <p className="text-sm font-semibold text-[var(--danger)]">
              This action cannot be undone from the app.
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              Continue only if this record was created by mistake, duplicated,
              or no longer belongs in your proof archive. Your account and other
              vault records will not be affected.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <form action={deleteAchievement.bind(null, record.id)}>
              <button
                type="submit"
                className="w-full rounded-full border border-[var(--danger-border)] bg-[var(--danger)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto"
              >
                Remove record permanently
              </button>
            </form>

            <Link
              href={`/vault/${record.id}`}
              className="inline-flex justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              Keep record
            </Link>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}