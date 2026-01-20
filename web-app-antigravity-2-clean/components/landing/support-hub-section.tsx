import Link from "next/link";

import { supportHub } from "@/src/content/landing";

const bullets = supportHub.bullets;

export function SupportHubSection() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-12 md:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.16),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,0,0,0.12),transparent_35%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0b0b] via-[#070707] to-black px-6 py-8 shadow-[0_60px_160px_rgba(255,0,0,0.16)] md:grid-cols-[1.05fr_1fr] md:px-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-red-200">
            Support Hub
          </div>
          <h2 className="text-3xl font-semibold text-white leading-tight">{supportHub.headline}</h2>
          <p className="text-sm text-slate-300">{supportHub.copy}</p>
          <ul className="space-y-3">
            {bullets.map((item) => (
              <li
                key={item}
                className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:-translate-y-1 hover:border-red-300/50 hover:shadow-[0_24px_90px_rgba(255,0,0,0.2)]"
              >
                <span className="mt-0.5 grid h-9 w-9 place-items-center rounded-full border border-red-500/60 bg-black text-xs font-bold text-red-200 transition group-hover:shadow-[0_0_0_6px_rgba(255,0,0,0.2)]">
                  ❤️
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href={supportHub.cta.href}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_30px_90px_rgba(255,0,0,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_34px_110px_rgba(255,0,0,0.5)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-400"
          >
            {supportHub.cta.label} →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="group relative col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_30px_120px_rgba(255,0,0,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_40px_140px_rgba(255,0,0,0.22)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-red-700/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
              <button
                type="button"
                className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_20px_60px_rgba(255,0,0,0.35)] transition hover:scale-105 hover:shadow-[0_28px_80px_rgba(255,0,0,0.55)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-400"
                aria-label="Play preview"
              >
                ▶
              </button>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                Video coming soon
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 space-y-2 px-4 pb-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-white/70">
                <span>0:00</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  HD
                </span>
                <span>1:45</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-red-400 to-red-600 transition duration-300 group-hover:w-2/3" />
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70">
            <div className="flex h-36 items-center justify-center text-sm text-slate-300">Image placeholder</div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-red-500/15" />
          </div>
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70">
            <div className="flex h-36 items-center justify-center text-sm text-slate-300">Image placeholder</div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-red-500/15" />
          </div>
        </div>
      </div>
    </section>
  );
}
