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
      title: "First Meeting & Discussion",
      timeline: "60–90 Min Meeting • Ideas & Budget",
      summary:
        "A friendly one-on-one session to understand your wedding ideas, style preferences, guest count, and budget. We explain our planning options clearly and share a simple, honest wedding plan.",
      deliverables: [
        "Understanding Your Vision",
        "Clear Budget Planning",
        "Custom Wedding Plan & Timeline",
      ],
    },
    {
      num: "02",
      title: "Detailed Planning & 3D Decor Design",
      timeline: "Design & Bookings • Creative Concepts",
      summary:
        "Our design team creates realistic 3D designs for your mandap, entrance, and stage so you see everything before setup starts. We help book trusted venues, caterers, sound, lights, and artists with honest pricing.",
      deliverables: [
        "3D Decor Previews & Flower Colors",
        "Venue & Vendor Confirmations",
        "Wedding Cards & Stationery",
      ],
    },
    {
      num: "03",
      title: "Wedding Day Management & Execution",
      timeline: "Wedding Day • Smooth Delivery",
      summary:
        "Our team manages everything on the wedding day. Dedicated personal helpers assist the bride and groom, while our on-ground crew handles guest check-ins, food timings, rituals, and music so your family can enjoy freely.",
      deliverables: [
        "Personal Helpers for Bride & Groom",
        "Detailed Event Schedule",
        "Guest Care & Food Timing Supervision",
      ],
    },
  ];

  const steps = Array.isArray(about?.howWeWork) && about.howWeWork.length > 0
    ? about.howWeWork
    : defaultSteps;

  return (
    <section className="section-pad relative bg-background overflow-hidden border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="How We Work"
          title="How We Plan Your Wedding"
          subtitle="From our first meeting to smooth management on the wedding day, here is our simple, stress-free process."
        />

        <div className="reveal mt-10 sm:mt-16 space-y-6 sm:space-y-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isEven = idx % 2 === 1;
            return (
              <div
                key={step.num}
                className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-border/80 shadow-soft transition-all duration-500 hover:shadow-luxe hover:border-primary/40 relative overflow-hidden"
              >
                <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 lg:items-center">
                  {/* Left: Step Number & Icon */}
                  <div className="lg:col-span-4 flex items-center gap-4 sm:gap-5">
                    <div className="relative">
                      <span className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gold-gradient block">
                        {step.num}
                      </span>
                    </div>
                    <div>
                      <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-widest text-primary font-bold block">
                        {step.timeline}
                      </span>
                      <h3 className="font-display text-lg sm:text-2xl text-ink font-bold mt-0.5 sm:mt-1">
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
                    <div className="lg:col-span-3 rounded-xl sm:rounded-2xl bg-card/80 p-3.5 sm:p-4 border border-border/60 text-xs space-y-2">
                      <span className="text-[0.62rem] sm:text-[0.65rem] uppercase tracking-wider text-secondary font-bold block mb-1">
                        What You Get:
                      </span>
                      {step.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-foreground/85">
                          <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                          <span className="text-[0.68rem] sm:text-[0.72rem] leading-tight">{item}</span>
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
