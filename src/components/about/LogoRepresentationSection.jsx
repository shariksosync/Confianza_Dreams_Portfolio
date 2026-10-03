"use client";

import { Sparkles, Feather, Layers, Palette, Flame } from "lucide-react";

export default function LogoRepresentationSection() {
  const elements = [
    {
      icon: Feather,
      title: "The Soaring Bird",
      subtitle: "Elevation, Freedom & Grace",
      description:
        "The bird taking flight above the monogram embodies the freedom from planning anxiety that we gift to our families. It signifies lofty aspirations, soaring creativity, and romance taking wing into a beautiful lifelong journey.",
      accent: "from-blue-600 to-indigo-600",
    },
    {
      icon: Layers,
      title: "The 'CE' Monogram",
      subtitle: "Confianza & Events Intertwined",
      description:
        "Derived from 'Confianza' (the Spanish word for Trust, Faith & Confidence) united with 'Events'. The interlocked letters symbolize the sacred bond formed between two souls, as well as the deep trust between our team and the families we serve.",
      accent: "from-primary to-purple-600",
    },
    {
      icon: Palette,
      title: "The Royal & Gold Palette",
      subtitle: "Regal Dignity & Warmth",
      description:
        "Royal Lavender represents grandeur, spiritual tranquility, and bespoke elegance. It is crowned with Luxury Gold accents that reflect prosperity, auspicious Indian rituals, and radiant celebration under twilight chandeliers.",
      accent: "from-secondary to-amber-500",
    },
    {
      icon: Flame,
      title: "Art • Skill • Soul",
      subtitle: "Our Foundational Trinity",
      description:
        "Art represents our original 3D concepts and spatial styling. Skill represents our logistical engineering, vendor management, and minute-by-minute execution. Soul represents the genuine love, empathy, and emotional warmth poured into every moment.",
      accent: "from-primary to-secondary",
    },
  ];

  return (
    <section className="section-pad relative bg-ink text-background overflow-hidden border-b border-white/10">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-secondary font-bold inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Brand Identity &amp; Symbolism</span>
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight">
            The Story Behind Our Emblem
          </h2>
          <div className="rule-gold mx-auto my-3 sm:my-4" />
          <p className="text-xs sm:text-sm lg:text-base text-champagne/80 font-light leading-relaxed px-2">
            Every curve, hue, and ligature in the Confianza seal carries deep significance — reflecting our commitment to trust, soaring grandeur, and personal celebrations.
          </p>
        </div>

        <div className="reveal mt-10 sm:mt-16 grid gap-8 lg:gap-10 lg:grid-cols-12 lg:items-center">
          {/* Circular Logo Badge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            <div className="relative group">
              {/* Outer halo glow ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-secondary/40 via-primary/30 to-secondary/40 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Strict Circular Container with overflow-hidden and internal padding */}
              <div className="relative h-48 w-48 sm:h-60 sm:w-60 lg:h-72 lg:w-72 rounded-full overflow-hidden bg-white p-4 sm:p-5 ring-4 ring-secondary/90 shadow-[0_0_50px_rgba(201,162,39,0.35)] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Confianza Events Official Seal"
                  className="h-full w-full object-contain rounded-full select-none"
                />
              </div>
            </div>

            <h3 className="mt-5 sm:mt-6 font-display text-xl sm:text-2xl text-white font-semibold">
              Confianza Events
            </h3>
            <span className="text-[0.68rem] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-secondary font-medium mt-1 block">
              Art • Skill • Soul
            </span>
          </div>

          {/* 4 Symbolic Breakdown Cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 sm:gap-5">
            {elements.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/15 transition-all duration-300 hover:border-secondary/50 hover:-translate-y-1 group"
                >
                  <div className="flex items-center gap-3 mb-2.5 sm:mb-3">
                    <div className={`grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-md`}>
                      <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-base sm:text-lg text-white group-hover:text-secondary transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[0.62rem] sm:text-[0.65rem] uppercase tracking-wider text-champagne/70 font-medium block">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-light mt-1.5 sm:mt-2">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
