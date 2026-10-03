"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, HeartHandshake } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

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
  return norm === "all" || norm === "alldisciplines" || norm === "allservices";
};

const isCategoryMatch = (itemCategory, targetCategory) => {
  if (!targetCategory || isAllCategory(targetCategory)) return true;
  if (!itemCategory) return false;
  const normItem = normalizeCategory(itemCategory);
  const normTarget = normalizeCategory(
    typeof targetCategory === "string"
      ? targetCategory
      : targetCategory?.name || targetCategory?.label || targetCategory?.id || ""
  );
  return Boolean(normItem && normTarget && normItem === normTarget);
};

export default function ServicesSection() {
  const { services, serviceCategories } = useSite();
  const [activeCategory, setActiveCategory] = useState("all");

  const serviceList = useMemo(() => {
    return Array.isArray(services) ? services : [];
  }, [services]);

  const categories = useMemo(() => {
    const list =
      Array.isArray(serviceCategories) && serviceCategories.length > 0
        ? serviceCategories
        : [
            { id: "all", name: "All Services", label: "All Services" },
            { id: "planning", name: "Signature Planning & Direction", label: "Signature Planning & Direction" },
            { id: "decor", name: "Mandap & Spatial Decor", label: "Mandap & Spatial Decor" },
            { id: "hospitality", name: "Royal Hospitality & Shadows", label: "Royal Hospitality & Shadows" },
            { id: "rituals", name: "Rituals, Artists & F&B", label: "Rituals, Artists & F&B" },
          ];
    return list;
  }, [serviceCategories]);

  const filteredServices = useMemo(() => {
    if (isAllCategory(activeCategory)) return serviceList;
    return serviceList.filter((s) => isCategoryMatch(s.category, activeCategory));
  }, [serviceList, activeCategory]);

  const displayedServices = useMemo(() => {
    return filteredServices.slice(0, 8);
  }, [filteredServices]);

  return (
    <section id="services" className="section-pad relative bg-accent/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Bespoke Offerings"
          title="Curated Services for Every Milestone"
          subtitle="From grand destination weddings to intimate family ceremonies, our bespoke services bring artistry, precision, and calm to your celebration."
        />

        {/* Category Filter Pills */}
        <div className="reveal mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
          {categories.map((cat, idx) => {
            const isAllPill = isAllCategory(cat);
            const catName = cat.name || cat.label || cat.id;
            const count = isAllPill
              ? serviceList.length
              : serviceList.filter((s) => isCategoryMatch(s.category, catName)).length;

            const isSelected = isAllPill
              ? isAllCategory(activeCategory)
              : isCategoryMatch(activeCategory, catName);

            return (
              <button
                key={cat.id || catName || idx}
                type="button"
                onClick={() => setActiveCategory(isAllPill ? "all" : catName)}
                className={`rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 text-[0.7rem] sm:text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.14em] transition-all duration-300 flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs ${
                  isSelected
                    ? "gradient-royal text-primary-foreground shadow-luxe scale-105"
                    : "glass-card text-foreground/80 hover:border-primary/40 hover:text-primary"
                }`}
              >
                <span>{catName}</span>
                <span
                  className={`text-[0.62rem] sm:text-[0.65rem] px-1.5 py-0.5 rounded-full font-mono font-bold ${
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

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="mt-10 sm:mt-12 glass-card rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-center text-muted-foreground border border-border transition-all duration-300 animate-in fade-in">
            <Sparkles className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-display text-lg text-ink font-semibold">
              {serviceList.length === 0
                ? "No Services Listed"
                : `No Services in "${activeCategory}"`}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              {serviceList.length === 0
                ? "Services will appear here once added in the admin panel."
                : "No services are currently assigned to this category. Select another category or click below to view all services."}
            </p>
            {serviceList.length > 0 && activeCategory !== "all" && (
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="mt-5 btn-luxe gradient-gold text-ink text-xs py-2 px-5 font-bold shadow-xs cursor-pointer"
              >
                View All Services ({serviceList.length})
              </button>
            )}
          </div>
        ) : (
          <div className="mt-10 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300">
            {displayedServices.map((service, idx) => (
              <div
                key={service.id || idx}
                className="group glass-card overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe flex flex-col justify-between"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={service.image || "/images/hero-1.jpg"}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 sm:left-4 inline-flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1 text-[0.62rem] sm:text-[0.65rem] uppercase tracking-wider text-champagne backdrop-blur-md border border-white/10">
                    <Sparkles className="h-2.5 w-2.5 text-secondary" />
                    <span>{service.badge || "Confianza Signature"}</span>
                  </span>
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-display text-lg sm:text-xl text-ink transition-colors group-hover:text-primary">
                      {service.title}
                    </h3>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-border/50 flex items-center justify-between">
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-primary transition-all group-hover:text-secondary group-hover:translate-x-1"
                    >
                      <span>Inquire Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <span className="text-[0.65rem] sm:text-[0.68rem] text-muted-foreground/60 font-mono">
                      0{idx + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA to full services page */}
        <div className="reveal mt-10 sm:mt-14 text-center">
          <Link
            href="/services"
            className="btn-luxe gradient-royal text-primary-foreground text-xs shadow-luxe py-3 px-6 sm:py-3.5 sm:px-8 inline-flex items-center justify-center gap-2 hover:scale-105 transition uppercase tracking-wider font-semibold w-full sm:w-auto"
          >
            <span>Explore All Services &amp; Packages</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}

