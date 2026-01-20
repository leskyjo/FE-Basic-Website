import Image from "next/image";
import Link from "next/link";

import { FeatureConfig } from "@/src/content/landing";

import { MediaBlock } from "./media-block";

const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

type FeatureSectionProps = {
  feature: FeatureConfig;
};

export function FeatureSection({ feature }: FeatureSectionProps) {
  const [primaryMedia, ...secondaryMedia] = feature.media;
  const flip = feature.flip;
  const hasCustomVideo = Boolean(feature.videoSrc);
  const isBook = feature.id === "book";
  const isMerch = feature.id === "merch";

  return (
    <section className="relative isolate overflow-hidden px-6 py-10 md:px-10">
      <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />

      <div
        className={cx(
          "relative mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c0c0c]/90 via-[#050505] to-black shadow-[0_60px_160px_rgba(255,0,0,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_70px_180px_rgba(255,0,0,0.22)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70",
          flip ? "md:grid-cols-[1.05fr_1fr]" : "md:grid-cols-[1fr_1.05fr]",
        )}
      >
        {/* LEFT COLUMN */}
        <div
          className={cx(
            // IMPORTANT: For Merch we need the left column to be a true vertical layout
            // so the top/bottom placeholders can expand to fill the blank space.
            isMerch ? "relative flex h-full flex-col p-6 md:p-10" : "relative space-y-4 p-6 md:p-10",
            flip ? "order-2 md:order-1" : "order-1",
          )}
        >
          {/* =========================
              MERCH ONLY (Wear Your Wins)
              Goal: Top placeholder + bottom placeholder expand and fill dead space above/below text.
             ========================= */}
          {isMerch ? (
            <>
              {/* TOP EXPANDING PLACEHOLDER */}
              <div className="mb-6 flex-1">
                <div className="group relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70">
                  <div className="flex h-full w-full items-center justify-center text-sm text-slate-300">
                    Image placeholder
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-red-500/15" />
                </div>
              </div>

              {/* TEXT CONTENT (fixed height, does not stretch) */}
              <div className="shrink-0 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-200">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  {feature.title}
                </div>

                <h2 className="text-3xl font-semibold text-white">{feature.title}</h2>
                <p className="text-sm text-slate-300">{feature.description}</p>

                <ul className="space-y-3">
                  {feature.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-200"
                    >
                      <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-red-500/20 text-xs font-bold text-red-300">
                        ✓
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={feature.cta.href}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_30px_90px_rgba(255,0,0,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_34px_110px_rgba(255,0,0,0.5)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-400"
                >
                  {feature.cta.label} →
                </Link>
              </div>

              {/* BOTTOM EXPANDING PLACEHOLDER */}
              <div className="mt-6 flex-1">
                <div className="group relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70">
                  <div className="flex h-full items-center justify-center text-sm text-slate-300">
                    Image placeholder
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-red-500/15" />
                </div>
              </div>
            </>
          ) : (
            /* =========================
               DEFAULT LEFT COLUMN (everything except Merch special layout)
               ========================= */
            <>
              {/* REMOVE THIS BLOCK FOR BOOK:
                 The user wants the "top-left placeholder" in Get the Book gone.
                 So: only render the top placeholder for non-book merch (handled above) and non-book sections as originally.
              */}
              {!isBook && (feature.id === "book" || feature.id === "merch") ? null : null}

              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-200">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                {feature.title}
              </div>

              <h2 className="text-3xl font-semibold text-white">{feature.title}</h2>
              <p className="text-sm text-slate-300">{feature.description}</p>

              <ul className="space-y-3">
                {feature.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-200"
                  >
                    <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-red-500/20 text-xs font-bold text-red-300">
                      ✓
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={feature.cta.href}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_30px_90px_rgba(255,0,0,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_34px_110px_rgba(255,0,0,0.5)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-400"
              >
                {feature.cta.label} →
              </Link>

              {/* BOOK: remove the two little placeholders under the button */}
              {isBook ? null : null}
            </>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div
          className={cx(
            "relative space-y-4 p-6 md:p-10",
            flip ? "order-1 md:order-2" : "order-2",
          )}
        >
          {isBook ? (
            <div className="space-y-4">
              {/* Keep the big book image */}
              {primaryMedia && (
                <MediaBlock
                  type={primaryMedia.type}
                  src={primaryMedia.src}
                  alt={primaryMedia.alt}
                  label={primaryMedia.label}
                  className="min-h-[260px]"
                />
              )}

              {/* Keep the video placeholder */}
              <MediaBlock type="video" label="Preview" className="min-h-[180px]" />

              {/* REMOVE the bottom gallery grid entirely to eliminate the extra placeholder blocks (including the “solid white” one). */}
              {/* (feature.gallery || []).map(...) removed on purpose */}
            </div>
          ) : hasCustomVideo ? (
            <>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_30px_120px_rgba(255,0,0,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_40px_140px_rgba(255,0,0,0.22)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70">
                <video
                  src={feature.videoSrc}
                  controls
                  preload="metadata"
                  className="h-full w-full rounded-2xl object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-red-500/10" />
              </div>

              {feature.supportingImages?.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {feature.supportingImages.map((item) => (
                    <div
                      key={item.src}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover opacity-90"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-red-500/15" />
                      <span className="absolute left-3 bottom-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {item.alt}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <>
              {primaryMedia && (
                <MediaBlock
                  type={primaryMedia.type}
                  src={primaryMedia.src}
                  alt={primaryMedia.alt}
                  label={primaryMedia.label}
                  className="min-h-[260px]"
                />
              )}

              {secondaryMedia.length > 0 && (
                <div className="grid gap-3 md:grid-cols-2">
                  {secondaryMedia.map((media) => (
                    <MediaBlock
                      key={`${feature.id}-${media.alt ?? media.label ?? "media"}`}
                      type={media.type}
                      src={media.src}
                      alt={media.alt}
                      label={media.label}
                      className="min-h-[160px]"
                    />
                  ))}
                </div>
              )}

              {feature.gallery && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {feature.gallery.map((item) => (
                    <div
                      key={item.src}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)] focus-within:outline focus-within:outline-1 focus-within:outline-red-500/70"
                    >
                      {item.src ? (
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={400}
                          height={300}
                          className="h-full w-full object-cover opacity-90"
                        />
                      ) : (
                        <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-slate-300">
                          Image placeholder
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-red-500/15" />
                      <span className="absolute left-3 bottom-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {item.alt || "Image placeholder"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
