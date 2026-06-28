import Link from "next/link";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { createClient } from "@/lib/supabase/server";
import {
  AchievementRecord,
  EvidenceItem,
  PublicProofLink,
} from "@/lib/proof/types";
import { formatDate, formatStatus } from "@/lib/proof/format";

type ArchiveRecord = AchievementRecord & {
  evidenceCount: number;
  publicEvidenceCount: number;
  mediaEvidenceCount: number;
  proofLink: PublicProofLink | null;
};

function ArchiveMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <GlassCard className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
        {value}
      </p>

      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
        {detail}
      </p>
    </GlassCard>
  );
}

function getProofState(record: ArchiveRecord) {
  if (record.proofLink) {
    return {
      label: "Proof identity active",
      value: record.proofLink.proof_code,
      tone: "active",
    };
  }

  if (record.publicEvidenceCount > 0) {
    return {
      label: "Public evidence ready",
      value: "Review and generate proof ID",
      tone: "ready",
    };
  }

  return {
    label: "Private only",
    value: "No public proof identity",
    tone: "private",
  };
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
      mediaEvidenceCount: recordEvidence.filter((item) =>
        Boolean(item.file_path)
      ).length,
      proofLink,
    };
  });

  const totalRecords = records.length;
  const recordsWithEvidence = records.filter(
    (record) => record.evidenceCount > 0
  ).length;
  const recordsWithProof = records.filter((record) => record.proofLink).length;
  const totalEvidence = evidence.length;
  const totalMediaEvidence = evidence.filter((item) =>
    Boolean(item.file_path)
  ).length;

  return (
    <main className="premium-noise relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <section className="relative z-10 mx-auto w-full max-w-[96rem] px-5 py-6 sm:px-8 lg:px-10">
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
                Vault archive
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <SecondaryButton href="/dashboard" className="hidden sm:inline-flex">
              Dashboard
            </SecondaryButton>

            <PrimaryButton href="/vault/new">Create record</PrimaryButton>
          </div>
        </nav>

        <header className="grid gap-8 py-12 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] xl:items-end xl:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Proof vault
            </p>

            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              A private archive for achievements that deserve evidence, context,
              and control.
            </h1>

            <p className="mt-6 max-w-3xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
              Preserve certificates, projects, publications, competitions,
              leadership roles, and milestones as structured proof records.
              Keep them private by default, then publish only the evidence you
              intentionally approve.
            </p>
          </div>

          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Archive status
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                {totalRecords === 0 ? "Empty vault" : "Active archive"}
              </p>

              <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                {totalRecords} record{totalRecords === 1 ? "" : "s"}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              ProofTrail does not expose your files automatically. Public proof
              identities are created only after you review the record and choose
              what becomes visible.
            </p>

            <div className="mt-6">
              <PrimaryButton href="/vault/new">
                {totalRecords === 0 ? "Create first record" : "Create record"}
              </PrimaryButton>
            </div>
          </GlassCard>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ArchiveMetric
            label="Records"
            value={totalRecords}
            detail="Structured achievement records preserved in your vault"
          />

          <ArchiveMetric
            label="Evidence"
            value={totalEvidence}
            detail="Attached links, notes, documents, and support items"
          />

          <ArchiveMetric
            label="Media"
            value={totalMediaEvidence}
            detail="Uploaded certificates, images, PDFs, or files"
          />

          <ArchiveMetric
            label="Proof IDs"
            value={recordsWithProof}
            detail="Active QR-backed public proof identities"
          />
        </section>

        {records.length === 0 ? (
          <section className="pb-16 pt-6">
            <GlassCard className="overflow-hidden">
              <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10 xl:border-b-0 xl:border-r">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                    Empty vault
                  </p>

                  <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
                    Start with one record that should never remain scattered.
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-8 text-[var(--text-secondary)]">
                    Add a certificate, project, publication, award, competition,
                    leadership role, or course. ProofTrail will help you attach
                    context, evidence, visibility decisions, and a controlled
                    public proof identity when ready.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <PrimaryButton href="/vault/new">
                      Create first record
                    </PrimaryButton>

                    <SecondaryButton href="/dashboard">
                      Return to dashboard
                    </SecondaryButton>
                  </div>
                </div>

                <div className="p-8 sm:p-10">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                    Record lifecycle
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      [
                        "01",
                        "Create the record",
                        "Capture the title, issuer, date, category, and private context.",
                      ],
                      [
                        "02",
                        "Attach evidence",
                        "Add certificates, images, PDFs, source links, notes, or supporting references.",
                      ],
                      [
                        "03",
                        "Review visibility",
                        "Choose what stays private and what can appear on a public proof card.",
                      ],
                      [
                        "04",
                        "Generate proof identity",
                        "Create a QR-backed ProofTrail ID only when the record is ready to share.",
                      ],
                    ].map(([number, title, description]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
                      >
                        <div className="flex gap-4">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] font-mono text-xs font-semibold text-[var(--text-muted)]">
                            {number}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">
                              {title}
                            </p>

                            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                              {description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </section>
        ) : (
          <section className="pb-16 pt-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Archive entries
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
                  Record index.
                </h2>
              </div>

              <div className="text-sm text-[var(--text-muted)] sm:text-right">
                <p>Ordered by latest record activity</p>
                <p className="mt-1">
                  {recordsWithEvidence} record
                  {recordsWithEvidence === 1 ? "" : "s"} already supported by
                  evidence
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {records.map((record, index) => {
                const proofState = getProofState(record);

                return (
                  <Link
                    key={record.id}
                    href={`/vault/${record.id}`}
                    className="group block overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                  >
                    <div className="grid gap-0 xl:grid-cols-[11rem_minmax(0,1fr)_21rem]">
                      <div className="flex flex-col justify-between border-b border-[var(--border)] bg-[var(--surface-soft)] p-6 xl:border-b-0 xl:border-r">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                            Vault index
                          </p>

                          <p className="mt-3 font-mono text-2xl font-semibold text-[var(--text-primary)]">
                            #{String(index + 1).padStart(3, "0")}
                          </p>
                        </div>

                        <p className="mt-6 text-xs leading-6 text-[var(--text-muted)]">
                          Updated {formatDate(record.updated_at)}
                        </p>
                      </div>

                      <div className="p-6">
                        <div className="flex flex-wrap gap-3">
                          <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                            {formatStatus(record.verification_status)}
                          </span>

                          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                            {record.visibility === "private"
                              ? "Private record"
                              : record.visibility === "public"
                                ? "Public record"
                                : "Unlisted record"}
                          </span>

                          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                            {record.category}
                          </span>
                        </div>

                        <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[var(--text-primary)]">
                          {record.title}
                        </h3>

                        <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-secondary)]">
                          {record.description ||
                            "No context has been added yet. Open this dossier to document the story, effort, and evidence behind the achievement."}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                          <span>Issuer: {record.issuer || "Not added"}</span>
                          <span>Date: {formatDate(record.achievement_date)}</span>
                        </div>
                      </div>

                      <div className="border-t border-[var(--border)] bg-[var(--surface-soft)] p-6 xl:border-l xl:border-t-0">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                            <p className="text-xs text-[var(--text-muted)]">
                              Evidence
                            </p>

                            <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                              {record.evidenceCount}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                            <p className="text-xs text-[var(--text-muted)]">
                              Media
                            </p>

                            <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                              {record.mediaEvidenceCount}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                            <p className="text-xs text-[var(--text-muted)]">
                              Public
                            </p>

                            <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                              {record.publicEvidenceCount}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs text-[var(--text-muted)]">
                                {proofState.label}
                              </p>

                              <p className="mt-2 break-all text-sm font-semibold text-[var(--text-primary)]">
                                {proofState.value}
                              </p>
                            </div>

                            <span
                              className={
                                proofState.tone === "active"
                                  ? "mt-0.5 h-2.5 w-2.5 rounded-full bg-[var(--accent)]"
                                  : "mt-0.5 h-2.5 w-2.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-soft)]"
                              }
                              aria-hidden="true"
                            />
                          </div>
                        </div>

                        <p className="mt-5 text-sm font-semibold text-[var(--text-muted)] transition group-hover:text-[var(--accent)]">
                          Open dossier →
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}