import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

const proofLayers = [
  {
    label: "01",
    title: "Private archive",
    description:
      "Preserve achievements with issuer, date, context, notes, source links, and supporting media before anything becomes public.",
  },
  {
    label: "02",
    title: "Evidence dossier",
    description:
      "Attach certificates, PDFs, screenshots, project links, publication links, and award moments as structured evidence.",
  },
  {
    label: "03",
    title: "Controlled proof",
    description:
      "Generate a QR-backed public proof identity only when a record is ready for selected public sharing.",
  },
];

const ledgerRows = [
  ["Record", "Advanced Programming Certificate"],
  ["Issuer", "Training Academy"],
  ["Evidence", "Certificate image · PDF · Source note"],
  ["Visibility", "Private archive"],
  ["Public status", "Not shared"],
];

const auditItems = [
  "Record created",
  "Certificate evidence attached",
  "Media stored privately",
  "Public proof not generated",
];

export default function Home() {
  return (
    <main className="premium-noise relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--text-primary)] text-xs font-bold tracking-[0.16em] text-[var(--background)]">
              PT
            </div>

            <div>
              <p className="text-base font-semibold tracking-[-0.02em]">
                ProofTrail
              </p>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Evidence Vault
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-[var(--text-secondary)] md:flex">
            <a href="#archive" className="transition hover:text-[var(--text-primary)]">
              Archive
            </a>
            <a href="#evidence" className="transition hover:text-[var(--text-primary)]">
              Evidence
            </a>
            <a href="#proof" className="transition hover:text-[var(--text-primary)]">
              Proof
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <Link
              href="/sign-in"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:text-[var(--accent)] sm:inline-flex"
            >
              Sign in
            </Link>

            <PrimaryButton href="/sign-up" className="px-5 py-2.5">
              Start vault
            </PrimaryButton>
          </div>
        </nav>

        <section className="grid gap-12 pb-20 pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pb-28 lg:pt-24">
          <div>
            <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)] shadow-[var(--shadow-soft)]">
              Personal achievement archive
            </div>

            <h1 className="mt-8 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Preserve achievements with the proof, context, and dignity they
              deserve.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
              ProofTrail is a private evidence vault for certificates, projects,
              awards, publications, and meaningful milestones — built to store
              proof carefully before anything becomes public.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/sign-up" className="px-7 py-3.5">
                Create proof vault
              </PrimaryButton>

              <SecondaryButton href="/sign-in" className="px-7 py-3.5">
                Open existing vault
              </SecondaryButton>
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["Default", "Private"],
                ["Media", "Supported"],
                ["Proof", "Controlled"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]"
                >
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                    Record dossier
                  </p>
                  <h2 className="mt-3 max-w-md text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-3xl">
                    Certificate evidence record
                  </h2>
                </div>

                <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--text-secondary)]">
                  Private
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                {ledgerRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[8rem_1fr] gap-4 border-b border-[var(--border)] px-5 py-4 text-sm last:border-b-0"
                  >
                    <p className="text-[var(--text-muted)]">{label}</p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_13rem]">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Evidence note
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    This certificate is stored with its context, issuer, proof
                    media, and visibility rules. It can later be framed and
                    published only after review.
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--text-primary)] p-4 text-[var(--background)]">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">
                    Proof ID
                  </p>
                  <p className="mt-3 font-mono text-sm font-semibold">
                    PT-2026-9K2X
                  </p>

                  <div className="mt-5 grid aspect-square grid-cols-5 grid-rows-5 gap-1 rounded-xl bg-[var(--background)] p-3">
                    {Array.from({ length: 25 }).map((_, index) => (
                      <div
                        key={index}
                        className={
                          index % 2 === 0 ||
                          index === 6 ||
                          index === 17 ||
                          index === 23
                            ? "rounded-sm bg-[var(--text-primary)]"
                            : "rounded-sm bg-[var(--surface-muted)]"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section
        id="archive"
        className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {proofLayers.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow-soft)]"
            >
              <p className="font-mono text-sm font-semibold text-[var(--text-muted)]">
                {item.label}
              </p>
              <h2 className="mt-7 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="evidence"
        className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10"
      >
        <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
                Not a public display wall
              </p>

              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-[var(--text-primary)] sm:text-4xl">
                Build the archive first. Decide the public presentation later.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-8 text-[var(--text-secondary)]">
                For certificates, ProofTrail should first preserve proof safely:
                certificate scan, moment image, description, issuer, date, and
                context. Public framing should be a deliberate later step.
              </p>
            </div>

            <div className="border-t border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-10 lg:border-l lg:border-t-0">
              <div className="space-y-3">
                {auditItems.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--text-primary)] font-mono text-xs text-[var(--background)]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-secondary)]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[var(--border-strong)] bg-[var(--text-primary)] p-5 text-[var(--background)]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">
                  Product rule
                </p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em]">
                  Public proof is a controlled excerpt, not the whole vault.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="proof"
        className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
              Private by default
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-[var(--text-primary)]">
              Your evidence does not become public accidentally.
            </h2>
            <p className="mt-5 text-sm leading-8 text-[var(--text-secondary)]">
              Uploaded certificates and moment images remain private unless an
              evidence item is intentionally marked public.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
              Certificate frame later
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-[var(--text-primary)]">
              Premium certificate presentation deserves its own phase.
            </h2>
            <p className="mt-5 text-sm leading-8 text-[var(--text-secondary)]">
              Before public certificate pages, we will design a dedicated frame
              system for your certificates and related award moments.
            </p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[var(--border)] px-5 py-9 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>ProofTrail — evidence, context, and controlled proof identity.</p>
          <p>
            Built with care by{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              Sumit Dhara
            </span>
          </p>
        </div>
      </footer>
    </main>
  );
}