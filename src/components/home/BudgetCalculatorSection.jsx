"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, Sparkles, Check, ArrowRight, Info } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function BudgetCalculatorSection() {
  const [guests, setGuests] = useState(250);
  const [days, setDays] = useState(2);
  const [decorTier, setDecorTier] = useState("royal"); // "classic" | "royal" | "imperial"
  const [entertainmentTier, setEntertainmentTier] = useState("live"); // "dj" | "live" | "celebrity"
  const [addons, setAddons] = useState({
    hospitality: true,
    photoCoordination: true,
    shadowCrew: false,
  });

  const decorRates = {
    classic: { label: "Simple & Elegant", costPerGuest: 800, base: 120000 },
    royal: { label: "Royal Decor", costPerGuest: 1600, base: 250000 },
    imperial: { label: "Grand Luxury", costPerGuest: 2800, base: 500000 },
  };

  const entertainmentRates = {
    dj: { label: "DJ & Lighting Setup", cost: 60000 },
    live: { label: "Live Music Band & DJ", cost: 160000 },
    celebrity: { label: "Celebrity Singers & Big Stage", cost: 380000 },
  };

  const breakdown = useMemo(() => {
    const decor = decorRates[decorTier].base + guests * decorRates[decorTier].costPerGuest * (days * 0.7);
    const entertainment = entertainmentRates[entertainmentTier].cost * days;
    const planningBase = 120000 + days * 45000 + (guests > 300 ? (guests - 300) * 150 : 0);
    
    let addonTotal = 0;
    if (addons.hospitality) addonTotal += 40000 * days;
    if (addons.photoCoordination) addonTotal += 25000;
    if (addons.shadowCrew) addonTotal += 35000 * days;

    const total = Math.round(decor + entertainment + planningBase + addonTotal);
    const minRange = Math.round(total * 0.9);
    const maxRange = Math.round(total * 1.15);

    return {
      planning: Math.round(planningBase),
      decor: Math.round(decor),
      entertainment: Math.round(entertainment),
      addons: addonTotal,
      total,
      minRange,
      maxRange,
    };
  }, [guests, days, decorTier, entertainmentTier, addons]);

  const formatINR = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="section-pad relative bg-accent/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Interactive Planner"
          title="Instant Wedding Budget Estimator"
          subtitle="Choose your guest count, event days, decor style, and entertainment to get an instant cost estimate."
        />

        <div className="reveal mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Controls Form */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 lg:col-span-7 border border-border space-y-6">
            {/* Guest Count Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Estimated Guest Count
                </label>
                <span className="font-display text-lg text-primary font-bold">
                  {guests} Guests
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1200"
                step="25"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-2 bg-border rounded-lg"
              />
              <div className="flex justify-between text-[0.68rem] text-muted-foreground mt-1">
                <span>50 (Intimate)</span>
                <span>500 (Grand)</span>
                <span>1200+ (Royal)</span>
              </div>
            </div>

            {/* Duration / Number of Days */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block mb-2.5">
                Number of Event Days / Ceremonies
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 1, label: "1 Day (Intimate)" },
                  { value: 2, label: "2 Days (Classic)" },
                  { value: 3, label: "3 Days (Grand)" },
                  { value: 4, label: "4+ Days (Dest.)" },
                ].map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDays(d.value)}
                    className={`rounded-2xl p-3 text-center transition-all ${
                      days === d.value
                        ? "gradient-royal text-primary-foreground shadow-md font-semibold"
                        : "bg-card/70 border border-border hover:border-primary/40 text-foreground"
                    }`}
                  >
                    <div className="text-sm font-bold">{d.value} Day{d.value > 1 ? "s" : ""}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Decor Tier */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block mb-2.5">
                Decor &amp; Floral Aesthetic Tier
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {Object.entries(decorRates).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDecorTier(key)}
                    className={`rounded-2xl p-4 text-left border transition-all ${
                      decorTier === key
                        ? "border-secondary bg-secondary/10 shadow-sm"
                        : "border-border bg-card/60 hover:border-primary/40"
                    }`}
                  >
                    <div className="text-xs font-bold text-ink">{val.label}</div>
                    <div className="mt-1 text-[0.7rem] text-muted-foreground">
                      {key === "classic" && "Simple fresh flowers & clean drapes"}
                      {key === "royal" && "Fresh flowers & grand stage setup"}
                      {key === "imperial" && "Full ceiling drapery, lighting & 3D stage"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Entertainment Curation */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block mb-2.5">
                Entertainment &amp; Music
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {Object.entries(entertainmentRates).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setEntertainmentTier(key)}
                    className={`rounded-2xl p-4 text-left border transition-all ${
                      entertainmentTier === key
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-card/60 hover:border-primary/40"
                    }`}
                  >
                    <div className="text-xs font-bold text-ink">{val.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Addon Toggles */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block mb-2.5">
                Optional Support Add-ons
              </label>
              <div className="space-y-2">
                {[
                  { key: "hospitality", label: "Guest Logistics & Airport Pickup Desk" },
                  { key: "photoCoordination", label: "Photography Schedule Coordinator" },
                  { key: "shadowCrew", label: "Personal Helper for Bride & Groom" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-card/40 border border-border/70 cursor-pointer hover:border-primary/40 transition"
                  >
                    <input
                      type="checkbox"
                      checked={addons[item.key]}
                      onChange={(e) =>
                        setAddons((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="rounded accent-primary h-4 w-4"
                    />
                    <span className="text-xs text-foreground font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 lg:col-span-5 border-2 border-secondary/30 shadow-luxe space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              <h3 className="font-display text-xl text-ink">Estimated Investment</h3>
            </div>

            <div className="rounded-2xl bg-ink p-6 text-center text-background shadow-inner">
              <span className="text-[0.68rem] uppercase tracking-[0.2em] text-champagne font-light">
                Projected Budget Range
              </span>
              <div className="mt-2 font-display text-2xl sm:text-3xl text-gold-gradient font-bold">
                {formatINR(breakdown.minRange)} - {formatINR(breakdown.maxRange)}
              </div>
              <p className="mt-1 text-[0.68rem] text-background/60">
                *Approximate estimate based on {guests} guests across {days} day{days > 1 ? "s" : ""}.
              </p>
            </div>

            {/* Cost Breakdown List */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold">
                Investment Breakdown
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Planning &amp; Execution Team</span>
                  <span className="font-semibold text-ink">{formatINR(breakdown.planning)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Floral &amp; Stage Decor ({decorRates[decorTier].label})</span>
                  <span className="font-semibold text-ink">{formatINR(breakdown.decor)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Entertainment &amp; Sound</span>
                  <span className="font-semibold text-ink">{formatINR(breakdown.entertainment)}</span>
                </div>
                {breakdown.addons > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">Selected Add-ons</span>
                    <span className="font-semibold text-ink">{formatINR(breakdown.addons)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-primary/5 p-4 border border-primary/10 flex items-start gap-3">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[0.72rem] text-muted-foreground leading-relaxed">
                Confianza gives clear, honest price sheets with no hidden charges. We customize all services to match your venue and selections.
              </p>
            </div>

            <Link
              href="/contact"
              className="btn-luxe gradient-royal w-full text-primary-foreground text-xs font-semibold shadow-luxe text-center"
            >
              <span>Talk to Ashish About This Estimate</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

