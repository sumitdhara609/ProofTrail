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
      className={`group inline-flex min-h-11 items-center justify-center rounded-full border border-[#171512] bg-[#171512] px-6 py-3 text-sm font-semibold shadow-[var(--shadow-button)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#2a251f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:border-[#fffaf1] dark:bg-[#fffaf1] dark:hover:bg-[#eadfce] ${className}`}
    >
      <span className="relative z-10 !text-[#fffaf1] dark:!text-[#171512]">
        {children}
      </span>
    </Link>
  );
}