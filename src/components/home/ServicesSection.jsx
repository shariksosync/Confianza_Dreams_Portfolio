"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, HeartHandshake } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function ServicesSection() {
  const { services } = useSite();
  const [filter, setFilter] = useState("all");

  const categories = [
    { id: "all", label: "All Services" },
    { id: "core", label: "Signature Planning" },
    { id: "rituals", label: "Rituals & Functions" },
    { id: "special", label: "Corporate & Entertainment" },
  ];

  const serviceList = services || [];

  const filteredServices = serviceList.filter((s) => {
    if (filter === "all") return true;
    if (filter === "core")
      return ["wedding-planning", "wedding-decor", "destination-wedding", "wedding-execution"].includes(s.id);
    if (filter === "rituals")
      return ["haldi", "mehendi", "reception", "engagement", "anniversary"].includes(s.id);
    if (filter === "special")
      return ["corporate-events", "entertainment", "birthday"].includes(s.id);
    return true;
  });

  return (
    <section id="services" className="section-pad relative bg-accent/40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Bespoke Offerings"
          title="Curated Services for Every Milestone"
          subtitle="From grand destination weddings to intimate family ceremonies, our bespoke services bring artistry, precision, and calm to your celebration."
        />

        {/* Category Filter Pills */}
        <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={`rounded-full px-4 sm:px-6 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-all duration-300 ${
                filter === cat.id
                  ? "gradient-royal text-primary-foreground shadow-luxe"
                  : "glass-card text-foreground/80 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="mt-12 glass-card rounded-3xl p-10 text-center text-muted-foreground border border-border transition-all duration-300">
            <Sparkles className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-display text-lg text-ink font-semibold">No Services Found</h3>
            <p className="text-xs text-muted-foreground mt-1">Services will appear here once added in the admin panel.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300">
          {filteredServices.map((service, idx) => (
            <div
              key={service.id || idx}
              className="group glass-card overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image || "/images/hero-1.jpg"}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-champagne backdrop-blur-md border border-white/10">
                  <Sparkles className="h-2.5 w-2.5 text-secondary" />
                  <span>Confianza Signature</span>
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-xl text-ink transition-colors group-hover:text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-primary transition-all group-hover:text-secondary group-hover:translate-x-1"
                  >
                    <span>Inquire Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <span className="text-[0.68rem] text-muted-foreground/60 font-mono">
                    0{idx + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Bottom CTA to full services page */}
        <div className="reveal mt-14 text-center">
          <Link
            href="/services"
            className="btn-luxe gradient-royal text-primary-foreground text-xs shadow-luxe"
          >
            <span>Explore All 12 Tailored Services &amp; Packages</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

