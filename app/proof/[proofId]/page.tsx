import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { CertificateFrame } from "@/components/certificates/CertificateFrame";
import { createClient } from "@/lib/supabase/server";
import { generateQrDataUrl } from "@/lib/qr/generate";
import {
  AchievementRecord,
  EvidenceItem,
  PublicProofLink,
} from "@/lib/proof/types";
import {
  formatDate,
  formatEvidenceType,
  formatStatus,
} from "@/lib/proof/format";

type PublicProofPageProps = {
  params: Promise<{
    proofId: string;
  }>;
};

type ProofUnavailableReason =
  | "invalid"
  | "withdrawn"
  | "record-unavailable"
  | "not-public";

type PublicEvidenceWithMediaPreview = EvidenceItem & {
  mediaPreviewUrl: string | null;
  mediaPreviewKind: "image" | "pdf" | "file" | null;
};

function getUnavailableCopy(reason: ProofUnavailableReason) {
  const copy: Record<
    ProofUnavailableReason,
    {
      label: string;
      title: string;
      description: string;
    }
  > = {
    invalid: {
      label: "Proof unavailable",
      title: "This proof identity could not be found.",
      description:
        "The ProofTrail ID may be incorrect, withdrawn, inactive, or no longer connected to an available public record.",
    },
    withdrawn: {
      label: "Proof withdrawn",
      title: "This public proof is no longer active.",
      description:
        "The owner has withdrawn public access to this proof identity. The private record may still exist inside their vault, but this public proof card is no longer available.",
    },
    "record-unavailable": {
      label: "Record unavailable",
      title: "The connected record is no longer available.",
      description:
        "This proof identity exists, but the connected achievement record may have been removed, restricted, or made unavailable.",
    },
    "not-public": {
      label: "Access restricted",
      title: "This record is not available for public proof.",
      description:
        "The connected record is not currently configured for public or controlled unlisted access.",
    },
  };

  return copy[reason];
}

function getMediaPreviewKind(mimeType: string | null) {
  if (!mimeType) {
    return null;
  }

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType === "application/pdf") {
    return "pdf";
  }

  return "file";
}

function getCleanEvidenceLabel(evidenceType: string) {
  if (evidenceType === "certificate") {
    return "Certificate evidence";
  }

  if (evidenceType === "document") {
    return "Document evidence";
  }

  if (evidenceType === "image") {
    return "Image evidence";
  }

  return "Public media evidence";
}

function PublicNav({ label }: { label: string }) {
  return (
    <nav className="flex items-center justify-between rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--text-primary)] text-xs font-bold tracking-[0.16em] text-[var(--background)]">
          PT
        </div>

        <div>
          <p className="text-sm font-semibold tracking-[-0.02em]">
            ProofTrail
          </p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {label}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
        >
          About
        </Link>
      </div>
    </nav>
  );
}

function ProofUnavailable({
  reason,
  proofId,
}: {
  reason: ProofUnavailableReason;
  proofId: string;
}) {
  const copy = getUnavailableCopy(reason);

  return (
    <main className="premium-noise relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[96rem] flex-col px-5 py-6 sm:px-8 lg:px-10">
        <PublicNav label="Proof unavailable" />

        <div className="flex flex-1 items-center justify-center py-14">
          <GlassCard className="w-full overflow-hidden border-[var(--danger-border)]">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b border-[var(--danger-border)] bg-[var(--danger-soft)] p-8 sm:p-10 lg:border-b-0 lg:border-r">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--danger)]">
                  {copy.label}
                </p>

                <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl">
                  {copy.title}
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--text-secondary)]">
                  {copy.description}
                </p>

                <div className="mt-8">
                  <PrimaryButton href="/">Return to ProofTrail</PrimaryButton>
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Requested proof slug
                </p>

                <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="break-all font-mono text-sm leading-7 text-[var(--text-secondary)]">
                    {proofId}
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    What this means
                  </p>

                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    Public proof access depends on an active ProofTrail ID, an
                    available connected record, and a record visibility setting
                    that allows public or controlled unlisted access.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <footer className="pb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
            ProofTrail — controlled proof identity access.
          </p>
        </footer>
      </section>
    </main>
  );
}

