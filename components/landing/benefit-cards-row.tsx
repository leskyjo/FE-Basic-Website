import Link from "next/link";

import { benefitCards } from "@/src/content/landing";

export function BenefitCardsRow() {
  return (
    <section className="bg-[#050505] px-6 pb-6 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
        {benefitCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] via-[#090909] to-[#050505] p-6 shadow-[0_30px_120px_rgba(255,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:border-red-400/40 hover:shadow-[0_40px_140px_rgba(255,0,0,0.2)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-500/70"
          >
            <h3 className="text-2xl font-semibold text-red-400">{card.title}</h3>
            <p className="mt-2 text-lg text-slate-200">{card.description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-300 transition group-hover:text-red-200">
              Start now →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
