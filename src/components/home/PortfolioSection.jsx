"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Sparkles, Eye, ArrowRight, MapPin } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";
import Lightbox from "../ui/Lightbox";

const normalizeCategory = (str) =>
  (str || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "")
    .trim();

const isAllCategory = (cat) => {
  if (!cat) return false;
  const str = typeof cat === "string" ? cat : cat?.name || cat?.label || cat?.id || "";
  const norm = normalizeCategory(str);
  return norm === "all" || norm === "allportfolio" || norm === "allcelebrations";
};

const isCategoryMatch = (itemCategory, targetCategory) => {
  if (!targetCategory || isAllCategory(targetCategory)) return true;
  if (!itemCategory) return false;
  const norm1 = normalizeCategory(itemCategory);
  const norm2 = normalizeCategory(
    typeof targetCategory === "string"
      ? targetCategory
      : targetCategory?.name || targetCategory?.label || targetCategory?.id || ""
  );
  return Boolean(norm1 && norm2 && norm1 === norm2);
};

export default function PortfolioSection({ isStandalone = false }) {
  const { portfolio, portfolioSection, portfolioCategories } = useSite();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(isStandalone ? 12 : 8);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Dynamic Categories from database
  const categories = useMemo(() => {
    const dbCats = Array.isArray(portfolioCategories) && portfolioCategories.length > 0
      ? portfolioCategories
          .map((c) => (typeof c === "string" ? c : c.name || c.label))
          .filter(Boolean)
      : [
          "Destination Weddings",
          "Grand Mandaps",
          "Haldi Carnivals",
          "Opulent Receptions",
          "Sangeet & Cocktail",
          "Floral & Spatial Art",
        ];
    return ["All", ...dbCats];
  }, [portfolioCategories]);

  const allItems = useMemo(() => {
    return Array.isArray(portfolio) ? portfolio : [];
  }, [portfolio]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchCat = isCategoryMatch(item.category, selectedCategory);
      const matchSearch =
        !searchQuery.trim() ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allItems, selectedCategory, searchQuery]);

  const displayedItems = isStandalone
    ? filteredItems.slice(0, visibleCount)
    : filteredItems.slice(0, 8);

  return (
    <section id="portfolio" className="section-pad relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow={portfolioSection?.eyebrow || "Our Signature Works"}
          title={portfolioSection?.title || "Moments of Grandeur & Intimacy"}
          subtitle={
            portfolioSection?.subtitle ||
            "Explore a curated portfolio of mandaps, opulent ballrooms, sunny haldi courtyards, and destination weddings executed across India."
          }
        />

        {allItems.length === 0 ? (
          /* True Zero-Data State (Strict Database Reflection) */
          <div className="mt-12 glass-card rounded-3xl p-12 text-center text-muted-foreground border border-dashed border-border/80 transition-all duration-300">
            <Sparkles className="h-10 w-10 mx-auto text-secondary/60 mb-3" />
            <h3 className="font-display text-xl text-ink font-semibold">No Portfolio Works Added Yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Wedding stories and spatial decor projects added in the Admin Panel will appear here live.
            </p>
          </div>
        ) : (
          <>
            {/* Search Bar & Category Filter Bar */}
            <div className="reveal mt-10 space-y-5">
              <div className="mx-auto max-w-md relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by city, theme or ceremony (e.g. Udaipur, Goa, Haldi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-card/60 pl-11 pr-5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur-md"
                />
              </div>

              {/* Category Filter Pills with Item Counts */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {categories.map((cat) => {
                  const isAllPill = isAllCategory(cat);
                  const count = isAllPill
                    ? allItems.length
                    : allItems.filter((p) => isCategoryMatch(p.category, cat)).length;
                  const isSelected = isAllPill
                    ? isAllCategory(selectedCategory)
                    : normalizeCategory(selectedCategory) === normalizeCategory(cat);

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setVisibleCount(isStandalone ? 12 : 8);
                      }}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isSelected
                          ? "gradient-royal text-primary-foreground shadow-luxe scale-105"
                          : "glass-card text-foreground/75 hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[0.62rem] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                          isSelected
                            ? "bg-secondary text-ink"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Portfolio Masonry / Responsive Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300">
              {displayedItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe flex flex-col"
                >
                  <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-ink/5">
                    <img
                      src={item.image || "/images/hero-1.jpg"}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/images/hero-1.jpg";
                      }}
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
                      {item.description && (
                        <p className="mt-1.5 text-[0.72rem] text-background/70 font-light line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state when filtering or searching */}
            {displayedItems.length === 0 && (
              <div className="mt-12 glass-card rounded-3xl p-12 text-center text-muted-foreground border border-border/80 max-w-xl mx-auto shadow-soft transition-all duration-300 animate-in fade-in">
                <div className="h-14 w-14 rounded-full bg-secondary/15 ring-2 ring-secondary/40 flex items-center justify-center mx-auto mb-4 text-secondary">
                  <Eye className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl text-ink font-semibold">
                  {allItems.length === 0
                    ? "No Portfolio Works Added Yet"
                    : `No Celebrations Found`}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  {allItems.length === 0
                    ? "Wedding stories and spatial decor projects added in the Admin Panel will appear here live."
                    : `No portfolio celebrations match "${searchQuery || selectedCategory}".`}
                </p>
                {allItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="mt-5 btn-luxe gradient-gold text-ink text-xs py-2 px-5 font-bold shadow-xs cursor-pointer"
                  >
                    Reset Filters ({allItems.length} Total)
                  </button>
                )}
              </div>
            )}

            {/* Load More on Standalone & Explore All on Homepage */}
            <div className="reveal mt-14 flex flex-wrap items-center justify-center gap-4">
              {isStandalone && visibleCount < filteredItems.length && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="btn-luxe gradient-gold text-ink font-semibold"
                >
                  Load More Celebrations ({filteredItems.length - visibleCount} remaining)
                </button>
              )}

              {!isStandalone && (
                <Link
                  href="/portfolio"
                  className="btn-luxe gradient-royal text-primary-foreground shadow-luxe font-semibold py-3.5 px-8 text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:scale-105 transition"
                >
                  <span>Explore All Signature Works</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && displayedItems.length > 0 && (
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

