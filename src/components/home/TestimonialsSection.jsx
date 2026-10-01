"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Quote, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function TestimonialsSection() {
  const { testimonials, testimonialsHeader } = useSite();

  const reviews = testimonials || [];

  return (
    <section id="testimonials" className="section-pad relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow={testimonialsHeader?.eyebrow || "Words of Gratitude"}
          title={testimonialsHeader?.title || "Stories of Love, Captured Forever"}
          subtitle={
            testimonialsHeader?.subtitle ||
            "Read how our couples and their families experienced the ease, beauty, and grandeur of a Confianza managed wedding."
          }
        />

        {reviews.length === 0 ? (
          <div className="reveal mt-14 glass-card rounded-3xl p-10 text-center text-muted-foreground border border-border">
            <Quote className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-display text-lg text-ink font-semibold">No Testimonials Yet</h3>
            <p className="text-xs text-muted-foreground mt-1">Client reviews will appear here once added in the admin panel.</p>
          </div>
        ) : (
          <div className="reveal mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reviews.map((rev, idx) => (
              <div
                key={rev.id || idx}
                className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe border border-border/80"
              >
                <div>
                  {/* Rating stars & Quote mark */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-primary/25" />
                  </div>

                  {/* Quote Text */}
                  <p className="mt-5 text-xs sm:text-sm leading-relaxed text-foreground/85 italic">
                    "{rev.text}"
                  </p>
                </div>

                {/* Couple Info */}
                <div className="mt-8 pt-5 border-t border-border/60 flex items-center gap-3.5">
                  <img
                    src={rev.image || "/images/couple.jpg"}
                    alt={rev.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-secondary/50"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-display text-sm sm:text-base font-semibold text-ink">
                      {rev.name}
                    </h4>
                    <div className="flex items-center gap-3 text-[0.68rem] text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-secondary" />
                        {rev.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground/70" />
                        {rev.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Stories CTA */}
        {reviews.length > 0 && (
          <div className="reveal mt-12 text-center">
            <Link
              href="/testimonials"
              className="btn-luxe gradient-royal text-primary-foreground text-xs shadow-luxe"
            >
              <span>Read More Couple Stories &amp; Highlights</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

