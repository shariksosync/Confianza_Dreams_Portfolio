"use client";

import SiteLayout from "@/layouts/SiteLayout";
import GallerySection from "@/components/home/GallerySection";
import InstagramSection from "@/components/home/InstagramSection";

export default function GalleryPage() {
  return (
    <SiteLayout revealKey="gallery-page">
      {/* Hero Banner */}
      <section className="relative bg-ink pt-32 pb-20 sm:pt-40 sm:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/images/floral.jpg"
            alt="Confianza Gallery Archive"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 text-center">
          <span className="text-[0.68rem] uppercase tracking-[0.34em] text-secondary font-medium">
            Visual Inspirations
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl text-background font-normal">
            The Pinterest Gallery
          </h1>
          <div className="rule-gold mx-auto my-5" />
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-background/80 font-light leading-relaxed">
            Immerse yourself in close-up details of floral centerpieces, bridal entries, fairy-lit courtyards, and grand lavender stages.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection isStandalone={true} />

      {/* Instagram Feed */}
      <InstagramSection />
    </SiteLayout>
  );
}
