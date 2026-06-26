import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/server";
import { deleteEvidenceItem } from "@/app/vault/[achievementId]/actions";
import { EvidenceItem } from "@/lib/proof/types";
import {
  formatDateTime,
  formatEvidenceType,
} from "@/lib/proof/format";

type DeleteEvidencePageProps = {
  params: Promise<{
    achievementId: string;
    evidenceItemId: string;
  }>;
};

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
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--text-primary)] sm:px-10 lg:px-16">
      <section className="mx-auto max-w-4xl">
        <Link
          href={`/vault/${achievementId}`}
          className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
        >
          ← Back to record dossier
        </Link>

        <GlassCard className="mt-8 overflow-hidden rounded-[2.5rem]">
          <div className="border-b border-[var(--danger-border)] bg-[var(--danger-soft)] p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--danger)]">
              Delete evidence
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl">
              Remove this evidence item?
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--text-secondary)]">
              This action will permanently remove the evidence from this record.
              If the evidence has an uploaded media file, the private storage
              object will also be removed.
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_0.85fr]">
            <div className="p-8 sm:p-10">
              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Evidence item
                </p>

                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                  {evidence.title}
                </h2>

                {evidence.description ? (
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                    {evidence.description}
                  </p>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                    No evidence note was added.
                  </p>
                )}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Type
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      {formatEvidenceType(evidence.evidence_type)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Visibility
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      {evidence.is_public ? "Public" : "Private"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Source URL
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold text-[var(--text-primary)]">
                      {evidence.source_url || "None"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Added
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      {formatDateTime(evidence.created_at)}
                    </p>
                  </div>
                </div>

                {hasMediaFile ? (
                  <div className="mt-6 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-[var(--danger)]">
                    <p className="text-sm font-semibold">
                      Media file will also be deleted.
                    </p>

                    <p className="mt-2 text-sm leading-7">
                      This evidence has an uploaded file attached:{" "}
                      <span className="font-semibold">
                        {evidence.file_name || "Attached media"}
                      </span>
                      . Deleting this evidence will remove the file from the
                      private storage bucket.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <form
                  action={deleteEvidenceItem.bind(
                    null,
                    achievementId,
                    evidenceItemId
                  )}
                >
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-full border border-[var(--danger-border)] bg-[var(--danger)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:opacity-90 sm:w-auto"
                  >
                    Yes, delete evidence
                  </button>
                </form>

                <Link
                  href={`/vault/${achievementId}`}
                  className="inline-flex justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </Link>
              </div>
            </div>

            <aside className="border-t border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10 lg:border-l lg:border-t-0">
              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Parent record
                </p>

                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                  {achievement.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  This evidence item belongs to the record above. The record
                  itself will not be deleted, only this selected evidence item.
                </p>
              </div>

              <div className="mt-5 rounded-[2rem] border border-[var(--danger-border)] bg-[var(--danger-soft)] p-6 text-[var(--danger)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                  Permanent action
                </p>

                <p className="mt-4 text-sm leading-7">
                  Use deletion only when the evidence is incorrect, duplicated,
                  outdated, or should no longer remain in the vault.
                </p>
              </div>
            </aside>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}