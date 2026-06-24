import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-6 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
          ProofTrail
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Sign in to your vault
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/55">
          Authentication will be connected in the next phase. This page is part
          of the product shell.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/45">
          Secure sign-in form coming soon.
        </div>

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