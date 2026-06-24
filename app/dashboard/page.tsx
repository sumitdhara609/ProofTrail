export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#08090d] px-6 py-10 text-white sm:px-10 lg:px-16">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">
          Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
          Your verification command center.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
          This dashboard will later show vault health, verification status,
          evidence count, public proof cards, and recent audit activity.
        </p>
      </section>
    </main>
  );
}