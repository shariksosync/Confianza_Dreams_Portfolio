"use client";

import { useSite } from "../../context/SiteContext";
import { useCountUp } from "../../hooks/useCountUp";
import { Sparkles, Trophy, Heart, Palmtree, Clock } from "lucide-react";

function StatCounterItem({ value, suffix, label, icon: Icon }) {
  const [ref, count] = useCountUp(Number(value) || 0, 1800);

  return (
    <div
      ref={ref}
      className="reveal glass-dark rounded-3xl p-6 sm:p-8 text-center border border-white/10 transition-all duration-500 hover:border-secondary/40 hover:-translate-y-2 hover:shadow-luxe"
    >
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-secondary/15 text-secondary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-gold-gradient font-bold tracking-tight">
        {count}
        {suffix}
      </div>
      <p className="mt-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-background/80 font-light">
        {label}
      </p>
    </div>
  );
}

export default function StatsSection() {
  const { stats } = useSite();

  const statIcons = [Trophy, Heart, Palmtree, Clock];

  const items = stats?.length
    ? stats
    : [
        { id: 1, value: 500, suffix: "+", label: "Events" },
        { id: 2, value: 350, suffix: "+", label: "Happy Couples" },
        { id: 3, value: 40, suffix: "+", label: "Destination Weddings" },
        { id: 4, value: 7, suffix: "+", label: "Years Experience" },
      ];

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-background">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[0.7rem] uppercase tracking-[0.34em] text-secondary font-medium">
            Our Legacy in Numbers
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl text-background">
            Milestones of Trust &amp; Joy
          </h2>
          <div className="rule-gold mx-auto my-4" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((stat, idx) => (
            <StatCounterItem
              key={stat.id || idx}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              icon={statIcons[idx % statIcons.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

