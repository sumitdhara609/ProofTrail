import { Container } from "@/components/ui/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container>
        <div className="flex flex-col gap-4 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>ProofTrail — evidence, context, and proof identity.</p>
          <p className="tracking-wide">
            Shaped with discipline by{" "}
            <span className="text-white/70">Sumit Dhara</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}