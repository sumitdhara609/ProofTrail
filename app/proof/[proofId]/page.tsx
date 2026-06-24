type ProofPageProps = {
  params: Promise<{
    proofId: string;
  }>;
};

export default async function PublicProofPage({ params }: ProofPageProps) {
  const { proofId } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-6 py-10 text-white">
      <section className="w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
          Public Proof Card
        </p>

        <div className="mt-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">
              ProofTrail ID
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              {proofId}
            </h1>
          </div>

          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white text-xs font-bold text-black">
            QR
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-cyan-200">Evidence Attached</p>
          <h2 className="mt-2 text-2xl font-semibold">
            Demo Achievement Record
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/55">
            This public page will later display achievement context, issuer,
            date, verification status, evidence summary, and QR-backed sharing.
          </p>
        </div>
      </section>
    </main>
  );
}