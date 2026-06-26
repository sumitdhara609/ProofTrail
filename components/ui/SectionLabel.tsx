import { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
      {children}
    </p>
  );
}