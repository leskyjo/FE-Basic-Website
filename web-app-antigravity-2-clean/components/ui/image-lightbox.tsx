"use client";

import Image from "next/image";
import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
};

type ImageLightboxProps = {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageLightboxProps) {
  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const goNext = useCallback(() => {
    if (hasMultiple) {
      onNavigate((currentIndex + 1) % images.length);
    }
  }, [currentIndex, images.length, hasMultiple, onNavigate]);

  const goPrev = useCallback(() => {
    if (hasMultiple) {
      onNavigate((currentIndex - 1 + images.length) % images.length);
    }
  }, [currentIndex, images.length, hasMultiple, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          goNext();
          break;
        case "ArrowLeft":
          goPrev();
          break;
      }
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    const scrollY = window.scrollY;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, [onClose, goNext, goPrev]);

  const lightboxContent = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-md"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        aria-label="Close lightbox"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Image container */}
      <div
        className="relative mx-4 flex flex-col items-center justify-center px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={1200}
            height={1600}
            className="max-h-[90vh] w-auto max-w-[90vw] object-contain"
            sizes="90vw"
            priority
          />
        </div>

        {/* Caption */}
        {currentImage.caption && (
          <div className="mt-4 text-center">
            <p className="text-lg text-slate-300">{currentImage.caption}</p>
          </div>
        )}

        {/* Image counter */}
        {hasMultiple && (
          <div className="mt-2 text-center text-sm text-slate-500">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );

  // Use portal to render at document root level
  if (typeof document === "undefined") return null;
  return createPortal(lightboxContent, document.body);
}
