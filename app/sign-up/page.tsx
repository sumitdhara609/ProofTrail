import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { signUp } from "@/app/auth/actions";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { error } = await searchParams;

  return (
    <main className="premium-noise relative min-h-screen overflow-hidden bg-[var(--background)] px-5 py-6 text-[var(--text-primary)] sm:px-8 lg:px-10">
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <nav className="flex items-center justify-between rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)]/88 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--text-primary)] text-xs font-bold tracking-[0.16em] text-[var(--background)]">
              PT
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[-0.02em]">
                ProofTrail
              </p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Evidence vault
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </nav>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16">
          <section className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)]/92 p-7 shadow-[var(--shadow-card)] backdrop-blur-xl sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Create vault
            </p>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl">
              Start your private proof archive.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-8 text-[var(--text-secondary)]">
              Build a structured vault for certificates, projects, awards,
              publications, and meaningful records before anything becomes
              public.
            </p>

            {error ? (
              <div className="mt-6 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-sm text-[var(--danger)]">
                <p className="font-semibold">Vault could not be created.</p>
                <p className="mt-2 leading-7">{error}</p>
              </div>
            ) : null}

            <form action={signUp} className="mt-8 space-y-5">
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
                Create vault
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
          </section>

          <aside className="hidden lg:block">
            <div className="rounded-[2.75rem] border border-[var(--border)] bg-[var(--surface)]/78 p-8 shadow-[var(--shadow-card)] backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Archive principle
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)]">
                Preserve first. Review carefully. Share selectively.
              </h2>

              <div className="mt-8 rounded-[2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-6">
                <p className="text-sm leading-8 text-[var(--text-secondary)]">
                  ProofTrail is designed for a slower, more deliberate kind of
                  credibility: records with proof, context, visibility controls,
                  and public identities only when they are ready.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}