import Link from "next/link";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function SiteNav() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[var(--border)] bg-[var(--surface)]/85 px-5 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--text-primary)] text-sm font-semibold text-[var(--background)]">
          PT
        </div>
        <span className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">
          ProofTrail
        </span>
      </Link>

      <div className="hidden items-center gap-8 text-sm text-[var(--text-secondary)] md:flex">
        <a
          href="#system"
          className="transition hover:text-[var(--text-primary)]"
        >
          System
        </a>
        <a href="#proof" className="transition hover:text-[var(--text-primary)]">
          Proof Cards
        </a>
        <a href="#trust" className="transition hover:text-[var(--text-primary)]">
          Trust Layer
        </a>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        <Link
          href="/sign-in"
          className="hidden rounded-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] sm:inline-flex"
        >
          Sign in
        </Link>

        <PrimaryButton href="/sign-up" className="px-4 py-2">
          Start vault
        </PrimaryButton>
      </div>
    </nav>
  );
}