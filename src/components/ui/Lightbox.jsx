"use client";

import { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/** Accessible image popup with previous / next navigation and mobile swipe gestures. */
export default function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

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

  // Mobile touch swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current !== null ? touchStartY.current - e.changedTouches[0].clientY : 0;

    // Only trigger horizontal swipe if horizontal movement is greater than vertical movement
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        onNext(); // Swiped left -> next
      } else {
        onPrev(); // Swiped right -> prev
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (index == null || !items[index]) return null;
  const item = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title || item.caption || "Image preview"}
      className="animate-fade-in fixed inset-0 z-100 flex items-center justify-center bg-ink/95 p-2 sm:p-4 backdrop-blur-md select-none"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Close Button */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-3 top-3 sm:right-6 sm:top-6 z-30 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/25 shadow-lg transition active:scale-95 cursor-pointer"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Left Navigation Arrow */}
      <button
        type="button"
        aria-label="Previous image"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-black/60 hover:bg-black/85 text-white hover:text-secondary border border-white/25 shadow-xl transition-all active:scale-95 cursor-pointer pointer-events-auto"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Main Image Figure */}
      <figure
        className="animate-zoom-in max-h-[86vh] w-full max-w-4xl px-8 sm:px-12 relative z-20 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.image}
          alt={item.title || item.caption || ""}
          className="max-h-[72vh] sm:max-h-[78vh] w-auto max-w-full rounded-2xl sm:rounded-3xl object-contain shadow-2xl"
          draggable={false}
        />
        <figcaption className="mt-3 sm:mt-4 text-center text-xs sm:text-sm font-medium tracking-wide text-background/90 px-2">
          <span>{item.title || item.caption}</span>
          {item.location ? <span className="text-secondary font-semibold"> • {item.location}</span> : null}
        </figcaption>
      </figure>

      {/* Right Navigation Arrow */}
      <button
        type="button"
        aria-label="Next image"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-black/60 hover:bg-black/85 text-white hover:text-secondary border border-white/25 shadow-xl transition-all active:scale-95 cursor-pointer pointer-events-auto"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </div>
  );
}

