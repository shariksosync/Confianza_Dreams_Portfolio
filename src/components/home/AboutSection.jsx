"use client";

import Link from "next/link";
import { Sparkles, Compass, HeartHandshake, CheckCircle2, ArrowRight } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function AboutSection() {
  const { homeStory, about } = useSite();
  const story = homeStory || {};

  const eyebrow = story.eyebrow || "Our Story & Philosophy";
  const title = story.title || about?.homepageHeading || "A Pune Studio Devoted to Weddings That Feel Personal";
  const subtitle = story.subtitle || "Where real emotions meet beautiful design. We create unforgettable weddings made specially for you.";
  const image = story.image || "/images/hero-1.jpg";
  const badge = story.badge || "Since 2018 • Warje, Pune";
  const quote = story.quote || '"Every love story deserves a stage as breathtaking as the journey itself."';
  const quoteAuthor = story.quoteAuthor || "— Ashish Wankhede, Founder";
  const feature1Title = story.feature1Title || "Pan-India Destination";
  const feature1Text = story.feature1Text || "From Udaipur palatial courtyards to Goa beachside mandaps.";
  const feature2Title = story.feature2Title || "Zero Template Policy";
  const feature2Text = story.feature2Text || "Every color theme, flower setup, and schedule is made specially for you.";
  const storyHeading = story.storyHeading || "The Confianza Story";
  const storyText =
    story.storyText ||
    about?.homepageStory ||
    "Confianza began in 2018 with one belief — a wedding should sound like the couple, not like a catalogue. What started as a two-person decor team in Warje is now a full-service house planning, designing and executing weddings across India.";
  const missionLabel = story.missionLabel || "Our Mission";
  const missionText =
    story.missionText ||
    about?.mission ||
    "To take the weight of planning off a family's shoulders and hand back a celebration they can be fully present for.";
  const visionLabel = story.visionLabel || "Our Vision";
  const visionText =
    story.visionText ||
    about?.vision ||
    "To be the most trusted and admired name in personalised luxury weddings across Maharashtra and every landmark destination we travel to.";
  const pillarsHeading = story.pillarsHeading || "Our Three Pillars of Excellence";
  const pillars =
    Array.isArray(story.pillars) && story.pillars.length > 0
      ? story.pillars
      : Array.isArray(about?.values) && about.values.length > 0
      ? about.values
      : [
          {
            title: "Authentic Heritage",
            text: "Respect for sacred Maharashtrian, Marwari, and pan-Indian rituals without superficial modern shortcuts.",
          },
          {
            title: "Calm Execution",
            text: "Direct founder oversight on-ground ensuring flawless timing with zero last-minute panic.",
          },
          {
            title: "Uncompromising Aesthetic",
            text: "Spatial styling, royal chandeliers, and imported floral installations tailored exclusively for you.",
          },
        ];
  const ctaLabel = story.ctaLabel || "Learn More About Us & Our Team";
  const ctaLink = story.ctaLink || "/about";

  return (
    <section id="about" className="section-pad relative overflow-hidden bg-background scroll-mt-28 lg:scroll-mt-32">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
        />

        <div className="mt-10 sm:mt-14 lg:mt-20 grid gap-8 sm:gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Visual Story Cards */}
          <div className="reveal space-y-4 sm:space-y-6 lg:col-span-6">
            <div className="group overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-luxe">
              <div className="overflow-hidden h-[240px] sm:h-[300px] md:h-[340px] w-full">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5 sm:p-6 bg-card border-t border-border/60">
                {badge && (
                  <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.25em] text-secondary font-bold block mb-1.5">
                    {badge}
                  </span>
                )}
                {quote && (
                  <p className="font-display text-base sm:text-xl text-ink font-normal leading-snug italic">
                    {quote}
                  </p>
                )}
                {quoteAuthor && (
                  <p className="mt-2.5 text-xs sm:text-sm font-semibold text-primary">
                    {quoteAuthor}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Mini Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-primary/15">
                <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-2" />
                <h3 className="font-display text-sm sm:text-base text-ink">{feature1Title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {feature1Text}
                </p>
              </div>
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-secondary/20">
                <HeartHandshake className="h-5 w-5 sm:h-6 sm:w-6 text-secondary mb-2" />
                <h3 className="font-display text-sm sm:text-base text-ink">{feature2Title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {feature2Text}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Mission, Vision, Core Values */}
          <div className="reveal space-y-6 sm:space-y-8 lg:col-span-6">
            <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-border">
              <h3 className="font-display text-xl sm:text-2xl text-ink">{storyHeading}</h3>
              <p className="mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed text-muted-foreground">
                {storyText}
              </p>

              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-widest text-primary font-medium">
                    {missionLabel}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/85">
                    {missionText}
                  </p>
                </div>
                <div>
                  <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-widest text-secondary font-medium">
                    {visionLabel}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/85">
                    {visionText}
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values / 3 Pillars */}
            <div className="space-y-3">
              <h4 className="text-[0.7rem] sm:text-xs uppercase tracking-[0.25em] text-primary font-semibold">
                {pillarsHeading}
              </h4>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                {pillars.map((val, i) => (
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
                href={ctaLink}
                className="btn-luxe gradient-royal text-primary-foreground text-xs inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-6 sm:py-3.5 sm:px-8 tracking-wider uppercase font-semibold shadow-md hover:scale-[1.02] active:scale-98 transition"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

