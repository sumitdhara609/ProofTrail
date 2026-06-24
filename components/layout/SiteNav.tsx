import Link from "next/link";

export function SiteNav() {
  return (
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
        <a href="#vault">Vault</a>
        <a href="#proof">Proof Cards</a>
        <a href="#trust">Trust Layer</a>
      </div>

      <div className="flex items-center gap-3">
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
  );
}