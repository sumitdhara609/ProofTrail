import { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { createClient } from "@/lib/supabase/server";
import { AddEvidenceForm } from "@/components/vault/AddEvidenceForm";
import {
  deactivatePublicProofLink,
  generatePublicProofLink,
} from "@/app/vault/[achievementId]/actions";
import { generateQrDataUrl } from "@/lib/qr/generate";
import {
  AchievementRecord,
  AuditLog,
  EvidenceItem,
  PublicProofLink,
} from "@/lib/proof/types";
import {
  getAuditActionDescription,
  getAuditActionLabel,
} from "@/lib/proof/audit-labels";
import {
  formatDate,
  formatDateTime,
  formatEvidenceType,
  formatStatus,
} from "@/lib/proof/format";

type AchievementPageProps = {
  params: Promise<{
    achievementId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

function formatErrorMessage(error: string) {
  const messages: Record<string, string> = {
    "record-not-found": "This achievement record could not be found.",
    "evidence-not-found": "The selected evidence item could not be found.",
    "active-proof-link-not-found":
      "No active public proof link was found for this record.",
    "media-public-review-required":
      "Please review and confirm the media-public warning before making this evidence public.",
  };

  return (
    messages[error] ||
    error.replaceAll("-", " ").replace(/^./, (char) => char.toUpperCase())
  );
}

function DossierMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
        {detail}
      </p>
    </div>
  );
}

function PrimaryFormButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex w-full justify-center rounded-full border border-[#171512] bg-[#171512] px-5 py-3 text-sm font-semibold shadow-[var(--shadow-button)] transition hover:-translate-y-0.5 hover:bg-[#2a251f] dark:border-[#fffaf1] dark:bg-[#fffaf1] dark:hover:bg-[#eadfce]"
    >
      <span className="!text-[#fffaf1] dark:!text-[#171512]">
        {children}
      </span>
    </button>
  );
}

function PrimaryExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-full justify-center rounded-full border border-[#171512] bg-[#171512] px-5 py-3 text-sm font-semibold shadow-[var(--shadow-button)] transition hover:-translate-y-0.5 hover:bg-[#2a251f] dark:border-[#fffaf1] dark:bg-[#fffaf1] dark:hover:bg-[#eadfce]"
    >
      <span className="!text-[#fffaf1] dark:!text-[#171512]">
        {children}
      </span>
    </a>
  );
}

