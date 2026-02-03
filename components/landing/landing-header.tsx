import Image from "next/image";
import Link from "next/link";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-black/50 px-6 py-5 backdrop-blur-lg md:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/felon-entrepreneur-logo.png"
            alt="Felon Entrepreneur"
            width={240}
            height={72}
            className="h-14 w-auto"
            priority
          />
        </Link>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link
            href="/signup"
            className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-5 py-2 text-white shadow-[0_20px_60px_rgba(255,0,0,0.35)] transition hover:from-red-400 hover:to-red-500"
          >
            Join the Waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}
