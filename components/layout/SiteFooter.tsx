export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-4 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>ProofTrail — evidence, context, and controlled proof identity.</p>

          <p>
            Built with care by{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              Sumit Dhara
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}