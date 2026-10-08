"use client";

import { useState } from "react";
import { Sparkles, SlidersHorizontal, ArrowLeftRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function BeforeAfterSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [mode, setMode] = useState("slider"); // "slider" | "before" | "after"

  const beforeImage = "/images/corporate.jpg";
  const afterImage = "/images/stage.jpg";

  return (
    <section className="section-pad relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Venue Transformations"
          title="From Empty Hall to Grand Wedding Stage"
          subtitle="See how our team turns empty venues into beautiful wedding setups with lighting, fresh flowers, and custom decor."
        />

        {/* View Mode Controls */}
        <div className="reveal mt-6 sm:mt-8 flex flex-wrap justify-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setMode("slider")}
            className={`rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[0.68rem] sm:text-xs font-medium uppercase tracking-wider transition cursor-pointer ${
              mode === "slider"
                ? "gradient-royal text-primary-foreground shadow-luxe"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            Interactive Slider
          </button>
          <button
            type="button"
            onClick={() => setMode("before")}
            className={`rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[0.68rem] sm:text-xs font-medium uppercase tracking-wider transition cursor-pointer ${
              mode === "before"
                ? "gradient-royal text-primary-foreground shadow-luxe"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            Before Setup
          </button>
          <button
            type="button"
            onClick={() => setMode("after")}
            className={`rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[0.68rem] sm:text-xs font-medium uppercase tracking-wider transition cursor-pointer ${
              mode === "after"
                ? "gradient-royal text-primary-foreground shadow-luxe"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            After Confianza Setup
          </button>
        </div>

        {/* Interactive Comparison Container */}
        <div className="reveal mt-8 sm:mt-10 mx-auto max-w-5xl">
          <div className="relative h-[280px] sm:h-[420px] md:h-[500px] w-full select-none overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/20 shadow-luxe">
            {mode === "slider" ? (
              <>
                {/* Background (After) Image */}
                <img
                  src={afterImage}
                  alt="After: Wedding Stage Decor"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute top-3 sm:top-5 right-3 sm:right-5 rounded-full bg-ink/75 px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[0.62rem] sm:text-[0.7rem] uppercase tracking-wider text-secondary font-medium backdrop-blur-md border border-secondary/30 whitespace-nowrap">
                  After: Grand Reception
                </div>

                {/* Foreground (Before) Image clipped to sliderPosition */}
                <div
                  className="absolute inset-0 h-full overflow-hidden transition-[clip-path] duration-75"
                  style={{
                    clipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)`,
                  }}
                >
                  <img
                    src={beforeImage}
                    alt="Before: Empty Venue Space"
                    className="absolute inset-0 h-full w-full object-cover filter brightness-90"
                  />
                  <div className="absolute top-3 sm:top-5 left-3 sm:left-5 rounded-full bg-ink/75 px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[0.62rem] sm:text-[0.7rem] uppercase tracking-wider text-background font-medium backdrop-blur-md border border-white/20 whitespace-nowrap">
                    Before: Empty Banquet Hall
                  </div>
                </div>

                {/* Center Divider Line */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-secondary shadow-[0_0_12px_rgba(201,162,39,0.8)]"
                  style={{ left: `${sliderPosition}%` }}
                >
                  {/* Draggable Circle Handle */}
                  <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 place-items-center rounded-full gradient-gold text-ink shadow-[0_0_25px_rgba(201,162,39,0.7)] ring-4 sm:ring-6 ring-ink/40 cursor-ew-resize transition-transform hover:scale-110 active:scale-95">
                    <ArrowLeftRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 stroke-[2.2]" />
                  </div>
                </div>

                {/* Range Input for dragging */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  aria-label="Drag to compare before and after wedding decor"
                  className="absolute inset-0 z-30 h-full w-full opacity-0 cursor-ew-resize"
                />
              </>
            ) : mode === "before" ? (
              <div className="relative h-full w-full">
                <img
                  src={beforeImage}
                  alt="Before Decor Setup"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 sm:top-5 left-3 sm:left-5 rounded-full bg-ink/75 px-3 sm:px-4 py-1 sm:py-1.5 text-[0.68rem] sm:text-xs uppercase tracking-wider text-background backdrop-blur-md whitespace-nowrap">
                  Empty Venue Before Setup
                </div>
              </div>
            ) : (
              <div className="relative h-full w-full">
                <img
                  src={afterImage}
                  alt="After Confianza Decor Setup"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 sm:top-5 right-3 sm:right-5 rounded-full gradient-gold px-3 sm:px-4 py-1 sm:py-1.5 text-[0.68rem] sm:text-xs uppercase tracking-wider text-ink font-semibold backdrop-blur-md whitespace-nowrap">
                  Finished Wedding Setup
                </div>
              </div>
            )}
          </div>

          {/* Metrics summary */}
          <div className="reveal mt-6 sm:mt-8 grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-4">
            <div className="glass-card rounded-2xl p-3.5 sm:p-4 text-center">
              <span className="font-display text-lg sm:text-xl text-primary font-bold">11 Hours</span>
              <p className="text-[0.62rem] sm:text-[0.7rem] uppercase tracking-wider text-muted-foreground mt-0.5 leading-snug">
                Overnight Setup
              </p>
            </div>
            <div className="glass-card rounded-2xl p-3.5 sm:p-4 text-center">
              <span className="font-display text-lg sm:text-xl text-secondary font-bold">4,000+</span>
              <p className="text-[0.62rem] sm:text-[0.7rem] uppercase tracking-wider text-muted-foreground mt-0.5 leading-snug">
                Fresh Flowers
              </p>
            </div>
            <div className="glass-card rounded-2xl p-3.5 sm:p-4 text-center">
              <span className="font-display text-lg sm:text-xl text-primary font-bold">100% Custom</span>
              <p className="text-[0.62rem] sm:text-[0.7rem] uppercase tracking-wider text-muted-foreground mt-0.5 leading-snug">
                Stage &amp; Drapery
              </p>
            </div>
            <div className="glass-card rounded-2xl p-3.5 sm:p-4 text-center">
              <span className="font-display text-lg sm:text-xl text-secondary font-bold">36 Members</span>
              <p className="text-[0.62rem] sm:text-[0.7rem] uppercase tracking-wider text-muted-foreground mt-0.5 leading-snug">
                On-Ground Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

