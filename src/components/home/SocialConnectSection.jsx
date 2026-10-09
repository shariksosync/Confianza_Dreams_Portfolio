"use client";

import { Instagram, Globe, MessageCircle, ArrowUpRight } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function SocialConnectSection() {
  const { contact } = useSite();

  const instaUrl = contact?.instagram || "https://www.instagram.com/confianza_events";
  const rawWhatsapp = contact?.whatsapp || "917057357240";
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    "Hi Confianza team, I would like to inquire about wedding planning and decor services."
  )}`;

  return (
    <section className="py-14 sm:py-20 lg:py-24 relative bg-accent/30 overflow-hidden border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 text-center">
        <SectionHeading
          eyebrow="Connect & Celebrate With Us"
          title="Stay Connected & Plan Your Celebration"
          subtitle="Explore our real-time wedding highlights on Instagram, browse our complete services online, or chat directly with our founders on WhatsApp."
        />

        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* 1. Instagram Button */}
          <a
            href={instaUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-card border border-border/80 text-foreground font-semibold text-xs sm:text-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-luxe hover:text-primary cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-110 transition-transform">
              <Instagram className="h-5 w-5" />
            </div>
            <div className="text-left">
              <span className="text-[0.62rem] uppercase tracking-wider text-muted-foreground block font-bold">
                Follow On
              </span>
              <span className="font-display font-bold text-sm sm:text-base text-ink group-hover:text-primary">
                Instagram
              </span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ml-1" />
          </a>

          {/* 2. Website Link Button */}
          <a
            href="/services"
            className="group inline-flex items-center gap-3.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-card border border-border/80 text-foreground font-semibold text-xs sm:text-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-luxe hover:text-primary cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl gradient-royal flex items-center justify-center text-primary-foreground shrink-0 shadow-sm group-hover:scale-110 transition-transform">
              <Globe className="h-5 w-5 text-secondary" />
            </div>
            <div className="text-left">
              <span className="text-[0.62rem] uppercase tracking-wider text-muted-foreground block font-bold">
                Explore Full
              </span>
              <span className="font-display font-bold text-sm sm:text-base text-ink group-hover:text-primary">
                Services &amp; Events
              </span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ml-1" />
          </a>

          {/* 3. WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-card border border-border/80 text-foreground font-semibold text-xs sm:text-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-luxe hover:text-primary cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-110 transition-transform">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="text-left">
              <span className="text-[0.62rem] uppercase tracking-wider text-muted-foreground block font-bold">
                Chat Directly on
              </span>
              <span className="font-display font-bold text-sm sm:text-base text-ink group-hover:text-primary">
                WhatsApp
              </span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
