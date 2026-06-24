type SectionLabelProps = {
  children: string;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200/80">
      {children}
    </p>
  );
}