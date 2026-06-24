import Link from "next/link";
import { ReactNode } from "react";

type PrimaryButtonProps = {
  href: string;
  children: ReactNode;
};

export function PrimaryButton({ href, children }: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
    >
      {children}
    </Link>
  );
}