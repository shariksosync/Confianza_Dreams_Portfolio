"use client";

import {
  HeartHandshake,
  Truck,
  UserCheck,
  Flame,
  Palette,
  Utensils,
  Music,
  Radio,
  FileText,
  Crown,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const VERTICALS = [
  {
    num: "01",
    title: "Hospitality Management",
    icon: HeartHandshake,
    tagline: "Guest Welcome & Care",
    description:
      "Smooth guest arrivals, hotel room check-in, welcome desk, custom gift hampers, room key cards, luggage tags, and transport help.",
    highlights: ["Guest Check-in & Help Desk", "Welcome Gifts & Room Keys", "Pick-up & Drop Coordination"],
  },
  {
    num: "02",
    title: "Logistics Management",
    icon: Truck,
    tagline: "Setup, Sound & Power",
    description:
      "Coordination of vendor deliveries, stage setups, sound and lighting systems, power backups, and smooth ceremony transitions.",
    highlights: ["Vendor Delivery Coordination", "Sound, Lights & Backup Power", "Parking & Guest Movement"],
  },
  {
    num: "03",
    title: "Shadow Management",
    icon: UserCheck,
    tagline: "Dedicated Personal Helpers",
    description:
      "Dedicated helpers for the bride, groom, and parents. Taking care of timing, dress touch-ups, water, snacks, and emergency items.",
    highlights: ["Bride & Groom Helpers", "Dress Touch-ups & Essentials", "Relaxed & Stress-Free Support"],
  },
  {
    num: "04",
    title: "Ritual Management",
    icon: Flame,
    tagline: "Traditional Pooja & Customs",
    description:
      "Timely and respectful coordination for Baraat, Milni, Varmala, Pheras, and Haldi. Full pandit coordination, havan kund, and pooja items.",
    highlights: ["Baraat & Varmala Direction", "Pandit & Pooja Samagri Ready", "Right Timing for All Rituals"],
  },
  {
    num: "05",
    title: "Production & Decor",
    icon: Palette,
    tagline: "Custom 3D Decor & Stages",
    description:
      "Custom 3D designs, mandap setups, fresh flower decoration, beautiful lighting, and safe, solid stage building.",
    highlights: ["3D Decor Previews", "Mandap & Fresh Flowers", "Stage Lighting & Backdrop"],
  },
  {
    num: "06",
    title: "F & B Management",
    icon: Utensils,
    tagline: "Food & Beverage Coordination",
    description:
      "Menu planning, live food counter timing, welcome drinks, cleanliness checks, food temperature, and guest dining care.",
    highlights: ["Food Counter Flow & Timing", "Welcome Drinks & Bar Setup", "Quality & Cleanliness Checks"],
  },
  {
    num: "07",
    title: "Artist Management",
    icon: Music,
    tagline: "Singers, Bands & Performers",
    description:
      "Booking and managing singers, Sufi/Bollywood live bands, DJs, anchors, and dancers. Complete sound checks and green room care.",
    highlights: ["Live Bands & Celebrities", "Sound Checks & Stage Ready", "Artist Green Room Care"],
  },
  {
    num: "08",
    title: "Show Runner & Cueing",
    icon: Radio,
    tagline: "On-Ground Event Direction",
    description:
      "A dedicated ground director managing event flow, stage entries, fireworks, music cues, and quick on-the-spot support.",
    highlights: ["Minute-by-Minute Event Schedule", "Walkie-Talkie Ground Team", "Quick On-Ground Support"],
  },
  {
    num: "09",
    title: "Wedding Stationery",
    icon: FileText,
    tagline: "Custom Cards & Welcome Items",
    description:
      "Custom wedding stationery matching your theme: personalized schedule cards, luggage tags, key jackets, menu cards, and welcome signboards.",
    highlights: ["Custom Luggage Tags", "Room Key Cards & Schedules", "Welcome Signs & Menu Cards"],
  },
  {
    num: "10",
    title: "Welcome Hostesses",
    icon: Crown,
    tagline: "Traditional Welcome Team",
    description:
      "Well-dressed hostesses in traditional Indian attire welcoming guests with aarti, flower showers, refreshing welcome drinks, and guidance to rooms.",
    highlights: ["Traditional Attire Hostesses", "Aarti & Flower Showers", "VIP Guest Welcoming"],
  },
];

export default function ManagementVerticalsSection() {
  return (
    <section className="section-pad relative bg-accent/25 overflow-hidden border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Complete Event Coordination"
          title="Our 10 Core Services & Teams"
          subtitle="From warm guest welcome and pooja timing to bride and groom helpers and event management, here is how we make everything easy for you."
        />

        <div className="reveal is-visible mt-10 sm:mt-16 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map((vert) => {
            const Icon = vert.icon;
            return (
              <div
                key={vert.num}
                className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-secondary/25 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-luxe hover:border-secondary/60 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-border/60">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl sm:rounded-2xl gradient-gold text-ink shadow-md group-hover:scale-105 transition-transform">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <span className="text-[0.62rem] sm:text-[0.65rem] uppercase tracking-wider text-secondary font-bold block">
                          Vertical #{vert.num}
                        </span>
                        <h3 className="font-display text-base sm:text-lg lg:text-xl text-ink font-bold group-hover:text-primary transition-colors">
                          {vert.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <span className="text-[0.68rem] sm:text-[0.72rem] uppercase tracking-wider text-primary font-bold block mt-3 sm:mt-4">
                    {vert.tagline}
                  </span>

                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {vert.description}
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-border/50 space-y-1.5">
                  {vert.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-foreground/85">
                      <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                      <span className="text-[0.68rem] sm:text-[0.72rem]">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
