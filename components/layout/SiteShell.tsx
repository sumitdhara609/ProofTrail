import { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08090d] text-white">
      <section className="relative px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute left-1/2 top-0 -z-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-0 top-32 -z-0 h-[360px] w-[360px] rounded-full bg-blue-500/10 blur-[120px]" />
        <SiteNav />
      </section>

      {children}

      <SiteFooter />
    </main>
  );
}