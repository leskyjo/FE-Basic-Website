import Image from "next/image";

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
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">App coming soon to iOS and Android</span>
        </div>
      </div>
    </footer>
  );
}
