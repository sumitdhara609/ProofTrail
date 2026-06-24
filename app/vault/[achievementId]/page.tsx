import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddEvidenceForm } from "@/components/vault/AddEvidenceForm";
import {
  AchievementRecord,
  AuditLog,
  EvidenceItem,
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

  const record = achievement as AchievementRecord;
  const logs = (auditLogs || []) as AuditLog[];
  const evidence = (evidenceItems || []) as EvidenceItem[];

  return (
    <main className="min-h-screen bg-[#08090d] px-6 py-10 text-white sm:px-10 lg:px-16">
      <section className="mx-auto max-w-7xl">
        <Link href="/vault" className="text-sm font-medium text-cyan-200">
          ← Back to vault
        </Link>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/30 sm:p-10">
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

            <h1 className="mt-8 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {record.title}
            </h1>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/40">Issuer</p>
                <p className="mt-2 font-medium text-white">
                  {record.issuer || "Not added"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/40">Date</p>
                <p className="mt-2 font-medium text-white">
                  {record.achievement_date || "Not added"}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm uppercase tracking-[0.22em] text-white/35">
                Context
              </p>
              <p className="mt-4 text-sm leading-8 text-white/60">
                {record.description || "No context added yet."}
              </p>
            </div>

            <div className="mt-8">
              <p className="text-sm uppercase tracking-[0.22em] text-white/35">
                Impact
              </p>
              <p className="mt-4 text-sm leading-8 text-white/60">
                {record.impact_summary || "No impact summary added yet."}
              </p>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
                Evidence layer
              </p>

              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
                Attach proof to this record.
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/50">
                Add source links, certificate pages, published references,
                project links, or other evidence that supports this achievement.
              </p>

              <AddEvidenceForm achievementId={record.id} />
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
                Evidence attached
              </p>

              {evidence.length === 0 ? (
                <p className="mt-4 text-sm leading-7 text-white/50">
                  No evidence has been attached yet.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {evidence.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/35">
                            {formatEvidenceType(item.evidence_type)}
                          </p>
                        </div>

                        {item.is_public ? (
                          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                            Public
                          </span>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/40">
                            Private
                          </span>
                        )}
                      </div>

                      {item.description ? (
                        <p className="mt-3 text-sm leading-6 text-white/50">
                          {item.description}
                        </p>
                      ) : null}

                      {item.source_url ? (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex text-sm font-medium text-cyan-200"
                        >
                          Open source →
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
                Audit trail
              </p>

              {logs.length === 0 ? (
                <p className="mt-4 text-sm leading-7 text-white/50">
                  No audit events found.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-sm font-medium text-white">
                        {log.action}
                      </p>
                      <p className="mt-1 text-xs text-white/35">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}