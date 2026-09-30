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
    tagline: "Guest Welcome & Concierge",
    description:
      "Seamless guest arrival coordination, room allocations, welcome desk, custom welcome hampers, key jackets, luggage tags, and dedicated guest transport support.",
    highlights: ["Guest Check-in & Desk", "Welcome Kits & Room Keys", "Dedicated Travel Concierge"],
  },
  {
    num: "02",
    title: "Logistics Management",
    icon: Truck,
    tagline: "Infrastructure & Flow",
    description:
      "Comprehensive vendor transit coordination, staging deliveries, audio-visual schematics, lighting power backups, and punctual ceremony-to-reception transitions.",
    highlights: ["Vendor Delivery Sync", "AV & Power Infrastructure", "Valet & Convoy Management"],
  },
  {
    num: "03",
    title: "Shadow Management",
    icon: UserCheck,
    tagline: "Dedicated Personal Care",
    description:
      "Discreet personal coordinators shadowing the Bride, Groom, and VIP parents. Handling schedule tracking, wardrobe steaming, emergency makeup touch-ups, and hydration.",
    highlights: ["Bride & Groom Shadows", "Wardrobe & Emergency Fixes", "Behind-the-Scenes Calm"],
  },
  {
    num: "04",
    title: "Ritual Management",
    icon: Flame,
    tagline: "Sacred Traditions & Customs",
    description:
      "Punctual and reverent execution of traditional customs (Baraat, Milni, Varmala, Saptapadi, Pheras, Haldi). Complete pandit coordination, havan kund, and pooja samagri.",
    highlights: ["Baraat & Varmala Direction", "Pandit & Samagri Readiness", "Customs Timing Adherence"],
  },
  {
    num: "05",
    title: "Production & Decor",
    icon: Palette,
    tagline: "Spatial Artistry & Engineering",
    description:
      "Bespoke spatial design, mandap architecture, floral conditioning, ambient lighting, 2D/3D CAD layouts, structural safety compliance, and overnight venue build-outs.",
    highlights: ["3D Decor Visualizations", "Floral & Mandap Architecture", "Acoustic & Lighting Design"],
  },
  {
    num: "06",
    title: "F & B Management",
    icon: Utensils,
    tagline: "Culinary & Bar Operations",
    description:
      "Master menu coordination, live food counter pacing, signature beverage & bar setup, strict hygiene and food temperature monitoring, and guest dining satisfaction.",
    highlights: ["Catering Flow Oversight", "Beverage Bar Management", "Guest Dining Excellence"],
  },
  {
    num: "07",
    title: "Artist Management",
    icon: Music,
    tagline: "Performers & Celebrity Talents",
    description:
      "Booking and coordinating celebrity singers, Sufi/Bollywood live bands, DJs, emcees, folk dancers, and choreographers. Full rider fulfillment, green rooms, and sound checks.",
    highlights: ["Live Bands & Celebrity Acts", "Technical Riders & Sound Checks", "Green Room Hospitality"],
  },
  {
    num: "08",
    title: "Show Runner & Cueing",
    icon: Radio,
    tagline: "Master Timeline Direction",
    description:
      "A dedicated ground director managing the master minute-by-minute cue sheet. Real-time intercom synchrony across audio, lighting, catering, and entry fireworks.",
    highlights: ["Minute-by-Minute Master Run Sheet", "Intercom Ground Synchrony", "Instant Trouble-Shooting"],
  },
  {
    num: "09",
    title: "Event Stationery",
    icon: FileText,
    tagline: "Custom Brand & Paper Suite",
    description:
      "Bespoke wedding collateral matching your theme: personalized itinerary cards, luggage tags, room key jackets, menu cards, and luxury welcome signage.",
    highlights: ["Custom Luggage Tags", "Room Key Jackets & Itineraries", "Thematic Welcome Signage"],
  },
  {
    num: "10",
    title: "Welcome Hostesses",
    icon: Crown,
    tagline: "Royal Greeting Entourage",
    description:
      "Professional hostesses in traditional Indian attire welcoming guests with royal aarti, rose petal showers, fragrance mists, and personalized venue ushering.",
    highlights: ["Traditional Attire Hostesses", "Royal Aarti & Petal Showers", "VIP Guest Ushering"],
  },
];

export default function ManagementVerticalsSection() {
  return (
    <section className="section-pad relative bg-accent/25 overflow-hidden border-b border-border/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="360° Comprehensive Coordination"
          title="Our 10 Core Management Verticals"
          subtitle="From royal guest hospitality and ritual timing to dedicated bridal shadows and master show running, here is how we make every wedding effortless."
        />

        <div className="reveal is-visible mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map((vert) => {
            const Icon = vert.icon;
            return (
              <div
                key={vert.num}
                className="glass-card rounded-3xl p-7 border border-secondary/25 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-luxe hover:border-secondary/60 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-gold text-ink shadow-md group-hover:scale-105 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[0.65rem] uppercase tracking-wider text-secondary font-bold block">
                          Vertical #{vert.num}
                        </span>
                        <h3 className="font-display text-lg sm:text-xl text-ink font-bold group-hover:text-primary transition-colors">
                          {vert.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <span className="text-[0.72rem] uppercase tracking-wider text-primary font-bold block mt-4">
                    {vert.tagline}
                  </span>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {vert.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 space-y-1.5">
                  {vert.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-foreground/85">
                      <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                      <span className="text-[0.72rem]">{h}</span>
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
