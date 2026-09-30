"use client";

import { Sparkles, Building2 } from "lucide-react";

const DEFAULT_PARTNERS = [
  "Taj Hotels",
  "The Westin",
  "JW Marriott",
  "Novotel",
  "Hyatt Regency",
  "Della Resorts",
  "Radisson Blu",
  "Le Méridien",
  "The Ritz-Carlton",
  "Conrad Pune",
];

export default function PartnerMarqueeSection() {
  const partners = DEFAULT_PARTNERS;

  // Double the array for seamless endless marquee
  const marqueeList = [...partners, ...partners];

  return (
    <div className="border-y border-border/60 bg-card/40 py-10 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-5 text-center mb-6">
        <span className="text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground font-medium">
          Trusted by Premier Hospitality Brands &amp; Venues Across India
        </span>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap">
          {marqueeList.map((name, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 text-muted-foreground/80 transition-colors duration-300 hover:text-primary"
            >
              <Building2 className="h-4 w-4 text-secondary/70" />
              <span className="font-display text-base sm:text-lg tracking-wider">
                {name}
              </span>
              <span className="text-secondary/40 text-xs">âœ¦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

