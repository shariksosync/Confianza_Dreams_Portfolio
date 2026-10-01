"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { useSite } from "../../context/SiteContext";

export default function HeroSection() {
  const { hero } = useSite();
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = hero.images?.length
    ? hero.images
    : ["/images/hero-1.jpg", "/images/hero-2.jpg", "/images/hero-3.jpg"];

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-ink pt-20 pb-16">
      {/* Background Image Carousel with Ken-Burns & Crossfade */}
      <div className="absolute inset-0 z-0">
        {images.map((img, idx) => (
          <div
            key={img + idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              idx === currentSlide ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              transition: "opacity 1.5s ease-in-out, transform 8s ease-out",
            }}
          />
        ))}
        {/* Luxury Dark + Royal Lavender Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(43,33,56,0.7)_100%)]" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 text-center flex flex-col items-center">
        {/* Eyebrow */}
        <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
          <span className="text-[0.68rem] sm:text-xs font-medium uppercase tracking-[0.3em] text-champagne">
            {hero.eyebrow || "Luxury Wedding Planners • Pune"}
          </span>
        </div>

        {/* Heading */}
        <h1 className="animate-slide-up mt-6 max-w-4xl font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.12] text-background">
          {hero.headline || "Where Weddings Become Stories"}
        </h1>

        {/* Gold divider */}
        <div className="animate-zoom-in my-5 rule-gold mx-auto" />

        {/* Subtitle */}
        <p className="animate-fade-in max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-background/80 font-light">
          {hero.subtitle ||
            "From the first consultation to the final celebration, Confianza crafts personalised, flawlessly executed weddings that your guests will talk about for years."}
        </p>

        {/* CTAs */}
        <div className="animate-slide-up mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={hero.primaryCta?.href || "/contact"}
            className="btn-luxe gradient-royal text-primary-foreground shadow-luxe font-semibold"
          >
            <span>{hero.primaryCta?.label || "Book Consultation"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={hero.secondaryCta?.href || "/portfolio"}
            className="btn-luxe glass-dark text-background border border-background/25 hover:border-secondary hover:text-secondary"
          >
            <span>{hero.secondaryCta?.label || "View Portfolio"}</span>
          </Link>
        </div>

        {/* Slide navigation indicators */}
        {images.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentSlide ? "w-8 bg-secondary" : "w-2 bg-background/30 hover:bg-background/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Floating Statistics Grid */}
        <div className="mt-12 sm:mt-16 grid w-full max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {(hero.floatingStats || []).map((stat, i) => (
            <div
              key={stat.label || i}
              className="glass-dark rounded-2xl p-4 sm:p-5 text-center backdrop-blur-lg border border-white/10 transition-all duration-300 hover:border-secondary/40 hover:-translate-y-1"
            >
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl text-gold-gradient font-bold">
                {stat.value}
              </div>
              <div className="mt-1 text-[0.68rem] sm:text-xs tracking-wider uppercase text-background/70 font-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll down prompt */}
        <a
          href="#about"
          aria-label="Scroll down"
          className="mt-10 inline-flex flex-col items-center text-xs tracking-widest text-background/50 hover:text-secondary transition-colors"
        >
          <span className="uppercase text-[0.62rem] mb-1 tracking-[0.25em]">Explore</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}

