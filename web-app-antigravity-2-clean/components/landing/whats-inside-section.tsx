import Link from "next/link";

const insideFeatures = [
  {
    icon: "🎯",
    title: "Personalized Life Plan",
    description:
      "AI builds a custom roadmap from your goals—weekly, monthly, quarterly action steps you can actually execute.",
  },
  {
    icon: "💼",
    title: "Job Discovery",
    description:
      "Find fair-chance employers who hire people with records. Resume builder, job search, and application tracking.",
  },
  {
    icon: "🏗️",
    title: "Build My Business",
    description:
      "Step-by-step workflow to start your own business—from idea to LLC to income. Verified resources, no guesswork.",
  },
  {
    icon: "📖",
    title: "Stories",
    description:
      "Connect with a community that gets it. Share your journey, find inspiration, build real connections.",
  },
  {
    icon: "⚡",
    title: "Cheat Codes",
    description:
      "Short video lessons with instant wins—credit hacks, business shortcuts, mindset resets. Quick to watch, easy to apply.",
  },
  {
    icon: "🛒",
    title: "Shop",
    description:
      "Premium merch for people building something real. Limited drops, mission-driven designs.",
  },
];

const coreValues = [
  {
    stat: "Systems",
    label: "Over Motivation",
    description: "Daily structure that keeps you moving forward",
  },
  {
    stat: "Ownership",
    label: "Over Excuses",
    description: "Build income you control, not permission you wait for",
  },
  {
    stat: "Execution",
    label: "Over Theory",
    description: "Real tools, real actions, real results",
  },
];

export function WhatsInsideSection() {
  return (
    <section id="features" className="relative bg-[#050505] px-6 py-20 md:px-10">
      {/* Background glow */}
      <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-red-500/5 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
            What&apos;s Inside
          </p>
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
              Rebuild
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Felon Entrepreneur isn&apos;t just an app—it&apos;s a complete system for turning setbacks into ownership.
            From personalized planning to business building, everything works together to move you forward.
          </p>
        </div>

        {/* Core Values Row */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {coreValues.map((value) => (
            <div
              key={value.stat}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] to-[#050505] p-6 text-center"
            >
              <div className="mb-2 text-3xl font-bold text-red-400">{value.stat}</div>
              <div className="mb-3 text-lg font-semibold text-white">{value.label}</div>
              <p className="text-sm text-slate-400">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insideFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] via-[#090909] to-[#050505] p-6 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-[0_30px_100px_rgba(255,0,0,0.15)]"
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-slate-400">
            Ready to see how it all works together?
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:bg-red-400 hover:shadow-xl hover:shadow-red-500/30"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  );
}
