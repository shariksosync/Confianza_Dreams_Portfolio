"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Sparkles, Eye, ArrowRight, MapPin } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";
import Lightbox from "../ui/Lightbox";
import { portfolioCategories } from "../../mock/portfolio";

export default function PortfolioSection({ isStandalone = false }) {
  const { portfolio } = useSite();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(isStandalone ? 12 : 8);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = portfolioCategories || [
    "All",
    "Wedding",
    "Haldi",
    "Mehendi",
    "Reception",
    "Destination",
    "Decor",
    "Outdoor",
    "Indoor",
    "Luxury Stage",
    "Floral Decor",
  ];

  const filteredItems = useMemo(() => {
    return (portfolio || []).filter((item) => {
      const matchCat =
        selectedCategory === "All" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [portfolio, selectedCategory, searchQuery]);

  const displayedItems = filteredItems.slice(0, visibleCount);

  return (
    <section id="portfolio" className="section-pad relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Our Signature Works"
          title="Moments of Grandeur &amp; Intimacy"
          subtitle="Explore a curated portfolio of mandaps, opulent ballrooms, sunny haldi courtyards, and destination weddings executed across India."
        />

        {/* Search Bar & Category Filter Bar */}
        <div className="reveal mt-10 space-y-5">
          <div className="mx-auto max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by city, theme or ceremony (e.g. Goa, Stage, Haldi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-card/60 pl-11 pr-5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur-md"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(isStandalone ? 12 : 8);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat
                    ? "gradient-royal text-primary-foreground shadow-luxe"
                    : "glass-card text-foreground/75 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Masonry / Responsive Grid */}
        <div className="reveal mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setLightboxIndex(idx)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe"
            >
              <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink/60 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-secondary backdrop-blur-md border border-white/10">
                    <Sparkles className="h-2.5 w-2.5 text-secondary" />
                    <span>{item.category}</span>
                  </span>
                </div>

                {/* Zoom Icon Button */}
                <div className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Eye className="h-4 w-4" />
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-background">
                  <h3 className="font-display text-lg leading-snug text-background transition-colors group-hover:text-gold-gradient">
                    {item.title}
                  </h3>
                  {item.location && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-champagne/80 font-light">
                      <MapPin className="h-3.5 w-3.5 text-secondary" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {displayedItems.length === 0 && (
          <div className="my-16 text-center text-muted-foreground">
            <p className="font-display text-lg">No wedding stories found for "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More & View Full Portfolio Actions */}
        <div className="reveal mt-14 flex flex-wrap items-center justify-center gap-4">
          {visibleCount < filteredItems.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="btn-luxe gradient-gold text-ink font-semibold"
            >
              Load More Celebrations ({filteredItems.length - visibleCount} remaining)
            </button>
          )}

          {!isStandalone && (
            <Link
              href="/portfolio"
              className="btn-luxe gradient-royal text-primary-foreground shadow-luxe"
            >
              <span>Explore Complete Gallery</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
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

