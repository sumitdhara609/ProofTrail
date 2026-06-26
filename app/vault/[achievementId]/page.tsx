import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
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
                    </