"use client";

import Link from "next/link";
import { Sparkles, Compass, HeartHandshake, CheckCircle2, ArrowRight } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function AboutSection() {
  const { about } = useSite();

  return (
    <section id="about" className="section-pad relative overflow-hidden bg-background scroll-mt-28 lg:scroll-mt-32">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Our Story & Philosophy"
          title={about.homepageHeading || "A Pune Studio Devoted to Weddings That Feel Personal"}
          subtitle="Where real emotions meet beautiful design. We create unforgettable weddings made specially for you."
        />

        <div className="mt-10 sm:mt-14 lg:mt-20 grid gap-8 sm:gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Visual Story Cards */}
          <div className="reveal space-y-4 sm:space-y-6 lg:col-span-6">
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/10 shadow-luxe">
              <img
                src="/images/hero-1.jpg"
                alt="Confianza wedding planning in Pune"
                className="h-[280px] sm:h-[380px] md:h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-5 sm:p-8 flex flex-col justify-end">
                <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.25em] text-secondary font-medium">
                  Since 2018 • Warje, Pune
                </span>
                <p className="mt-2 font-display text-lg sm:text-2xl text-background font-normal leading-snug">
                  "Every love story deserves a stage as breathtaking as the journey itself."
                </p>
                <p className="mt-2 text-xs text-champagne/90">— Ashish Wankhede, Founder</p>
              </div>
            </div>

            {/* Quick Mini Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-primary/15">
                <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-2" />
                <h3 className="font-display text-sm sm:text-base text-ink">Pan-India Destination</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  From Udaipur palatial courtyards to Goa beachside mandaps.
                </p>
              </div>
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-secondary/20">
                <HeartHandshake className="h-5 w-5 sm:h-6 sm:w-6 text-secondary mb-2" />
                <h3 className="font-display text-sm sm:text-base text-ink">Zero Template Policy</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Every color theme, flower setup, and schedule is made specially for you.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Mission, Vision, Core Values */}
          <div className="reveal space-y-6 sm:space-y-8 lg:col-span-6">
            <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-border">
              <h3 className="font-display text-xl sm:text-2xl text-ink">The Confianza Story</h3>
              <p className="mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed text-muted-foreground">
                {about.homepageStory ||
                  "Confianza began in 2018 with one belief — a wedding should sound like the couple, not like a catalogue. What started as a two-person decor team in Warje is now a full-service house planning, designing and executing weddings across India."}
              </p>

              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-widest text-primary font-medium">
                    Our Mission
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/85">
                    {about.mission}
                  </p>
                </div>
                <div>
                  <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-widest text-secondary font-medium">
                    Our Vision
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/85">
                    {about.vision}
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values / 3 Pillars */}
            <div className="space-y-3">
              <h4 className="text-[0.7rem] sm:text-xs uppercase tracking-[0.25em] text-primary font-semibold">
                Our Three Pillars of Excellence
              </h4>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                {(about.values || []).map((val, i) => (
                  <div
                    key={val.title || i}
                    className="glass-card rounded-2xl p-3.5 sm:p-4 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <h5 className="font-display text-xs sm:text-sm text-ink">{val.title}</h5>
                    </div>
                    <p className="text-[0.72rem] sm:text-[0.78rem] text-muted-foreground leading-relaxed">
                      {val.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="btn-luxe gradient-royal text-primary-foreground text-xs inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-6 sm:py-3.5 sm:px-8 tracking-wider uppercase font-semibold"
              >
                <span>Learn More About Us &amp; Our Team</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

