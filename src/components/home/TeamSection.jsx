"use client";

import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function TeamSection() {
  const { team } = useSite();

  const members = team?.length
    ? team
    : [
        { id: 1, name: "Ashish Wankhede", role: "Founder", image: "/images/couple.jpg", bio: "Seven years of building weddings that feel personal, not produced." },
        { id: 2, name: "Rutuja Deshmukh", role: "Creative Director", image: "/images/floral.jpg", bio: "Leads concept, colour and every mood board that leaves our studio." },
        { id: 3, name: "Sagar Patil", role: "Event Manager", image: "/images/corporate.jpg", bio: "Runs the ground crew and the minute-by-minute run sheet." },
        { id: 4, name: "Decor Team", role: "Decor & Production", image: "/images/stage.jpg", bio: "Florists, carpenters and light technicians who build through the night." },
        { id: 5, name: "Neha Kulkarni", role: "Wedding Planner", image: "/images/mehendi.jpg", bio: "Your single point of contact from consultation to farewell brunch." },
        { id: 6, name: "Omkar Jadhav", role: "Coordinator", image: "/images/outdoor.jpg", bio: "Keeps guests, vendors and timelines moving in the same direction." },
      ];

  return (
    <section className="section-pad relative bg-accent/30 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="The Minds Behind The Magic"
          title="Meet Our Visionaries &amp; Coordinators"
          subtitle="A passionate ensemble of artists, logistics masters, and ground directors dedicated to making your big day effortless."
        />

        <div className="reveal mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((person, idx) => (
            <div
              key={person.id || idx}
              className="group glass-card rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe border border-border/70 flex flex-col"
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                  src={person.image || "/images/couple.jpg"}
                  alt={person.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full gradient-gold px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink shadow-md">
                  <Sparkles className="h-3 w-3" />
                  {person.role}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl text-ink group-hover:text-primary transition-colors">
                    {person.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {person.bio}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-[0.7rem] text-primary font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
                    <span>Confianza Core</span>
                  </span>
                  <span className="text-muted-foreground/60 font-mono">
                    #{idx + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

