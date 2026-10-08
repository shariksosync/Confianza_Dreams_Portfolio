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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Clear Pricing"
          title="Wedding Planning Packages"
          subtitle="Whether you are planning an intimate family wedding or a large celebration, our packages offer clear pricing and complete support."
        />

        {loading && !ready ? (
          <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 border border-border/80 space-y-4">
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
          <div className="reveal is-visible mt-10 sm:mt-16 glass-card rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-muted-foreground border border-border max-w-2xl mx-auto">
            <Sparkles className="h-10 w-10 mx-auto text-secondary/50 mb-3" />
            <h3 className="font-display text-xl text-ink font-semibold">0 Packages Available</h3>
            <p className="text-xs text-muted-foreground mt-1.5">
              No wedding packages are currently listed. Configure wedding planning packages in the Admin Panel to display them here.
            </p>
          </div>
        ) : (
          <div className="reveal is-visible mt-8 sm:mt-14 grid gap-5 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {packageList.map((pkg, idx) => (
            <div
              key={pkg.id || idx}
              className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 ${
                pkg.featured
                  ? "gradient-royal text-primary-foreground shadow-luxe ring-2 ring-secondary/70 scale-100 lg:scale-105 z-10 my-2 lg:my-0"
                  : "glass-card text-foreground border border-border/80 shadow-soft"
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full gradient-gold px-3 sm:px-4 py-0.5 sm:py-1 text-[0.62rem] sm:text-[0.68rem] font-bold uppercase tracking-wider text-ink shadow-md whitespace-nowrap">
                  <Sparkles className="h-3 w-3" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                <span
                  className={`text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.25em] block ${
                    pkg.featured ? "text-champagne" : "text-primary"
                  }`}
                >
                  {pkg.tag}
                </span>

                <h3
                  className={`mt-1.5 sm:mt-2 font-display text-lg sm:text-2xl lg:text-3xl leading-snug ${
                    pkg.featured ? "text-background" : "text-ink"
                  }`}
                >
                  {pkg.name}
                </h3>

                <div className="mt-2.5 sm:mt-4 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                  <span
                    className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold ${
                      pkg.featured ? "text-secondary" : "text-primary"
                    }`}
                  >
                    {pkg.price}
                  </span>
                  <span
                    className={`text-[0.68rem] sm:text-xs font-light ${
                      pkg.featured ? "text-background/70" : "text-muted-foreground"
                    }`}
                  >
                    / starting price
                  </span>
                </div>

                <div
                  className={`my-4 sm:my-6 h-px w-full ${
                    pkg.featured ? "bg-white/20" : "bg-border"
                  }`}
                />

                <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 sm:gap-3">
                      <div
                        className={`grid h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 place-items-center rounded-full mt-0.5 ${
                          pkg.featured
                            ? "bg-secondary text-ink"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span
                        className={`leading-snug break-words min-w-0 ${
                          pkg.featured ? "text-background/90" : "text-muted-foreground"
                        }`}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 sm:mt-8 pt-2 sm:pt-4">
                <Link
                  href={`/contact?package=${encodeURIComponent(pkg.name)}`}
                  className={`btn-luxe w-full text-[0.7rem] sm:text-xs font-semibold py-2.5 sm:py-3 px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-center whitespace-normal leading-snug tracking-wider uppercase ${
                    pkg.featured
                      ? "gradient-gold text-ink shadow-luxe"
                      : "gradient-royal text-primary-foreground shadow-sm"
                  }`}
                >
                  <span className="break-words">Select {pkg.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
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

