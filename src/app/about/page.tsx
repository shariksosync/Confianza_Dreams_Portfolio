"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Phone } from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import FounderFeatureSection from "@/components/about/FounderFeatureSection";
import TeamSection from "@/components/home/TeamSection";
import ManagementVerticalsSection from "@/components/about/ManagementVerticalsSection";
import LogoRepresentationSection from "@/components/about/LogoRepresentationSection";
import VisionMissionSection from "@/components/about/VisionMissionSection";
import WhyConfianzaSection from "@/components/about/WhyConfianzaSection";
import CoreValuesSection from "@/components/about/CoreValuesSection";
import HowWeWorkSection from "@/components/about/HowWeWorkSection";
import { useSite } from "@/context/SiteContext";

export default function AboutPage() {
  const { about } = useSite();

  return (
    <SiteLayout revealKey="about-page">
      {/* 1. Hero Header Banner */}
      <section className="relative bg-ink pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={about?.headerBanner?.image || "/images/hero-1.jpg"}
            alt="Confianza wedding heritage"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 text-center">
          <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 border border-white/20 px-3.5 sm:px-4 py-1 text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.32em] text-secondary font-semibold backdrop-blur-md">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-secondary" />
            <span>{about?.headerBanner?.badge || "Since 2018 • Warje, Pune"}</span>
          </span>
          <h1 className="mt-2.5 sm:mt-4 font-display text-3xl sm:text-5xl lg:text-6xl text-background font-normal leading-tight">
            {about?.headerBanner?.title || about?.heading || "Where Weddings Become Stories"}
          </h1>
          <div className="rule-gold mx-auto my-4 sm:my-5" />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm lg:text-base text-background/80 font-light leading-relaxed px-2">
            {about?.headerBanner?.subtitle ||
              about?.story ||
              "At Confianza, we help you create a beautiful and memorable wedding. For us, your wedding is just like our own family event."}
          </p>
        </div>
      </section>

      {/* 2. Founder & Leadership Feature Section */}
      <FounderFeatureSection />

      {/* 3. Meet Our Visionaries & Coordinators */}
      <TeamSection />

      {/* 4. The Story Behind Our Emblem */}
      <LogoRepresentationSection />

      {/* 5. Our Vision & Our Mission */}
      <VisionMissionSection />

      {/* 6. Why Confianza Events & Entertainment */}
      <WhyConfianzaSection />

      {/* 7. Our Core Values */}
      <CoreValuesSection />

      {/* 8. How Do We Work */}
      <HowWeWorkSection />

      {/* 9. Our 10 Core Management Verticals */}
      <ManagementVerticalsSection />

      {/* Bottom Consultation Booking CTA */}
      <section className="relative bg-ink py-14 sm:py-20 text-background overflow-hidden text-center border-t border-white/10">
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
          <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-secondary font-semibold">
            Begin With A Conversation
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl text-background font-normal leading-tight">
            Let's Plan Your Wedding Together
          </h2>
          <div className="rule-gold mx-auto my-3 sm:my-4" />
          <p className="text-xs sm:text-sm text-background/80 font-light leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto px-2">
            Schedule an in-person meeting at our Pune office or connect with us over a call to discuss your dates and ideas.
          </p>
          <div className="flex justify-center">
            <a
              href="tel:7057357240"
              className="btn-luxe gradient-gold text-ink font-semibold shadow-luxe py-3 px-6 sm:px-8 text-xs uppercase tracking-wider flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>call for enquiry</span>
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
