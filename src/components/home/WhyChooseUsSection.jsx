"use client";

import {
  Users,
  Heart,
  Sparkles,
  Wallet,
  Clock,
  Crown,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

const ICONS = {
  Users,
  Heart,
  Sparkles,
  Wallet,
  Clock,
  Crown,
  Plane,
};

export default function WhyChooseUsSection() {
  const { why } = useSite();

  const reasons = why?.length
    ? why
    : [
        { icon: "Users", title: "Experienced Team", text: "Seven years and 500+ events of on-ground expertise." },
        { icon: "Heart", title: "Personalized Planning", text: "Every wedding designed around your story, never a template." },
        { icon: "Sparkles", title: "Creative Designs", text: "Original concepts, mood boards and 3D decor previews." },
        { icon: "Wallet", title: "Budget Friendly", text: "Transparent costing with options at every price point." },
        { icon: "Clock", title: "On-time Execution", text: "Detailed run sheets and crews that start before sunrise." },
        { icon: "Crown", title: "Premium Vendors", text: "A vetted network of India's finest partners." },
        { icon: "Plane", title: "Destination Expertise", text: "Travel, stays and permissions handled end to end." },
      ];

  return (
    <section className="section-pad relative overflow-hidden bg-ink text-background">
      {/* Subtle radial light backdrops */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[300px] w-[400px] rounded-full bg-secondary/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          light
          eyebrow="The Confianza Standard"
          title="Why Discerning Couples Choose Us"
          subtitle="We balance high romantic aesthetics with meticulous logistics so that you remain completely present in every moment."
        />

        <div className="mt-14 sm:mt-18 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reasons.map((item, idx) => {
            const IconComponent = ICONS[item.icon] || ShieldCheck;
            return (
              <div
                key={item.title || idx}
                className="reveal group glass-dark rounded-3xl p-6 sm:p-7 border border-white/10 transition-all duration-500 hover:border-secondary/50 hover:-translate-y-1.5 hover:shadow-luxe"
              >
                <div className="gradient-royal grid h-13 w-13 place-items-center rounded-2xl text-primary-foreground shadow-luxe transition-transform duration-500 group-hover:scale-110 group-hover:bg-secondary">
                  <IconComponent className="h-6 w-6 text-champagne" />
                </div>

                <h3 className="mt-6 font-display text-lg text-background transition-colors group-hover:text-secondary">
                  {item.title}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-background/70 font-light">
                  {item.text}
                </p>

                <div className="mt-5 h-0.5 w-8 rounded-full bg-white/10 transition-all duration-300 group-hover:w-16 group-hover:bg-secondary" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

