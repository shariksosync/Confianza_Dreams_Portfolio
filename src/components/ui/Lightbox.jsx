"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, MapPin, Sparkles, ArrowRight, Phone } from "lucide-react";

/** Accessible image popup with previous / next navigation, side details panel, and mobile swipe gestures. */
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
  const itemTitle = item.caption || item.title || "Celebration Showcase";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={itemTitle}
      className="animate-fade-in fixed inset-0 z-100 flex items-center justify-center bg-ink/90 p-2 sm:p-4 lg:p-6 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Top Floating Close Button on Mobile / Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-3 top-3 sm:right-6 sm:top-6 z-30 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-xl transition active:scale-95 cursor-pointer"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Main Split Dialog Card */}
      <div
        className="animate-zoom-in relative w-full max-w-5xl lg:max-w-6xl max-h-[92vh] rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-2xl overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left: Main Image Area with Floating Nav Arrows */}
        <div className="relative flex-1 bg-black/95 flex items-center justify-center min-h-[260px] sm:min-h-[380px] md:min-h-[520px] p-3 sm:p-6 overflow-hidden select-none">
          <img
            src={item.image}
            alt={itemTitle}
            className="max-h-[48vh] sm:max-h-[60vh] md:max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
            draggable={false}
          />

          {/* Left Arrow */}
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-black/60 hover:bg-black/90 text-white hover:text-secondary border border-white/20 shadow-xl transition active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-black/60 hover:bg-black/90 text-white hover:text-secondary border border-white/20 shadow-xl transition active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Right: Side Details Panel */}
        <div className="w-full md:w-80 lg:w-96 bg-card p-5 sm:p-6 lg:p-7 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border/80 overflow-y-auto max-h-[40vh] md:max-h-[82vh]">
          {/* Header Tag & Counter */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
              {item.category ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wider text-primary font-semibold">
                  <Sparkles className="h-2.5 w-2.5 text-secondary" />
                  <span>{item.category}</span>
                </span>
              ) : (
                <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground font-semibold">
                  Gallery Photo
                </span>
              )}

              <span className="text-[0.65rem] font-mono text-muted-foreground uppercase tracking-wider">
                {index + 1} / {items.length}
              </span>
            </div>

            {/* Title / Caption */}
            <h3 className="font-display text-lg sm:text-xl lg:text-2xl text-ink font-semibold leading-snug">
              {itemTitle}
            </h3>

            {/* Location */}
            {item.location && (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-primary font-medium">
                <MapPin className="h-3.5 w-3.5 text-secondary shrink-0" />
                <span>{item.location}</span>
              </div>
            )}

            {/* Description if present */}
            {item.description && (
              <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/20 mt-3">
                <p className="text-xs text-foreground/90 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions & Switcher */}
          <div className="pt-4 mt-4 border-t border-border/60 space-y-3">
            <a
              href="tel:+917057357240"
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-sm w-full hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Inquire About This Setup (+91 7057357240)</span>
            </a>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <button
                type="button"
                onClick={onPrev}
                className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={onNext}
                className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


