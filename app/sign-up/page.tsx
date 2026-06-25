import Link from "next/link";
import { signUp } from "@/app/auth/actions";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-6 py-10 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
          ProofTrail
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Create your proof vault.
        </h1>

        <p className="mt-4 text-sm leading-7 text-white/55">
          Start a private vault for preserving achievement records, attaching
          evidence, and controlling what becomes publicly shareable.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-100">
            <p className="font-medium">Vault could not be created.</p>
            <p className="mt-2 leading-7 text-red-100/70">{error}</p>
          </div>
        ) : null}

        <form action={signUp} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-white/70"
            >
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Your name"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-white/70">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-white/70"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/40"
            />
            <p className="mt-2 text-xs leading-5 text-white/35">
              Use a password that is unique to this account.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Create vault
          </button>
        </form>

        <p className="mt-6 text-sm text-white/45">
          Already have a vault?{" "}
          <Link href="/sign-in" className="font-medium text-cyan-200">
            Sign in
          </Link>
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex text-sm font-medium text-cyan-200"
        >
          ← Back to home
        </Link>
      </section>
    </main>
  );
}