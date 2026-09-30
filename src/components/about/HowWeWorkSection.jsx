"use client";

import { MessageSquare, LayoutGrid, Handshake, Hammer, PartyPopper, CheckCircle2, ArrowRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { useSite } from "@/context/SiteContext";

const STEP_ICONS = [MessageSquare, LayoutGrid, Handshake, Hammer, PartyPopper];

export default function HowWeWorkSection() {
  const { about } = useSite();

  const defaultSteps = [
    {
      num: "01",
      title: "Personalized Consultation",
      timeline: "60–90 Min Session • Vision & Budget",
      summary:
        "A dedicated one-on-one session to explore your love story, wedding vision, aesthetic preferences, guest count, and realistic budget priorities. We outline customized planning tiers (Full Planning, Partial Planning, Day-of Coordination) and present a transparent, tailored wedding proposal.",
      deliverables: [
        "Vision & Expectations Alignment",
        "Budget Allocation Framework",
        "Tailored Planning Proposal & Timeline",
      ],
    },
    {
      num: "02",
      title: "Strategic Planning & 3D Spatial Design",
      timeline: "Design & Procurement • Artistry",
      summary:
        "Our design studio creates realistic 3D renderings of the mandap, entrance arches, and stage layouts so you see your celebration before we build it. We curate trusted venues, caterers, sound/lighting engineers, celebrity artists, and custom event stationery with zero hidden markups.",
      deliverables: [
        "3D CAD Decor & Floral Palettes",
        "Venue Lock-in & Vendor Contracts",
        "Event Stationery & Branding Suite",
      ],
    },
    {
      num: "03",
      title: "On-Ground Execution & Show Running",
      timeline: "Event Day • Flawless Delivery",
      summary:
        "Our team brings every carefully planned detail to life. Dedicated shadow coordinators support the bride and groom, while our ground directors oversee hospitality check-in, F&B pacing, ritual timings, artist cues, and instant trouble-shooting so families celebrate as honored guests.",
      deliverables: [
        "Dedicated Bride & Groom Shadows",
        "Minute-by-Minute Master Run Sheet",
        "Royal Hospitality & F&B Supervision",
      ],
    },
  ];

  const steps = Array.isArray(about?.howWeWork) && about.howWeWork.length > 0
    ? about.howWeWork
    : defaultSteps;

  return (
    <section className="section-pad relative bg-background overflow-hidden border-t border-border/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Our 3-Phase Luxury Roadmap"
          title="How Do We Work"
          subtitle="From your initial 60–90 minute vision consultation to flawless on-ground show running, here is our transparent, stress-free execution process."
        />

        <div className="reveal mt-16 space-y-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isEven = idx % 2 === 1;
            return (
              <div
                key={step.num}
                className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-border/80 shadow-soft transition-all duration-500 hover:shadow-luxe hover:border-primary/40 relative overflow-hidden"
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  {/* Left: Step Number & Icon */}
                  <div className="lg:col-span-4 flex items-center gap-5">
                    <div className="relative">
                      <span className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gold-gradient block">
                        {step.num}
                      </span>
                    </div>
                    <div>
                      <span className="text-[0.68rem] uppercase tracking-widest text-primary font-bold block">
                        {step.timeline}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl text-ink font-bold mt-1">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  {/* Center: Summary Description */}
                  <div className="lg:col-span-5">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {step.summary}
                    </p>
                  </div>

                  {/* Right: Key Deliverables */}
                  {Array.isArray(step.deliverables) && step.deliverables.length > 0 && (
                    <div className="lg:col-span-3 rounded-2xl bg-card/80 p-4 border border-border/60 text-xs space-y-2">
                      <span className="text-[0.65rem] uppercase tracking-wider text-secondary font-bold block mb-1">
                        Key Deliverables:
                      </span>
                      {step.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-foreground/85">
                          <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                          <span className="text-[0.72rem] leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
