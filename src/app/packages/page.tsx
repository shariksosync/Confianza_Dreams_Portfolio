"use client";

import SiteLayout from "@/layouts/SiteLayout";
import PackagesSection from "@/components/home/PackagesSection";
import BudgetCalculatorSection from "@/components/home/BudgetCalculatorSection";
import FaqSection from "@/components/home/FaqSection";

export default function PackagesPage() {
  return (
    <SiteLayout revealKey="packages-page">
      {/* Hero Banner */}
      <section className="relative bg-ink pt-32 pb-20 sm:pt-40 sm:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/images/stage.jpg"
            alt="Confianza Packages and Pricing"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 text-center">
          <span className="text-[0.68rem] uppercase tracking-[0.34em] text-secondary font-medium">
            Pricing &amp; Value Architecture
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl text-background font-normal">
            Packages &amp; Investment Planner
          </h1>
          <div className="rule-gold mx-auto my-5" />
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-background/80 font-light leading-relaxed">
            Transparent costing, customized tiers, and real-time budget forecasting tailored for intimate, grand, and destination weddings.
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <PackagesSection />

      {/* Budget Calculator */}
      <BudgetCalculatorSection />

      {/* FAQ */}
      <FaqSection />
    </SiteLayout>
  );
}
