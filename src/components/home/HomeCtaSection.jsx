"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
} from "lucide-react";
import { useSite } from "../../context/SiteContext";
import EnquiryModal from "../EnquiryModal";

export default function HomeCtaSection() {
  const { contact } = useSite();
  const [modalOpen, setModalOpen] = useState(false);

  const phone = contact?.phone || "7057357240";
  const whatsapp = contact?.whatsapp || "917057357240";

  return (
    <>
      <section className="relative overflow-hidden bg-ink py-14 sm:py-20 lg:py-28 text-background">
        {/* Ambient Luxury Glow */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(43,33,56,0.85)_100%)]" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-8 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-3.5 sm:px-4 py-1 sm:py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
            <span className="text-[0.62rem] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-champagne">
              Where Weddings Become Stories
            </span>
          </div>

          {/* Headline */}
          <h2 className="mt-4 sm:mt-6 font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.2] sm:leading-[1.15] text-background">
            Ready to Plan Your <span className="text-gold-gradient font-medium">Dream Wedding</span>?
          </h2>

          {/* Gold divider */}
          <div className="my-4 sm:my-5 rule-gold mx-auto" />

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xs sm:text-base md:text-lg leading-relaxed text-background/80 font-light">
            Book a free 60–90 minute meeting with founders Ashish Wankhede &amp; Rutik Pund at our Pune office or on a video call.
          </p>

          {/* Trust Value Badges */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 text-[0.7rem] sm:text-xs md:text-sm text-background/90">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 sm:px-3.5 py-1 sm:py-1.5 backdrop-blur-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
              <span>100% Custom 3D Decor Designs</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 sm:px-3.5 py-1 sm:py-1.5 backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary shrink-0" />
              <span>Personal Care by Founders</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 sm:px-3.5 py-1 sm:py-1.5 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-secondary shrink-0" />
              <span>Smooth On-Time Event Flow</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 sm:px-3.5 py-1 sm:py-1.5 backdrop-blur-sm">
              <Calendar className="h-3.5 w-3.5 text-secondary shrink-0" />
              <span>500+ Happy Weddings</span>
            </span>
          </div>

          {/* Interactive CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href={`tel:${phone}`}
              className="btn-luxe gradient-royal text-primary-foreground shadow-luxe font-semibold py-3 px-6 sm:py-3.5 sm:px-8 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition hover:scale-105 w-full sm:w-auto"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>Call For Enquiry</span>
            </a>

            <a
              href={`tel:${phone}`}
              className="btn-luxe glass-dark text-background border border-background/25 hover:border-secondary hover:text-secondary py-3 px-5 sm:py-3.5 sm:px-6 text-xs sm:text-sm flex items-center justify-center gap-2 transition w-full sm:w-auto"
            >
              <Phone className="h-4 w-4 text-secondary shrink-0" />
              <span>Call Founders</span>
            </a>

            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Confianza Team, I would like to inquire about wedding planning services.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxe bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 py-3 px-5 sm:py-3.5 sm:px-6 text-xs sm:text-sm flex items-center justify-center gap-2 transition w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Studio Visit & Dedicated Page Link */}
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-[0.72rem] sm:text-xs text-background/60">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-secondary shrink-0" />
              <span>Indrayani Complex, Warje, Pune</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-secondary shrink-0" />
              <span>Open Daily: 10:00 AM – 9:00 PM</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <a
              href="https://maps.google.com/?q=Warje+Jakat+Naka,+Pune,+Maharashtra+411052"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline font-medium flex items-center gap-1"
            >
              <span>View Studio On Google Maps</span>
              <ArrowRight className="h-3 w-3 shrink-0" />
            </a>
          </div>
        </div>
      </section>

      {/* Instant Enquiry Modal Trigger */}
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
