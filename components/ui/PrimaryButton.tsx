import Link from "next/link";
import { ReactNode } from "react";

type PrimaryButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function PrimaryButton({
  href,
  children,
  className = "",
}: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full bg-[#171512] px-6 py-3 text-sm font-semibold text-[#fffaf1] shadow-[var(--shadow-button)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#2a251f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[#fffaf1] dark:text-[#171512] dark:hover:bg-[#eadfce] ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}