export default async function AchievementPage({
  params,
  searchParams,
}: AchievementPageProps) {
  const { achievementId } = await params;
  const { error: pageError } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: achievement, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", achievementId)
    .eq("user_id", user.id)
    .single();

  if (error || !achievement) {
    notFound();
  }

  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("achievement_id", achievementId)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: evidenceItems } = await supabase
    .from("evidence_items")
    .select("*")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: proofLinksData } = await supabase
    .from("public_proof_links")
    .select("*")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const proofLinkData =
    proofLinksData?.find((link) => link.is_active === true) || null;

  const record = achievement as AchievementRecord;
  const logs = (auditLogs || []) as AuditLog[];
  const evidence = (evidenceItems || []) as EvidenceItem[];
  const proofLinks = (proofLinksData || []) as PublicProofLink[];
  const proofLink = proofLinkData as PublicProofLink | null;

  const publicEvidenceCount = evidence.filter((item) => item.is_public).length;
  const mediaEvidenceCount = evidence.filter((item) =>
    Boolean(item.file_path)
  ).length;

  const qrDataUrl = proofLink?.qr_target_url
    ? await generateQrDataUrl(proofLink.qr_target_url)
    : null;

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
                Record dossier
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

            <SecondaryButton
              href={`/vault/${record.id}/edit`}
              className="hidden sm:inline-flex"
            >
              Edit record
            </SecondaryButton>
          </div>
        </nav>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/vault"
            className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
          >
            ← Back to vault archive
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            <span>Created {formatDate(record.created_at)}</span>
            <span>•</span>
            <span>Updated {formatDate(record.updated_at)}</span>
          </div>
        </div>

        {pageError ? (
          <div className="mt-6 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-sm text-[var(--danger)]">
            <p className="font-semibold">Action could not be completed.</p>
            <p className="mt-2 leading-7">{formatErrorMessage(pageError)}</p>
          </div>
        ) : null}

        <header className="grid gap-6 py-10 lg:grid-cols-[1fr_0.72fr] lg:items-stretch lg:py-12">
          <GlassCard className="overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Record dossier
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  {formatStatus(record.verification_status)}
                </span>

                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                  {record.visibility}
                </span>

                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                  {record.category}
                </span>
              </div>

              <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                {record.title}
              </h1>

              <p className="mt-6 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
                {record.description ||
                  "No context has been added yet. Add the background, effort, and circumstances behind this record."}
              </p>
            </div>

            <div className="grid gap-4 p-8 sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
              <DossierMetric
                label="Evidence"
                value={evidence.length}
                detail="Attached support items"
              />

              <DossierMetric
                label="Media"
                value={mediaEvidenceCount}
                detail="Uploaded files or certificates"
              />

              <DossierMetric
                label="Public"
                value={publicEvidenceCount}
                detail="Visible on proof pages"
              />

              <DossierMetric
                label="Proof ID"
                value={proofLink ? "Active" : "Private"}
                detail={proofLink ? proofLink.proof_code : "No public identity"}
              />
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Proof identity
              </p>

              {proofLink ? (
                <>
                  <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
                    Public proof access is active.
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                    This record has an active ProofTrail ID and QR-backed public
                    proof card. You can withdraw public access without deleting
                    the private record.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)]">
                    Private record only.
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                    Generate a ProofTrail ID only when the record, evidence, and
                    public visibility are ready for controlled sharing.
                  </p>
                </>
              )}
            </div>

            <div className="flex-1 p-7">
              {proofLink ? (
                <>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      ProofTrail ID
                    </p>

                    <p className="mt-2 font-mono text-lg font-semibold text-[var(--text-primary)]">
                      {proofLink.proof_code}
                    </p>
                  </div>

                  {qrDataUrl ? (
                    <div className="mt-5 flex justify-center rounded-2xl border border-[var(--border)] bg-white p-5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrDataUrl}
                        alt={`QR code for ${proofLink.proof_code}`}
                        className="h-40 w-40"
                      />
                    </div>
                  ) : null}

                  <div className="mt-5 space-y-3">
                    <PrimaryExternalLink href={`/proof/${proofLink.public_slug}`}>
                      Open public proof
                    </PrimaryExternalLink>

                    <form
                      action={deactivatePublicProofLink.bind(null, record.id)}
                    >
                      <button
                        type="submit"
                        className="w-full rounded-full border border-[var(--danger-border)] bg-[var(--danger-soft)] px-5 py-3 text-sm font-semibold text-[var(--danger)] transition hover:border-[var(--danger)]"
                      >
                        Withdraw public proof
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <form action={generatePublicProofLink.bind(null, record.id)}>
                  <PrimaryFormButton>Generate proof identity</PrimaryFormButton>
                </form>
              )}
            </div>
          </GlassCard>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Record details
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Issuer / origin
                </p>

                <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                  {record.issuer || "Not added"}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Achievement date
                </p>

                <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                  {formatDate(record.achievement_date)}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Impact
              </p>

              <p className="mt-3 text-sm leading-8 text-[var(--text-secondary)]">
                {record.impact_summary ||
                  "No impact summary has been added yet. Add what this achievement changed, demonstrated, or contributed."}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <SecondaryButton href={`/vault/${record.id}/edit`}>
                Edit record
              </SecondaryButton>

              <Link
                href={`/vault/${record.id}/delete`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--danger-border)] bg-[var(--danger-soft)] px-6 py-3 text-sm font-semibold text-[var(--danger)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--danger)]"
              >
                Delete record
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Evidence intake
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
              Attach supporting evidence.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              Add source links, certificates, publications, project pages, or
              supporting references that strengthen this record.
            </p>

            <AddEvidenceForm achievementId={record.id} />
          </GlassCard>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Evidence ledger
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
                  Attached evidence.
                </h2>
              </div>

              <p className="text-sm text-[var(--text-muted)]">
                {evidence.length} item{evidence.length === 1 ? "" : "s"}
              </p>
            </div>

            {evidence.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  No evidence has been attached yet.
                </p>

                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Add a source link, project page, publication, certificate, or
                  supporting note to strengthen this record before sharing it.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {evidence.map((item, index) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]"
                  >
                    <div className="grid gap-0 sm:grid-cols-[5rem_1fr]">
                      <div className="border-b border-[var(--border)] bg-[var(--surface)] p-5 sm:border-b-0 sm:border-r">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          Item
                        </p>

                        <p className="mt-2 font-mono text-xl font-semibold text-[var(--text-primary)]">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                      </div>

                      <div className="p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">
                              {item.title}
                            </p>

                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                              {formatEvidenceType(item.evidence_type)}
                            </p>
                          </div>

                          <span
                            className={
                              item.is_public
                                ? "w-fit rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]"
                                : "w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]"
                            }
                          >
                            {item.is_public ? "Public" : "Private"}
                          </span>
                        </div>

                        {item.description ? (
                          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                            {item.description}
                          </p>
                        ) : null}

                        {item.file_name ? (
                          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                              Media evidence
                            </p>

                            <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                              {item.file_name}
                            </p>
                          </div>
                        ) : null}

                        <div className="mt-4 flex flex-wrap items-center gap-4">
                          <Link
                            href={`/vault/${record.id}/evidence/${item.id}/edit`}
                            className="inline-flex text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                          >
                            Edit evidence →
                          </Link>

                          {item.source_url ? (
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                            >
                              Open source →
                            </a>
                          ) : null}

                          <Link
                            href={`/vault/${record.id}/evidence/${item.id}/delete`}
                            className="inline-flex text-sm font-semibold text-[var(--danger)] transition hover:opacity-80"
                          >
                            Remove evidence
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Trust timeline
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
              Audit activity.
            </h2>

            {logs.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  No trust activity recorded yet.
                </p>

                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Evidence changes, record edits, proof generation, and proof
                  withdrawal events will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {logs.map((log, index) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text-muted)]">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {getAuditActionLabel(log.action)}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                          {getAuditActionDescription(log.action)}
                        </p>

                        <p className="mt-3 text-xs text-[var(--text-muted)]">
                          {formatDateTime(log.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </section>

        {proofLinks.length > 0 ? (
          <section className="pb-16 pt-6">
            <GlassCard className="p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Proof history
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
                Previous proof identities.
              </h2>

              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                {proofLinks.map((link) => (
                  <div
                    key={link.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                          {link.proof_code}
                        </p>

                        <p className="mt-2 text-xs text-[var(--text-muted)]">
                          Created {formatDateTime(link.created_at)}
                        </p>

                        {link.revoked_at ? (
                          <p className="mt-1 text-xs text-[var(--danger)]">
                            Withdrawn {formatDateTime(link.revoked_at)}
                          </p>
                        ) : null}
                      </div>

                      <span
                        className={
                          link.is_active
                            ? "w-fit rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]"
                            : "w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]"
                        }
                      >
                        {link.is_active ? "Active" : "Withdrawn"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>
        ) : null}
      </section>
    </main>
  );
}