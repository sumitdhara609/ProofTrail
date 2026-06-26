import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const archiveStats = [
  ["Vault mode", "Private first"],
  ["Proof access", "Withdrawable"],
  ["Media evidence", "Certificate · Image · PDF"],
];

const principles = [
  {
    title: "Archive before display.",
    description:
      "Every achievement starts as a preserved record with context, issuer, date, evidence, media, and private notes before anything becomes public.",
  },
  {
    title: "Public means selected.",
    description:
      "A public proof page shows only the record and evidence intentionally marked public. The private vault remains protected.",
  },
  {
    title: "Credibility without noise.",
    description:
      "ProofTrail is designed to feel like a quiet evidence archive, not a loud portfolio template or social media showcase.",
  },
];

const timeline = [
  ["01", "Record created", "A structured achievement dossier is preserved."],
  ["02", "Evidence attached", "Links, certificates, images, PDFs, and notes are connected."],
  ["03", "Proof identity issued", "A QR-backed public proof card can be generated."],
  ["04", "Access controlled", "Public proof can be withdrawn without deleting the record."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <section className="relative px-5 py-6 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />
        <div className="pointer-events-none absolute left-[-14rem] top-20 h-[34rem] w-[34rem] rounded-full bg-[var(--accent-soft)] blur-[150px]" />
        <div className="pointer-events-none absolute right-[-12rem] top-0 h-[32rem] w-[32rem] rounded-full bg-[var(--surface-muted)] blur-[150px]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-[1.7rem] border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[var(--border-strong)] bg-[var(--text-primary)] text-xs font-bold tracking-[0.16em] text-[var(--background)]">
              PT
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                ProofTrail
              </p>
              <p className="hidden text-[0.65rem] uppercase tracking-[0.2em] text-[var(--text-muted)] sm:block">
                Evidence vault
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-medium text-[var(--text-secondary)] lg:flex">
            <a href="#archive" className="transition hover:text-[var(--text-primary)]">
              Archive
            </a>
            <a href="#dossier" className="transition hover:text-[var(--text-primary)]">
              Dossier
            </a>
            <a href="#trust" className="transition hover:text-[var(--text-primary)]">
              Trust
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <Link
              href="/sign-in"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="rounded-full bg-[var(--text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Start vault
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 pb-20 pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pb-28 lg:pt-28">
          <div>
            <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)] shadow-[var(--shadow-soft)]">
              Personal proof archive
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.07em] text-[var(--text-primary)] sm:text-6xl lg:text-7xl">
              A quieter, stronger way to preserve what you have earned.
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              ProofTrail turns achievements into structured evidence records —
              with context, files, public proof identities, and controlled
              visibility built around trust instead of noise.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-[var(--text-primary)] px-7 py-3.5 text-sm font-semibold text-[var(--background)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Create proof vault
              </Link>

              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-7 py-3.5 text-sm font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              >
                Open existing vault
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl gap-3 sm:grid-cols-3">
              {archiveStats.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/85 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl"
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[3rem] border border-[var(--border)] bg-[var(--surface)]/30 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.6rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
              <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                      Proof dossier
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      Controlled evidence record
                    </p>
                  </div>

                  <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                    PT-2026-9K2X
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1fr_15rem]">
                <div className="p-6 sm:p-8">
                  <div className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Achievement record
                    </p>

                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-[var(--text-primary)]">
                      Product Build Milestone
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                      A preserved record containing context, proof media,
                      selected public evidence, and an audit-aware identity.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Record type", "Achievement dossier"],
                      ["Visibility", "Unlisted proof"],
                      ["Evidence", "4 public · 9 private"],
                      ["Media", "Certificate · PDF"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
                      >
                        <p className="text-xs text-[var(--text-muted)]">{label}</p>
                        <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[var(--border)] bg-[var(--surface-soft)] p-6 lg:border-l lg:border-t-0">
                  <div className="grid aspect-square place-items-center rounded-[1.8rem] border border-[var(--border)] bg-white p-5">
                    <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-1">
                      {Array.from({ length: 25 }).map((_, index) => (
                        <div
                          key={index}
                          className={
                            index % 2 === 0 ||
                            index === 7 ||
                            index === 18 ||
                            index === 21
                              ? "rounded-sm bg-[#111]"
                              : "rounded-sm bg-[#eee]"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    QR backed
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    A public proof card can be opened, reviewed, and withdrawn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="archive"
        className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {principles.map((principle, index) => (
            <div
              key={principle.title}
              className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow-soft)]"
            >
              <p className="font-mono text-sm text-[var(--text-muted)]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                {principle.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="dossier"
        className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12"
      >
        <div className="overflow-hidden rounded-[2.75rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Not a portfolio template
              </p>

              <h2 className="mt-6 max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-[var(--text-primary)] sm:text-5xl">
                Built to feel like an archive, not a loud display wall.
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-8 text-[var(--text-secondary)] sm:text-base">
                Certificates, projects, publications, awards, and moments can
                live as evidence records first. Public presentation comes later,
                only when the record is ready and intentionally selected.
              </p>

              <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Product principle
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  ProofTrail should make credibility feel calm, documented, and
                  reviewable — never desperate, flashy, or over-explained.
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--border)] bg-[var(--surface-soft)] p-8 sm:p-12 lg:border-l lg:border-t-0">
              <div className="space-y-4">
                {timeline.map(([number, action, detail]) => (
                  <div
                    key={action}
                    className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] font-mono text-xs text-[var(--text-muted)]">
                        {number}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {action}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                          {detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.75rem] border border-[var(--border)] bg-[var(--text-primary)] p-5 text-[var(--background)] shadow-[var(--shadow-soft)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
                  Final layer
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
        id="trust"
        className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-card)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Public boundaries
            </p>
            <h2 className="mt-6 text-4xl font-semibold leading-[1] tracking-[-0.06em] text-[var(--text-primary)]">
              Private evidence stays private by design.
            </h2>
            <p className="mt-6 text-sm leading-8 text-[var(--text-secondary)]">
              A public proof card can show selected context, selected sources,
              and selected media. Everything else remains inside the vault.
            </p>
          </div>

          <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-card)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Evidence media
            </p>
            <h2 className="mt-6 text-4xl font-semibold leading-[1] tracking-[-0.06em] text-[var(--text-primary)]">
              Certificates deserve a dedicated visual system.
            </h2>
            <p className="mt-6 text-sm leading-8 text-[var(--text-secondary)]">
              Media evidence can include certificate scans, award moments,
              PDFs, and supporting images. The premium certificate frame system
              should be designed separately before public use.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
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