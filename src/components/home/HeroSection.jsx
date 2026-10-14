"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSite } from "../../context/SiteContext";

const DEFAULT_SLIDES = [
  "https://res.cloudinary.com/kipl0jjw/image/upload/v1791962054/confianza_heroes/home_hero_1.jpg",
  "https://res.cloudinary.com/kipl0jjw/image/upload/v1791962055/confianza_heroes/home_hero_2.jpg",
  "https://res.cloudinary.com/kipl0jjw/image/upload/v1791962056/confianza_heroes/home_hero_3.jpg",
];

export default function HeroSection() {
  const { hero } = useSite();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const images =
    Array.isArray(hero?.images) && hero.images.length > 0
      ? hero.images.filter(Boolean)
      : DEFAULT_SLIDES;

  const total = images.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + total) % total);
  }, [total]);

  const slideInterval = typeof hero?.slideInterval === "number" ? hero.slideInterval : 5000;

  // Automatic timer with pause on hover
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, slideInterval);
    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide, slideInterval]);

  // Touch swipe support for mobile viewports
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      aria-label="Homepage Luxury Banner Showcase"
      className="relative w-full bg-[#1A1322] pt-[68px] sm:pt-[80px] lg:pt-[92px] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 100% Visible Banner Frame */}
      <div className="relative w-full h-[45vh] sm:h-[60vh] md:h-[72vh] lg:h-[82vh] min-h-[320px] max-h-[860px] overflow-hidden">
        {images.map((img, idx) => (
          <div
            key={img + idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={img}
              alt={`Confianza Luxury Banner ${idx + 1}`}
              className="h-full w-full object-cover object-center"
              loading={idx === 0 ? "eager" : "lazy"}
              onError={(e) => {
                // Fallback to default if custom remote url fails
                if (e.currentTarget.src !== DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length]) {
                  e.currentTarget.src = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length];
                }
              }}
            />
          </div>
        ))}

        {/* Previous Slide Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/40 hover:bg-black/70 text-white hover:text-[#C2A438] border border-white/20 hover:border-[#C2A438]/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}

        {/* Next Slide Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/40 hover:bg-black/70 text-white hover:text-[#C2A438] border border-white/20 hover:border-[#C2A438]/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer hover:scale-105"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}

        {/* Bottom Slide Indicators */}
        {total > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 shadow-md">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                  i === currentSlide
                    ? "w-7 sm:w-9 bg-[#C2A438] shadow-[0_0_10px_rgba(194,164,56,0.6)]"
                    : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
