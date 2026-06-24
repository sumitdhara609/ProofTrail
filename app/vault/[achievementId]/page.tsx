import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddEvidenceForm } from "@/components/vault/AddEvidenceForm";
import {
  deleteEvidenceItem,
  generatePublicProofLink,
} from "@/app/vault/[achievementId]/actions";
import { generateQrDataUrl } from "@/lib/qr/generate";
import {
  AchievementRecord,
  AuditLog,
  EvidenceItem,
  PublicProofLink,
} from "@/lib/proof/types";

type AchievementPageProps = {
  params: Promise<{
    achievementId: string;
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

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AchievementPage({ params }: AchievementPageProps) {
  const { achievementId } = await params;

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

  const { data: proofLinkData } = await supabase
    .from("public_proof_links")
    .select("*")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  const record = achievement as AchievementRecord;
  const logs = (auditLogs || []) as AuditLog[];
  const evidence = (evidenceItems || []) as EvidenceItem[];
  const proofLink = proofLinkData as PublicProofLink | null;

  const publicEvidenceCount = evidence.filter((item) => item.is_public).length;

  const qrDataUrl = proofLink?.qr_target_url
    ? await generateQrDataUrl(proofLink.qr_target_url)
    : null;

  return (
    <main className="min-h-screen bg-[#08090d] px-6 py-10 text-white sm:px-10 lg:px-16">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/vault" className="text-sm font-medium text-cyan-200">
            ← Back to archive
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-3 text-xs text-white/35">
              <span>Created {formatDate(record.created_at)}</span>
              <span>•</span>
              <span>Updated {formatDate(record.updated_at)}</span>
            </div>

            <Link
              href={`/vault/${record.id}/edit`}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/[0.06] hover:text-white"
            >
              Edit record
            </Link>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.032] shadow-2xl shadow-black/30">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <article className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
                Record Dossier
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  {formatStatus(record.verification_status)}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/50">
                  {record.visibility}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/50">
                  {record.category}
                </span>
              </div>

              <h1 className="mt-8 max-w-4xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                {record.title}
              </h1>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/40">Issuer / origin</p>
                  <p className="mt-2 font-medium text-white">
                    {record.issuer || "Not added"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/40">Achievement date</p>
                  <p className="mt-2 font-medium text-white">
                    {formatDate(record.achievement_date)}
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs text-white/35">Evidence items</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {evidence.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs text-white/35">Public evidence</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {publicEvidenceCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs text-white/35">Proof identity</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {proofLink ? proofLink.proof_code : "Not generated"}
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-sm uppercase tracking-[0.22em] text-white/35">
                  Context
                </p>
                <p className="mt-4 text-sm leading-8 text-white/60">
                  {record.description || "No context added yet."}
                </p>
              </div>

              <div className="mt-10">
                <p className="text-sm uppercase tracking-[0.22em] text-white/35">
                  Impact
                </p>
                <p className="mt-4 text-sm leading-8 text-white/60">
                  {record.impact_summary || "No impact summary added yet."}
                </p>
              </div>
            </article>

            <aside className="border-t border-white/10 bg-black/20 p-8 sm:p-10 lg:border-l lg:border-t-0">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
                <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
                  Proof identity
                </p>

                {proofLink ? (
                  <>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                      Public proof is active.
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-white/50">
                      This record has a public ProofTrail ID and QR-backed
                      access link.
                    </p>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                        ProofTrail ID
                      </p>
                      <p className="mt-2 font-mono text-lg font-semibold text-white">
                        {proofLink.proof_code}
                      </p>
                    </div>

                    {qrDataUrl ? (
                      <div className="mt-5 flex justify-center rounded-2xl border border-white/10 bg-white p-5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrDataUrl}
                          alt={`QR code for ${proofLink.proof_code}`}
                          className="h-40 w-40"
                        />
                      </div>
                    ) : null}

                    <a
                      href={`/proof/${proofLink.public_slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex w-full justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Open public proof
                    </a>
                  </>
                ) : (
                  <>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                      No public proof yet.
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-white/50">
                      Generate a proof identity when this record is ready for
                      controlled public sharing.
                    </p>

                    <form action={generatePublicProofLink.bind(null, record.id)}>
                      <button
                        type="submit"
                        className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                      >
                        Generate proof link
                      </button>
                    </form>
                  </>
                )}
              </div>

              <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
                <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
                  Evidence intake
                </p>

                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                  Attach proof.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/50">
                  Add links, source pages, certificates, publications, or other
                  references that support this record.
                </p>

                <AddEvidenceForm achievementId={record.id} />
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
              Evidence ledger
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
              Attached proof items.
            </h2>

            {evidence.length === 0 ? (
              <p className="mt-6 text-sm leading-7 text-white/50">
                No evidence has been attached yet.
              </p>
            ) : (
              <div className="mt-6 space-y-3">
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
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/35">
                              {formatEvidenceType(item.evidence_type)}
                            </p>
                          </div>

                          <span
                            className={
                              item.is_public
                                ? "rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100"
                                : "rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/40"
                            }
                          >
                            {item.is_public ? "Public" : "Private"}
                          </span>
                        </div>

                        {item.description ? (
                          <p className="mt-4 text-sm leading-7 text-white/50">
                            {item.description}
                          </p>
                        ) : null}

                        <div className="mt-4 flex flex-wrap items-center gap-4">
                          {item.source_url ? (
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex text-sm font-medium text-cyan-200"
                            >
                              Open source →
                            </a>
                          ) : null}

                          <form
                            action={deleteEvidenceItem.bind(
                              null,
                              record.id,
                              item.id
                            )}
                          >
                            <button
                              type="submit"
                              className="text-sm font-medium text-red-200/70 transition hover:text-red-100"
                            >
                              Delete evidence
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
              Trust timeline
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
              Audit activity.
            </h2>

            {logs.length === 0 ? (
              <p className="mt-6 text-sm leading-7 text-white/50">
                No audit events found.
              </p>
            ) : (
              <div className="mt-6 space-y-3">
                {logs.map((log, index) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-xs text-white/45">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {log.action}
                        </p>
                        <p className="mt-2 text-xs text-white/35">
                          {formatDateTime(log.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}