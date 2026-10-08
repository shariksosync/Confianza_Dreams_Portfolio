"use client";

import { Compass, Heart, Eye, Target, CheckCircle2, Sparkles } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function VisionMissionSection() {
  const { about } = useSite();

  const visionPillars = Array.isArray(about?.visionPillars) && about.visionPillars.length > 0
    ? about.visionPillars
    : [
        "Creating memorable destination wedding experiences across India",
        "Creating beautiful mandap, stage, and floral decor",
        "Honoring authentic cultural traditions with modern elegance",
      ];

  const missionCommitments = Array.isArray(about?.missionCommitments) && about.missionCommitments.length > 0
    ? about.missionCommitments
    : [
        "Handling all the planning and logistics so families can enjoy as guests",
        "Complete budget transparency with zero hidden markups or surprises",
        "On-time execution managed by our calm, dedicated team",
      ];

  return (
    <section className="section-pad relative bg-background overflow-hidden border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Our Purpose"
          title="Our Vision &amp; Mission"
          subtitle="The simple purpose that guides our wedding planners and team every single day."
        />

        <div className="reveal mt-10 sm:mt-16 grid gap-6 sm:gap-8 lg:grid-cols-2">
          {/* 1. OUR VISION CARD */}
          <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-secondary/30 relative overflow-hidden flex flex-col justify-between shadow-soft hover:shadow-luxe transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-border/60">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl sm:rounded-2xl gradient-gold text-ink shadow-md">
                    <Compass className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-secondary font-bold block">
                      The Long-Term Goal
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-ink font-bold">
                      Our Vision
                    </h3>
                  </div>
                </div>
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-secondary/40 shrink-0" />
              </div>

              <p className="mt-4 sm:mt-6 font-display text-base sm:text-lg lg:text-xl text-ink leading-relaxed italic">
                "{about?.vision ||
                  "To be the most trusted wedding planner across Maharashtra and every destination we travel to."}"
              </p>

              <div className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3">
                <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-wider text-muted-foreground font-semibold block">
                  Key Goals:
                </span>
                {visionPillars.map((pillar, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-foreground/85">
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary shrink-0 mt-0.5" />
                    <span>{pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-3.5 sm:pt-4 border-t border-border/50 text-[0.65rem] sm:text-[0.7rem] text-secondary uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Making Every Wedding Special</span>
            </div>
          </div>

          {/* 2. OUR MISSION CARD */}
          <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-primary/30 relative overflow-hidden flex flex-col justify-between shadow-soft hover:shadow-luxe transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-border/60">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl sm:rounded-2xl gradient-royal text-primary-foreground shadow-md">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                  </div>
                  <div>
                    <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary font-bold block">
                      Our Promise
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-ink font-bold">
                      Our Mission
                    </h3>
                  </div>
                </div>
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary/40 shrink-0" />
              </div>

              <p className="mt-4 sm:mt-6 font-display text-base sm:text-lg lg:text-xl text-ink leading-relaxed italic">
                "{about?.mission ||
                  "To take all planning stress away so families can truly enjoy every moment of the wedding."}"
              </p>

              <div className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3">
                <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-wider text-muted-foreground font-semibold block">
                  What We Deliver:
                </span>
                {missionCommitments.map((commitment, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-foreground/85">
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0 mt-0.5" />
                    <span>{commitment}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-3.5 sm:pt-4 border-t border-border/50 text-[0.65rem] sm:text-[0.7rem] text-primary uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Committed to Perfect Events</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
