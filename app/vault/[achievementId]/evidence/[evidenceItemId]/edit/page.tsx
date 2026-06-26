import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/server";
import { updateEvidenceItem } from "@/app/vault/[achievementId]/actions";
import { EvidenceItem } from "@/lib/proof/types";
import { formatDateTime, formatEvidenceType } from "@/lib/proof/format";

type EditEvidencePageProps = {
  params: Promise<{
    achievementId: string;
    evidenceItemId: string;
  }>;
};

const evidenceTypes = [
  "certificate",
  "document",
  "image",
  "project_link",
  "publication_link",
  "social_post",
  "letter",
  "other",
];

export default async function EditEvidencePage({
  params,
}: EditEvidencePageProps) {
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
  const requiresPublicMediaReview = hasMediaFile && !evidence.is_public;

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
          <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Edit evidence item
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl">
              Refine evidence details.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--text-secondary)]">
              Update the title, type, source, note, and public visibility for
              this evidence item. Uploaded media files remain attached unless
              the evidence item is removed.
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_0.85fr]">
            <form
              action={updateEvidenceItem.bind(
                null,
                achievementId,
                evidenceItemId
              )}
              className="space-y-6 p-8 sm:p-10"
            >
              <div>
                <label
                  htmlFor="evidenceType"
                  className="text-sm font-semibold text-[var(--text-secondary)]"
                >
                  Evidence type
                </label>
                <select
                  id="evidenceType"
                  name="evidenceType"
                  defaultValue={evidence.evidence_type}
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                >
                  {evidenceTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatEvidenceType(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="text-sm font-semibold text-[var(--text-secondary)]"
                >
                  Evidence title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={evidence.title}
                  placeholder="Certificate page / Published article / Award photo"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label
                  htmlFor="sourceUrl"
                  className="text-sm font-semibold text-[var(--text-secondary)]"
                >
                  Source URL
                </label>
                <input
                  id="sourceUrl"
                  name="sourceUrl"
                  type="url"
                  inputMode="url"
                  defaultValue={evidence.source_url || ""}
                  placeholder="https://..."
                  title="Enter a valid URL beginning with http:// or https://"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] invalid:border-[var(--danger-border)] focus:border-[var(--accent)]"
                />
                <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                  Optional. Use this when the evidence has a public source,
                  official page, publication link, or project reference.
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-[var(--text-secondary)]"
                >
                  Evidence note
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  defaultValue={evidence.description || ""}
                  placeholder="Briefly explain what this evidence proves and why it matters."
                  className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <label className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                  <input
                    name="isPublic"
                    type="checkbox"
                    defaultChecked={evidence.is_public}
                    className="mt-1 h-4 w-4 rounded border-[var(--border)] bg-[var(--surface)] accent-[var(--accent)]"
                  />
                  <span>
                    Allow this evidence to appear on public proof cards when the
                    record is shared.
                  </span>
                </label>

                {hasMediaFile ? (
                  <div className="mt-4 rounded-xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger)]">
                    <p className="font-semibold">
                      Review before making media public.
                    </p>

                    <p className="mt-2 leading-6">
                      This evidence has an uploaded file attached. If you mark
                      it public, that media may appear on the public proof page
                      through a temporary signed preview link.
                    </p>

                    {requiresPublicMediaReview ? (
                      <label className="mt-4 flex items-start gap-3 rounded-xl border border-[var(--danger-border)] bg-[var(--surface)] p-4 text-[var(--danger)]">
                        <input
                          name="publicMediaReviewed"
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-[var(--danger-border)] accent-[var(--danger)]"
                        />
                        <span className="text-sm leading-6">
                          I have reviewed this media and understand it may
                          appear on the public proof page if I make this
                          evidence public.
                        </span>
                      </label>
                    ) : (
                      <p className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
                        This media evidence is already public. Keep it checked
                        only if it should continue appearing on public proof
                        pages.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
                    Only selected public evidence is shown on public proof
                    pages. Private evidence stays hidden inside the vault.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-semibold text-[var(--background)] shadow-[var(--shadow-soft)] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                >
                  Save evidence changes
                </button>

                <Link
                  href={`/vault/${achievementId}`}
                  className="inline-flex justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </Link>
              </div>
            </form>

            <aside className="border-t border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10 lg:border-l lg:border-t-0">
              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Evidence summary
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Parent record
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      {achievement.title}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Current visibility
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      {evidence.is_public ? "Public" : "Private"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Media attachment
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      {hasMediaFile ? evidence.file_name || "Attached" : "None"}
                    </p>
                  </div>

                  {evidence.file_mime_type ? (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                        File type
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                        {evidence.file_mime_type}
                      </p>
                    </div>
                  ) : null}

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Added
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      {formatDateTime(evidence.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[2rem] border border-[var(--danger-border)] bg-[var(--danger-soft)] p-6 text-[var(--danger)] shadow-[var(--shadow-soft)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                  Public safety
                </p>

                <p className="mt-4 text-sm leading-7">
                  For certificates and award moments, keep evidence private
                  until the certificate frame, description, and public proof
                  presentation are reviewed deliberately.
                </p>
              </div>
            </aside>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}