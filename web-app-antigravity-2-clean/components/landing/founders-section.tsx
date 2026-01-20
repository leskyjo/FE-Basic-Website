import Image from "next/image";

import { founders } from "@/src/content/landing";

export function FoundersSection() {
  return (
    <section className="px-6 pb-14 pt-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">Founders</p>
          <h2 className="text-3xl font-semibold text-white">Message from the founders</h2>
          <p className="mt-2 text-sm text-slate-300">
            Built to help you move faster than the obstacles. We&apos;re designing a comeback platform that
            feels premium, intentional, and unapologetically yours.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {founders.map((founder) => (
            <div
              key={founder.name}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] via-[#080808] to-black p-6 shadow-[0_30px_120px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_40px_140px_rgba(255,0,0,0.2)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70"
            >
              <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.16),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(255,0,0,0.1),transparent_40%)]">
                {founder.imageSrc ? (
                  <Image
                    src={founder.imageSrc}
                    alt={founder.name}
                    width={640}
                    height={400}
                    className="h-57-full bg-black/60 object-cover object-center p-1 opacity-95 transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-56-full items-center justify-center bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] text-sm font-semibold text-slate-300">
                    Founder photo coming soon
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white">{founder.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{founder.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
