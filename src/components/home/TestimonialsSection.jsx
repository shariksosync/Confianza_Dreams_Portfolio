"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Quote, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function TestimonialsSection() {
  const { testimonials } = useSite();

  const reviews = testimonials?.length
    ? testimonials
    : [
        {
          id: 1,
          name: "Sneha & Rohan",
          image: "/images/couple.jpg",
          rating: 5,
          date: "12 Feb 2025",
          location: "Udaipur",
          text: "Confianza turned a three-day wedding into a film we get to relive forever. Ashish and his team were calm, warm and unbelievably organised.",
        },
        {
          id: 2,
          name: "Priya & Aditya",
          image: "/images/hero-2.jpg",
          rating: 5,
          date: "08 Dec 2024",
          location: "Goa",
          text: "Our destination wedding had 220 guests flying in. Not one thing went wrong. The decor was beyond our mood board.",
        },
        {
          id: 3,
          name: "Meera & Karan",
          image: "/images/hero-3.jpg",
          rating: 5,
          date: "22 Nov 2024",
          location: "Pune",
          text: "They respected our budget completely and still delivered a reception that looked like a palace evening.",
        },
        {
          id: 4,
          name: "Anjali & Vivek",
          image: "/images/stage.jpg",
          rating: 5,
          date: "03 May 2024",
          location: "Lonavala",
          text: "The haldi and mehendi setups were the most photographed part of our wedding. Every guest asked who planned it.",
        },
      ];

  return (
    <section id="testimonials" className="section-pad relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Words of Gratitude"
          title="Stories of Love, Captured Forever"
          subtitle="Read how our couples and their families experienced the ease, beauty, and grandeur of a Confianza managed wedding."
        />

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

        {/* View All Stories CTA */}
        <div className="reveal mt-12 text-center">
          <Link
            href="/testimonials"
            className="btn-luxe gradient-royal text-primary-foreground text-xs shadow-luxe"
          >
            <span>Read More Couple Stories &amp; Highlights</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

