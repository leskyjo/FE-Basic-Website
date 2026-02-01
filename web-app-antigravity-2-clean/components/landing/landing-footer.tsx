import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 bg-black px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
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
        <div className="flex items-center gap-6 text-sm">
          <Link href="/login" className="text-slate-400 transition hover:text-white">
            Log in
          </Link>
          <Link href="/signup" className="text-slate-400 transition hover:text-white">
            Join the Waitlist
          </Link>
          <span className="text-slate-500">© {new Date().getFullYear()} Felon Entrepreneur</span>
        </div>
      </div>
    </footer>
  );
}
