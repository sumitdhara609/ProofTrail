import { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      {children}
    </main>
  );
}