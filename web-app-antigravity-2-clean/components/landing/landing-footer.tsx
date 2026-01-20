import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 bg-black px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/felon-entrepreneur-logo.png"
            alt="Felon Entrepreneur"
            width={150}
            height={48}
            className="h-9 w-auto"
          />
          <p className="text-sm text-slate-400">Felon Entrepreneur · Command your comeback.</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link
            href="/signup"
            className="rounded-full bg-white/5 px-4 py-2 text-slate-200 transition hover:-translate-y-0.5 hover:border-red-300 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-500/70"
          >
            Join free
          </Link>
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-slate-300 transition hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-500/70"
          >
            Log in
          </Link>
        </div>
      </div>
    </footer>
  );
}
