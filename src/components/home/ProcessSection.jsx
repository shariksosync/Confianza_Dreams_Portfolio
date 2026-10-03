"use client";

import {
  MessageSquareHeart,
  CalendarCheck,
  Palette,
  Hammer,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

const STEP_ICONS = [
  MessageSquareHeart,
  CalendarCheck,
  Palette,
  Hammer,
  PartyPopper,
];

export default function ProcessSection() {
  const { process } = useSite();

  const steps = process || [];
  if (steps.length === 0) return null;

  return (
    <section className="section-pad relative bg-accent/30 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="The Wedding Journey"
          title="From First Meeting to Forever Memories"
          subtitle="A transparent, stress-free path crafted so you and your families can cherish every second leading up to the celebration."
        />

        {/* Process Timeline Steps */}
        <div className="reveal mt-10 sm:mt-16 relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-0.5 -translate-y-8 bg-gradient-to-r from-primary/30 via-secondary/60 to-primary/30 z-0" />

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-5 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = STEP_ICONS[idx % STEP_ICONS.length] || Sparkles;
              return (
                <div
                  key={step.id || idx}
                  className="group glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe flex flex-col items-center justify-between"
                >
                  <div className="flex flex-col items-center">
                    {/* Step Number & Icon Circle */}
                    <div className="relative mb-4 sm:mb-5">
                      <div className="gradient-royal grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-full text-primary-foreground shadow-luxe transition-transform duration-500 group-hover:scale-110 group-hover:bg-secondary">
                        <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-champagne" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 grid h-5.5 w-5.5 sm:h-6 sm:w-6 place-items-center rounded-full gradient-gold text-[0.62rem] sm:text-[0.65rem] font-bold text-ink shadow-md">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-display text-base sm:text-lg text-ink transition-colors group-hover:text-primary">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {step.text}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-5 text-[0.62rem] sm:text-[0.65rem] font-semibold uppercase tracking-widest text-secondary/80">
                    Step 0{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

