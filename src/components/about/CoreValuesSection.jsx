"use client";

import { ShieldCheck, Palette, Clock, HeartHandshake, Leaf, Sparkles } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

const ICON_MAP = {
  ShieldCheck,
  Palette,
  Clock,
  HeartHandshake,
  Leaf,
  Sparkles,
};

export default function CoreValuesSection() {
  const { about } = useSite();

  const defaultValues = [
    {
      icon: "ShieldCheck",
      title: "Uncompromised Trust (Confianza)",
      subtitle: "Absolute Honesty in Costing",
      text: "True to our name, we believe trust is the cornerstone of luxury. We provide completely transparent itemized sheets with zero hidden commissions or eleventh-hour markups.",
      gradient: "from-secondary to-amber-500",
    },
    {
      icon: "Palette",
      title: "Artistic Distinction",
      subtitle: "Tailored, Never Templated",
      text: "Every couple has a unique rhythm. We craft custom mood boards, bespoke drape geometries, and original floral installations designed specifically for your aesthetic.",
      gradient: "from-primary to-purple-600",
    },
    {
      icon: "Clock",
      title: "Operational Precision",
      subtitle: "Time-Tested Execution",
      text: "Our production crews start before sunrise with minute-by-minute run sheets, dual generator backups, and proactive weather contingencies to ensure zero delays.",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      icon: "HeartHandshake",
      title: "Empathetic Hospitality",
      subtitle: "Caring for Your Family",
      text: "Weddings are emotional milestones. We coordinate with elders, prioritize guest comfort, and manage vendor interactions so you stay relaxed throughout.",
      gradient: "from-rose-500 to-primary",
    },
    {
      icon: "Leaf",
      title: "Sustainable Elegance",
      subtitle: "Conscious Celebrations",
      text: "We partner with local floral cultivators, utilize low-emission LED lighting designs, and recycle organic decor waste responsibly after grand events.",
      gradient: "from-emerald-600 to-teal-600",
    },
  ];

  const values = Array.isArray(about?.coreValues) && about.coreValues.length > 0
    ? about.coreValues
    : defaultValues;

  return (
    <section className="section-pad relative bg-accent/25 overflow-hidden border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Our Non-Negotiable Pillars"
          title="Our Core Values"
          subtitle="The five foundational principles that define our craft, our ethics, and the way we treat every celebration."
        />

        <div className="reveal mt-10 sm:mt-16 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((val, idx) => {
            const Icon = ICON_MAP[val.icon] || ShieldCheck;
            const isFullWidthOnLarge = idx === 4;
            return (
              <div
                key={val.title || idx}
                className={`glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-border/80 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe hover:border-primary/40 group ${
                  isFullWidthOnLarge ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className={`grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${val.gradient || "from-secondary to-amber-500"} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-muted-foreground/60">
                      0{idx + 1}
                    </span>
                  </div>

                  <span className="text-[0.62rem] sm:text-[0.65rem] uppercase tracking-wider text-secondary font-semibold block mb-1">
                    {val.subtitle}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl text-ink font-bold group-hover:text-primary transition-colors">
                    {val.title}
                  </h3>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {val.text}
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-border/50 flex items-center gap-1.5 text-[0.65rem] sm:text-[0.68rem] text-primary font-semibold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-secondary" />
                  <span>Confianza Promise</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
