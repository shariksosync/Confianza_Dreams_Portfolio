"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Quote, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function TestimonialsSection({ showOnlyPortfolio = true }) {
  const { testimonials, testimonialsHeader } = useSite();

  const allReviews = testimonials || [];
  const reviews = showOnlyPortfolio
    ? allReviews.filter((t) => Boolean(t.showOnPortfolio))
    : allReviews;

  const displayedReviews = reviews.slice(0, 4);

  return (
    <section id="testimonials" className="section-pad relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow={testimonialsHeader?.eyebrow || "Words of Gratitude"}
          title={
            testimonialsHeader?.title === "Real Reviews from Real Couples" ||
            testimonialsHeader?.title === "Stories of Love, Captured Forever" ||
            testimonialsHeader?.title === "What Couples & Families Say" ||
            !testimonialsHeader?.title
              ? "Real Stories from Happy Families"
              : testimonialsHeader.title
          }
          subtitle={
            testimonialsHeader?.subtitle ===
              "Read first-hand accounts of couples and families who entrusted their most sacred wedding milestones to Confianza's aesthetic vision and care." ||
            testimonialsHeader?.subtitle ===
              "Read how couples and their families loved their wedding celebrations planned and decorated by our team." ||
            testimonialsHeader?.subtitle ===
              "Read how our couples and their families experienced the ease, beauty, and joy of a Confianza managed wedding." ||
            testimonialsHeader?.subtitle ===
              "Read honest feedback and reviews from couples and families whose weddings we planned." ||
            !testimonialsHeader?.subtitle
              ? "See what couples and their families say about trusting Confianza to design and manage their special day."
              : testimonialsHeader.subtitle
          }
        />

        {reviews.length === 0 ? (
          <div className="mt-10 sm:mt-14 glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center text-muted-foreground border border-border transition-all duration-300">
            <Quote className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-display text-lg text-ink font-semibold">
              No Featured Testimonials Selected
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Select client stories in the Admin Panel by ticking &ldquo;Show on Homepage &amp; Portfolio (Client Reviews)&rdquo; to feature them here.
            </p>
          </div>
        ) : (
          <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-300">
            {displayedReviews.map((rev, idx) => (
              <div
                key={rev.id || idx}
                className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe border border-border/80"
              >
                <div>
                  {/* Rating stars & Quote mark */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-primary/25" />
                  </div>

                  {/* Quote Text */}
                  <p className="mt-4 sm:mt-5 text-xs sm:text-sm leading-relaxed text-foreground/85 italic">
                    "{rev.text}"
                  </p>
                </div>

                {/* Couple Info */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-border/60 flex items-center gap-3 sm:gap-3.5">
                  <img
                    src={rev.image || "/images/couple.jpg"}
                    alt={rev.name}
                    className="h-11 w-11 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-secondary/50 shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <h4 className="font-display text-sm sm:text-base font-semibold text-ink truncate">
                      {rev.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[0.65rem] sm:text-[0.68rem] text-muted-foreground mt-0.5">
                      {rev.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-secondary shrink-0" />
                          <span className="truncate">{rev.location}</span>
                        </span>
                      )}
                      {rev.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                          <span>{rev.date}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Stories CTA */}
        {reviews.length > 0 && (
          <div className="reveal mt-8 sm:mt-12 text-center">
            <Link
              href="/testimonials"
              className="btn-luxe gradient-royal text-primary-foreground text-xs shadow-luxe py-3 px-6 sm:py-3.5 sm:px-8 inline-flex items-center justify-center gap-2 hover:scale-105 transition font-semibold tracking-wider uppercase w-full sm:w-auto"
            >
              <span>Read All Reviews &amp; Stories</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

