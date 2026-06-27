import { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
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

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
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

function FieldHint({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
      {children}
    </p>
  );
}

function PrimarySubmitButton({ children }: { children: ReactNode }) {
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
                Edit evidence
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <SecondaryButton href="/vault" className="hidden sm:inline-flex">
              Vault
            </SecondaryButton>

            <SecondaryButton href={`/vault/${achievementId}`}>
              Dossier
            </SecondaryButton>
          </div>
        </nav>

        <div className="mt-8">
          <Link
            href={`/vault/${achievementId}`}
            className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
          >
            ← Back to record dossier
          </Link>
        </div>

        <header className="grid gap-8 py-10 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:py-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Evidence control
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Refine one evidence item carefully.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
              Update the title, type, source, note, and public visibility for
              this evidence item. Uploaded media remains attached unless the
              evidence item is removed.
            </p>
          </div>

          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Parent record
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
              {achievement.title}
            </h2>

            <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
              Evidence should clearly support this specific record. Keep public
              visibility cautious until the proof presentation is reviewed.
            </p>
          </GlassCard>
        </header>

        <section className="grid gap-6 pb-16 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-4">
            <GlassCard className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Evidence summary
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Current title
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                    {evidence.title}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Current type
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                    {formatEvidenceType(evidence.evidence_type)}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Visibility
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                    {evidence.is_public ? "Public" : "Private"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Media attachment
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                    {hasMediaFile ? evidence.file_name || "Attached" : "None"}
                  </p>
                </div>

                {evidence.file_mime_type ? (
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      File type
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      {evidence.file_mime_type}
                    </p>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Added
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                    {formatDateTime(evidence.created_at)}
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="border-[var(--danger-border)] bg-[var(--danger-soft)] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--danger)]">
                Public safety
              </p>

              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                For certificates and award moments, keep evidence private until
                the certificate frame, description, and public proof
                presentation are reviewed deliberately.
              </p>
            </GlassCard>
          </aside>

          <GlassCard className="overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Edit evidence item
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
                Update evidence details.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                Only selected public evidence appears on proof pages. Private
                evidence remains hidden inside your vault.
              </p>
            </div>

            <form
              action={updateEvidenceItem.bind(
                null,
                achievementId,
                evidenceItemId
              )}
              className="space-y-7 p-8 sm:p-10"
            >
              <div>
                <FieldLabel htmlFor="evidenceType">Evidence type</FieldLabel>
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
                <FieldLabel htmlFor="title">Evidence title</FieldLabel>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={evidence.title}
                  placeholder="Certificate page / Published article / Award photo"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
                <FieldHint>
                  Use a title that explains what this evidence proves.
                </FieldHint>
              </div>

              <div>
                <FieldLabel htmlFor="sourceUrl">Source URL</FieldLabel>
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
                <FieldHint>
                  Optional. Use this for official pages, publication links,
                  project references, or public sources.
                </FieldHint>
              </div>

              <div>
                <FieldLabel htmlFor="description">Evidence note</FieldLabel>
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

                    <p className="mt-2 leading-6 text-[var(--text-secondary)]">
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
                  <FieldHint>
                    Only selected public evidence is shown on public proof
                    pages. Private evidence stays hidden inside the vault.
                  </FieldHint>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-7">
                <PrimarySubmitButton>Save evidence changes</PrimarySubmitButton>

                <Link
                  href={`/vault/${achievementId}`}
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