"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import PortfolioSection from "@/components/home/PortfolioSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { useSite } from "@/context/SiteContext";

export default function PortfolioPage() {
  const { portfolioHeader, portfolioCta, contact } = useSite();

  const header = portfolioHeader || {
    badge: "500+ Stories & Counting",
    eyebrow: "OUR SIGNATURE WORKS",
    title: "The Wedding Portfolio",
    subtitle:
      "A curated gallery of our mandap concepts, floral installations, destination beach setups, and grand reception stages created across India.",
    image: "/images/hero-2.jpg",
    stats: ["500+ Weddings", "15+ Cities Across India", "100% On-Time Cue Execution"],
  };

  const cta = portfolioCta || {
    eyebrow: "WHERE WEDDINGS BECOME STORIES",
    headline: "Want Your Wedding to Be Our Next Masterpiece?",
    subtitle:
      "Connect directly with Ashish Wankhede and Rutik Pund to review your venue options, custom 3D decor concepts, and complete management timeline.",
    buttonText: "Book Your Free Consultation",
    buttonLink: "/contact",
    notice: "Free Consultation • No Obligation",
    perks: [
      "Personalized 1-on-1 Vision Mapping",
      "Direct Founder Interaction (Ashish & Rutik)",
      "Realistic 3D Decor CAD Renderings",
      "Clear & Transparent Line-Item Estimates",
    ],
  };

  return (
    <SiteLayout revealKey="portfolio-page">
      {/* 1. Dynamic Hero Banner */}
      <section className="relative bg-ink pt-32 pb-20 sm:pt-40 sm:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={header.image || "/images/hero-2.jpg"}
            alt="Confianza Portfolio Showcase"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/hero-2.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-[0.68rem] uppercase tracking-[0.3em] text-secondary font-medium backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-secondary" />
            <span>{header.badge || "500+ Stories & Counting"}</span>
          </span>

          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-background font-normal">
            {header.title || "The Wedding Portfolio"}
          </h1>

          <div className="rule-gold mx-auto my-5" />

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-background/85 font-light leading-relaxed">
            {header.subtitle ||
              "A curated gallery of our mandap concepts, floral installations, destination beach setups, and grand reception stages created across India."}
          </p>

          {/* Dynamic Highlight Stats Pills */}
          {Array.isArray(header.stats) && header.stats.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
              {header.stats.map((stat: string, sIdx: number) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs text-champagne backdrop-blur-md border border-white/15 shadow-sm font-medium"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  <span>{stat}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. Main Portfolio Grid with Categories Filter, Search & Lightbox */}
      <PortfolioSection isStandalone={true} />

      {/* 3. Words of Gratitude (Client Testimonials & Stories) */}
      <TestimonialsSection />

      {/* 4. Private Consultation CTA Banner */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-ink text-background overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-ink to-ink pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-secondary font-bold mb-3">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span>{cta.eyebrow || "WHERE WEDDINGS BECOME STORIES"}</span>
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-background font-normal mb-4">
            {cta.headline || "Want Your Wedding to Be Our Next Masterpiece?"}
          </h2>

          <div className="rule-gold mx-auto my-4" />

          <p className="text-sm sm:text-base text-background/85 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            {cta.subtitle ||
              "Connect directly with Ashish Wankhede and Rutik Pund to review your venue options, custom 3D decor concepts, and complete management timeline."}
          </p>

          {/* Consultation Perks */}
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
              className="btn-luxe gradient-gold text-ink font-bold shadow-luxe py-3 px-8 text-xs tracking-wider uppercase flex items-center gap-2"
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

            {contact?.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxe bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 transition-all py-3 px-6 text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md shadow-md"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <span className="tracking-wide">WhatsApp Us</span>
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
