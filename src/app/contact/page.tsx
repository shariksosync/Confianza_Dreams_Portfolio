"use client";

import SiteLayout from "@/layouts/SiteLayout";
import ContactSection from "@/components/home/ContactSection";
import FaqSection from "@/components/home/FaqSection";

export default function ContactPage() {
  return (
    <SiteLayout revealKey="contact-page">
      {/* Hero Banner */}
      <section className="relative bg-ink pt-28 pb-14 sm:pt-36 sm:pb-18 lg:pt-44 lg:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/images/hero-1.jpg"
            alt="Contact Confianza Events"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 lg:px-10 text-center">
          <span className="text-[0.62rem] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.34em] text-secondary font-medium block">
            Let's Shape Your Wedding Story
          </span>
          <h1 className="mt-2.5 sm:mt-3 font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-background font-normal leading-tight">
            Contact Us &amp; Consultation
          </h1>
          <div className="rule-gold mx-auto my-3.5 sm:my-5" />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-background/80 font-light leading-relaxed">
            Reach out via phone, WhatsApp, or our inquiry form. We welcome consultations in person at Warje, Pune, or via video call.
          </p>
        </div>
      </section>

      {/* Main Contact Section with Form, Details & Google Maps Embed */}
      <ContactSection isStandalone={true} />

      {/* FAQ Section */}
      <FaqSection />
    </SiteLayout>
  );
}
