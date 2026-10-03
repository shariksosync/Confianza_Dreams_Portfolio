"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import FounderFeatureSection from "@/components/about/FounderFeatureSection";
import TeamSection from "@/components/home/TeamSection";
import ManagementVerticalsSection from "@/components/about/ManagementVerticalsSection";
import LogoRepresentationSection from "@/components/about/LogoRepresentationSection";
import VisionMissionSection from "@/components/about/VisionMissionSection";
import CoreValuesSection from "@/components/about/CoreValuesSection";
import HowWeWorkSection from "@/components/about/HowWeWorkSection";
import PartnerMarqueeSection from "@/components/home/PartnerMarqueeSection";
import { useSite } from "@/context/SiteContext";

export default function AboutPage() {
  const { about } = useSite();

  return (
    <SiteLayout revealKey="about-page">
      {/* 1. Hero Header Banner */}
      <section className="relative bg-ink pt-36 pb-20 sm:pt-40 lg:pt-44 sm:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={about?.headerBanner?.image || "/images/hero-1.jpg"}
            alt="Confianza wedding heritage"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.32em] text-secondary font-medium backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            <span>{about?.headerBanner?.badge || "Since 2018 • Warje, Pune"}</span>
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-background font-normal">
            {about?.headerBanner?.title || about?.heading || "Where Weddings Become Stories"}
          </h1>
          <div className="rule-gold mx-auto my-5" />
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-background/80 font-light leading-relaxed">
            {about?.headerBanner?.subtitle ||
              about?.story ||
              "At Confianza, we're the romantic and elegant wedding experts who bring love stories to life with passion and precision. For us, your event is no less than our own."}
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

      {/* 6. Our Core Values */}
      <CoreValuesSection />

      {/* 7. How Do We Work */}
      <HowWeWorkSection />

      {/* 8. Our 10 Core Management Verticals */}
      <ManagementVerticalsSection />

      {/* Hospitality Partners Marquee */}
      <PartnerMarqueeSection />

      {/* Bottom Consultation Booking CTA */}
      <section className="relative bg-ink py-20 text-background overflow-hidden text-center border-t border-white/10">
        <div className="relative z-10 mx-auto max-w-3xl px-5">
          <span className="text-[0.68rem] uppercase tracking-[0.3em] text-secondary font-medium">
            Begin With A Conversation
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl text-background">
            Let's Plan Your Wedding Story Together
          </h2>
          <div className="rule-gold mx-auto my-4" />
          <p className="text-sm text-background/80 font-light leading-relaxed mb-8">
            Schedule an in-person meeting at our Pune studio or connect with us over a call to review your dates and preliminary mood boards.
          </p>
          <Link
            href="/contact"
            className="btn-luxe gradient-gold text-ink font-semibold shadow-luxe"
          >
            <span>Book Consultation With Ashish</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