function ProofMetric({
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
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-3 break-words text-sm font-semibold text-[var(--text-primary)]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
        {detail}
      </p>
    </div>
  );
}

export default async function PublicProofPage({ params }: PublicProofPageProps) {
  const { proofId } = await params;

  const supabase = await createClient();

  const { data: proofLinkData } = await supabase
    .from("public_proof_links")
    .select("*")
    .eq("public_slug", proofId)
    .maybeSingle();

  if (!proofLinkData) {
    return <ProofUnavailable reason="invalid" proofId={proofId} />;
  }

  const proofLink = proofLinkData as PublicProofLink;

  if (!proofLink.is_active) {
    return <ProofUnavailable reason="withdrawn" proofId={proofId} />;
  }

  const { data: achievementData } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", proofLink.achievement_id)
    .maybeSingle();

  if (!achievementData) {
    return <ProofUnavailable reason="record-unavailable" proofId={proofId} />;
  }

  const achievement = achievementData as AchievementRecord;

  if (
    achievement.visibility !== "public" &&
    achievement.visibility !== "unlisted"
  ) {
    return <ProofUnavailable reason="not-public" proofId={proofId} />;
  }

  const { data: evidenceItems } = await supabase
    .from("evidence_items")
    .select("*")
    .eq("achievement_id", achievement.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  const rawEvidence = (evidenceItems || []) as EvidenceItem[];

  const evidence: PublicEvidenceWithMediaPreview[] = await Promise.all(
    rawEvidence.map(async (item) => {
      const mediaPreviewKind = getMediaPreviewKind(item.file_mime_type);

      if (!item.file_path || !item.storage_bucket) {
        return {
          ...item,
          mediaPreviewUrl: null,
          mediaPreviewKind,
        };
      }

      const { data: signedUrlData } = await supabase.storage
        .from(item.storage_bucket)
        .createSignedUrl(item.file_path, 60 * 10);

      return {
        ...item,
        mediaPreviewUrl: signedUrlData?.signedUrl || null,
        mediaPreviewKind,
      };
    })
  );

  const publicMediaCount = evidence.filter((item) =>
    Boolean(item.file_path)
  ).length;

  const qrDataUrl = proofLink.qr_target_url
    ? await generateQrDataUrl(proofLink.qr_target_url)
    : null;

  return (
    <main className="premium-noise relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <section className="relative z-10 mx-auto w-full max-w-[96rem] px-5 py-6 sm:px-8 lg:px-10">
        <PublicNav label="Public proof card" />

        <header className="grid gap-8 py-10 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.75fr)] xl:items-end xl:py-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Active proof identity
            </p>

            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              {achievement.title}
            </h1>

            <p className="mt-6 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
              This public proof card presents a selected record, its visible
              context, and evidence intentionally made public by the owner.
              Private evidence and private vault data are not exposed here.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                {formatStatus(achievement.verification_status)}
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                {achievement.category}
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                {achievement.visibility}
              </span>
            </div>
          </div>

          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              ProofTrail ID
            </p>

            <h2 className="mt-4 break-all font-mono text-2xl font-semibold tracking-[-0.035em] text-[var(--text-primary)]">
              {proofLink.proof_code}
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              This ID points to the current public proof card. If access is
              withdrawn later, this page will no longer display active proof.
            </p>
          </GlassCard>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <GlassCard className="overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Public record
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
                Visible achievement context.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                ProofTrail presents the claim, context, and visible evidence in
                one reviewable public card.
              </p>
            </div>

            <div className="p-8 sm:p-10">
              <div className="grid gap-4 sm:grid-cols-3">
                <ProofMetric
                  label="Issuer"
                  value={achievement.issuer || "Not added"}
                  detail="Issuer or origin stated by owner"
                />

                <ProofMetric
                  label="Record date"
                  value={formatDate(achievement.achievement_date)}
                  detail="Achievement date"
                />

                <ProofMetric
                  label="Public evidence"
                  value={evidence.length}
                  detail="Selected visible evidence items"
                />
              </div>

              <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Public context
                </p>

                <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)]">
                  {achievement.description ||
                    "No public context has been added for this record."}
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Public impact
                </p>

                <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)]">
                  {achievement.impact_summary ||
                    "No public impact summary has been added for this record."}
                </p>
              </div>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                QR proof access
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
                Scan to reopen this proof card.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                This QR code points to the current public ProofTrail card. It is
                useful for certificate cards, printed proof sheets, or shareable
                public records.
              </p>

              {qrDataUrl ? (
                <div className="mt-6 flex justify-center rounded-2xl border border-[var(--border)] bg-white p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`QR code for ${proofLink.proof_code}`}
                    className="h-44 w-44"
                  />
                </div>
              ) : null}

              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Public slug
                </p>

                <p className="mt-2 break-all font-mono text-sm text-[var(--text-secondary)]">
                  {proofLink.public_slug}
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Verification note
              </p>

              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                ProofTrail does not independently certify the achievement. This
                page presents a structured record and its public evidence so the
                viewer can review the context and sources transparently.
              </p>
            </GlassCard>
          </div>
        </section>

        <GlassCard className="mt-6 p-7 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Public evidence
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
                Evidence visible on this proof card.
              </h2>
            </div>

            <div className="text-sm text-[var(--text-muted)] sm:text-right">
              <p>
                {evidence.length} public item
                {evidence.length === 1 ? "" : "s"}
              </p>
              <p className="mt-1">
                {publicMediaCount} media item
                {publicMediaCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {evidence.length === 0 ? (
            <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                No public evidence is visible on this proof card.
              </p>

              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                The owner may have kept evidence private, or may not have marked
                any evidence items as public yet.
              </p>
            </div>
          ) : (
            <div className="mt-7 grid gap-4">
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
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                            {formatEvidenceType(item.evidence_type)}
                          </p>
                        </div>

                        {item.source_url ? (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                          >
                            Open source →
                          </a>
                        ) : null}
                      </div>

                      {item.description ? (
                        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                          {item.description}
                        </p>
                      ) : null}

                      {item.file_path ? (
                        <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                          <div className="border-b border-[var(--border)] p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                                  {getCleanEvidenceLabel(item.evidence_type)}
                                </p>

                                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                                  A public evidence item selected for this proof
                                  card.
                                </p>
                              </div>

                              <span className="w-fit rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                                Public selection
                              </span>
                            </div>
                          </div>

                          {item.mediaPreviewUrl &&
                          item.mediaPreviewKind === "image" ? (
                            <CertificateFrame className="m-4">
                              <a
                                href={item.mediaPreviewUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.mediaPreviewUrl}
                                  alt={`${getCleanEvidenceLabel(
                                    item.evidence_type
                                  )} for ${achievement.title}`}
                                  className="max-h-[560px] w-full rounded-[1rem] object-contain"
                                />
                              </a>
                            </CertificateFrame>
                          ) : null}

                          {item.mediaPreviewUrl &&
                          item.mediaPreviewKind === "pdf" ? (
                            <CertificateFrame className="m-4">
                              <a
                                href={item.mediaPreviewUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex min-h-[220px] items-center justify-between gap-4 rounded-[1rem] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-6 text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                              >
                                <span>Open public certificate evidence</span>
                                <span aria-hidden="true">→</span>
                              </a>
                            </CertificateFrame>
                          ) : null}

                          {item.mediaPreviewUrl &&
                          item.mediaPreviewKind === "file" ? (
                            <CertificateFrame className="m-4">
                              <a
                                href={item.mediaPreviewUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex min-h-[220px] items-center justify-between gap-4 rounded-[1rem] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-6 text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                              >
                                <span>Open public evidence file</span>
                                <span aria-hidden="true">→</span>
                              </a>
                            </CertificateFrame>
                          ) : null}

                          {!item.mediaPreviewUrl ? (
                            <CertificateFrame className="m-4">
                              <div className="rounded-[1rem] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-6">
                                <p className="text-sm font-semibold text-[var(--text-primary)]">
                                  Public media preview unavailable.
                                </p>

                                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                                  This evidence item is public, but the protected
                                  media preview link could not be generated.
                                </p>
                              </div>
                            </CertificateFrame>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <footer className="py-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
            ProofTrail — evidence, context, and controlled proof identity.
          </p>
        </footer>
      </section>
    </main>
  );
}