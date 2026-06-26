import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
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

function ProofUnavailable({
  reason,
  proofId,
}: {
  reason: ProofUnavailableReason;
  proofId: string;
}) {
  const copy = getUnavailableCopy(reason);

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] px-6 py-8 text-[var(--text-primary)] sm:px-10 lg:px-16">
      <div className="pointer-events-none fixed left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[var(--danger-soft)] blur-[130px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[var(--accent-soft)] blur-[130px]" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <nav className="flex items-center justify-between rounded-full border border-[var(--border)] bg-[var(--surface)]/85 px-5 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--text-primary)] text-sm font-semibold text-[var(--background)]">
              PT
            </div>
            <span className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">
              ProofTrail
            </span>
          </Link>

          <p className="hidden text-sm text-[var(--text-muted)] sm:block">
            Public proof access
          </p>
        </nav>

        <div className="flex flex-1 items-center justify-center py-16">
          <GlassCard className="w-full border-[var(--danger-border)] p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--danger)]">
              {copy.label}
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl">
              {copy.title}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--text-secondary)]">
              {copy.description}
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Requested proof slug
              </p>
              <p className="mt-2 break-all font-mono text-sm text-[var(--text-secondary)]">
                {proofId}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/">Return to ProofTrail</PrimaryButton>
            </div>
          </GlassCard>
        </div>

        <footer className="py-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
            ProofTrail — controlled proof identity access.
          </p>
        </footer>
      </section>
    </main>
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

  const evidence = (evidenceItems || []) as EvidenceItem[];

  const qrDataUrl = proofLink.qr_target_url
    ? await generateQrDataUrl(proofLink.qr_target_url)
    : null;

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] px-6 py-8 text-[var(--text-primary)] sm:px-10 lg:px-16">
      <div className="pointer-events-none fixed left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[var(--accent-soft)] blur-[130px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[var(--surface-muted)] blur-[130px]" />

      <section className="relative z-10 mx-auto max-w-6xl">
        <nav className="flex items-center justify-between rounded-full border border-[var(--border)] bg-[var(--surface)]/85 px-5 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--text-primary)] text-sm font-semibold text-[var(--background)]">
              PT
            </div>
            <span className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">
              ProofTrail
            </span>
          </Link>

          <p className="hidden text-sm text-[var(--text-muted)] sm:block">
            Public proof card
          </p>
        </nav>

        <GlassCard className="mt-10 overflow-hidden rounded-[2.75rem]">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <article className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Active proof identity
              </p>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                {achievement.title}
              </h1>

              <p className="mt-6 max-w-3xl text-sm leading-8 text-[var(--text-secondary)]">
                This public proof card presents a selected record, its visible
                context, and the evidence intentionally made public by the
                owner. Private evidence and private vault data are not exposed
                here.
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

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="text-sm text-[var(--text-muted)]">
                    ProofTrail ID
                  </p>
                  <p className="mt-2 font-mono text-sm font-semibold text-[var(--text-primary)]">
                    {proofLink.proof_code}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="text-sm text-[var(--text-muted)]">
                    Issuer / origin
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                    {achievement.issuer || "Not added"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                  <p className="text-sm text-[var(--text-muted)]">
                    Record date
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                    {formatDate(achievement.achievement_date)}
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Public context
                </p>
                <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)]">
                  {achievement.description ||
                    "No public context has been added for this record."}
                </p>
              </div>

              <div className="mt-10">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Public impact
                </p>
                <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)]">
                  {achievement.impact_summary ||
                    "No public impact summary has been added for this record."}
                </p>
              </div>
            </article>

            <aside className="border-t border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10 lg:border-l lg:border-t-0">
              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  QR proof access
                </p>

                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-[var(--text-primary)]">
                  Scan to reopen this public proof card.
                </h2>

                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  This QR code points to the current public ProofTrail card. If
                  public access is withdrawn later, the same link will no longer
                  display an active proof.
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
              </div>

              <div className="mt-6 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  How to read this proof
                </p>

                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  ProofTrail does not independently certify the achievement.
                  This page presents a structured record and its public evidence
                  so the viewer can review the context and sources transparently.
                </p>
              </div>
            </aside>
          </div>
        </GlassCard>

        <GlassCard className="mt-8 p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Public evidence
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                Evidence visible on this proof card.
              </h2>
            </div>

            <p className="text-sm text-[var(--text-muted)]">
              {evidence.length} public item{evidence.length === 1 ? "" : "s"}
            </p>
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
            <div className="mt-7 grid gap-3">
              {evidence.map((item, index) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]"
                >
                  <div className="grid gap-0 sm:grid-cols-[90px_1fr]">
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