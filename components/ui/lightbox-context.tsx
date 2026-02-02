"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

import { ImageLightbox, LightboxImage } from "./image-lightbox";

type LightboxContextType = {
  openLightbox: (imageSrc: string) => void;
  registerImages: (images: LightboxImage[]) => void;
};

const LightboxContext = createContext<LightboxContextType | null>(null);

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [allImages, setAllImages] = useState<LightboxImage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const registerImages = useCallback((images: LightboxImage[]) => {
    setAllImages((prev) => {
      // Only add images that don't already exist (by src)
      const existingSrcs = new Set(prev.map((img) => img.src));
      const newImages = images.filter((img) => !existingSrcs.has(img.src));
      if (newImages.length === 0) return prev;
      return [...prev, ...newImages];
    });
  }, []);

  const openLightbox = useCallback(
    (imageSrc: string) => {
      const index = allImages.findIndex((img) => img.src === imageSrc);
      if (index !== -1) {
        setCurrentIndex(index);
        setIsOpen(true);
      }
    },
    [allImages]
  );

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <LightboxContext.Provider value={{ openLightbox, registerImages }}>
      {children}
      {isOpen && allImages.length > 0 && (
        <ImageLightbox
          images={allImages}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNavigate={setCurrentIndex}
        />
      )}
    </LightboxContext.Provider>
  );
}
