"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, Phone, Calendar, ShieldCheck, Heart } from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import GallerySection from "@/components/home/GallerySection";
import GalleryHighlightsSection from "@/components/gallery/GalleryHighlightsSection";
import InstagramSection from "@/components/home/InstagramSection";
import { useSite } from "@/context/SiteContext";

export default function GalleryPage() {
  const { galleryHeader, galleryCta, contact } = useSite();

  const header = galleryHeader || {};
  const cta = galleryCta || {};

  const heroImage =
    header.image ||
    "https://res.cloudinary.com/kipl0jjw/image/upload/v1791962052/confianza_heroes/gallery_hero_banner.jpg";

  const statsList =
    Array.isArray(header.stats) && header.stats.length > 0
      ? header.stats
      : [
          "500+ Happy Weddings Across India",
          "15+ Cities Across India",
          "100% Custom 3D Decor Designs",
          "Smooth On-Ground Execution",
        ];

  const perksList =
    Array.isArray(cta.perks) && cta.perks.length > 0
      ? cta.perks
      : [
          "60–90 Min Planning Session",
          "Talk Directly with Founders (Ashish & Rutik)",
          "3D Decor Design Previews",
          "Clear & Honest Cost Estimates",
        ];

  return (
    <SiteLayout revealKey="gallery-page">
      {/* 1. Dynamic Hero Header Banner */}
      <section className="relative bg-ink pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28 text-background overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src={heroImage}
            alt="Confianza Gallery Archive Banner"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-secondary/40 bg-white/5 px-3.5 py-1 text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.25em] sm:tracking-[0.28em] text-secondary font-semibold backdrop-blur-md mb-2 sm:mb-3 shadow-soft">
            <Sparkles className="h-3 w-3 text-secondary animate-pulse" />
            <span>{header.badge || "Wedding Photo Gallery"}</span>
          </div>

          <h1 className="mt-2 font-display text-3xl sm:text-5xl lg:text-6xl text-background font-normal tracking-tight leading-tight">
            {header.title || "Wedding Photo Gallery"}
          </h1>

          <div className="rule-gold mx-auto my-3.5 sm:my-5" />

          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-background/85 font-light leading-relaxed">
            {header.subtitle ||
              "Explore photos of our mandap decor, floral arrangements, bridal entries, and wedding celebrations."}
          </p>

          {/* Floating Trust Metrics Chips */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {statsList.map((stat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[0.68rem] sm:text-[0.72rem] text-champagne font-medium shadow-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                <span className="leading-snug">{stat}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Visual Chronicles Masonry Gallery */}
      <GallerySection isStandalone={true} />

      {/* 3. Signature Spatial Craft Highlights (From PDF Materials) */}
      <GalleryHighlightsSection />

      {/* 4. Follow Our Journey Instagram Feed */}
      <InstagramSection showAll={true} />

      {/* 5. Consultation CTA Banner */}
      <section className="py-12 sm:py-16 lg:py-24 relative bg-ink text-background overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src={heroImage}
            alt="Confianza Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/90" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-secondary font-semibold block">
            {cta.eyebrow || "LET'S PLAN YOUR SPECIAL DAY"}
          </span>

          <h2 className="mt-2.5 sm:mt-3 font-display text-2xl sm:text-4xl lg:text-5xl text-background font-normal leading-tight">
            {cta.headline || "Let Us Plan Your Dream Wedding"}
          </h2>

          <div className="rule-gold mx-auto my-3.5 sm:my-5" />

          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-background/80 font-light leading-relaxed">
            {cta.subtitle ||
              "Schedule a free 60–90 minute consultation with Ashish Wankhede and Rutik Pund in Warje, Pune to plan your wedding decor and celebration."}
          </p>

          {/* Perks Grid */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-left">
            {perksList.map((perk, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-2.5 sm:px-4 sm:py-3 backdrop-blur-md"
              >
                <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                <span className="text-xs text-champagne font-medium leading-snug">
                  {perk}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href={`tel:+91${contact?.phone || "7057357240"}`}
              className="btn-luxe gradient-gold text-ink font-bold text-xs py-3 px-6 sm:px-8 shadow-luxe flex items-center justify-center gap-2 w-full sm:w-auto text-center cursor-pointer"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>{cta.buttonText || "Book Free Consultation"}</span>
            </a>

            <a
              href={`tel:+91${contact?.phone || "7057357240"}`}
              className="btn-luxe bg-white/10 border border-white/20 text-background hover:bg-white/20 hover:border-secondary transition text-xs py-3 px-5 sm:px-6 flex items-center justify-center gap-2 w-full sm:w-auto text-center"
            >
              <Phone className="h-4 w-4 text-secondary" />
              <span>Call Ashish Wankhede (+91 {contact?.phone || "7057357240"})</span>
            </a>
          </div>

          {cta.notice && (
            <p className="mt-3.5 sm:mt-4 text-[0.65rem] sm:text-[0.68rem] text-background/60 font-light">
              {cta.notice}
            </p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
