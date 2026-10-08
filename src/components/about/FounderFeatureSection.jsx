"use client";

import { Sparkles, Quote } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const DEFAULT_LEADERSHIP = [
  {
    id: "founder",
    badge: "FOUNDER'S VISION",
    eyebrow: "FOUNDER'S ADDRESS",
    quote:
      "Every love story is special, and that is why we create weddings tailored just for you.",
    image: "/images/couple.jpg",
    name: "Mr. Ashish Wankhede",
    role: "Founder & Managing Director",
    story:
      "At Confianza, we love bringing wedding dreams to life with care and attention to detail. Our team is passionate about creating happy moments for couples and their families.\n\nFor us, your wedding is as important as our own family function. From traditional rituals to multi-day destination weddings across India, we take care of all planning, guest hospitality, vendor coordination, and timing so your family can relax and enjoy the celebrations.\n\nOur promise is simple: we manage every detail smoothly so you can make lifelong memories with the people you love.",
  },
  {
    id: "cfo",
    badge: "CLEAR & HONEST BUDGETING",
    eyebrow: "CFO'S PERSPECTIVE",
    quote:
      "Clear budget planning and honest pricing are the foundation of a stress-free wedding.",
    image: "/images/hero-2.jpg",
    name: "Mr. Rutik Pund",
    role: "CFO & Co-Founder",
    story:
      "At Confianza, we handle every family's wedding budget with complete honesty and care. Great weddings are not about high extra costs—they are about smart budget planning, fair vendor rates, and clear spending.\n\nWe give you detailed cost sheets with clear prices for every item. We negotiate directly with hotels and vendors to make sure you get the best quality and value for your money.\n\nWe believe that when you have full peace of mind about your budget, you can celebrate happily with complete confidence.",
  },
  {
    id: "management-head",
    badge: "ON-GROUND MANAGEMENT",
    eyebrow: "OPERATIONS & MANAGEMENT",
    quote:
      "Smooth weddings do not happen by chance—they happen because of good planning, proper preparation, and calm coordination.",
    image: "/images/hero-3.jpg",
    name: "Management Head",
    role: "Head of Operations & Production",
    story:
      "Behind every beautiful bridal entry and grand floral mandap, there is a dedicated ground team working hard. Our team starts early in the morning to set up lighting, sound, stage decor, and guest hospitality on time.\n\nWe stay prepared for every situation and solve any issue quietly behind the scenes so that all ceremonies run smoothly.\n\nOur goal is simple: you enjoy the wedding as happy hosts, while we handle every single detail with care.",
  },
];

export default function FounderFeatureSection() {
  const { about } = useSite();

  // Combine DB leadership array or default 3 cards, ensuring founderAddress override is applied to card 0
  let leadershipList = Array.isArray(about?.leadership) && about.leadership.length > 0
    ? about.leadership
    : DEFAULT_LEADERSHIP;

  // Fallback / sync from legacy founderAddress if leadership array wasn't customized yet
  if (!about?.leadership && about?.founderAddress) {
    leadershipList = [
      {
        ...DEFAULT_LEADERSHIP[0],
        ...about.founderAddress,
      },
      DEFAULT_LEADERSHIP[1],
      DEFAULT_LEADERSHIP[2],
    ];
  }

  return (
    <section className="section-pad relative bg-background overflow-hidden border-b border-border/60">
      {/* Ambient background lighting blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[34rem] h-[34rem] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[34rem] h-[34rem] bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 space-y-10 sm:space-y-14 lg:space-y-20">
        {leadershipList.map((leader, index) => {
          const paragraphs = (leader.story || "")
            .split("\n\n")
            .filter((p) => p.trim().length > 0);

          return (
            <div
              key={leader.id || index}
              className="reveal bg-gradient-to-br from-white/95 via-card/90 to-accent/20 backdrop-blur-2xl rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-14 border border-secondary/30 shadow-2xl shadow-primary/5 relative overflow-hidden ring-1 ring-secondary/15"
            >
              {/* Subtle warm corner glows */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start">
                {/* Left Column: Portrait Card + Details Below Image */}
                <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
                  {/* Clean Photo Container (Without overlay text or dark gradient) */}
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[300px] sm:h-[380px] lg:h-[440px] border-2 border-secondary/30 shadow-xl bg-card group ring-2 sm:ring-4 ring-secondary/10">
                    <img
                      src={leader.image || "/images/couple.jpg"}
                      alt={leader.name || "Leader"}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/images/couple.jpg";
                      }}
                    />
                  </div>

                  {/* Details Cleanly Positioned Below The Image */}
                  <div className="space-y-1.5 pt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full gradient-gold text-ink font-bold text-[0.62rem] sm:text-[0.68rem] tracking-wider uppercase px-3 py-1 shadow-sm">
                      <Sparkles className="h-3 w-3 text-ink shrink-0" />
                      <span>{leader.badge || "EXECUTIVE LEADERSHIP"}</span>
                    </span>
                    <h4 className="font-display text-xl sm:text-2xl lg:text-3xl text-ink font-bold pt-1">
                      {leader.name || "Executive Leader"}
                    </h4>
                    <p className="text-xs sm:text-sm text-secondary font-semibold tracking-wide">
                      {leader.role || "Executive Leadership"}
                    </p>
                  </div>
                </div>

                {/* Right Column: Address, Quote & Narrative (No Signature Row) */}
                <div className="lg:col-span-7 space-y-3.5 sm:space-y-5 lg:pl-4">
                  {/* Eyebrow Badge */}
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 text-primary font-bold text-[0.68rem] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] bg-primary/10 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-primary/20">
                    <Quote className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-secondary rotate-180 shrink-0" />
                    <span>{leader.eyebrow || "EXECUTIVE ADDRESS"}</span>
                  </div>

                  {/* Majestic Serif Quote Headline */}
                  <h3 className="font-display text-lg sm:text-2xl lg:text-3xl text-ink font-normal leading-snug tracking-tight">
                    "{leader.quote || "Where Weddings Become Stories."}"
                  </h3>

                  {/* Gold Divider Accent */}
                  <div className="rule-gold" />

                  {/* Story Narrative in Crisp Legible Typography */}
                  <div className="space-y-3 text-xs sm:text-sm text-foreground/85 leading-relaxed font-normal">
                    {paragraphs.length > 0 ? (
                      paragraphs.map((p, pIdx) => <p key={pIdx}>{p}</p>)
                    ) : (
                      <p>{leader.story}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
