"use client";

import { 
  HeartHandshake, 
  UserCheck, 
  Flame, 
  Layers, 
  Hotel, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkle,
  Crown,
  Quote
} from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const DIFFERENTIATORS = [
  {
    num: "01",
    icon: HeartHandshake,
    title: "Treating Your Event Like Our Own",
    badge: "Personal Care",
    tagline: "Your Wedding, Our Personal Commitment",
    description:
      "For us, your wedding is just like our own family celebration. We take complete personal care—standing beside you with warm hospitality, senior founder presence, and peace of mind.",
    points: [
      "Senior founders present on-ground during all ceremonies",
      "Special care and attention for family elders and guests",
      "Calm, helpful problem-solving so you stay relaxed",
    ],
    gradient: "from-amber-500/20 via-primary/10 to-transparent",
    iconBg: "gradient-gold text-ink",
    borderGlow: "group-hover:border-secondary/50",
  },
  {
    num: "02",
    icon: UserCheck,
    title: "Personal Helpers for Bride & Groom",
    badge: "1-on-1 Support",
    tagline: "Helpful Care Behind The Scenes",
    description:
      "We assign dedicated personal helpers to the bride, groom, and close family members—taking care of every small detail so you can enjoy your special day happily.",
    points: [
      "Coordinating dress changes, schedule, and timings",
      "Helping with water, snacks, wardrobe, and touch-ups",
      "Connecting smoothly with photographers and guests",
    ],
    gradient: "from-rose-500/15 via-primary/10 to-transparent",
    iconBg: "gradient-royal text-white",
    borderGlow: "group-hover:border-primary/50",
  },
  {
    num: "03",
    icon: Flame,
    title: "Smooth Pooja & Ritual Coordination",
    badge: "Traditional Rituals",
    tagline: "Honoring Traditions with Care",
    description:
      "From Vedic havan poojas to Maharashtrian, Marwari, South Indian, and modern fusion ceremonies, our team makes sure all rituals happen smoothly and on the right auspicious timings.",
    points: [
      "Direct coordination with priests and pandits",
      "Complete arrangement of all pooja items, havan kund, and samagri",
      "Guiding family members step-by-step without any rush",
    ],
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    iconBg: "bg-gradient-to-br from-amber-600 to-yellow-500 text-white",
    borderGlow: "group-hover:border-amber-500/50",
  },
  {
    num: "04",
    icon: Layers,
    title: "Custom 3D Decor Designs (No Generic Catalogues)",
    badge: "Custom 3D Designs",
    tagline: "See 3D Previews Before Setup Starts",
    description:
      "We believe every wedding should look unique. We never force standard catalogue designs. Our team creates realistic 3D designs so you can see exactly how your venue will look before setup starts.",
    points: [
      "Custom 3D mandap, stage, and entrance previews",
      "Careful checks for lighting, sound, and stage safety",
      "Custom colors, fabrics, and fresh flower combinations",
    ],
    gradient: "from-blue-500/15 via-indigo-500/10 to-transparent",
    iconBg: "bg-gradient-to-br from-blue-600 to-indigo-700 text-white",
    borderGlow: "group-hover:border-blue-400/50",
  },
  {
    num: "05",
    icon: Hotel,
    title: "Guest Hospitality & Welcome Desk",
    badge: "Warm Hospitality",
    tagline: "Making Guests Feel Welcome",
    description:
      "Our hospitality team takes care of your guests from the moment they arrive. We coordinate easy hotel check-ins, welcome gifts, and helpful information cards.",
    points: [
      "Personalized event schedules, luggage tags, and welcome kits",
      "Helpful welcome desk, gift delivery, and room check-in help",
      "Smooth airport and railway station pickup coordination",
    ],
    gradient: "from-emerald-500/15 via-teal-500/10 to-transparent",
    iconBg: "bg-gradient-to-br from-emerald-600 to-teal-700 text-white",
    borderGlow: "group-hover:border-emerald-400/50",
  },
  {
    num: "06",
    icon: Clock,
    title: "Smooth Event Flow & Food Supervision",
    badge: "On-Time Coordination",
    tagline: "Timely Flow & Tasty Food",
    description:
      "Our on-ground team keeps everything running on time—managing sound, lighting, music, and food service so your celebration flows smoothly.",
    points: [
      "Clear cues for bride & groom entries and entertainment",
      "Food & beverage quality check and fast service supervision",
      "Quick on-ground support with zero delay",
    ],
    gradient: "from-purple-500/15 via-secondary/10 to-transparent",
    iconBg: "bg-gradient-to-br from-purple-700 to-pink-600 text-white",
    borderGlow: "group-hover:border-purple-400/50",
  },
];

export default function WhyConfianzaSection() {
  return (
    <section className="section-pad relative bg-gradient-to-b from-background via-card/30 to-background overflow-hidden border-b border-border/60">
      {/* Decorative ambient gold glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-secondary/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Why Confianza Events & Entertainment"
          subtitle="We combine creative design with reliable planning. Here is why families trust us to plan their special wedding celebrations."
        />

        {/* Featured Philosophy Quote Card */}
        <div className="reveal mt-8 sm:mt-12 rounded-2xl sm:rounded-3xl border border-secondary/30 bg-gradient-to-r from-card via-card/90 to-card p-5 sm:p-7 lg:p-8 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-secondary/10 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative z-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl gradient-gold text-ink shadow-md">
                <Crown className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.25em] text-secondary font-bold block">
                  Our Core Promise
                </span>
                <h3 className="font-display text-base sm:text-xl lg:text-2xl text-ink font-semibold mt-0.5">
                  "For us, your event is just like our own."
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-xl italic md:border-l md:border-border/60 md:pl-6">
              "We believe that every couple has a unique love story. That is why we create personalized weddings with honest pricing, high quality, and warm hospitality."
            </p>
          </div>
        </div>

        {/* 6 Differentiators Grid */}
        <div className="reveal mt-8 sm:mt-12 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIATORS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className={`group glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-border/80 relative flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe ${item.borderGlow} overflow-hidden`}
              >
                {/* Subtle top card gradient highlight */}
                <div
                  className={`absolute top-0 left-0 right-0 h-28 bg-gradient-to-b ${item.gradient} pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Card Header: Icon & Number */}
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div
                      className={`grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-xl sm:rounded-2xl ${item.iconBg} shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-wider font-semibold text-secondary px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
                        {item.badge}
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-muted-foreground/50 ml-1">
                        {item.num}
                      </span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <span className="text-[0.62rem] sm:text-[0.66rem] uppercase tracking-wider text-primary font-bold block mb-1">
                    {item.tagline}
                  </span>
                  <h4 className="font-display text-base sm:text-lg lg:text-xl text-ink font-bold group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="mt-2.5 sm:mt-3 text-xs sm:text-[0.82rem] text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {/* Proof points */}
                  <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-border/50 space-y-2">
                    <span className="text-[0.6rem] sm:text-[0.64rem] uppercase tracking-wider text-muted-foreground/80 font-bold block">
                      What This Means For You:
                    </span>
                    {item.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-foreground/85">
                        <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                        <span className="text-[0.68rem] sm:text-[0.74rem] leading-snug">
                          {pt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="relative z-10 mt-5 sm:mt-6 pt-3 border-t border-border/40 flex items-center justify-between text-[0.62rem] sm:text-[0.68rem] text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1 text-primary">
                    <Sparkles className="h-3 w-3 text-secondary" />
                    <span>Confianza Quality</span>
                  </span>
                  <span className="font-mono text-[0.65rem] opacity-60">Verified Service</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
