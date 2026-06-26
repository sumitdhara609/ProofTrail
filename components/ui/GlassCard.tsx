import { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={`rounded-[2rem] border border-[var(--border)] bg-[var(--surface)]/92 shadow-[var(--shadow-card)] backdrop-blur-xl transition duration-200 ${className}`}
    >
      {children}
    </div>
  );
}