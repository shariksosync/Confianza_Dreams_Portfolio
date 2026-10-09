"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Eye, Sparkles, ArrowRight, MapPin, Filter, Layers } from "lucide-react";
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
  if (!cat) return true;
  const str = typeof cat === "string" ? cat : cat?.name || cat?.slug || cat?.id || "";
  const norm = normalizeCategory(str);
  return norm === "all" || norm === "allarchives" || norm === "";
};

const isCategoryMatch = (itemCategory, targetCategory) => {
  if (isAllCategory(targetCategory)) return true;
  const norm1 = normalizeCategory(itemCategory);
  const norm2 = normalizeCategory(targetCategory);
  return Boolean(norm1 && norm2 && norm1 === norm2);
};

export default function GallerySection({ isStandalone = false }) {
  const { gallery, galleryCategories } = useSite();
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const items = useMemo(() => {
    return Array.isArray(gallery) ? gallery : [];
  }, [gallery]);

  const categories = useMemo(() => {
    const list =
      Array.isArray(galleryCategories) && galleryCategories.length > 0
        ? galleryCategories
        : [
            { id: "all", name: "All Photos", slug: "all" },
            { id: "mandap", name: "Mandap & Decor", slug: "mandap" },
            { id: "reception", name: "Receptions", slug: "reception" },
            { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet" },
            { id: "bridal-entries", name: "Bridal Entries & Portraits", slug: "bridal-entries" },
            { id: "destination", name: "Destination Weddings", slug: "destination" },
            { id: "spatial-decor", name: "Mandap & Flower Decor", slug: "spatial-decor" },
          ];
    return list;
  }, [galleryCategories]);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (isAllCategory(activeCategory)) {
      return items;
    }
    return items.filter((item) => isCategoryMatch(item.category, activeCategory));
  }, [items, activeCategory]);

  const displayedItems = isStandalone ? filteredItems : items.slice(0, 8);

  return (
    <section id="gallery" className="py-10 sm:py-16 lg:py-24 relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Photo Gallery"
          title="Moments of Joy & Celebration"
          subtitle="Explore photos of our mandap decor, grand reception stages, colorful haldi ceremonies, and destination weddings."
        />

        {/* 4 Front Category Filter Pills + Luxury Dropdown */}
        {isStandalone && items.length > 0 && (
          <div className="reveal mt-6 sm:mt-10">
            <CategoryFilterBar
              items={items}
              categories={
                Array.isArray(galleryCategories) && galleryCategories.length > 0
                  ? galleryCategories
                  : [
                      { id: "mandap", name: "Mandap & Decor", slug: "mandap", showInFront: true },
                      { id: "reception", name: "Receptions", slug: "reception", showInFront: true },
                      { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet", showInFront: true },
                      { id: "bridal-entries", name: "Bridal Entries & Portraits", slug: "bridal-entries" },
                      { id: "destination", name: "Destination Weddings", slug: "destination" },
                      { id: "spatial-decor", name: "Mandap & Flower Decor", slug: "spatial-decor" },
                    ]
              }
              selectedCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat === "All" ? "all" : cat)}
              allLabel="All Photos"
              maxFrontCategories={3}
              dropdownLabel="More Categories"
              getItemCount={(cat, itms) => {
                if (isAllCategory(cat)) return itms.length;
                const catName = typeof cat === "string" ? cat : cat.name || cat.slug || "";
                return itms.filter(
                  (it) => isCategoryMatch(it.category, catName) || (cat.slug && isCategoryMatch(it.category, cat.slug))
                ).length;
              }}
            />
          </div>
        )}

        {/* Photo Gallery Masonry Grid */}
        {displayedItems.length === 0 ? (
          <div className="mt-8 sm:mt-12 glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center text-muted-foreground border border-border/80 max-w-xl mx-auto shadow-soft transition-all duration-300">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-secondary/15 ring-2 ring-secondary/40 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-secondary">
              <Eye className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h3 className="font-display text-lg sm:text-xl text-ink font-semibold">
              {items.length === 0
                ? "No Gallery Photos Uploaded"
                : activeCategory && activeCategory !== "all"
                ? `No Photos in "${activeCategory}" Yet`
                : "No Photos in This Category"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              {items.length === 0
                ? "The visual archive is currently empty. Photographs added via the Admin Panel will appear here automatically."
                : activeCategory && activeCategory !== "all"
                ? `No photographs have been tagged under "${activeCategory}" in MongoDB yet. Select another category or click below to view all archives.`
                : "No photographs match the selected filter category. Choose another category or click below to view all archives."}
            </p>
            {items.length > 0 && activeCategory !== "all" && (
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="mt-4 sm:mt-5 btn-luxe gradient-gold text-ink text-xs py-2 px-5 font-bold shadow-xs cursor-pointer"
              >
                View All Archives ({items.length})
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8 sm:mt-12 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3.5 sm:gap-5 space-y-3.5 sm:space-y-5 transition-all duration-300">
            {displayedItems.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => setLightboxIndex(idx)}
                className="group relative cursor-pointer break-inside-avoid overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-luxe"
              >
                <div className="relative overflow-hidden bg-muted/40">
                  <img
                    src={item.image}
                    alt={item.caption || item.title || "Confianza Wedding Decor"}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Full Gallery CTA for Homepage */}
        {!isStandalone && displayedItems.length > 0 && (
          <div className="reveal mt-8 sm:mt-12 text-center">
            <Link
              href="/gallery"
              className="btn-luxe gradient-royal text-primary-foreground text-xs shadow-luxe inline-flex items-center gap-2"
            >
              <span>Explore Complete Visual Archive ({items.length} Photos)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Interactive Lightbox Viewer */}
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
