import Link from "next/link";
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
    <main className="min-h-screen overflow-hidden bg-[#08090d] text-white">
      <section className="relative px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute left-1/2 top-0 -z-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-0 top-32 -z-0 h-[360px] w-[360px] rounded-full bg-blue-500/10 blur-[120px]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold">
              PT
            </div>
            <span className="text-sm font-medium tracking-wide text-white/90">
              ProofTrail
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <a href="#system" className="transition hover:text-white">
              System
            </a>
            <a href="#proof" className="transition hover:text-white">
              Proof Cards
            </a>
            <a href="#trust" className="transition hover:text-white">
              Trust Layer
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <Link
              href="/sign-in"
              className="hidden rounded-full px-4 py-2 text-sm text-white/70 transition hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Start vault
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center py-24 text-center sm:py-32">
          <div className="mb-6 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Evidence-backed achievement vault
          </div>

          <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            Give every achievement a structured proof identity.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            ProofTrail helps users preserve achievements, attach evidence,
            control visibility, and share selected records through QR-backed
            public proof cards.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Create proof vault
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.06]"
            >
              Open existing vault
            </Link>
          </div>
        </div>
      </section>

      <section
        id="system"
        className="relative mx-auto grid max-w-7xl gap-4 px-6 pb-24 sm:px-10 lg:grid-cols-3 lg:px-16"
      >
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl shadow-black/20 backdrop-blur-xl"
          >
            <div className="mb-8 h-1.5 w-12 rounded-full bg-cyan-300/70" />
            <h2 className="text-xl font-semibold tracking-tight text-white">
              {pillar.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/55">
              {pillar.description}
            </p>
          </article>
        ))}
      </section>

      <section
        id="proof"
        className="mx-auto max-w-7xl px-6 pb-28 sm:px-10 lg:px-16"
      >
        <div className="grid overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200/80">
              Public proof card
            </p>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              A focused public page for selected evidence-backed records.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              Each shared record can receive a ProofTrail ID, public slug, QR
              access, record context, and only the evidence intentionally marked
              as public.
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
                    PT-2026-9K2X
                  </h3>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white text-xs font-bold text-black">
                  QR
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm text-cyan-200">Evidence Attached</p>
                <h4 className="mt-2 text-xl font-semibold text-white">
                  Product Build Milestone
                </h4>
                <p className="mt-4 text-sm leading-7 text-white/50">
                  A structured record containing context, source references,
                  public evidence status, and a controlled proof identity.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-white/40">Public evidence</p>
                  <p className="mt-1 font-medium text-white">4 items</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-white/40">Access</p>
                  <p className="mt-1 font-medium text-white">Unlisted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="trust"
        className="mx-auto max-w-7xl px-6 pb-28 sm:px-10 lg:px-16"
      >
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8 sm:p-12 lg:p-16">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200/80">
            Trust layer
          </p>

          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            ProofTrail is designed around controlled access, audit history, and
            evidence boundaries.
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            Public proof cards do not expose the full private vault. They show
            only the selected record data and evidence marked public by the
            owner, while important lifecycle actions remain traceable inside the
            vault.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm font-medium text-white">
                Private by default
              </p>
              <p className="mt-3 text-sm leading-7 text-white/45">
                Records stay private until a proof identity is intentionally
                generated.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm font-medium text-white">
                Withdrawable access
              </p>
              <p className="mt-3 text-sm leading-7 text-white/45">
                Public proof access can be withdrawn without deleting the
                private record.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm font-medium text-white">
                Public evidence only
              </p>
              <p className="mt-3 text-sm leading-7 text-white/45">
                Private evidence remains hidden from the public proof page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}