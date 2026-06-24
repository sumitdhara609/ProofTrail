import Link from "next/link";
import { ReactNode } from "react";

type SecondaryButtonProps = {
  href: string;
  children: ReactNode;
};

export function SecondaryButton({ href, children }: SecondaryButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.06]"
    >
      {children}
    </Link>
  );
}