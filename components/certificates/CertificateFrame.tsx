import { ReactNode } from "react";

type CertificateFrameProps = {
  children: ReactNode;
  className?: string;
};

export function CertificateFrame({
  children,
  className = "",
}: CertificateFrameProps) {
  return (
    <div
      className={`rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface-soft)] p-4 shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--surface)] p-3">
        <div className="rounded-[1.25rem] border border-[rgba(0,0,0,0.06)] bg-[#fffdf8] p-3 dark:border-[rgba(255,255,255,0.08)] dark:bg-[#16120f]">
          {children}
        </div>
      </div>
    </div>
  );
}