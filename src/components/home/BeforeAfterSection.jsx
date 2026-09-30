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
          eyebrow="Transformation Spotlight"
          title="From Blank Canvas to Royal Ballroom"
          subtitle="Watch how our production and decor team turns bare event spaces into cinematic fairy tales through lighting, florals, and bespoke architecture."
        />

        {/* View Mode Controls */}
        <div className="reveal mt-8 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setMode("slider")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
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
            className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
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
            className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
              mode === "after"
                ? "gradient-royal text-primary-foreground shadow-luxe"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            After Confianza Magic
          </button>
        </div>

        {/* Interactive Comparison Container */}
        <div className="reveal mt-10 mx-auto max-w-5xl">
          <div className="relative h-[340px] sm:h-[480px] md:h-[540px] w-full select-none overflow-hidden rounded-3xl border border-primary/20 shadow-luxe">
            {mode === "slider" ? (
              <>
                {/* Background (After) Image */}
                <img
                  src={afterImage}
                  alt="After: Luxury Wedding Decor"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute top-5 right-5 rounded-full bg-ink/75 px-3.5 py-1 text-[0.7rem] uppercase tracking-wider text-secondary font-medium backdrop-blur-md border border-secondary/30">
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
                    alt="Before: Raw Venue Space"
                    className="absolute inset-0 h-full w-full object-cover filter brightness-90"
                  />
                  <div className="absolute top-5 left-5 rounded-full bg-ink/75 px-3.5 py-1 text-[0.7rem] uppercase tracking-wider text-background font-medium backdrop-blur-md border border-white/20">
                    Before: Raw Banquet
                  </div>
                </div>

                {/* Center Divider Line */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-secondary shadow-[0_0_12px_rgba(201,162,39,0.8)]"
                  style={{ left: `${sliderPosition}%` }}
                >
                  {/* Draggable Circle Handle */}
                  <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full gradient-gold text-ink shadow-luxe ring-4 ring-ink/30 cursor-ew-resize">
                    <ArrowLeftRight className="h-4 w-4" />
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
                <div className="absolute top-5 left-5 rounded-full bg-ink/75 px-4 py-1.5 text-xs uppercase tracking-wider text-background backdrop-blur-md">
                  Raw Space Before Work
                </div>
              </div>
            ) : (
              <div className="relative h-full w-full">
                <img
                  src={afterImage}
                  alt="After Confianza Luxury Decor"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-5 right-5 rounded-full gradient-gold px-4 py-1.5 text-xs uppercase tracking-wider text-ink font-semibold backdrop-blur-md">
                  Final Masterpiece
                </div>
              </div>
            )}
          </div>

          {/* Metrics summary */}
          <div className="reveal mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="glass-card rounded-2xl p-4 text-center">
              <span className="font-display text-xl text-primary font-bold">11 Hours</span>
              <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mt-0.5">
                Overnight Build
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <span className="font-display text-xl text-secondary font-bold">4,000+</span>
              <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mt-0.5">
                Fresh Exotic Stems
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <span className="font-display text-xl text-primary font-bold">100% Custom</span>
              <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mt-0.5">
                Fabricated Stage &amp; Drapes
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <span className="font-display text-xl text-secondary font-bold">36 Specialists</span>
              <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mt-0.5">
                On-Ground Production Crew
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

