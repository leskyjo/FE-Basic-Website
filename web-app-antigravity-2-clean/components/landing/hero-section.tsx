import Link from "next/link";
import { MediaBlock } from "./media-block";

export function HeroSection() {
  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 px-4 py-2.5 text-center text-sm font-medium text-white">
        Coming Soon to iOS &amp; Android
      </div>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#050505] px-6 pb-20 pt-20 md:px-10 md:pt-28">
        {/* Background glow */}
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/8 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Pill Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-red-400">
            Ownership Over Excuses
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            From Setback to{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text font-serif italic text-transparent">
              Ownership
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            Felon Entrepreneur is the execution platform for justice-impacted individuals ready to
            build legitimate income, real businesses, and lasting legacy. No fluff. No excuses. Just systems that work.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#features"
              className="group flex items-center gap-2 rounded-lg bg-red-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:bg-red-400 hover:shadow-xl hover:shadow-red-500/30"
            >
              See What&apos;s Inside
              <span className="transition group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          {/* Video Section - Centered */}
          <div className="mx-auto mt-16 max-w-3xl">
            <MediaBlock
              type="video"
              videoSrc="/fe-intro-video.mp4"
              src="/hero-credit.jpg.png"
              alt="Felon Entrepreneur intro video"
              label="Watch"
              className="w-full min-h-[400px] md:min-h-[500px] rounded-2xl"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-auto mt-20 max-w-3xl border-t border-white/10" />

        {/* Trust Indicators */}
        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Built for Second Chances. Designed for First-Class Results.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-2xl font-bold text-white md:text-3xl">AI-Powered</div>
              <div className="mt-1 text-sm text-slate-500">Life Planning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white md:text-3xl">Fair-Chance</div>
              <div className="mt-1 text-sm text-slate-500">Employers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white md:text-3xl">Business</div>
              <div className="mt-1 text-sm text-slate-500">Builder Tools</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
