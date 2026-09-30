"use client";

import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function PackagesSection() {
  const { packages, loading, ready } = useSite();

  const packageList = packages || [];

  return (
    <section className="section-pad relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Transparent Investment"
          title="Tailored Wedding Planning Packages"
          subtitle="Whether you envision an intimate family ceremony or a multi-day royal palace affair, our tiers are designed for clarity and absolute excellence."
        />

        {loading && !ready ? (
          <div className="mt-16 grid gap-8 lg:grid-cols-3 items-stretch">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-3xl p-8 border border-border/80 space-y-4">
                <div className="h-4 w-1/4 skeleton rounded" />
                <div className="h-8 w-3/4 skeleton rounded" />
                <div className="h-6 w-1/2 skeleton rounded" />
                <div className="h-px w-full bg-border my-4" />
                <div className="space-y-2">
                  <div className="h-4 w-full skeleton rounded" />
                  <div className="h-4 w-5/6 skeleton rounded" />
                  <div className="h-4 w-2/3 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : packageList.length === 0 ? (
          <div className="reveal is-visible mt-16 glass-card rounded-3xl p-12 text-center text-muted-foreground border border-border max-w-2xl mx-auto">
            <Sparkles className="h-10 w-10 mx-auto text-secondary/50 mb-3" />
            <h3 className="font-display text-xl text-ink font-semibold">0 Packages Available</h3>
            <p className="text-xs text-muted-foreground mt-1.5">
              No wedding packages are currently listed. Configure wedding planning packages in the Admin Panel to display them here.
            </p>
          </div>
        ) : (
          <div className="reveal is-visible mt-16 grid gap-8 lg:grid-cols-3 items-stretch">
          {packageList.map((pkg, idx) => (
            <div
              key={pkg.id || idx}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 ${
                pkg.featured
                  ? "gradient-royal text-primary-foreground shadow-luxe ring-2 ring-secondary/70 scale-105 z-10"
                  : "glass-card text-foreground border border-border/80 shadow-soft"
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full gradient-gold px-4 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink shadow-md">
                  <Sparkles className="h-3 w-3" />
                  <span>Most Chosen Experience</span>
                </div>
              )}

              <div>
                <span
                  className={`text-[0.68rem] font-semibold uppercase tracking-[0.25em] ${
                    pkg.featured ? "text-champagne" : "text-primary"
                  }`}
                >
                  {pkg.tag}
                </span>

                <h3
                  className={`mt-2 font-display text-2xl sm:text-3xl ${
                    pkg.featured ? "text-background" : "text-ink"
                  }`}
                >
                  {pkg.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className={`font-display text-3xl sm:text-4xl font-bold ${
                      pkg.featured ? "text-secondary" : "text-primary"
                    }`}
                  >
                    {pkg.price}
                  </span>
                  <span
                    className={`text-xs ${
                      pkg.featured ? "text-background/70" : "text-muted-foreground"
                    }`}
                  >
                    / starting package
                  </span>
                </div>

                <div
                  className={`my-6 h-px w-full ${
                    pkg.featured ? "bg-white/20" : "bg-border"
                  }`}
                />

                <ul className="space-y-3.5 text-xs sm:text-sm">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <div
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full mt-0.5 ${
                          pkg.featured
                            ? "bg-secondary text-ink"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span
                        className={
                          pkg.featured ? "text-background/90" : "text-muted-foreground"
                        }
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href="/contact"
                  className={`btn-luxe w-full text-xs font-semibold ${
                    pkg.featured
                      ? "gradient-gold text-ink shadow-luxe"
                      : "gradient-royal text-primary-foreground shadow-sm"
                  }`}
                >
                  <span>Select {pkg.name} Tier</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}

