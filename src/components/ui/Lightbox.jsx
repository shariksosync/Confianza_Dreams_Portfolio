"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/** Accessible image popup with previous / next navigation. */
export default function Lightbox({ items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  if (index == null || !items[index]) return null;
  const item = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title || item.caption || "Image preview"}
      className="animate-fade-in fixed inset-0 z-100 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full border border-background/25 p-2 text-background transition hover:bg-background/10"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Previous image"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-3 rounded-full border border-background/25 p-2 text-background transition hover:bg-background/10 sm:left-8"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <figure
        className="animate-zoom-in max-h-[86vh] w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.image}
          alt={item.title || item.caption || ""}
          className="max-h-[76vh] w-full rounded-3xl object-contain"
        />
        <figcaption className="mt-4 text-center text-sm tracking-wide text-background/80">
          {item.title || item.caption}
          {item.location ? ` â€” ${item.location}` : ""}
        </figcaption>
      </figure>

      <button
        type="button"
        aria-label="Next image"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-3 rounded-full border border-background/25 p-2 text-background transition hover:bg-background/10 sm:right-8"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}

