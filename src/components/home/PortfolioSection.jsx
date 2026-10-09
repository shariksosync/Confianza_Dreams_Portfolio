"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Sparkles, Eye, ArrowRight, MapPin } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";
import Lightbox from "../ui/Lightbox";
import CategoryFilterBar from "../ui/CategoryFilterBar";

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
          "Haldi & Mehendi",
          "Grand Receptions",
          "Sangeet & Stage",
          "Floral & Stage Decor",
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
          eyebrow={
            portfolioSection?.eyebrow === "Our Signature Works" ||
            portfolioSection?.eyebrow === "Our Work" ||
            !portfolioSection?.eyebrow
              ? "Our Works"
              : portfolioSection.eyebrow
          }
          title={
            portfolioSection?.title === "Our Wedding Celebrations & Decor" ||
            portfolioSection?.title === "Moments of Grandeur & Intimacy" ||
            portfolioSection?.title === "Moments of Joy & Celebration" ||
            !portfolioSection?.title
              ? "Memorable Moments, Big and Small"
              : portfolioSection.title
          }
          subtitle={
            portfolioSection?.subtitle ===
              "Explore a curated portfolio of mandaps, opulent ballrooms, sunny haldi courtyards, and destination weddings executed by Ashish Wankhede & Rutik Pund." ||
            portfolioSection?.subtitle ===
              "Explore our collection of mandaps, reception stages, colorful haldi setups, and destination weddings across India." ||
            portfolioSection?.subtitle ===
              "Explore our portfolio of mandap setups, reception stages, cheerful haldi events, and destination weddings across India." ||
            !portfolioSection?.subtitle
              ? "Look through photos of our past weddings, from colorful haldi setups and grand stages to beautiful destination celebrations planned by Ashish Wankhede and Rutik Pund."
              : portfolioSection.subtitle
          }
        />

        {allItems.length === 0 ? (
          /* True Zero-Data State (Strict Database Reflection) */
          <div className="mt-12 glass-card rounded-3xl p-12 text-center text-muted-foreground border border-dashed border-border/80 transition-all duration-300">
            <Sparkles className="h-10 w-10 mx-auto text-secondary/60 mb-3" />
            <h3 className="font-display text-xl text-ink font-semibold">No Portfolio Works Added Yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Wedding stories and decor projects added in the Admin Panel will appear here live.
            </p>
          </div>
        ) : (
          <>
            {/* Search Bar & Category Filter Bar */}
            <div className="reveal mt-8 sm:mt-10 space-y-4 sm:space-y-5">
              <div className="mx-auto max-w-md relative w-full">
                <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by city, theme or ceremony (e.g. Udaipur, Goa, Haldi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-card/60 pl-9 sm:pl-11 pr-4 sm:pr-5 py-2 sm:py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur-md"
                />
              </div>

              {/* Category Filter Pills + Dropdown */}
              <CategoryFilterBar
                items={allItems}
                categories={
                  Array.isArray(portfolioCategories) && portfolioCategories.length > 0
                    ? portfolioCategories
                    : [
                        { name: "Destination Weddings", showInFront: true },
                        { name: "Grand Mandaps", showInFront: true },
                        { name: "Haldi & Mehendi", showInFront: true },
                        { name: "Grand Receptions" },
                        { name: "Sangeet & Stage" },
                        { name: "Floral & Stage Decor" },
                      ]
                }
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setVisibleCount(isStandalone ? 12 : 8);
                }}
                allLabel="All Works"
                maxFrontCategories={3}
                dropdownLabel="More Categories"
              />
            </div>

            {/* Portfolio Grid - 100% Clean Image, Zero Overlays */}
            <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300">
              {displayedItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-luxe flex flex-col"
                >
                  {/* Top Image Container - Zero Overlays */}
                  <div className="relative h-56 sm:h-64 lg:h-72 w-full overflow-hidden bg-ink/5">
                    <img
                      src={item.image || "/images/hero-1.jpg"}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/images/hero-1.jpg";
                      }}
                    />
                  </div>

                  {/* Card Content Below Image */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 bg-card">
                    {item.category && (
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wider text-primary font-semibold">
                          <Sparkles className="h-2.5 w-2.5 text-secondary" />
                          <span>{item.category}</span>
                        </span>
                      </div>
                    )}

                    <h3 className="font-display text-base sm:text-lg font-semibold text-ink leading-snug group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {item.location && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}

                    {item.description && (
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3 font-normal">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state when filtering or searching */}
            {displayedItems.length === 0 && (
              <div className="mt-8 sm:mt-12 glass-card rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-muted-foreground border border-border/80 max-w-xl mx-auto shadow-soft transition-all duration-300 animate-in fade-in">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-secondary/15 ring-2 ring-secondary/40 flex items-center justify-center mx-auto mb-4 text-secondary">
                  <Eye className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="font-display text-lg sm:text-xl text-ink font-semibold">
                  {allItems.length === 0
                    ? "No Portfolio Works Added Yet"
                    : `No Celebrations Found`}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  {allItems.length === 0
                    ? "Wedding stories and decor projects added in the Admin Panel will appear here live."
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
            <div className="reveal mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-4">
              {isStandalone && visibleCount < filteredItems.length && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="btn-luxe gradient-gold text-ink font-semibold w-full sm:w-auto py-3 px-6"
                >
                  Load More Celebrations ({filteredItems.length - visibleCount} remaining)
                </button>
              )}

              {!isStandalone && (
                <Link
                  href="/portfolio"
                  className="btn-luxe gradient-royal text-primary-foreground shadow-luxe font-semibold py-3 px-6 sm:py-3.5 sm:px-8 text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:scale-105 transition w-full sm:w-auto"
                >
                  <span>See All Our Works</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
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

