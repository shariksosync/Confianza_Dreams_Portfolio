"use client";

import SiteLayout from "@/layouts/SiteLayout";
import BlogSection from "@/components/home/BlogSection";

export default function BlogPage() {
  return (
    <SiteLayout revealKey="blog-page">
      {/* Hero Banner */}
      <section className="relative bg-ink pt-36 pb-20 sm:pt-40 lg:pt-44 sm:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/images/outdoor.jpg"
            alt="Confianza Blog and Wedding Guides"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 text-center">
          <span className="text-[0.68rem] uppercase tracking-[0.34em] text-secondary font-medium">
            Confianza Wedding Guides
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl text-background font-normal">
            Wedding Tips &amp; Guides
          </h1>
          <div className="rule-gold mx-auto my-5" />
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-background/80 font-light leading-relaxed">
            Helpful tips on wedding timelines, decor ideas, budget planning, and venue selection from our team.
          </p>
        </div>
      </section>

      {/* Blog Section (Standalone Mode with all categories and interactive reader modal) */}
      <BlogSection isStandalone={true} />
    </SiteLayout>
  );
}
