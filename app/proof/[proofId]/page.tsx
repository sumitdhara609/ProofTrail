import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateQrDataUrl } from "@/lib/qr/generate";
import {
  AchievementRecord,
  EvidenceItem,
  PublicProofLink,
} from "@/lib/proof/types";

type PublicProofPageProps = {
  params: Promise<{
    proofId: string;
  }>;
};

function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function formatEvidenceType(type: string) {
  return type
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function PublicProofPage({ params }: PublicProofPageProps) {
  const { proofId } = await params;

  const supabase = await createClient();

  const { data: proofLinkData, error: proofLinkError } = await supabase
    .from("public_proof_links")
    .select("*")
    .eq("public_slug", proofId)
    .eq("is_active", true)
    .single();

  if (proofLinkError || !proofLinkData) {
    notFound();
  }

  const proofLink = proofLinkData as PublicProofLink;

  const { data: achievementData, error: achievementError } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", proofLink.achievement_id)
    .single();

  if (achievementError || !achievementData) {
    notFound();
  }

  const achievement = achievementData as AchievementRecord;

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
    <main className="min-h-screen bg-[#08090d] px-6 py-10 text-white sm:px-10 lg:px-16">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/30 sm:p-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
                Public Proof Card
              </p>

              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {achievement.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  {formatStatus(achievement.verification_status)}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/50">
                  {achievement.category}
                </span>
              </div>
            </div>

            {qrDataUrl ? (
              <div className="rounded-2xl border border-white/10 bg-white p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${proofLink.proof_code}`}
                  className="h-32 w-32"
                />
              </div>
            ) : null}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-white/40">ProofTrail ID</p>
              <p className="mt-2 font-mono text-sm font-semibold text-white">
                {proofLink.proof_code}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-white/40">Issuer</p>
              <p className="mt-2 text-sm font-medium text-white">
                {achievement.issuer || "Not added"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-white/40">Date</p>
              <p className="mt-2 text-sm font-medium text-white">
                {achievement.achievement_date || "Not added"}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-sm uppercase tracking-[0.22em] text-white/35">
              Context
            </p>
            <p className="mt-4 text-sm leading-8 text-white/60">
              {achievement.description || "No context has been added."}
            </p>
          </div>

          <div className="mt-10">
            <p className="text-sm uppercase tracking-[0.22em] text-white/35">
              Impact
            </p>
            <p className="mt-4 text-sm leading-8 text-white/60">
              {achievement.impact_summary ||
                "No impact summary has been added."}
            </p>
          </div>

          <div className="mt-10">
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
              Public evidence
            </p>

            {evidence.length === 0 ? (
              <p className="mt-4 text-sm leading-7 text-white/50">
                No public evidence is attached to this proof card yet.
              </p>
            ) : (
              <div className="mt-5 grid gap-3">
                {evidence.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
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
                      <p className="mt-3 text-sm leading-7 text-white/50">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-xs uppercase tracking-[0.22em] text-white/25">
          ProofTrail records evidence and context. Verification status should be
          interpreted according to the displayed proof level.
        </p>
      </section>
    </main>
  );
}