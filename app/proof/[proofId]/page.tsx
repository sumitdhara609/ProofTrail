import Link from "next/link";
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
        "The ProofTrail ID may be incorrect, expired, withdrawn, or no longer connected to an active public record.",
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
        "This proof identity exists, but the connected achievement record may have been removed or made unavailable.",
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
    <main className="min-h-screen overflow-hidden bg-[#08090d] px-6 py-8 text-white sm:px-10 lg:px-16">
      <div className="pointer-events-none fixed left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-500/10 blur-[130px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold">
              PT
            </div>
            <span className="text-sm font-medium tracking-wide text-white/90">
              ProofTrail
            </span>
          </Link>

          <p className="hidden text-sm text-white/40 sm:block">
            Public proof access
          </p>
        </nav>

        <div className="flex flex-1 items-center justify-center py-16">
          <div className="w-full rounded-[2.75rem] border border-red-400/20 bg-red-400/[0.055] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10 lg:p-12">
            <p className="text-sm uppercase tracking-[0.24em] text-red-100/75">
              {copy.label}
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              {copy.title}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/60">
              {copy.description}
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                Requested proof slug
              </p>
              <p className="mt-2 break-all font-mono text-sm text-white/70">
                {proofId}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Return to ProofTrail
              </Link>
            </div>
          </div>
        </div>

        <footer className="py-10 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-white/25">
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
    <main className="min-h-screen overflow-hidden bg-[#08090d] px-6 py-8 text-white sm:px-10 lg:px-16">
      <div className="pointer-events-none fixed left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[130px]" />

      <section className="relative z-10 mx-auto max-w-6xl">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold">
              PT
            </div>
            <span className="text-sm font-medium tracking-wide text-white/90">
              ProofTrail
            </span>
          </Link>

          <p className="hidden text-sm text-white/40 sm:block">
            Public proof card
          </p>
        </nav>

        <div className="mt-10 overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <article className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
                Active proof identity
              </p>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                {achievement.title}
              </h1>

              <p className="mt-6 max-w-3xl text-sm leading-8 text-white/55">
                This public proof card shows the record details and evidence
                intentionally made visible by the record owner. Private evidence
                and private vault data are not exposed here.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  {formatStatus(achievement.verification_status)}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/50">
                  {achievement.category}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/50">
                  {achievement.visibility}
                </span>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/40">ProofTrail ID</p>
                  <p className="mt-2 font-mono text-sm font-semibold text-white">
                    {proofLink.proof_code}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/40">Issuer / origin</p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {achievement.issuer || "Not added"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/40">Record date</p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {formatDate(achievement.achievement_date)}
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-sm uppercase tracking-[0.22em] text-white/35">
                  Context
                </p>
                <p className="mt-4 text-sm leading-8 text-white/60">
                  {achievement.description ||
                    "No public context has been added for this record."}
                </p>
              </div>

              <div className="mt-10">
                <p className="text-sm uppercase tracking-[0.22em] text-white/35">
                  Impact
                </p>
                <p className="mt-4 text-sm leading-8 text-white/60">
                  {achievement.impact_summary ||
                    "No public impact summary has been added for this record."}
                </p>
              </div>
            </article>

            <aside className="border-t border-white/10 bg-black/20 p-8 sm:p-10 lg:border-l lg:border-t-0">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
                <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
                  QR proof access
                </p>

                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                  Scan to reopen this proof card.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/50">
                  This QR code points to this active public ProofTrail card. If
                  public access is withdrawn later, this link will no longer
                  display the active proof.
                </p>

                {qrDataUrl ? (
                  <div className="mt-6 flex justify-center rounded-2xl border border-white/10 bg-white p-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt={`QR code for ${proofLink.proof_code}`}
                      className="h-44 w-44"
                    />
                  </div>
                ) : null}

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Public slug
                  </p>
                  <p className="mt-2 break-all font-mono text-sm text-white/70">
                    {proofLink.public_slug}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
                <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
                  Proof interpretation
                </p>

                <p className="mt-4 text-sm leading-7 text-white/55">
                  ProofTrail records evidence, context, and public sharing
                  status. This page does not independently certify a claim; it
                  presents the record and the public evidence attached to it for
                  transparent review.
                </p>
              </div>
            </aside>
          </div>
        </div>

        <section className="mt-8 rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
                Public evidence
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                Evidence visible on this proof card.
              </h2>
            </div>

            <p className="text-sm text-white/35">
              {evidence.length} public item{evidence.length === 1 ? "" : "s"}
            </p>
          </div>

          {evidence.length === 0 ? (
            <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-6">
              <p className="text-sm font-medium text-white">
                No public evidence is visible on this proof card.
              </p>
              <p className="mt-3 text-sm leading-7 text-white/45">
                The owner may have kept evidence private, or may not have marked
                any evidence items as public yet.
              </p>
            </div>
          ) : (
            <div className="mt-7 grid gap-3">
              {evidence.map((item, index) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                >
                  <div className="grid gap-0 sm:grid-cols-[90px_1fr]">
                    <div className="border-b border-white/10 bg-white/[0.025] p-5 sm:border-b-0 sm:border-r">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                        Item
                      </p>
                      <p className="mt-2 font-mono text-xl font-semibold text-white/70">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                    </div>

                    <div className="p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/35">
                            {formatEvidenceType(item.evidence_type)}
                          </p>
                        </div>

                        {item.source_url ? (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-cyan-200"
                          >
                            Open source →
                          </a>
                        ) : null}
                      </div>

                      {item.description ? (
                        <p className="mt-4 text-sm leading-7 text-white/50">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="py-10 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-white/25">
            ProofTrail — evidence, context, and controlled proof identity.
          </p>
        </footer>
      </section>
    </main>
  );
}