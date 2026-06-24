import Link from "next/link";
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

function formatDate(value: string | null) {
  if (!value) {
    return "Not dated";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
            Public proof record
          </p>
        </nav>

        <div className="mt-10 overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <article className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
                Verified record identity
              </p>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                {achievement.title}
              </h1>

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
                  This QR code points to the public ProofTrail record for this
                  achievement.
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
                  ProofTrail records evidence, context, and sharing status. The
                  displayed verification level should be interpreted according to
                  the visible evidence and record history.
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
            <p className="mt-6 text-sm leading-7 text-white/50">
              No public evidence is attached to this proof card yet.
            </p>
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
            ProofTrail — evidence, context, and proof identity.
          </p>
        </footer>
      </section>
    </main>
  );
}