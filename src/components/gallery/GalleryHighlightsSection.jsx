"use client";

import { Sparkles, Layers, Award, Users, CheckCircle2 } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import SectionHeading from "@/components/ui/SectionHeading";

const ICON_MAP = {
  Sparkles: Sparkles,
  Layers: Layers,
  Award: Award,
  Users: Users,
};

export default function GalleryHighlightsSection() {
  const { galleryHighlights } = useSite();

  const highlights =
    Array.isArray(galleryHighlights) && galleryHighlights.length > 0
      ? galleryHighlights
      : [
          {
            id: "mandap-sanctum",
            title: "Mandap & Traditional Ritual Setups",
            subtitle: "Sacred Setups & Floral Art",
            description:
              "From temple pillars to lotus pools, our mandaps blend traditional Vedic rituals with fresh seasonal flowers.",
            icon: "Sparkles",
            badge: "Traditional Mandap",
          },
          {
            id: "stage-production",
            title: "Stage, Lighting & Special Effects",
            subtitle: "3D Design-to-Reality Execution",
            description:
              "Moving light setups, LED screens, cold pyro fireworks, and stages managed with precise timing.",
            icon: "Layers",
            badge: "Stage & Lights",
          },
          {
            id: "haldi-carnival",
            title: "Themed Haldi & Mehendi Setups",
            subtitle: "Bright Yellow Blooms & Traditional Art",
            description:
              "Phoolon ki Holi setups, marigold canopies, brass urlis, mehendi cabanas, and energetic dhol tasha groups.",
            icon: "Award",
            badge: "Haldi & Mehendi",
          },
          {
            id: "luxe-tablescapes",
            title: "Guest Tables & Welcome Hampers",
            subtitle: "Warm Hospitality & Personal Touches",
            description:
              "Chandeliers, candlelit centerpieces, personalized luggage tags, itinerary cards, and dedicated guest hospitality.",
            icon: "Users",
            badge: "Guest Hospitality",
          },
        ];

  if (highlights.length === 0) return null;

  return (
    <section className="py-10 sm:py-16 lg:py-24 relative bg-card/40 border-y border-border/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Decor &amp; Design"
          title="The Work Behind Every Wedding"
          subtitle="How our setup team, florists, and coordinators turn 3D designs into beautiful real-life wedding spaces."
        />

        <div className="reveal mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {highlights.map((card, idx) => {
            const IconComp = ICON_MAP[card.icon] || Sparkles;
            return (
              <div
                key={card.id || idx}
                className="group relative rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-6 lg:p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-luxe hover:border-secondary/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-secondary/15 ring-1 ring-secondary/40 flex items-center justify-center text-secondary transition-transform duration-300 group-hover:scale-105">
                      <IconComp className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    {card.badge && (
                      <span className="text-[0.58rem] sm:text-[0.62rem] uppercase tracking-wider font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-accent text-secondary border border-secondary/20">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-base sm:text-lg text-ink font-semibold leading-snug">
                    {card.title}
                  </h3>
                  {card.subtitle && (
                    <p className="text-[0.7rem] sm:text-xs text-secondary font-medium mt-1">
                      {card.subtitle}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 sm:mt-3 font-light leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-border/80 flex items-center gap-2">
                  <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                    <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-secondary" />
                  </div>
                  <span className="text-[0.7rem] sm:text-xs font-semibold text-foreground/90 tracking-wide">
                    Confianza Quality Setup
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
