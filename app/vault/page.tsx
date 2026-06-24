import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  AchievementRecord,
  EvidenceItem,
  PublicProofLink,
} from "@/lib/proof/types";

type ArchiveRecord = AchievementRecord & {
  evidenceCount: number;
  publicEvidenceCount: number;
  proofLink: PublicProofLink | null;
};

function formatStatus(status: string) {
  return status
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

export default async function VaultPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: achievements, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const achievementRecords = (achievements || []) as AchievementRecord[];
  const achievementIds = achievementRecords.map((record) => record.id);

  const { data: evidenceItems } =
    achievementIds.length > 0
      ? await supabase
          .from("evidence_items")
          .select("*")
          .eq("user_id", user.id)
          .in("achievement_id", achievementIds)
      : { data: [] };

  const { data: proofLinks } =
    achievementIds.length > 0
      ? await supabase
          .from("public_proof_links")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .in("achievement_id", achievementIds)
      : { data: [] };

  const evidence = (evidenceItems || []) as EvidenceItem[];
  const publicProofLinks = (proofLinks || []) as PublicProofLink[];

  const records: ArchiveRecord[] = achievementRecords.map((record) => {
    const recordEvidence = evidence.filter(
      (item) => item.achievement_id === record.id
    );

    const proofLink =
      publicProofLinks.find((link) => link.achievement_id === record.id) ||
      null;

    return {
      ...record,
      evidenceCount: recordEvidence.length,
      publicEvidenceCount: recordEvidence.filter((item) => item.is_public)
        .length,
      proofLink,
    };
  });

  const totalRecords = records.length;
  const recordsWithEvidence = records.filter(
    (record) => record.evidenceCount > 0
  ).length;
  const recordsWithProof = records.filter((record) => record.proofLink).length;

  return (
    <main className="min-h-screen bg-[#08090d] px-6 py-10 text-white sm:px-10 lg:px-16">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
              Record Archive
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              A private ledger for achievements worth preserving.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">
              Each record begins as a claim, grows through evidence, and can be
              turned into a public proof identity when it is ready to be shared.
            </p>
          </div>

          <Link
            href="/vault/new"
            className="inline-flex w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            New record
          </Link>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-sm text-white/40">Total records</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
              {totalRecords}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/40">
              Structured achievements stored inside your vault.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-sm text-white/40">Evidence-backed</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
              {recordsWithEvidence}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/40">
              Records with at least one supporting evidence item.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-sm text-white/40">Proof identities</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
              {recordsWithProof}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/40">
              Records with active public proof links and QR access.
            </p>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="mt-14 overflow-hidden rounded-[2.5rem] border border-dashed border-white/15 bg-white/[0.025]">
            <div className="grid gap-8 p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/35">
                  Empty archive
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                  Begin with one record that deserves a trail.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/50">
                  A project, certificate, publication, competition, leadership
                  role, award, or course can become a structured proof record.
                </p>

                <Link
                  href="/vault/new"
                  className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Create first record
                </Link>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
                  Record lifecycle
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    "Claim created",
                    "Evidence attached",
                    "Source linked",
                    "Proof identity generated",
                  ].map((step, index) => (
                    <div key={step} className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs text-white/50">
                        0{index + 1}
                      </div>
                      <p className="text-sm text-white/60">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-14">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.22em] text-white/35">
                Archive entries
              </p>
              <p className="text-sm text-white/35">
                Ordered by latest update
              </p>
            </div>

            <div className="space-y-4">
              {records.map((record, index) => (
                <Link
                  key={record.id}
                  href={`/vault/${record.id}`}
                  className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.032] transition hover:border-cyan-300/25 hover:bg-white/[0.052]"
                >
                  <div className="grid gap-0 lg:grid-cols-[180px_1fr_260px]">
                    <div className="flex flex-col justify-between border-b border-white/10 bg-black/20 p-6 lg:border-b-0 lg:border-r">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-white/30">
                          Record
                        </p>
                        <p className="mt-3 font-mono text-2xl font-semibold text-white/80">
                          #{String(index + 1).padStart(3, "0")}
                        </p>
                      </div>

                      <p className="mt-6 text-xs leading-6 text-white/35">
                        Updated {formatDate(record.updated_at)}
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap gap-3">
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

                      <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-white">
                        {record.title}
                      </h2>

                      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/50">
                        {record.description || "No context added yet."}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/35">
                        <span>Issuer: {record.issuer || "Not added"}</span>
                        <span>Date: {formatDate(record.achievement_date)}</span>
                      </div>
                    </div>

                    <div className="border-t border-white/10 bg-black/10 p-6 lg:border-l lg:border-t-0">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-xs text-white/35">Evidence</p>
                          <p className="mt-2 text-xl font-semibold text-white">
                            {record.evidenceCount}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-xs text-white/35">Public</p>
                          <p className="mt-2 text-xl font-semibold text-white">
                            {record.publicEvidenceCount}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs text-white/35">Proof identity</p>
                        <p className="mt-2 text-sm font-medium text-white">
                          {record.proofLink
                            ? record.proofLink.proof_code
                            : "Not generated"}
                        </p>
                      </div>

                      <p className="mt-5 text-sm font-medium text-white/35 transition group-hover:text-cyan-200">
                        Open record →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}