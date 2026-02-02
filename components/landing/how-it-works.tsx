import { howItWorks } from "@/src/content/landing";

export function HowItWorksBand() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-12 md:px-10">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(255,0,0,0.12),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#080808] to-black px-6 py-8 shadow-[0_50px_140px_rgba(255,0,0,0.14)] md:grid-cols-[1.1fr_1fr] md:px-10">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">Flow</p>
          <h2 className="text-3xl font-semibold text-white">{howItWorks.title}</h2>
          <p className="text-sm text-slate-300">{howItWorks.description}</p>
        </div>
        <div className="grid gap-4">
          {howItWorks.steps.map((step, idx) => (
            <div
              key={step.title}
              className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 transition hover:-translate-y-1 hover:border-red-300/50 hover:shadow-[0_24px_90px_rgba(255,0,0,0.22)]"
            >
              <div className="grid h-10 w-10 place-items-center rounded-full border border-red-500/50 bg-black text-sm font-bold text-red-200 transition group-hover:shadow-[0_0_0_6px_rgba(255,0,0,0.15)]">
                {idx + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="text-xs text-slate-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
