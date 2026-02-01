import Image from "next/image";

type MediaBlockProps = {
  type: "image" | "video";
  src?: string;
  videoSrc?: string;
  alt?: string;
  label?: string;
  className?: string;
};

const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export function MediaBlock({ type, src, videoSrc, alt, label, className }: MediaBlockProps) {
  const base =
    "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_30px_120px_rgba(255,0,0,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_40px_140px_rgba(255,0,0,0.18)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70";

  if (type === "image") {
    return (
      <div className={cx(base, className)}>
        {label && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {label}
          </span>
        )}
        {src ? (
          <Image
            src={src}
            alt={alt || "Landing media"}
            width={800}
            height={600}
            className="h-full w-full object-cover opacity-90"
            priority
          />
        ) : (
          <div className="flex h-full min-h-[240px] items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800 text-sm text-neutral-400">
            Image placeholder
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-red-500/10" />
      </div>
    );
  }

  // Video type - play actual video if videoSrc is provided
  if (videoSrc) {
    return (
      <div className={cx(base, className)}>
        {label && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {label}
          </span>
        )}
        <video
          src={videoSrc}
          controls
          playsInline
          className="w-full h-auto"
          poster={src}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Fallback - video placeholder with play button
  return (
    <div className={cx(base, className)}>
      {label && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {label}
        </span>
      )}
      {src && (
        <Image
          src={src}
          alt={alt || "Video preview"}
          width={800}
          height={600}
          className="h-full w-full object-cover opacity-40"
          priority
        />
      )}
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
  );
}
