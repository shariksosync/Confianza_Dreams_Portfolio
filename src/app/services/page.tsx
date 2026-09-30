"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import PackagesSection from "@/components/home/PackagesSection";
import ProcessSection from "@/components/home/ProcessSection";
import { useSite } from "@/context/SiteContext";

export default function ServicesPage() {
  const { services } = useSite() as any;

  return (
    <SiteLayout revealKey="services-page">
      {/* Hero Banner */}
      <section className="relative bg-ink pt-32 pb-20 sm:pt-40 sm:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/images/stage.jpg"
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

      {/* Detailed Services Catalog */}
      <section className="section-pad relative bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Our Complete Portfolio of Services"
            title="Designed for Every Step of the Journey"
            subtitle="Explore our 12 specialized disciplines across wedding planning, custom fabrication decor, destination logistics, and cultural ceremonies."
          />

          <div className="reveal mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(services || []).map((service: any, idx: number) => (
              <div
                key={service.id || idx}
                className="group glass-card rounded-3xl overflow-hidden border border-border/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden">
                    <img
                      src={service.image || "/images/hero-1.jpg"}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full gradient-gold px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink shadow-md">
                      <Sparkles className="h-3 w-3" />
                      <span>Specialized Craft</span>
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

                    <div className="mt-4 space-y-1.5 text-xs text-foreground/80">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
                        <span>Dedicated on-site coordinator</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
                        <span>Custom 3D visual preview</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
                        <span>Transparent vendor sheets</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/contact"
                    className="btn-luxe gradient-royal w-full text-primary-foreground text-xs font-semibold shadow-sm"
                  >
                    <span>Inquire About {service.title}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Packages Comparison */}
      <PackagesSection />

      {/* 5-Step Process */}
      <ProcessSection />

      {/* Bottom CTA */}
      <section className="bg-ink py-16 text-center text-background">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="font-display text-3xl sm:text-4xl text-background">
            Ready to Begin Curating Your Wedding?
          </h2>
          <div className="rule-gold mx-auto my-4" />
          <p className="text-sm text-background/80 font-light mb-8 max-w-xl mx-auto">
            Book a private meeting with Ashish Wankhede to discuss your custom dates, venue locations, and budget allocations.
          </p>
          <Link
            href="/contact"
            className="btn-luxe gradient-gold text-ink font-semibold shadow-luxe"
          >
            <span>Book Your Free Consultation</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
