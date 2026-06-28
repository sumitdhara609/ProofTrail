import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { signUp } from "@/app/auth/actions";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function formatAuthError(error: string) {
  const lowerError = error.toLowerCase();

  if (lowerError.includes("already") || lowerError.includes("registered")) {
    return "An account may already exist with this email. Try signing in instead.";
  }

  if (lowerError.includes("password")) {
    return "Please use a stronger password with at least 8 characters.";
  }

  if (lowerError.includes("email")) {
    return "Please check the email address and try again.";
  }

  return error;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { error } = await searchParams;

  return (
    <main className="premium-noise relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[96rem] flex-col px-5 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--text-primary)] text-xs font-bold tracking-[0.16em] text-[var(--background)]">
              PT
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[-0.02em]">
                ProofTrail
              </p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Create proof vault
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <Link
              href="/sign-in"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
            >
              Sign in
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,1.05fr)] lg:items-center lg:py-16">
          <section className="overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)]/92 shadow-[var(--shadow-card)] backdrop-blur-xl">
            <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-7 sm:p-10 lg:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Create vault
              </p>

              <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl">
                Start your private proof archive.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-8 text-[var(--text-secondary)]">
                Create a structured vault for achievements, certificates,
                projects, awards, publications, and milestones before anything
                becomes public.
              </p>
            </div>

            <div className="p-7 sm:p-10 lg:p-12">
              {error ? (
                <div className="mb-6 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-sm text-[var(--danger)]">
                  <p className="font-semibold">Vault could not be created.</p>
                  <p className="mt-2 leading-7">{formatAuthError(error)}</p>
                </div>
              ) : null}

              <form action={signUp} className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="text-sm font-semibold text-[var(--text-secondary)]"
                  >
                    Full name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    placeholder="Your name"
                    title="Enter your full name."
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3.5 text-sm font-medium text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] invalid:border-[var(--danger-border)] focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-[var(--text-secondary)]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Enter a valid email address, for example you@example.com"
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3.5 text-sm font-medium text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] invalid:border-[var(--danger-border)] focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[var(--text-secondary)]"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    title="Password must be at least 8 characters long."
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3.5 text-sm font-medium text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] invalid:border-[var(--danger-border)] focus:border-[var(--accent)]"
                  />

                  <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                    Use a unique password with at least 8 characters.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[var(--text-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--background)] shadow-[var(--shadow-button)] transition hover:-translate-y-0.5 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                >
                  Create proof vault
                </button>
              </form>

              <div className="mt-7 flex flex-col gap-3 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Already have a vault?{" "}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                  >
                    Sign in
                  </Link>
                </p>

                <Link
                  href="/"
                  className="font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                >
                  Back home →
                </Link>
              </div>
            </div>
          </section>

          <aside className="hidden lg:block">
            <div className="rounded-[2.75rem] border border-[var(--border)] bg-[var(--surface)]/78 p-8 shadow-[var(--shadow-card)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Archive principle
              </p>

              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)]">
                Preserve first. Review carefully. Share selectively.
              </h2>

              <p className="mt-5 text-sm leading-8 text-[var(--text-secondary)]">
                ProofTrail is designed for a deliberate kind of credibility:
                records with context, evidence, visibility controls, and public
                proof identities only when they are ready.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  [
                    "Private by default",
                    "New records and files stay inside your vault until reviewed.",
                  ],
                  [
                    "Evidence with context",
                    "Attach certificates, images, PDFs, links, notes, and supporting references.",
                  ],
                  [
                    "Controlled public proof",
                    "Generate QR-backed proof cards only for selected, public-ready records.",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      {label}
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text-primary)]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}