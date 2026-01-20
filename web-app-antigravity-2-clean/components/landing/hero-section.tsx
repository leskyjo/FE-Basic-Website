import Image from "next/image";
import Link from "next/link";

import { heroContent } from "@/src/content/landing";
import { MediaBlock } from "./media-block";

const highlightCardClasses =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0b0b]/90 to-[#050505]/90 shadow-[0_50px_140px_rgba(255,0,0,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_60px_160px_rgba(255,0,0,0.2)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0b0b0b] via-[#050505] to-black px-6 pb-14 pt-6 md:px-10 md:pt-12">
      <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-2">
        {/* LEFT: Text + Highlight Card */}
        <div className="space-y-6 text-left">
          <p className="sectionEyebrow text-sm md:text-xl text-red-400">{heroContent.eyebrow}</p>
          <h1 className="sectionTitle text-[34px] md:text-[52px]">{heroContent.title}</h1>
          <p className="sectionSubhead max-w-2xl text-xl md:text-2xl">{heroContent.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={heroContent.primaryCta.href}
              className="action-focus rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_34px_110px_rgba(255,0,0,0.38)] transition hover:-translate-y-0.5 hover:shadow-[0_44px_140px_rgba(255,0,0,0.55)]"
            >
              {heroContent.primaryCta.label}
            </Link>
            <Link
              href={heroContent.secondaryCta.href}
              className="action-focus rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-slate-200 shadow-[0_14px_60px_rgba(255,0,0,0.12)] transition hover:-translate-y-0.5 hover:border-red-300 hover:text-white hover:shadow-[0_24px_90px_rgba(255,0,0,0.24)]"
            >
              {heroContent.secondaryCta.label}
            </Link>
          </div>

          <div className={highlightCardClasses}>
            <Image
              src="/hero-credit.jpg.png"
              alt="Hero visual"
              width={800}
              height={640}
              className="absolute inset-0 h-full w-full object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/60 to-transparent" />
            <div className="relative space-y-4 p-6">
              <div className="sectionEyebrow">Highlighted actions</div>
              <h3 className="sectionTitle text-2xl md:text-3xl">Everything tuned to your next move</h3>
              <p className="text-xl md:text-2xl text-slate-100">
              </p>
              <div className="space-y-3">
                {heroContent.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-lg text-slate-200 transition hover:border-red-300/60 hover:shadow-[0_20px_60px_rgba(255,0,0,0.25)]"
                  >
                    <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-red-500/20 text-xs font-bold text-red-300">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute right-6 bottom-6 h-24 w-24 rounded-full bg-gradient-to-br from-red-500/30 via-red-500/15 to-transparent opacity-80 shadow-[0_0_60px_rgba(255,0,0,0.35)] ring-1 ring-red-500/30 backdrop-blur-sm"
              >
                <div className="absolute inset-3 rounded-full bg-black/40 ring-1 ring-red-400/40" />
                <div className="absolute inset-6 grid place-items-center rounded-full bg-red-500/30 text-xs font-semibold text-white/80">
                  FE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Video aligned to top */}
        <div className="relative">
          <MediaBlock
            type="video"
            src="/hero-credit.jpg.png"
            alt="Hero preview"
            label="Preview"
            className="w-full min-h-[540px] md:min-h-[660px]"
          />
        </div>
      </div>
    </section>
  );
}
