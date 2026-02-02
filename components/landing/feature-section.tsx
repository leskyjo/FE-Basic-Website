"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useEffect } from "react";

import { FeatureConfig } from "@/src/content/landing";

import { ExpandableBullet } from "../ui/expandable-bullet";
import { LightboxImage } from "../ui/image-lightbox";
import { useLightbox } from "../ui/lightbox-context";

import { MediaBlock } from "./media-block";

const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

type FeatureSectionProps = {
  feature: FeatureConfig;
};

export function FeatureSection({ feature }: FeatureSectionProps) {
  const { openLightbox, registerImages } = useLightbox();

  const [primaryMedia, ...secondaryMedia] = feature.media;
  const flip = feature.flip;
  const hasCustomVideo = Boolean(feature.videoSrc);
  const isBook = feature.id === "book";
  const isMerch = feature.id === "merch";

  // Collect all images for lightbox
  const lightboxImages = useMemo(() => {
    const images: LightboxImage[] = [];

    // Add primary media if it's an image
    if (primaryMedia?.type === "image" && primaryMedia.src) {
      images.push({
        src: primaryMedia.src,
        alt: primaryMedia.alt || feature.title,
        caption: primaryMedia.caption,
      });
    }

    // Add secondary media images
    secondaryMedia.forEach((media) => {
      if (media.type === "image" && media.src) {
        images.push({
          src: media.src,
          alt: media.alt || feature.title,
          caption: media.caption,
        });
      }
    });

    // Add gallery images
    feature.gallery?.forEach((item) => {
      if (item.src) {
        images.push({
          src: item.src,
          alt: item.alt,
          caption: item.caption,
        });
      }
    });

    // Add supporting images
    feature.supportingImages?.forEach((item) => {
      images.push({
        src: item.src,
        alt: item.alt,
        caption: item.caption,
      });
    });

    // Add merch section hardcoded images
    if (feature.id === "merch") {
      images.push({
        src: "/Entrepreneur-essentials-black.png",
        alt: "Entrepreneur Essentials - Black",
        caption: "Premium quality apparel designed for people building something real.",
      });
      images.push({
        src: "/Entrepreneur-essentials-white.png",
        alt: "Entrepreneur Essentials - White",
        caption: "Represent the movement. Wear your transformation.",
      });
    }

    return images;
  }, [primaryMedia, secondaryMedia, feature.gallery, feature.supportingImages, feature.title, feature.id]);

  // Register images with global lightbox on mount
  useEffect(() => {
    if (lightboxImages.length > 0) {
      registerImages(lightboxImages);
    }
  }, [lightboxImages, registerImages]);

  // Clickable image wrapper component
  const ClickableImage = ({
    src,
    alt,
    children,
  }: {
    src: string;
    alt: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => openLightbox(src)}
      className="relative block w-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-black rounded-2xl"
      aria-label={`View ${alt} in fullscreen`}
    >
      {children}
    </button>
  );

  return (
    <section id={feature.id} className="relative isolate overflow-hidden px-6 py-10 md:px-10 scroll-mt-20">
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
            isMerch ? "relative flex h-full flex-col p-6 md:p-10" : "relative space-y-4 p-6 md:p-10",
            flip ? "order-2 md:order-1" : "order-1",
          )}
        >
          {isMerch ? (
            <>
              {/* TOP IMAGE - Entrepreneur Essentials Black */}
              <div className="mb-6 flex-1">
                <ClickableImage src="/Entrepreneur-essentials-black.png" alt="Entrepreneur Essentials - Black">
                  <div className="group relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)]">
                    <Image
                      src="/Entrepreneur-essentials-black.png"
                      alt="Entrepreneur Essentials - Black"
                      fill
                      className="object-contain p-4"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-red-500/15" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
                      <span className="rounded-full bg-white/10 p-2 backdrop-blur">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </ClickableImage>
              </div>

              {/* TEXT CONTENT */}
              <div className="shrink-0 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-200">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  {feature.title}
                </div>

                <h2 className="text-3xl font-semibold text-white">{feature.title}</h2>
                <p className="text-sm text-slate-300">{feature.description}</p>

                <ul className="space-y-3">
                  {feature.bullets.map((bullet) => (
                    <ExpandableBullet key={bullet.text} bullet={bullet} />
                  ))}
                </ul>

                <Link
                  href={feature.cta.href}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_30px_90px_rgba(255,0,0,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_34px_110px_rgba(255,0,0,0.5)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-400"
                >
                  {feature.cta.label} →
                </Link>
              </div>

              {/* BOTTOM IMAGE - Entrepreneur Essentials White */}
              <div className="mt-6 flex-1">
                <ClickableImage src="/Entrepreneur-essentials-white.png" alt="Entrepreneur Essentials - White">
                  <div className="group relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)]">
                    <Image
                      src="/Entrepreneur-essentials-white.png"
                      alt="Entrepreneur Essentials - White"
                      fill
                      className="object-contain p-4"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-red-500/15" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
                      <span className="rounded-full bg-white/10 p-2 backdrop-blur">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </ClickableImage>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-200">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                {feature.title}
              </div>

              <h2 className="text-3xl font-semibold text-white">{feature.title}</h2>
              <p className="text-sm text-slate-300">{feature.description}</p>

              <ul className="space-y-3">
                {feature.bullets.map((bullet) => (
                  <ExpandableBullet key={bullet.text} bullet={bullet} />
                ))}
              </ul>

              <Link
                href={feature.cta.href}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_30px_90px_rgba(255,0,0,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_34px_110px_rgba(255,0,0,0.5)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-400"
              >
                {feature.cta.label} →
              </Link>
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
              {primaryMedia && (
                <MediaBlock
                  type={primaryMedia.type}
                  src={primaryMedia.src}
                  alt={primaryMedia.alt}
                  label={primaryMedia.label}
                  className="min-h-[260px]"
                />
              )}
              <MediaBlock type="video" label="Preview" className="min-h-[180px]" />
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
                    <ClickableImage key={item.src} src={item.src} alt={item.alt}>
                      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)]">
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
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
                          <span className="rounded-full bg-white/10 p-2 backdrop-blur">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8" />
                              <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              <line x1="11" y1="8" x2="11" y2="14" />
                              <line x1="8" y1="11" x2="14" y2="11" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </ClickableImage>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <>
              {primaryMedia && primaryMedia.src && (
                <ClickableImage src={primaryMedia.src} alt={primaryMedia.alt || feature.title}>
                  <div className="group relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_30px_120px_rgba(255,0,0,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_40px_140px_rgba(255,0,0,0.22)]">
                    <Image
                      src={primaryMedia.src}
                      alt={primaryMedia.alt || "Feature image"}
                      fill
                      className="object-contain opacity-90"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-red-500/15" />
                    {primaryMedia.label && (
                      <span className="absolute left-3 bottom-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {primaryMedia.label}
                      </span>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
                      <span className="rounded-full bg-white/10 p-2 backdrop-blur">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </ClickableImage>
              )}

              {secondaryMedia.length > 0 && (
                <div className="grid gap-3 md:grid-cols-2">
                  {secondaryMedia.map((media) =>
                    media.src ? (
                      <ClickableImage key={media.src} src={media.src} alt={media.alt || feature.title}>
                        <div className="group relative min-h-[160px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)]">
                          <Image
                            src={media.src}
                            alt={media.alt || "Feature image"}
                            fill
                            className="object-cover opacity-90"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-red-500/15" />
                          {media.label && (
                            <span className="absolute left-3 bottom-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                              {media.label}
                            </span>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
                            <span className="rounded-full bg-white/10 p-2 backdrop-blur">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                <line x1="11" y1="8" x2="11" y2="14" />
                                <line x1="8" y1="11" x2="14" y2="11" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </ClickableImage>
                    ) : (
                      <MediaBlock
                        key={`${feature.id}-${media.alt ?? media.label ?? "media"}`}
                        type={media.type}
                        src={media.src}
                        alt={media.alt}
                        label={media.label}
                        className="min-h-[160px]"
                      />
                    )
                  )}
                </div>
              )}

              {feature.gallery && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {feature.gallery.map((item) =>
                    item.src ? (
                      <ClickableImage key={item.src} src={item.src} alt={item.alt}>
                        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)]">
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
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
                            <span className="rounded-full bg-white/10 p-2 backdrop-blur">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                <line x1="11" y1="8" x2="11" y2="14" />
                                <line x1="8" y1="11" x2="14" y2="11" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </ClickableImage>
                    ) : (
                      <div
                        key={item.alt}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)]"
                      >
                        <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-slate-300">
                          Image placeholder
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
