"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageCircle,
  Feather,
  Layers,
  Calendar,
} from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import PackagesSection from "@/components/home/PackagesSection";
import ProcessSection from "@/components/home/ProcessSection";
import { useSite } from "@/context/SiteContext";

const normalizeCategory = (str: string) =>
  (str || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "")
    .trim();

const isAllCategory = (cat: any) => {
  if (!cat) return false;
  const str = typeof cat === "string" ? cat : cat?.name || cat?.label || cat?.id || "";
  const norm = normalizeCategory(str);
  return norm === "all" || norm === "alldisciplines" || norm === "allservices";
};

const isCategoryMatch = (itemCategory: string, targetCategory: any) => {
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

export default function ServicesPage() {
  const { services, serviceCategories, ceremonies, stationery, servicesCta, contact, loading, ready } = useSite() as any;
  const [selectedCategory, setSelectedCategory] = useState("all");

  const serviceList = services || [];
  const categoriesList =
    Array.isArray(serviceCategories) && serviceCategories.length > 0
      ? serviceCategories
      : [
          { id: "planning", name: "Signature Planning & Direction", label: "Signature Planning & Direction" },
          { id: "decor", name: "Mandap & Spatial Decor", label: "Mandap & Spatial Decor" },
          { id: "hospitality", name: "Royal Hospitality & Shadows", label: "Royal Hospitality & Shadows" },
          { id: "rituals", name: "Rituals, Artists & F&B", label: "Rituals, Artists & F&B" },
        ];

  const ceremonyList = ceremonies || [];
  const stationeryList = stationery || [];
  const cta = servicesCta || {
    eyebrow: "WHERE WEDDINGS BECOME STORIES",
    headline: "Ready to Begin Curating Your Wedding?",
    subtitle:
      "Book a private 60–90 minute consultation with Ashish Wankhede in Warje, Pune, or via virtual video call.",
    buttonText: "Book Your Free Consultation",
    buttonLink: "/contact",
    notice: "Free Consultation • No Commitment Required",
    perks: [
      "60–90 Min Vision Mapping",
      "In-Person (Pune) or Virtual Call",
      "Detailed Budget Allocations",
      "3D Spatial Concept Previews",
    ],
  };

  const filteredServices = serviceList.filter((service: any) => {
    if (isAllCategory(selectedCategory)) return true;
    return isCategoryMatch(service.category, selectedCategory);
  });

  return (
    <SiteLayout revealKey="services-page">
      {/* 1. Hero Banner */}
      <section className="relative bg-ink pt-36 pb-20 sm:pt-40 lg:pt-44 sm:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/images/hero-1.jpg"
            alt="Confianza Services"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 text-center">
          <span className="text-[0.68rem] uppercase tracking-[0.34em] text-secondary font-medium">
            Full-Spectrum Event Architecture
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl text-background font-normal">
            Bespoke Services &amp; Event Mastery
          </h1>
          <div className="rule-gold mx-auto my-5" />
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-background/80 font-light leading-relaxed">
            From initial concept sketches to minute-by-minute execution on the ground, every service is delivered with royal refinement and unwavering precision.
          </p>
        </div>
      </section>

      {/* 2. Detailed Services Catalog with Dynamic Category Filters */}
      <section className="section-pad relative bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Our Complete Portfolio of Services"
            title="Designed for Every Step of the Journey"
            subtitle="Explore our specialized disciplines across wedding planning, custom fabrication decor, destination logistics, and cultural ceremonies."
          />

          {/* Dynamic Category Filter Pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-4 sm:px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isAllCategory(selectedCategory)
                  ? "gradient-royal text-primary-foreground shadow-luxe scale-105"
                  : "glass-card text-foreground/80 hover:border-primary/40 hover:text-primary"
              }`}
            >
              <span>All Disciplines</span>
              <span className={`text-[0.65rem] px-1.5 py-0.5 rounded-full font-mono font-bold ${isAllCategory(selectedCategory) ? "bg-secondary text-ink" : "bg-muted text-muted-foreground"}`}>
                {serviceList.length}
              </span>
            </button>

            {categoriesList.map((cat: any) => {
              const catName = cat.name || cat.label || cat.id;
              const count = serviceList.filter((s: any) => isCategoryMatch(s.category, catName)).length;
              const isSelected = isAllCategory(selectedCategory)
                ? false
                : isCategoryMatch(selectedCategory, catName);

              return (
                <button
                  key={cat.id || catName}
                  type="button"
                  onClick={() => setSelectedCategory(catName)}
                  className={`rounded-full px-4 sm:px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "gradient-royal text-primary-foreground shadow-luxe scale-105"
                      : "glass-card text-foreground/80 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  <span>{catName}</span>
                  <span className={`text-[0.65rem] px-1.5 py-0.5 rounded-full font-mono font-bold ${isSelected ? "bg-secondary text-ink" : "bg-muted text-muted-foreground"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {loading && !ready ? (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-3xl overflow-hidden border border-border/80">
                  <div className="h-60 w-full skeleton" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 w-1/3 skeleton rounded" />
                    <div className="h-6 w-3/4 skeleton rounded" />
                    <div className="h-4 w-full skeleton rounded" />
                    <div className="h-4 w-2/3 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="mt-14 glass-card rounded-3xl p-12 text-center text-muted-foreground border border-border max-w-2xl mx-auto transition-all duration-300 animate-in fade-in">
              <Sparkles className="h-12 w-12 mx-auto text-secondary/50 mb-3" />
              <h3 className="font-display text-xl text-ink font-semibold">
                {serviceList.length === 0 ? "0 Services Listed" : `No Services in "${selectedCategory}"`}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                {serviceList.length === 0
                  ? "No services have been added in the Admin Panel yet."
                  : "No services are currently assigned to this discipline. Select another category or click below to view all disciplines."}
              </p>
              {serviceList.length > 0 && !isAllCategory(selectedCategory) && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="mt-5 btn-luxe gradient-gold text-ink text-xs py-2 px-5 font-bold shadow-xs cursor-pointer"
                >
                  View All Disciplines ({serviceList.length})
                </button>
              )}
            </div>
          ) : (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
              {filteredServices.map((service: any, idx: number) => (
                <div
                  key={service.id || service._id || idx}
                  className="group glass-card rounded-3xl overflow-hidden border border-border/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-60 w-full overflow-hidden bg-ink">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center gradient-royal text-primary-foreground">
                          <Sparkles className="h-12 w-12 text-secondary/60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                      <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full gradient-gold px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink shadow-md">
                        <Sparkles className="h-3 w-3" />
                        <span>{service.badge || "Specialized Craft"}</span>
                      </span>
                    </div>

                    <div className="p-6">
                      <span className="text-[0.68rem] text-primary font-semibold uppercase tracking-widest block mb-1">
                        Service 0{idx + 1}
                      </span>
                      <h3 className="font-display text-2xl text-ink group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>

                      {Array.isArray(service.features) && service.features.length > 0 && (
                        <div className="mt-4 space-y-1.5 text-xs text-foreground/80">
                          {service.features.map((feature: string, fIdx: number) => (
                            <div key={fIdx} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="btn-luxe gradient-royal w-full text-primary-foreground text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Inquire About {service.title}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Ceremony-by-Ceremony Management Matrix */}
      {ceremonyList.length > 0 && (
        <section className="section-pad relative bg-accent/30 border-t border-b border-border/50">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Curated Functions &amp; Ritual Mastery"
              title="From Sacred Pheras to Electrifying Sangeets"
              subtitle="Every Indian wedding milestone demands its own distinct atmosphere, spatial architecture, and minute-by-minute ground direction."
            />

            <div className="reveal mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ceremonyList.map((ceremony: any, idx: number) => (
                <div
                  key={ceremony.id || ceremony._id || idx}
                  className="group glass-card rounded-3xl overflow-hidden border border-border/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 w-full overflow-hidden bg-ink">
                      {ceremony.image ? (
                        <img
                          src={ceremony.image}
                          alt={ceremony.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center gradient-royal text-primary-foreground">
                          <Sparkles className="h-10 w-10 text-secondary" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-champagne backdrop-blur-md border border-white/10">
                        <Sparkles className="h-2.5 w-2.5 text-secondary" />
                        <span>{ceremony.theme || "Ceremony Milestone"}</span>
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="font-display text-2xl text-ink group-hover:text-primary transition-colors">
                        {ceremony.name}
                      </h3>
                      {ceremony.subtitle && (
                        <span className="text-[0.7rem] uppercase tracking-wider text-primary font-semibold block mt-0.5 mb-2">
                          {ceremony.subtitle}
                        </span>
                      )}
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mt-2">
                        {ceremony.description}
                      </p>

                      {Array.isArray(ceremony.highlights) && ceremony.highlights.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-border/50 space-y-1.5">
                          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground block">
                            Milestone Deliverables:
                          </span>
                          {ceremony.highlights.map((h: string, hIdx: number) => (
                            <div key={hIdx} className="flex items-center gap-2 text-xs text-foreground/85">
                              <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/contact?service=${encodeURIComponent(ceremony.name)}`}
                      className="btn-luxe gradient-royal w-full text-primary-foreground text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Plan Your {ceremony.name}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Event Stationery & Hospitality Suite */}
      {stationeryList.length > 0 && (
        <section className="section-pad relative bg-background">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Bespoke Guest Collateral"
              title="Event Stationery &amp; Hospitality Touchpoints"
              subtitle="The finest luxury lies in the smallest personal details. We design and deliver custom collateral that sets an unforgettable tone for your celebration."
            />

            <div className="reveal mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stationeryList.map((item: any, idx: number) => (
                <div
                  key={item.id || item._id || idx}
                  className="group glass-card rounded-3xl overflow-hidden border border-border/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-ink">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center gradient-royal text-primary-foreground">
                          <Feather className="h-8 w-8 text-secondary" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full gradient-gold px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-ink shadow-sm">
                        <span>{item.badge || "Collateral"}</span>
                      </span>
                    </div>

                    <div className="p-5">
                      <h4 className="font-display text-lg font-semibold text-ink group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <span className="text-[0.68rem] text-primary font-medium block mt-0.5">
                          {item.subtitle}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Wedding Packages Comparison */}
      <PackagesSection />

      {/* 6. 5-Step Process */}
      <ProcessSection />

      {/* 7. Dynamic Private Consultation VIP CTA Banner */}
      <section className="bg-ink py-20 text-center text-background relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="/images/hero-1.jpg"
            alt="Confianza Wedding Consultation"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
          <span className="text-[0.68rem] uppercase tracking-[0.35em] text-secondary font-bold block mb-2">
            {cta.eyebrow || "WHERE WEDDINGS BECOME STORIES"}
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-background font-normal max-w-3xl mx-auto">
            {cta.headline || "Ready to Begin Curating Your Wedding?"}
          </h2>

          <div className="rule-gold mx-auto my-5" />

          <p className="text-sm sm:text-base text-background/85 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            {cta.subtitle || "Book a private 60–90 minute consultation with Ashish Wankhede in Warje, Pune, or via virtual video call."}
          </p>

          {/* Consultation Perks Pills */}
          {Array.isArray(cta.perks) && cta.perks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-3xl mx-auto">
              {cta.perks.map((perk: string, pIdx: number) => (
                <span
                  key={pIdx}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs text-champagne backdrop-blur-md border border-white/15"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                  <span>{perk}</span>
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={cta.buttonLink || "/contact"}
              className="btn-luxe gradient-gold text-ink font-bold shadow-luxe py-3 px-8 text-xs tracking-wider uppercase"
            >
              <span>{cta.buttonText || "Book Your Free Consultation"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="btn-luxe bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-secondary hover:text-secondary transition-all py-3 px-6 text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md shadow-md group"
              >
                <Phone className="h-4 w-4 text-secondary group-hover:scale-110 transition-transform" />
                <span className="tracking-wide">Call +91 {contact.phone}</span>
              </a>
            )}
          </div>

          {cta.notice && (
            <span className="text-[0.7rem] text-background/60 block mt-6 font-light">
              {cta.notice}
            </span>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
