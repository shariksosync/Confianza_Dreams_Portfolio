"use client";

import Link from "next/link";
import { Heart, Compass, ArrowRight } from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import TeamSection from "@/components/home/TeamSection";
import PartnerMarqueeSection from "@/components/home/PartnerMarqueeSection";
import { useSite } from "@/context/SiteContext";

export default function AboutPage() {
  const { about, contact } = useSite() as any;

  return (
    <SiteLayout revealKey="about-page">
      {/* Hero Banner */}
      <section className="relative bg-ink pt-32 pb-20 sm:pt-40 sm:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/images/hero-1.jpg"
            alt="Confianza wedding heritage"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 text-center">
          <span className="text-[0.68rem] uppercase tracking-[0.34em] text-secondary font-medium">
            Since 2018 • Warje, Pune
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl text-background font-normal">
            Where Weddings Become Stories
          </h1>
          <div className="rule-gold mx-auto my-5" />
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-background/80 font-light leading-relaxed">
            Founded with a belief that no two love stories are identical, Confianza crafts bespoke, royal, and effortlessly managed wedding celebrations across India.
          </p>
        </div>
      </section>

      {/* Founder Letter & Brand Story */}
      <section className="section-pad relative bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="reveal lg:col-span-5 relative">
              <div className="overflow-hidden rounded-3xl border border-primary/20 shadow-luxe">
                <img
                  src="/images/couple.jpg"
                  alt="Ashish Wankhede, Founder of Confianza"
                  className="w-full object-cover h-[460px]"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 glass-card rounded-2xl p-5 border border-secondary/30 shadow-luxe max-w-xs">
                <span className="text-[0.65rem] uppercase tracking-widest text-secondary font-bold">
                  Founder &amp; Creative Lead
                </span>
                <h4 className="font-display text-base text-ink font-semibold mt-0.5">
                  {contact?.owner || "Ashish Wankhede"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  "We don't just decorate halls; we architect emotional memories that outlast generations."
                </p>
              </div>
            </div>

            <div className="reveal lg:col-span-7 space-y-6">
              <span className="text-[0.68rem] uppercase tracking-[0.3em] text-primary font-semibold">
                Our Genesis &amp; Evolution
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
                {about?.heading || "A Pune Studio Devoted to Weddings That Feel Personal"}
              </h2>
              <div className="rule-gold" />
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground font-light">
                {about?.story}
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground font-light">
                Over the last seven years, what began as a dedicated local decor workshop near Warje Jakat Naka in Pune has expanded into an acclaimed full-scale wedding planning house. We orchestrate royal palace weddings in Udaipur and Jaipur, beachfront celebrations in Goa and Alibaug, and grand indoor ballroom galas across Maharashtra.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="glass-card rounded-2xl p-5 border border-primary/15">
                  <Heart className="h-5 w-5 text-primary mb-2" />
                  <h4 className="font-display text-base text-ink">Our Mission</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {about?.mission}
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5 border border-secondary/20">
                  <Compass className="h-5 w-5 text-secondary mb-2" />
                  <h4 className="font-display text-base text-ink">Our Vision</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {about?.vision}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Year-by-Year Heritage Timeline */}
      <section className="section-pad relative bg-accent/30 overflow-hidden">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Milestones of Growth"
            title="The Confianza Timeline"
            subtitle="How we grew from a boutique two-person decor collective to delivering 500+ landmark celebrations."
          />

          <div className="reveal mt-16 relative border-l-2 border-primary/20 ml-4 sm:ml-32 space-y-10">
            {(about?.timeline || []).map((item: any, idx: number) => (
              <div key={item.year || idx} className="relative pl-6 sm:pl-10 group">
                {/* Year Marker Badge */}
                <div className="absolute -left-[17px] top-1 grid h-8 w-8 place-items-center rounded-full gradient-royal text-primary-foreground text-xs font-bold shadow-md ring-4 ring-background">
                  ✦
                </div>
                <div className="sm:absolute sm:-left-32 sm:top-1 sm:text-right sm:w-24">
                  <span className="font-display text-2xl font-bold text-gold-gradient">
                    {item.year}
                  </span>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-border transition-all duration-300 group-hover:border-primary/40 group-hover:-translate-y-0.5">
                  <p className="text-sm text-foreground/90 font-medium">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Showcase */}
      <TeamSection />

      {/* Partner Marquee */}
      <PartnerMarqueeSection />

      {/* Bottom Consultation Banner */}
      <section className="relative bg-ink py-20 text-background overflow-hidden text-center">
        <div className="relative z-10 mx-auto max-w-3xl px-5">
          <span className="text-[0.68rem] uppercase tracking-[0.3em] text-secondary font-medium">
            Begin With A Conversation
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl text-background">
            Let's Plan Your Wedding Story Together
          </h2>
          <div className="rule-gold mx-auto my-4" />
          <p className="text-sm text-background/80 font-light leading-relaxed mb-8">
            Schedule an in-person meeting at our Pune studio or connect with us over a call to review your dates and preliminary mood boards.
          </p>
          <Link
            href="/contact"
            className="btn-luxe gradient-gold text-ink font-semibold shadow-luxe"
          >
            <span>Book Consultation With Ashish</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
