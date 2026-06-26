import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { signIn } from "@/app/auth/actions";

type SignInPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
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
              Secure access
            </p>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl">
              Sign in to your proof vault.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-8 text-[var(--text-secondary)]">
              Continue managing private records, attached evidence, proof
              identities, and public access controls from one structured vault.
            </p>

            {error ? (
              <div className="mt-6 rounded-2xl border border-[var(--danger-border)] bg-[var(--danger-soft)] p-5 text-sm text-[var(--danger)]">
                <p className="font-semibold">Sign-in failed.</p>
                <p className="mt-2 leading-7">{error}</p>
              </div>
            ) : null}

            <form action={signIn} className="mt-8 space-y-5">
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
                  minLength={6}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3.5 text-sm font-medium text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[var(--text-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--background)] shadow-[var(--shadow-button)] transition hover:-translate-y-0.5 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                Sign in
              </button>
            </form>

            <div className="mt-7 flex flex-col gap-3 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
              <p>
                New to ProofTrail?{" "}
                <Link
                  href="/sign-up"
                  className="font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                >
                  Create a vault
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
                Vault status
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[var(--text-primary)]">
                Private archive. Controlled proof. Reviewable trust.
              </h2>

              <div className="mt-8 space-y-4">
                {[
                  ["Private records", "Stored inside your vault"],
                  ["Evidence media", "Protected until reviewed"],
                  ["Public proof", "Generated only when ready"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
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