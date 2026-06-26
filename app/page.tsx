import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const pillars = [
  {
    title: "Evidence-first records",
    description:
      "Preserve achievements with supporting links, context, dates, visibility, and proof status in one structured vault.",
  },
  {
    title: "Controlled proof cards",
    description:
      "Share selected records through active public proof identities without exposing the rest of your private vault.",
  },
  {
    title: "Audit-aware trust",
    description:
      "Important actions such as evidence changes, proof generation, and proof withdrawal are recorded in a clear trust timeline.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <section className="relative px-6 py-8 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[var(--accent-soft)] blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-32 h-[360px] w-[360px] rounded-full bg-[var(--surface-muted)] blur-[120px]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[var(--border)] bg-[var(--surface)]/85 px-5 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--text-primary)] text-sm font-semibold text-[var(--background)]">
              PT
            </div>
            <span className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">
              ProofTrail
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-[var(--text-secondary)] md:flex">
            <a
              href="#system"
              className="transition hover:text-[var(--text-primary)]"
            >
              System
            </a>
            <a
              href="#proof"
              className="transition hover:text-[var(--text-primary)]"
            >
              Proof Cards
            </a>
            <a
              href="#trust"
              className="transition hover:text-[var(--text-primary)]"
            >
              Trust Layer
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <Link
              href="/sign-in"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] sm:inline-flex"
            >
              Sign in
            </Link>

            <PrimaryButton href="/sign-up" className="px-4 py-2">
              Start vault
            </PrimaryButton>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center py-24 text-center sm:py-32">
          <div className="mb-6 rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Evidence-backed achievement vault
          </div>

          <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.055em] text-[var(--text-primary)] sm:text-6xl lg:text-7xl">
            Give every achievement a structured proof identity.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
            ProofTrail helps users preserve achievements, attach evidence,
            control visibility, and share selected records through QR-backed
            public proof cards.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <PrimaryButton href="/sign-up">Create proof vault</PrimaryButton>
            <SecondaryButton href="/sign-in">Open existing vault</SecondaryButton>
          </div>
        </div>
      </section>

      <section
        id="system"
        className="relative mx-auto grid max-w-7xl gap-4 px-6 pb-24 sm:px-10 lg:grid-cols-3 lg:px-16"
      >
        {pillars.map((pillar) => (
          <GlassCard key={pillar.title} className="p-7">
            <div className="mb-8 h-1.5 w-12 rounded-full bg-[var(--accent)]/70" />
            <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
              {pillar.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              {pillar.description}
            </p>
          </GlassCard>
        ))}
      </section>

      <section
        id="proof"
        className="mx-auto max-w-7xl px-6 pb-28 sm:px-10 lg:px-16"
      >
        <GlassCard className="grid overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Public proof card
            </p>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
              A focused public page for selected evidence-backed records.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              Each shared record can receive a ProofTrail ID, public slug, QR
              access, record context, and only the evidence intentionally marked
              as public.
            </p>
          </div>

          <div className="border-t border-[var(--border)] bg-[var(--surface-soft)] p-8 lg:border-l lg:border-t-0">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    ProofTrail ID
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
                    PT-2026-9K2X
                  </h3>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--text-primary)] text-xs font-bold text-[var(--background)]">
                  QR
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm font-medium text-[var(--accent)]">
                  Evidence Attached
                </p>
                <h4 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                  Product Build Milestone
                </h4>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  A structured record containing context, source references,
                  public evidence status, and a controlled proof identity.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-[var(--text-muted)]">Public evidence</p>
                  <p className="mt-1 font-medium text-[var(--text-primary)]">
                    4 items
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-[var(--text-muted)]">Access</p>
                  <p className="mt-1 font-medium text-[var(--text-primary)]">
                    Unlisted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      <section
        id="trust"
        className="mx-auto max-w-7xl px-6 pb-28 sm:px-10 lg:px-16"
      >
        <GlassCard className="p-8 sm:p-12 lg:p-16">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Trust layer
          </p>

          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
            ProofTrail is designed around controlled access, audit history, and
            evidence boundaries.
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
            Public proof cards do not expose the full private vault. They show
            only the selected record data and evidence marked public by the
            owner, while important lifecycle actions remain traceable inside the
            vault.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Private by default
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                Records stay private until a proof identity is intentionally
                generated.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Withdrawable access
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                Public proof access can be withdrawn without deleting the
                private record.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Public evidence only
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                Private evidence remains hidden from the public proof page.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}