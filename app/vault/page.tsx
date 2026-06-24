import { SiteShell } from "@/components/layout/SiteShell";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProofStatusBadge } from "@/components/ui/ProofStatusBadge";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { SectionLabel } from "@/components/ui/SectionLabel";

const pillars = [
  {
    title: "Private vault",
    description:
      "Store achievements, proof files, links, dates, and context inside a structured personal record system.",
  },
  {
    title: "Public proof identity",
    description:
      "Turn selected records into clean public proof cards with a unique link and QR-backed access.",
  },
  {
    title: "Trust trail",
    description:
      "Track status changes, evidence updates, visibility changes, and review history through a clear audit layer.",
  },
];

export default function Home() {
  return (
    <SiteShell>
      <section className="relative">
        <Container className="flex flex-col items-center pb-24 pt-14 text-center sm:pb-32 sm:pt-20">
          <div className="mb-6 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Verifiable achievement records
          </div>

          <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            Give every achievement a permanent proof identity.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            ProofTrail helps users preserve achievements with evidence, context,
            visibility controls, public proof cards, and QR-backed sharing.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <PrimaryButton href="/sign-up">Create proof vault</PrimaryButton>
            <SecondaryButton href="/proof/demo">View proof card</SecondaryButton>
          </div>
        </Container>
      </section>

      <section id="vault" className="pb-24">
        <Container className="grid gap-4 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <GlassCard key={pillar.title} className="p-7">
              <div className="mb-8 h-1.5 w-12 rounded-full bg-cyan-300/70" />
              <h2 className="text-xl font-semibold tracking-tight text-white">
                {pillar.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/55">
                {pillar.description}
              </p>
            </GlassCard>
          ))}
        </Container>
      </section>

      <section id="proof" className="pb-28">
        <Container>
          <GlassCard className="grid overflow-hidden rounded-[2.5rem] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <SectionLabel>Public proof card</SectionLabel>
              <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                A calm public record for what deserves to be preserved.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Each achievement can receive a public proof identity with title,
                owner, issuer, evidence summary, verification status, and QR
                sharing.
              </p>
            </div>

            <div className="border-t border-white/10 bg-black/20 p-8 lg:border-l lg:border-t-0">
              <div className="rounded-[2rem] border border-white/10 bg-[#0d1017] p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                      ProofTrail ID
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      CF-2026-9K2X
                    </h3>
                  </div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white text-xs font-bold text-black">
                    QR
                  </div>
                </div>

                <div className="mt-8">
                  <ProofStatusBadge status="Evidence Attached" />
                  <h4 className="mt-4 text-xl font-semibold text-white">
                    ChronoForge MVP Completion
                  </h4>
                  <p className="mt-4 text-sm leading-7 text-white/50">
                    Timeline simulation platform with protected dashboard,
                    custom projection engine, and structured product
                    documentation.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-white/40">Evidence</p>
                    <p className="mt-1 font-medium text-white">4 items</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-white/40">Visibility</p>
                    <p className="mt-1 font-medium text-white">Public</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </Container>
      </section>
    </SiteShell>
  );
}