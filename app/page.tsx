import Link from "next/link";

const proofLayers = [
  {
    label: "01",
    title: "Private archive",
    description:
      "Preserve achievements with issuer, date, context, notes, source links, and supporting media before anything becomes public.",
  },
  {
    label: "02",
    title: "Evidence dossier",
    description:
      "Attach certificates, PDFs, screenshots, project links, publication links, and award moments as structured evidence.",
  },
  {
    label: "03",
    title: "Controlled proof",
    description:
      "Generate a QR-backed public proof identity only when a record is ready for selected public sharing.",
  },
];

const ledgerRows = [
  ["Record", "Advanced Programming Certificate"],
  ["Issuer", "Training Academy"],
  ["Evidence", "Certificate image · PDF · Source note"],
  ["Visibility", "Private archive"],
  ["Public status", "Not shared"],
];

const auditItems = [
  "Record created",
  "Certificate evidence attached",
  "Media stored privately",
  "Public proof not generated",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f1e8] text-[#171512]">
      <section className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-3xl border border-[#d8d0c2] bg-[#fffaf1]/85 px-5 py-4 shadow-[0_20px_70px_rgba(65,48,28,0.08)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#171512] text-xs font-bold tracking-[0.16em] text-[#fffaf1]">
              PT
            </div>

            <div>
              <p className="text-base font-semibold tracking-[-0.02em]">
                ProofTrail
              </p>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8b7d67]">
                Evidence Vault
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-[#6f6250] md:flex">
            <a href="#archive" className="transition hover:text-[#171512]">
              Archive
            </a>
            <a href="#evidence" className="transition hover:text-[#171512]">
              Evidence
            </a>
            <a href="#proof" className="transition hover:text-[#171512]">
              Proof
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#6f6250] transition hover:text-[#171512] sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="rounded-full bg-[#171512] px-5 py-2.5 text-sm font-semibold text-[#fffaf1] shadow-[0_15px_40px_rgba(23,21,18,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2a251f]"
            >
              Start vault
            </Link>
          </div>
        </nav>

        <section className="grid gap-10 pb-20 pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pb-28 lg:pt-24">
          <div>
            <div className="inline-flex rounded-full border border-[#d8d0c2] bg-[#fffaf1] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#81653b] shadow-[0_14px_40px_rgba(65,48,28,0.07)]">
              Personal achievement archive
            </div>

            <h1 className="mt-8 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[#171512] sm:text-5xl lg:text-6xl">
              Preserve achievements with the proof, context, and dignity they
              deserve.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#625748]">
              ProofTrail is a private evidence vault for certificates, projects,
              awards, publications, and meaningful milestones — built to store
              proof carefully before anything becomes public.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-[#171512] px-7 py-3.5 text-sm font-semibold text-[#fffaf1] shadow-[0_18px_50px_rgba(23,21,18,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2a251f]"
              >
                Create proof vault
              </Link>

              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-full border border-[#d8d0c2] bg-[#fffaf1] px-7 py-3.5 text-sm font-semibold text-[#4f463a] shadow-[0_15px_45px_rgba(65,48,28,0.08)] transition hover:-translate-y-0.5 hover:border-[#b9ad9b]"
              >
                Open existing vault
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["Default", "Private"],
                ["Media", "Supported"],
                ["Proof", "Controlled"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#d8d0c2] bg-[#fffaf1] p-4 shadow-[0_14px_40px_rgba(65,48,28,0.06)]"
                >
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#9a8b75]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#171512]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-[#d8d0c2] bg-[#fffaf1] p-5 shadow-[0_30px_90px_rgba(65,48,28,0.13)]">
            <div className="rounded-[1.75rem] border border-[#ded6c9] bg-[#f8f2e8] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#81653b]">
                    Record dossier
                  </p>
                  <h2 className="mt-3 max-w-md text-2xl font-semibold tracking-[-0.04em] text-[#171512] sm:text-3xl">
                    Certificate evidence record
                  </h2>
                </div>

                <div className="rounded-full border border-[#d8d0c2] bg-[#fffaf1] px-3 py-1 text-xs font-bold text-[#625748]">
                  Private
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-[#d8d0c2] bg-[#fffaf1]">
                {ledgerRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[8rem_1fr] gap-4 border-b border-[#e5ded1] px-5 py-4 text-sm last:border-b-0"
                  >
                    <p className="text-[#8b7d67]">{label}</p>
                    <p className="font-semibold text-[#171512]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_13rem]">
                <div className="rounded-2xl border border-[#d8d0c2] bg-[#fffaf1] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a8b75]">
                    Evidence note
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#625748]">
                    This certificate is stored with its context, issuer, proof
                    media, and visibility rules. It can later be framed and
                    published only after review.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#d8d0c2] bg-[#171512] p-4 text-[#fffaf1]">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8ac99]">
                    Proof ID
                  </p>
                  <p className="mt-3 font-mono text-sm font-semibold">
                    PT-2026-9K2X
                  </p>

                  <div className="mt-5 grid aspect-square grid-cols-5 grid-rows-5 gap-1 rounded-xl bg-[#fffaf1] p-3">
                    {Array.from({ length: 25 }).map((_, index) => (
                      <div
                        key={index}
                        className={
                          index % 2 === 0 ||
                          index === 6 ||
                          index === 17 ||
                          index === 23
                            ? "rounded-sm bg-[#171512]"
                            : "rounded-sm bg-[#e8dfd1]"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section
        id="archive"
        className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {proofLayers.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-[#d8d0c2] bg-[#fffaf1] p-7 shadow-[0_18px_60px_rgba(65,48,28,0.08)]"
            >
              <p className="font-mono text-sm font-semibold text-[#9a8b75]">
                {item.label}
              </p>
              <h2 className="mt-7 text-2xl font-semibold tracking-[-0.04em] text-[#171512]">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#625748]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="evidence"
        className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10"
      >
        <div className="overflow-hidden rounded-[2.5rem] border border-[#d8d0c2] bg-[#fffaf1] shadow-[0_28px_90px_rgba(65,48,28,0.12)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#81653b]">
                Not a public display wall
              </p>

              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#171512] sm:text-4xl">
                Build the archive first. Decide the public presentation later.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-8 text-[#625748]">
                For certificates, ProofTrail should first preserve proof safely:
                certificate scan, moment image, description, issuer, date, and
                context. Public framing should be a deliberate later step.
              </p>
            </div>

            <div className="border-t border-[#d8d0c2] bg-[#f8f2e8] p-8 sm:p-10 lg:border-l lg:border-t-0">
              <div className="space-y-3">
                {auditItems.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border border-[#d8d0c2] bg-[#fffaf1] p-4 shadow-[0_12px_35px_rgba(65,48,28,0.06)]"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-[#171512] font-mono text-xs text-[#fffaf1]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="text-sm font-semibold text-[#4f463a]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#171512] bg-[#171512] p-5 text-[#fffaf1]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8ac99]">
                  Product rule
                </p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em]">
                  Public proof is a controlled excerpt, not the whole vault.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="proof"
        className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[#d8d0c2] bg-[#fffaf1] p-8 shadow-[0_18px_60px_rgba(65,48,28,0.08)]">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#81653b]">
              Private by default
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#171512]">
              Your evidence does not become public accidentally.
            </h2>
            <p className="mt-5 text-sm leading-8 text-[#625748]">
              Uploaded certificates and moment images remain private unless an
              evidence item is intentionally marked public.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#d8d0c2] bg-[#fffaf1] p-8 shadow-[0_18px_60px_rgba(65,48,28,0.08)]">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#81653b]">
              Certificate frame later
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#171512]">
              Premium certificate presentation deserves its own phase.
            </h2>
            <p className="mt-5 text-sm leading-8 text-[#625748]">
              Before public certificate pages, we will design a dedicated frame
              system for your 50–60 certificates and related award moments.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d8d0c2] px-5 py-9 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[#8b7d67] sm:flex-row sm:items-center sm:justify-between">
          <p>ProofTrail — evidence, context, and controlled proof identity.</p>
          <p>
            Built with care by{" "}
            <span className="font-semibold text-[#171512]">Sumit Dhara</span>
          </p>
        </div>
      </footer>
    </main>
  );
}