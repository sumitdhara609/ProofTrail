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

        <header className="grid gap-8 py-12 lg:grid-cols-[1fr_0.78fr] lg:items-end lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Proof vault
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Your private archive of structured proof records.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
              Preserve achievements with context, supporting evidence, audit
              activity, and optional QR-backed public proof identities.
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
              Records stay private by default. Public proof identities are only
              created when you deliberately review and generate them.
            </p>

            <div className="mt-6">
              <PrimaryButton href="/vault/new">Create record</PrimaryButton>
            </div>
          </GlassCard>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Records", totalRecords, "Achievement records in your vault"],
            ["Evidence", totalEvidence, "Attached proof and support items"],
            ["Media", totalMediaEvidence, "Uploaded certificates or files"],
            ["Proof IDs", recordsWithProof, "Active public proof identities"],
          ].map(([label, value, detail]) => (
            <GlassCard key={label} className="p-6">
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
          ))}
        </section>

        {records.length === 0 ? (
          <section className="pb-16 pt-6">
            <GlassCard className="overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10 lg:border-b-0 lg:border-r">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                    Empty vault
                  </p>

                  <h2 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
                    Start with one achievement worth preserving carefully.
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-8 text-[var(--text-secondary)]">
                    A project, certificate, publication, competition, leadership
                    role, award, or course can become a structured record with
                    evidence, context, and controlled proof access.
                  </p>

                  <div className="mt-8">
                    <PrimaryButton href="/vault/new">
                      Create first record
                    </PrimaryButton>
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
                        "Record created",
                        "Preserve the achievement title, issuer, date, and context.",
                      ],
                      [
                        "02",
                        "Evidence attached",
                        "Add files, links, notes, certificates, screenshots, or documents.",
                      ],
                      [
                        "03",
                        "Proof reviewed",
                        "Decide what can become public and what must remain private.",
                      ],
                      [
                        "04",
                        "Proof identity generated",
                        "Create a QR-backed public proof card only when ready.",
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

              <p className="text-sm text-[var(--text-muted)]">
                Ordered by latest record activity
              </p>
            </div>

            <div className="space-y-4">
              {records.map((record, index) => (
                <Link
                  key={record.id}
                  href={`/vault/${record.id}`}
                  className="group block overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                >
                  <div className="grid gap-0 lg:grid-cols-[11rem_1fr_18rem]">
                    <div className="flex flex-col justify-between border-b border-[var(--border)] bg-[var(--surface-soft)] p-6 lg:border-b-0 lg:border-r">
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
                          {record.visibility}
                        </span>

                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                          {record.category}
                        </span>
                      </div>

                      <h3 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[var(--text-primary)]">
                        {record.title}
                      </h3>

                      <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                        {record.description ||
                          "No context has been added yet. Open this record to document the story, effort, and proof behind it."}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                        <span>Issuer: {record.issuer || "Not added"}</span>
                        <span>Date: {formatDate(record.achievement_date)}</span>
                      </div>
                    </div>

                    <div className="border-t border-[var(--border)] bg-[var(--surface-soft)] p-6 lg:border-l lg:border-t-0">
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
                        <p className="text-xs text-[var(--text-muted)]">
                          Proof identity
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                          {record.proofLink
                            ? record.proofLink.proof_code
                            : "Private only"}
                        </p>
                      </div>

                      <p className="mt-5 text-sm font-semibold text-[var(--text-muted)] transition group-hover:text-[var(--accent)]">
                        Open dossier →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}