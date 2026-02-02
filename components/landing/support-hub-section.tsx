"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { supportHub } from "@/src/content/landing";

import { LightboxImage } from "../ui/image-lightbox";
import { useLightbox } from "../ui/lightbox-context";

const bullets = supportHub.bullets;

const supportImages: LightboxImage[] = [
  {
    src: "/newimage5.webp",
    alt: "Support the Movement - Donations",
    caption: "Your support helps justice-impacted individuals access the tools they need to rebuild.",
  },
  {
    src: "/newimage6.webp",
    alt: "Housing Stability",
    caption: "From housing to business—comprehensive support for a fresh start.",
  },
];

export function SupportHubSection() {
  const { openLightbox, registerImages } = useLightbox();

  // Register images with global lightbox on mount
  useEffect(() => {
    registerImages(supportImages);
  }, [registerImages]);

  return (
    <section className="relative isolate overflow-hidden px-6 py-12 md:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.16),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,0,0,0.12),transparent_35%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0b0b] via-[#070707] to-black px-6 py-8 shadow-[0_60px_160px_rgba(255,0,0,0.16)] md:grid-cols-[1.05fr_1fr] md:px-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-red-200">
            Support Hub
          </div>
          <h2 className="text-3xl font-semibold text-white leading-tight">{supportHub.headline}</h2>
          <p className="text-sm text-slate-300">{supportHub.copy}</p>
          <ul className="space-y-3">
            {bullets.map((item) => (
              <li
                key={item}
                className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:-translate-y-1 hover:border-red-300/50 hover:shadow-[0_24px_90px_rgba(255,0,0,0.2)]"
              >
                <span className="mt-0.5 grid h-9 w-9 place-items-center rounded-full border border-red-500/60 bg-black text-xs font-bold text-red-200 transition group-hover:shadow-[0_0_0_6px_rgba(255,0,0,0.2)]">
                  ❤️
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href={supportHub.cta.href}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_30px_90px_rgba(255,0,0,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_34px_110px_rgba(255,0,0,0.5)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-400"
          >
            {supportHub.cta.label} →
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {supportImages.map((image) => (
            <button
              key={image.src}
              onClick={() => openLightbox(image.src)}
              className="group relative h-72 cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#050505] shadow-[0_24px_90px_rgba(255,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_120px_rgba(255,0,0,0.22)] focus:outline-none focus:ring-2 focus:ring-red-500/50"
              aria-label={`View ${image.alt} in fullscreen`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-red-500/10" />
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
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
