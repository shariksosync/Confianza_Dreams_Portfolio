"use client";

import { Sparkles, Quote, Feather } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export default function FounderFeatureSection() {
  const { about } = useSite();

  const founder = about?.founderAddress || {
    badge: "FOUNDER'S VISION",
    eyebrow: "FOUNDER'S ADDRESS",
    quote: "We believe that every couple's love story is unique, and that's what inspires us to create truly personalized weddings.",
    image: "/images/couple.jpg",
    name: "Mr. Ashish Wankhede",
    role: "Founder & Lead Director",
    story:
      "At Confianza, we're the romantic and elegant wedding experts who bring love stories to life with passion and precision. We are a dedicated team obsessed with love, laughter, and happily ever afters.\n\nFor us, your event is no less than our own. From sacred heritage rituals to grand multi-day luxury weddings across India, we shoulder all logistics, hospitality, vendor coordination, and minute-by-minute show running so your family can celebrate as honored guests.\n\nWe pledge our continuous devotion to crafting not just flawless weddings, but heartfelt lifelong memories that outlast generations.",
    signatureName: "Ashish Wankhede",
    signatureTitle: "Founder & Principal Director, Confianza Events",
  };

  const paragraphs = (founder.story || "")
    .split("\n\n")
    .filter((p) => p.trim().length > 0);

  return (
    <section className="section-pad relative bg-background overflow-hidden border-b border-border/60">
      {/* Ethereal background lighting blurs */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[32rem] h-[32rem] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[32rem] h-[32rem] bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Luminous Smooth Cloud Card */}
        <div className="reveal bg-gradient-to-br from-white/95 via-card/90 to-accent/20 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-10 lg:p-14 border border-secondary/30 shadow-2xl shadow-primary/5 relative overflow-hidden ring-1 ring-secondary/15">
          {/* Subtle warm corner glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Founder Photo Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden h-[440px] sm:h-[490px] border-2 border-secondary/30 shadow-xl bg-card group ring-4 ring-secondary/10">
                <img
                  src={founder.image || "/images/couple.jpg"}
                  alt={founder.name || "Founder"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/images/couple.jpg";
                  }}
                />
                {/* Smooth natural bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

                {/* Floating Bottom Card Details */}
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full gradient-gold text-ink font-bold text-[0.68rem] tracking-wider uppercase px-3.5 py-1 shadow-md">
                    <Sparkles className="h-3 w-3" />
                    {founder.badge || "FOUNDER'S VISION"}
                  </span>
                  <h4 className="font-display text-xl sm:text-2xl text-white font-bold mt-2.5">
                    {founder.name || "Mr. Ashish Wankhede"}
                  </h4>
                  <p className="text-xs text-secondary font-semibold tracking-wide mt-0.5">
                    {founder.role || "Founder & Managing Director"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Founder's Address Prose */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 lg:pl-4">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.25em] bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20">
                <Quote className="h-3.5 w-3.5 text-secondary rotate-180" />
                <span>{founder.eyebrow || "FOUNDER'S ADDRESS"}</span>
              </div>

              {/* Majestic Serif Quote Headline */}
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-ink font-normal leading-snug tracking-tight">
                "{founder.quote || "We don't just decorate halls; we architect emotional memories that outlast generations."}"
              </h3>

              {/* Gold Divider Accent */}
              <div className="rule-gold" />

              {/* Story Narrative in Crisp Legible Typography */}
              <div className="space-y-3.5 text-xs sm:text-sm text-foreground/85 leading-relaxed font-normal">
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
                ) : (
                  <p>{founder.story}</p>
                )}
              </div>

              {/* Signature Row */}
              <div className="pt-5 border-t border-border/80 flex items-center gap-3.5">
                <div className="grid h-12 w-12 shrink-0 rounded-full gradient-royal text-primary-foreground place-items-center font-display text-base font-bold shadow-md ring-2 ring-secondary/40">
                  <Feather className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h5 className="font-display text-base sm:text-lg font-bold text-ink">
                    {founder.signatureName || founder.name || "Mr. Ashish Wankhede"}
                  </h5>
                  <p className="text-[0.68rem] sm:text-xs uppercase tracking-wider text-secondary font-semibold">
                    {founder.signatureTitle || "Founder & Principal Director, Confianza Events"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
