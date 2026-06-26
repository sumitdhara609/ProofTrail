import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { signIn } from "@/app/auth/actions";

type SignInPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-10 text-[var(--text-primary)]">
      <section className="w-full max-w-md">
        <GlassCard className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            ProofTrail
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Sign in to your proof vault.
          </h1>

          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
            Continue managing your private records, evidence, proof identities,
            and public access controls.
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
                Use the email address connected to your ProofTrail vault.
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
                minLength={6}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-semibold text-[var(--background)] shadow-[var(--shadow-soft)] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-sm text-[var(--text-muted)]">
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
            className="mt-8 inline-flex text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
          >
            ← Back to home
          </Link>
        </GlassCard>
      </section>
    </main>
  );
}