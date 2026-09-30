"use client";

import Link from "next/link";
import { Star, Quote, MapPin, Calendar, ArrowRight } from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import PartnerMarqueeSection from "@/components/home/PartnerMarqueeSection";
import { useSite } from "@/context/SiteContext";

export default function TestimonialsPage() {
  const { testimonials } = useSite() as any;

  return (
    <SiteLayout revealKey="testimonials-page">
      {/* Hero Banner */}
      <section className="relative bg-ink pt-32 pb-20 sm:pt-40 sm:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/images/couple.jpg"
            alt="Confianza Couple Stories"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 text-center">
          <span className="text-[0.68rem] uppercase tracking-[0.34em] text-secondary font-medium">
            Couples &amp; Families
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl text-background font-normal">
            Testimonials &amp; Love Stories
          </h1>
          <div className="rule-gold mx-auto my-5" />
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-background/80 font-light leading-relaxed">
            Read first-hand accounts of couples who entrusted their most sacred days to Confianza's care and aesthetic vision.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section-pad relative bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Heartfelt Reviews"
            title="Real Weddings. Lasting Memories."
            subtitle="Discover how Ashish and our crew managed every intricate detail with poise, creativity, and warmth."
          />

          <div className="reveal mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(testimonials || []).map((rev: any, idx: number) => (
              <div
                key={rev.id || idx}
                className="glass-card rounded-3xl p-8 border border-border flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <Quote className="h-7 w-7 text-primary/20" />
                  </div>

                  <p className="mt-6 text-sm sm:text-base leading-relaxed text-foreground/85 italic">
                    "{rev.text}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-border/60 flex items-center gap-4">
                  <img
                    src={rev.image || "/images/couple.jpg"}
                    alt={rev.name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-secondary"
                  />
                  <div>
                    <h4 className="font-display text-base font-semibold text-ink">
                      {rev.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-secondary" />
                        {rev.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {rev.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Marquee */}
      <PartnerMarqueeSection />

      {/* CTA */}
      <section className="bg-ink py-16 text-center text-background">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-display text-3xl text-background">
            Ready to Create Your Own Love Story?
          </h2>
          <div className="rule-gold mx-auto my-4" />
          <p className="text-sm text-background/80 font-light mb-8">
            Connect with our team to start designing your celebration.
          </p>
          <Link
            href="/contact"
            className="btn-luxe gradient-gold text-ink font-semibold shadow-luxe"
          >
            <span>Book A Free Consultation</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
