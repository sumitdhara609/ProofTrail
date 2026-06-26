import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { signUp } from "@/app/auth/actions";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-10 text-[var(--text-primary)]">
      <section className="w-full max-w-md">
        <GlassCard className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            ProofTrail
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Create your proof vault.
          </h1>

          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
            Start a private vault for preserving achievement records, attaching
            evidence, and controlling what becomes publicly shareable.
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
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] invalid:border-[var(--danger-border)] focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-[var(--text-secondary)]"
              >
                Email
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
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] invalid:border-[var(--danger-border)] focus:border-[var(--accent)]"
              />
              <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                Enter a valid email address. You may need it for account access
                and confirmation.
              </p>
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
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] invalid:border-[var(--danger-border)] focus:border-[var(--accent)]"
              />
              <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                Use a password that is unique to this account and at least 8
                characters long.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-semibold text-[var(--background)] shadow-[var(--shadow-soft)] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              Create vault
            </button>
          </form>

          <p className="mt-6 text-sm text-[var(--text-muted)]">
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
            className="mt-8 inline-flex text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
          >
            ← Back to home
          </Link>
        </GlassCard>
      </section>
    </main>
  );
}