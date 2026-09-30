"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Sparkles, ArrowRight } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";
import Lightbox from "../ui/Lightbox";

export default function GallerySection({ isStandalone = false }) {
  const { gallery } = useSite();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const items = gallery?.length
    ? gallery
    : [
        { id: 1, image: "/images/hero-1.jpg", caption: "Candlelit Mandap" },
        { id: 2, image: "/images/floral.jpg", caption: "Orchid Centrepieces" },
        { id: 3, image: "/images/mehendi.jpg", caption: "Mehendi Swings" },
        { id: 4, image: "/images/hero-3.jpg", caption: "Ballroom Glow" },
        { id: 5, image: "/images/outdoor.jpg", caption: "Garden Dinner" },
        { id: 6, image: "/images/haldi.jpg", caption: "Haldi Joy" },
        { id: 7, image: "/images/stage.jpg", caption: "Lavender Stage" },
        { id: 8, image: "/images/couple.jpg", caption: "The Happy Couple" },
        { id: 9, image: "/images/hero-2.jpg", caption: "Seaside Vows" },
      ];

  const displayedItems = isStandalone ? items : items.slice(0, 8);

  return (
    <section id="gallery" className="section-pad relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Visual Chronicles"
          title="A Pinterest-Style Tapestry of Memories"
          subtitle="Glimpse into the intricate floral installations, grand ballroom stages, playful haldi setups, and candid romantic moments weâ€™ve had the privilege to curate."
        />

        {/* Pinterest-like Masonry Grid */}
        <div className="reveal mt-14 columns-1 sm:columns-2 lg:columns-4 gap-5 space-y-5">
          {displayedItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setLightboxIndex(idx)}
              className="group relative cursor-pointer break-inside-avoid overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-luxe"
            >
              <img
                src={item.image}
                alt={item.caption || "Confianza Wedding Decor"}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-5">
                <span className="text-[0.65rem] uppercase tracking-widest text-secondary font-medium">
                  Confianza Archive
                </span>
                <h4 className="mt-1 font-display text-base text-background">
                  {item.caption}
                </h4>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-champagne/80">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Click to expand</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Gallery CTA */}
        {!isStandalone && (
          <div className="reveal mt-12 text-center">
            <Link
              href="/gallery"
              className="btn-luxe gradient-royal text-primary-foreground text-xs shadow-luxe"
            >
              <span>Explore Complete Photo Archive</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox popup */}
      {lightboxIndex !== null && (
        <Lightbox
          items={displayedItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) => (prev > 0 ? prev - 1 : displayedItems.length - 1))
          }
          onNext={() =>
            setLightboxIndex((prev) => (prev < displayedItems.length - 1 ? prev + 1 : 0))
          }
        />
      )}
    </section>
  );
}

