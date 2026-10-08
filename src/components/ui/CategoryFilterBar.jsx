"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Sparkles, Filter, X } from "lucide-react";

const normalizeCategory = (str) =>
  (str || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "")
    .trim();

const isAllCategory = (cat) => {
  if (!cat) return false;
  const str = typeof cat === "string" ? cat : cat?.name || cat?.label || cat?.slug || cat?.id || "";
  const norm = normalizeCategory(str);
  return (
    norm === "all" ||
    norm === "allportfolio" ||
    norm === "allwork" ||
    norm === "allservices" ||
    norm === "allphotos" ||
    norm === "allarchives" ||
    norm === "allstories" ||
    norm === "alltestimonials" ||
    norm === ""
  );
};

const defaultCategoryMatcher = (itemCategory, targetCategory) => {
  if (!targetCategory || isAllCategory(targetCategory)) return true;
  if (!itemCategory) return false;
  const norm1 = normalizeCategory(itemCategory);
  const norm2 = normalizeCategory(
    typeof targetCategory === "string"
      ? targetCategory
      : targetCategory?.name || targetCategory?.label || targetCategory?.slug || targetCategory?.id || ""
  );
  return Boolean(norm1 && norm2 && norm1 === norm2);
};

export default function CategoryFilterBar({
  items = [],
  categories = [],
  selectedCategory = "All",
  onSelectCategory,
  allLabel = "All",
  maxFrontCategories = 3,
  dropdownLabel = "More Categories",
  getItemCount,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Clean raw categories list excluding any duplicate "All"
  const cleanCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.filter((c) => {
      const name = typeof c === "string" ? c : c?.name || c?.label || c?.slug || "";
      return name && !isAllCategory(name);
    });
  }, [categories]);

  // Partition into Front 3 Categories and Dropdown Categories
  const { frontCategories, dropdownCategories } = useMemo(() => {
    // 1. Check if any categories have explicit showInFront === true
    const explicitFront = cleanCategories.filter((c) => typeof c === "object" && Boolean(c?.showInFront));
    let front = [];
    let remaining = [];

    if (explicitFront.length > 0) {
      front = explicitFront.slice(0, maxFrontCategories);
      const frontIds = new Set(front.map((c) => c.id || c.name || c.label || c.slug));
      remaining = cleanCategories.filter((c) => {
        const id = typeof c === "object" ? c.id || c.name || c.label || c.slug : c;
        return !frontIds.has(id);
      });
    } else {
      // Default: Take first maxFrontCategories
      front = cleanCategories.slice(0, maxFrontCategories);
      remaining = cleanCategories.slice(maxFrontCategories);
    }

    return {
      frontCategories: front,
      dropdownCategories: remaining,
    };
  }, [cleanCategories, maxFrontCategories]);

  // Calculate counts helper
  const countForCategory = (cat) => {
    if (typeof getItemCount === "function") {
      return getItemCount(cat, items);
    }
    if (isAllCategory(cat)) return items.length;
    const catName = typeof cat === "string" ? cat : cat.name || cat.label || cat.slug || "";
    return items.filter((it) => defaultCategoryMatcher(it.category, catName)).length;
  };

  // Check if selected category is in the dropdown
  const isSelectedInDropdown = useMemo(() => {
    if (isAllCategory(selectedCategory)) return false;
    const normSelected = normalizeCategory(selectedCategory);
    return dropdownCategories.some((c) => {
      const name = typeof c === "string" ? c : c.name || c.label || c.slug || "";
      return normalizeCategory(name) === normSelected;
    });
  }, [selectedCategory, dropdownCategories]);

  const selectedDropdownCatName = useMemo(() => {
    if (!isSelectedInDropdown) return null;
    const normSelected = normalizeCategory(selectedCategory);
    const found = dropdownCategories.find((c) => {
      const name = typeof c === "string" ? c : c.name || c.label || c.slug || "";
      return normalizeCategory(name) === normSelected;
    });
    return typeof found === "string" ? found : found?.name || found?.label || found?.slug || selectedCategory;
  }, [isSelectedInDropdown, selectedCategory, dropdownCategories]);

  const allCount = useMemo(() => {
    if (typeof getItemCount === "function") {
      return getItemCount("All", items);
    }
    return items.length;
  }, [getItemCount, items]);

  const isAllActive = isAllCategory(selectedCategory);

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 ${className}`}>
      {/* 1. Pill 1: "All" Category */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          onSelectCategory("All");
        }}
        className={`rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-[0.68rem] sm:text-xs font-semibold uppercase tracking-wider transition-colors duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs ${
          isAllActive
            ? "gradient-royal text-primary-foreground shadow-luxe ring-1 ring-white/30"
            : "glass-card text-foreground/80 hover:border-primary/40 hover:text-primary hover:bg-card/90"
        }`}
      >
        <span>{allLabel}</span>
        <span
          className={`text-[0.58rem] sm:text-[0.62rem] px-1.5 py-0.5 rounded-full font-bold font-mono ${
            isAllActive ? "bg-secondary text-ink" : "bg-muted text-muted-foreground"
          }`}
        >
          {allCount}
        </span>
      </button>

      {/* 2. Pills 2, 3, 4: Front Categories */}
      {frontCategories.map((cat, idx) => {
        const catName = typeof cat === "string" ? cat : cat.name || cat.label || cat.slug || "";
        const catKey = typeof cat === "string" ? `front-${idx}` : cat.id || cat.slug || `front-${idx}`;
        const count = countForCategory(cat);
        const isSelected =
          !isAllActive && normalizeCategory(selectedCategory) === normalizeCategory(catName);

        return (
          <button
            key={catKey}
            type="button"
            onClick={() => {
              setIsOpen(false);
              onSelectCategory(catName);
            }}
            className={`rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-[0.68rem] sm:text-xs font-semibold uppercase tracking-wider transition-colors duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isSelected
                ? "gradient-royal text-primary-foreground shadow-luxe ring-1 ring-white/30"
                : "glass-card text-foreground/80 hover:border-primary/40 hover:text-primary hover:bg-card/90"
            }`}
          >
            <span>{catName}</span>
            <span
              className={`text-[0.58rem] sm:text-[0.62rem] px-1.5 py-0.5 rounded-full font-bold font-mono ${
                isSelected ? "bg-secondary text-ink" : "bg-muted text-muted-foreground"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}

      {/* 3. Luxury Premium Dropdown for Remaining Categories */}
      {dropdownCategories.length > 0 && (
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isOpen}
            className={`rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-[0.68rem] sm:text-xs font-semibold uppercase tracking-wider transition-colors duration-150 flex items-center gap-2 cursor-pointer shadow-xs ${
              isSelectedInDropdown
                ? "gradient-royal text-primary-foreground shadow-luxe ring-1 ring-secondary/50 border border-secondary/40"
                : "glass-card border border-border/90 text-foreground/85 hover:border-secondary/60 hover:text-secondary hover:bg-card/90"
            }`}
          >
            <Filter className={`h-3 w-3 ${isSelectedInDropdown ? "text-secondary" : "text-muted-foreground"}`} />
            <span className="truncate max-w-[140px] sm:max-w-[180px]">
              {isSelectedInDropdown ? selectedDropdownCatName : dropdownLabel}
            </span>
            {isSelectedInDropdown ? (
              <span className="text-[0.58rem] sm:text-[0.62rem] px-1.5 py-0.5 rounded-full font-bold font-mono bg-secondary text-ink">
                {countForCategory(selectedCategory)}
              </span>
            ) : (
              <span className="text-[0.58rem] sm:text-[0.62rem] px-1.5 py-0.5 rounded-full font-bold font-mono bg-muted text-muted-foreground">
                +{dropdownCategories.length}
              </span>
            )}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-150 ${
                isOpen ? "rotate-180 text-secondary" : "text-muted-foreground"
              }`}
            />
          </button>

          {/* Floating Luxury Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-64 sm:w-72 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl p-2 z-50 animate-dropdown-pop space-y-1">
              <div className="px-3 py-1.5 border-b border-border/60 flex items-center justify-between text-[0.65rem] uppercase tracking-wider font-bold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-secondary" />
                  <span>More Filter Categories</span>
                </span>
                <span>{dropdownCategories.length} Categories</span>
              </div>

              <div className="max-h-60 overflow-y-auto py-1 space-y-1 no-scrollbar">
                {dropdownCategories.map((cat, dIdx) => {
                  const catName = typeof cat === "string" ? cat : cat.name || cat.label || cat.slug || "";
                  const catKey = typeof cat === "string" ? `drop-${dIdx}` : cat.id || cat.slug || `drop-${dIdx}`;
                  const count = countForCategory(cat);
                  const isSelected =
                    !isAllActive && normalizeCategory(selectedCategory) === normalizeCategory(catName);

                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => {
                        onSelectCategory(catName);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-primary/15 text-primary font-bold border border-primary/20"
                          : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        {isSelected ? (
                          <Check className="h-3.5 w-3.5 text-secondary shrink-0" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary/40 shrink-0" />
                        )}
                        <span className="truncate">{catName}</span>
                      </div>
                      <span
                        className={`text-[0.62rem] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                          isSelected ? "bg-secondary text-ink" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isSelectedInDropdown && (
                <div className="pt-1.5 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory("All");
                      setIsOpen(false);
                    }}
                    className="w-full py-1.5 text-center text-[0.7rem] text-muted-foreground hover:text-primary transition-colors duration-150 font-semibold cursor-pointer"
                  >
                    Reset to {allLabel}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
