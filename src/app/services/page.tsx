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
import CategoryFilterBar from "@/components/ui/CategoryFilterBar";
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
          { id: "planning", name: "Complete Wedding Planning", label: "Complete Wedding Planning" },
          { id: "decor", name: "Mandap & Stage Decor", label: "Mandap & Stage Decor" },
          { id: "hospitality", name: "Guest Hospitality & Personal Helpers", label: "Guest Hospitality & Personal Helpers" },
          { id: "rituals", name: "Rituals, Entertainment & Catering", label: "Rituals, Entertainment & Catering" },
        ];

  const ceremonyList = ceremonies || [];
  const stationeryList = stationery || [];
  const cta = servicesCta || {
    eyebrow: "LET'S PLAN YOUR SPECIAL DAY",
    headline: "Ready to Plan Your Wedding?",
    subtitle:
      "Book a free 60–90 minute consultation with Ashish Wankhede in Warje, Pune, or via video call.",
    buttonText: "Book Free Consultation",
    buttonLink: "/contact",
    notice: "Free Consultation • No Commitment Required",
    perks: [
      "60–90 Min Planning Session",
      "In-Person (Pune) or Video Call",
      "Clear Budget Planning",
      "3D Decor Design Previews",
    ],
  };

  const filteredServices = serviceList.filter((service: any) => {
    if (isAllCategory(selectedCategory)) return true;
    return isCategoryMatch(service.category, selectedCategory);
  });

  return (
    <SiteLayout revealKey="services-page">
      {/* 1. Hero Banner */}
      <section className="relative bg-ink pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/images/hero-1.jpg"
            alt="Confianza Services"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 text-center">
          <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-[0.25em] sm:tracking-[0.34em] text-secondary font-semibold">
            Complete Wedding Planning &amp; Decor
          </span>
          <h1 className="mt-2.5 sm:mt-3 font-display text-3xl sm:text-5xl lg:text-6xl text-background font-normal leading-tight">
            Our Wedding Services
          </h1>
          <div className="rule-gold mx-auto my-4 sm:my-5" />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm lg:text-base text-background/80 font-light leading-relaxed px-2">
            From first design ideas to smooth execution on your big day, every service is delivered with care and quality.
          </p>
        </div>
      </section>

      {/* 2. Detailed Services Catalog with Dynamic Category Filters */}
      <section className="section-pad relative bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="What We Offer"
            title="Everything You Need for Your Wedding"
            subtitle="Explore our complete range of wedding planning services, custom decor, destination management, and rituals."
          />

          {/* 4 Front Category Filter Pills + Luxury Dropdown */}
          <div className="mt-8 sm:mt-10">
            <CategoryFilterBar
              items={serviceList}
              categories={categoriesList}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat: string) => setSelectedCategory(cat === "All" ? "all" : cat)}
              allLabel="All Services"
              maxFrontCategories={3}
              dropdownLabel="More Services"
              getItemCount={(cat: any, itms: any[]) => {
                if (isAllCategory(cat)) return itms.length;
                const catName = typeof cat === "string" ? cat : cat.name || cat.label || cat.id || "";
                return itms.filter((s: any) => isCategoryMatch(s.category, catName)).length;
              }}
            />
          </div>

          {loading && !ready ? (
            <div className="mt-10 sm:mt-14 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80">
                  <div className="h-48 sm:h-60 w-full skeleton" />
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="h-4 w-1/3 skeleton rounded" />
                    <div className="h-6 w-3/4 skeleton rounded" />
                    <div className="h-4 w-full skeleton rounded" />
                    <div className="h-4 w-2/3 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="mt-10 sm:mt-14 glass-card rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-muted-foreground border border-border max-w-2xl mx-auto transition-all duration-300 animate-in fade-in">
              <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-secondary/50 mb-3" />
              <h3 className="font-display text-lg sm:text-xl text-ink font-semibold">
                {serviceList.length === 0 ? "0 Services Listed" : `No Services in "${selectedCategory}"`}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-md mx-auto">
                {serviceList.length === 0
                  ? "No services have been added in the Admin Panel yet."
                  : "No services are currently assigned to this category. Select another category or click below to view all services."}
              </p>
              {serviceList.length > 0 && !isAllCategory(selectedCategory) && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="mt-5 btn-luxe gradient-gold text-ink text-xs py-2 px-5 font-bold shadow-xs cursor-pointer"
                >
                  View All Services ({serviceList.length})
                </button>
              )}
            </div>
          ) : (
            <div className="mt-10 sm:mt-14 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
              {filteredServices.map((service: any, idx: number) => (
                <div
                  key={service.id || service._id || idx}
                  className="group glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-ink">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center gradient-royal text-primary-foreground">
                          <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-secondary/60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 inline-flex items-center gap-1.5 rounded-full gradient-gold px-3 py-0.5 sm:px-3.5 sm:py-1 text-[0.62rem] sm:text-[0.65rem] font-bold uppercase tracking-wider text-ink shadow-md">
                        <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span>{service.badge || "Our Service"}</span>
                      </span>
                    </div>

                    <div className="p-5 sm:p-6">
                      <span className="text-[0.65rem] sm:text-[0.68rem] text-primary font-semibold uppercase tracking-widest block mb-1">
                        Service 0{idx + 1}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl text-ink group-hover:text-primary transition-colors leading-snug">
                        {service.title}
                      </h3>
                      <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
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

                  <div className="p-4 sm:p-6 pt-0">
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="btn-luxe gradient-royal w-full text-primary-foreground text-[0.72rem] sm:text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-center whitespace-normal leading-snug"
                    >
                      <span>Inquire About This Service</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <SectionHeading
              eyebrow="Wedding Functions &amp; Ceremonies"
              title="From Sacred Pheras to Sangeet Nights"
              subtitle="Every Indian wedding function has its own unique style, decor setup, and timing."
            />

            <div className="reveal mt-8 sm:mt-14 grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ceremonyList.map((ceremony: any, idx: number) => (
                <div
                  key={ceremony.id || ceremony._id || idx}
                  className="group glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-ink">
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
                      <span className="absolute bottom-3 left-3 sm:left-4 inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1 text-[0.62rem] sm:text-[0.65rem] font-bold uppercase tracking-wider text-champagne backdrop-blur-md border border-white/10">
                        <Sparkles className="h-2.5 w-2.5 text-secondary" />
                        <span>{ceremony.theme || "Ceremony Milestone"}</span>
                      </span>
                    </div>

                    <div className="p-4 sm:p-6">
                      <h3 className="font-display text-lg sm:text-2xl text-ink group-hover:text-primary transition-colors leading-snug">
                        {ceremony.name}
                      </h3>
                      {ceremony.subtitle && (
                        <span className="text-[0.62rem] sm:text-[0.7rem] uppercase tracking-wider text-primary font-semibold block mt-0.5 mb-2">
                          {ceremony.subtitle}
                        </span>
                      )}
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mt-2">
                        {ceremony.description}
                      </p>

                      {Array.isArray(ceremony.highlights) && ceremony.highlights.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-border/50 space-y-1.5">
                          <span className="text-[0.62rem] sm:text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground block">
                            What's Included:
                          </span>
                          {ceremony.highlights.map((h: string, hIdx: number) => (
                            <div key={hIdx} className="flex items-center gap-2 text-xs text-foreground/85">
                              <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                              <span className="break-words leading-snug">{h}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 pt-0">
                    <Link
                      href={`/contact?service=${encodeURIComponent(ceremony.name)}`}
                      className="btn-luxe gradient-royal w-full text-primary-foreground text-[0.72rem] sm:text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-center whitespace-normal leading-snug"
                    >
                      <span>Plan Your {ceremony.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <SectionHeading
              eyebrow="Wedding Stationery &amp; Welcome Items"
              title="Invitation Cards, Luggage Tags &amp; Welcome Kits"
              subtitle="Personal details make weddings special. We design custom invitation cards, luggage tags, key jackets, and welcome hampers for your guests."
            />

            <div className="reveal mt-10 sm:mt-14 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stationeryList.map((item: any, idx: number) => (
                <div
                  key={item.id || item._id || idx}
                  className="group glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-ink">
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
                        <span>{item.badge || "Stationery"}</span>
                      </span>
                    </div>

                    <div className="p-4 sm:p-5">
                      <h4 className="font-display text-base sm:text-lg font-semibold text-ink group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <span className="text-[0.65rem] sm:text-[0.68rem] text-primary font-medium block mt-0.5">
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

      {/* 7. Dynamic Consultation CTA Banner */}
      <section className="bg-ink py-14 sm:py-20 text-center text-background relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="/images/hero-1.jpg"
            alt="Confianza Wedding Consultation"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-secondary font-bold block mb-2">
            {cta.eyebrow || "WHERE WEDDINGS BECOME STORIES"}
          </span>

          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl text-background font-normal max-w-3xl mx-auto leading-tight">
            {cta.headline || "Ready to Begin Planning Your Wedding?"}
          </h2>

          <div className="rule-gold mx-auto my-4 sm:my-5" />

          <p className="text-xs sm:text-sm lg:text-base text-background/85 font-light mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            {cta.subtitle || "Book a free 60–90 minute consultation with Ashish Wankhede in Warje, Pune, or via video call."}
          </p>

          {/* Consultation Perks Pills */}
          {Array.isArray(cta.perks) && cta.perks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 max-w-3xl mx-auto">
              {cta.perks.map((perk: string, pIdx: number) => (
                <span
                  key={pIdx}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[0.7rem] sm:text-xs text-champagne backdrop-blur-md border border-white/15"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                  <span>{perk}</span>
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Link
              href={cta.buttonLink || "/contact"}
              className="btn-luxe gradient-gold text-ink font-bold shadow-luxe py-3 px-6 sm:px-8 text-xs tracking-wider uppercase w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <span>{cta.buttonText || "Book Your Free Consultation"}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>

            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="btn-luxe bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-secondary hover:text-secondary transition-all py-3 px-6 text-xs font-semibold flex items-center justify-center gap-2.5 backdrop-blur-md shadow-md group w-full sm:w-auto"
              >
                <Phone className="h-4 w-4 text-secondary group-hover:scale-110 transition-transform shrink-0" />
                <span className="tracking-wide">Call +91 {contact.phone}</span>
              </a>
            )}
          </div>

          {cta.notice && (
            <span className="text-[0.65rem] sm:text-[0.7rem] text-background/60 block mt-5 sm:mt-6 font-light">
              {cta.notice}
            </span>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
