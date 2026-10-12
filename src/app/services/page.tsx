"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Phone,
  Feather,
  Eye,
  X,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import ProcessSection from "@/components/home/ProcessSection";
import { useSite } from "@/context/SiteContext";

const defaultTypeOfServices = [
  {
    id: "tos-1",
    title: "Event Management",
    description:
      "Our complete event management ensures every part of your celebration runs smoothly. We manage on-ground setup, stage schedules, sound systems, guest hospitality, vendor coordination, and team management so your family can enjoy every moment stress-free.",
    order: 1,
  },
  {
    id: "tos-2",
    title: "Event Planning",
    description:
      "Good planning is the foundation of a memorable wedding. We create detailed event schedules, manage budgets, negotiate with vendors, and design creative themes to make your celebration special from start to finish.",
    order: 2,
  },
  {
    id: "tos-3",
    title: "Decor",
    description:
      "We transform event spaces into beautiful environments. From realistic 3D designs to on-ground setup, our team creates custom mandaps, entry gates, table centerpieces, mood lighting, and grand stage backdrops.",
    order: 3,
  },
  {
    id: "tos-4",
    title: "Venue",
    description:
      "Finding the right venue sets the perfect mood for your celebration. We help you explore and book top heritage palaces, beachside resorts, private lawns, and luxury banquet halls at the best rates.",
    order: 4,
  },
  {
    id: "tos-5",
    title: "Photograph/Videography",
    description:
      "Capture your most precious wedding memories with beautiful photos and videos. Our team records candid emotions, traditional ceremonies, drone views, and highlight reels for your family to cherish forever.",
    order: 5,
  },
  {
    id: "tos-6",
    title: "Catering",
    description:
      "Delight your guests with delicious food and drinks. We organize customized menus featuring traditional regional dishes, live food counters, fresh beverage bars, and warm hospitality.",
    order: 6,
  },
  {
    id: "tos-7",
    title: "Outfits",
    description:
      "Look your best for every function. Our styling team helps you with wedding dress selection, matching colors across ceremonies, jewelry pairing, and on-day outfit assistance.",
    order: 7,
  },
];

const defaultTypeOfEvents = [
  {
    id: "toe-1",
    title: "Wedding",
    description:
      "From traditional wedding pheras under beautiful mandaps to grand multi-day destination weddings, we manage every ceremony and tradition smoothly with care.",
    order: 1,
  },
  {
    id: "toe-2",
    title: "Social",
    description:
      "Celebrate life's meaningful milestones with style and warmth. We design memorable family events with themed decor, great food, lively entertainment, and smooth hosting.",
    order: 2,
  },
  {
    id: "toe-3",
    title: "Sports",
    description:
      "Energetic sports events delivered with precision. We manage ground branding, audio and scoreboards, prize distributions, and guest management.",
    order: 3,
  },
  {
    id: "toe-4",
    title: "Concert",
    description:
      "Exciting live shows with high-quality sound, concert lighting, stage setups, artist management, and smooth crowd entry.",
    order: 4,
  },
  {
    id: "toe-5",
    title: "Corporate",
    description:
      "Professional event management for your business. We deliver modern audio-visual setups, stage designs, executive hospitality, and corporate award functions.",
    order: 5,
  },
  {
    id: "toe-6",
    title: "Social Gathering",
    description:
      "Bring friends and families together in welcoming settings. We arrange delicious food, warm lighting, fun games, and photo booths for get-togethers of all sizes.",
    order: 6,
  },
];

const defaultServicesHeader = {
  badge: "Complete Wedding Planning & Decor",
  eyebrow: "COMPLETE WEDDING PLANNING & DECOR",
  title: "Our Wedding Services",
  subtitle:
    "From first design ideas to smooth execution on your big day, every service is delivered with care and quality.",
  image: "/images/hero-1.jpg",
};

export default function ServicesPage() {
  const {
    servicesHeader,
    typeOfServices,
    typeOfEvents,
    stationery,
    servicesCta,
    contact,
    loading,
    ready,
  } = useSite() as any;

  const [activeTab, setActiveTab] = useState<"services" | "events">("services");
  const [selectedDetailItem, setSelectedDetailItem] = useState<any>(null);

  const header = servicesHeader || defaultServicesHeader;

  const servicesList =
    Array.isArray(typeOfServices) && typeOfServices.length > 0
      ? typeOfServices
      : defaultTypeOfServices;

  const eventsList =
    Array.isArray(typeOfEvents) && typeOfEvents.length > 0
      ? typeOfEvents
      : defaultTypeOfEvents;

  const stationeryList = stationery || [];
  const cta = servicesCta || {
    eyebrow: "LET'S PLAN YOUR SPECIAL DAY",
    headline: "Ready to Plan Your Wedding?",
    subtitle:
      "Book a free 60–90 minute consultation with Ashish Wankhede in Warje, Pune, or via video call.",
    buttonText: "Book Free Consultation",
    buttonLink: "/contact",
    notice: "Free Consultation • No Commitment Required",
    perks: [
      "60–90 Min Planning Session",
      "In-Person (Pune) or Video Call",
      "Clear Budget Planning",
      "3D Decor Design Previews",
    ],
  };

  const currentItems = activeTab === "services" ? servicesList : eventsList;

  return (
    <SiteLayout revealKey="services-page">
      {/* 1. Dynamic Hero Banner from Admin Panel */}
      <section className="relative bg-ink pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={header.image || "/images/hero-1.jpg"}
            alt={header.title || "Confianza Services"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 text-center">
          <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-[0.25em] sm:tracking-[0.34em] text-secondary font-semibold">
            {header.badge || header.eyebrow || "Complete Wedding Planning & Decor"}
          </span>
          <h1 className="mt-2.5 sm:mt-3 font-display text-3xl sm:text-5xl lg:text-6xl text-background font-normal leading-tight">
            {header.title || "Our Wedding Services"}
          </h1>
          <div className="rule-gold mx-auto my-4 sm:my-5" />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm lg:text-base text-background/80 font-light leading-relaxed px-2">
            {header.subtitle ||
              "From first design ideas to smooth execution on your big day, every service is delivered with care and quality."}
          </p>
        </div>
      </section>

      {/* 2. Type of Services & Type of Events Section */}
      <section className="section-pad relative bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="What We Offer"
            title="Everything You Need for Your Wedding"
            subtitle="Explore our complete range of wedding planning services, custom decor, destination management, and rituals."
          />

          {/* 2 Dual Switcher Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xs ${
                activeTab === "services"
                  ? "gradient-royal text-primary-foreground shadow-luxe scale-105"
                  : "glass-card text-foreground/80 hover:text-primary hover:border-primary/40"
              }`}
            >
              Type of Services ({servicesList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("events")}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xs ${
                activeTab === "events"
                  ? "gradient-royal text-primary-foreground shadow-luxe scale-105"
                  : "glass-card text-foreground/80 hover:text-primary hover:border-primary/40"
              }`}
            >
              Type of Events ({eventsList.length})
            </button>
          </div>

          {/* Active Tab Cards Grid (No Images, Uniform Height with Line Clamp) */}
          <div className="mt-10 sm:mt-14 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
            {currentItems.map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className="group glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-luxe flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Eye View Details Button */}
                  <div className="flex items-center justify-end mb-4">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDetailItem({
                          ...item,
                          itemType: activeTab === "services" ? "Service" : "Event",
                        })
                      }
                      className="p-2 sm:p-2.5 rounded-full bg-accent/60 hover:bg-secondary/20 text-muted-foreground hover:text-secondary transition-colors cursor-pointer border border-border/60 hover:border-secondary/40"
                      title="View Details"
                      aria-label={`View full details for ${item.title}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Card Heading */}
                  <h3 className="font-display text-xl sm:text-2xl text-ink group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Single Description Field with Automatic Card Height Limit */}
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3 min-h-[3.8rem]">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-end">
                  <a
                    href={`tel:${contact?.phone ? (contact.phone.startsWith("+") ? contact.phone : `+91${contact.phone}`) : "+917057357240"}`}
                    className="inline-flex items-center gap-1.5 text-[0.72rem] sm:text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>Inquire</span>
                    <Phone className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Type of Events Teaser Section when Type of Services is Active by Default */}
          {activeTab === "services" && (
            <div className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-border/60">
              <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-[0.25em] sm:tracking-[0.32em] text-secondary font-bold block mb-2">
                  EXPLORE CELEBRATIONS
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-ink font-normal">
                  Type of Events We Plan & Manage
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  In addition to end-to-end services, we specialize in organizing distinct event types with full customized decor, entertainment, and logistics.
                </p>
              </div>

              <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {eventsList.map((event: any, eIdx: number) => (
                  <div
                    key={event.id || eIdx}
                    className="group glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-luxe flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar: Eye View Details Button */}
                      <div className="flex items-center justify-end mb-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedDetailItem({
                              ...event,
                              itemType: "Event",
                            })
                          }
                          className="p-2 sm:p-2.5 rounded-full bg-accent/60 hover:bg-secondary/20 text-muted-foreground hover:text-secondary transition-colors cursor-pointer border border-border/60 hover:border-secondary/40"
                          title="View Details"
                          aria-label={`View full details for ${event.title}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Card Heading */}
                      <h3 className="font-display text-xl sm:text-2xl text-ink group-hover:text-primary transition-colors leading-snug">
                        {event.title}
                      </h3>

                      {/* Single Description Field with Automatic Card Height Limit */}
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3 min-h-[3.8rem]">
                        {event.description}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-end">
                      <a
                        href={`tel:${contact?.phone ? (contact.phone.startsWith("+") ? contact.phone : `+91${contact.phone}`) : "+917057357240"}`}
                        className="inline-flex items-center gap-1.5 text-[0.72rem] sm:text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        <span>Inquire</span>
                        <Phone className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Event Stationery & Hospitality Suite */}
      {stationeryList.length > 0 && (
        <section className="section-pad relative bg-background border-t border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <SectionHeading
              eyebrow="Wedding Stationery &amp; Welcome Items"
              title="Invitation Cards, Luggage Tags &amp; Welcome Kits"
              subtitle="Personal details make weddings special. We design custom invitation cards, luggage tags, key jackets, and welcome hampers for your guests."
            />

            <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stationeryList.map((item: any, idx: number) => (
                <div
                  key={item.id || item._id || idx}
                  className="group glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-luxe flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 sm:h-44 w-full overflow-hidden bg-ink">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center gradient-royal text-primary-foreground">
                          <Feather className="h-8 w-8 text-secondary" />
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="mb-2.5">
                        <span className="inline-flex items-center gap-1 rounded-full gradient-gold px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-ink shadow-sm">
                          <span>{item.badge || "Stationery"}</span>
                        </span>
                      </div>

                      <h4 className="font-display text-base sm:text-lg font-semibold text-ink group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <span className="text-[0.65rem] sm:text-[0.68rem] text-primary font-medium block mt-0.5">
                          {item.subtitle}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. 5-Step Process */}
      <ProcessSection />

      {/* 5. Dynamic Consultation CTA Banner */}
      <section className="bg-ink py-14 sm:py-20 text-center text-background relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="/images/hero-1.jpg"
            alt="Confianza Wedding Consultation"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-secondary font-bold block mb-2">
            {cta.eyebrow || "WHERE WEDDINGS BECOME STORIES"}
          </span>

          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl text-background font-normal max-w-3xl mx-auto leading-tight">
            {cta.headline || "Ready to Begin Planning Your Wedding?"}
          </h2>

          <div className="rule-gold mx-auto my-4 sm:my-5" />

          <p className="text-xs sm:text-sm lg:text-base text-background/85 font-light mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            {cta.subtitle ||
              "Book a free 60–90 minute consultation with Ashish Wankhede in Warje, Pune, or via video call."}
          </p>

          {/* Consultation Perks Pills */}
          {Array.isArray(cta.perks) && cta.perks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 max-w-3xl mx-auto">
              {cta.perks.map((perk: string, pIdx: number) => (
                <span
                  key={pIdx}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[0.7rem] sm:text-xs text-champagne backdrop-blur-md border border-white/15"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                  <span>{perk}</span>
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <a
              href={`tel:${contact?.phone ? (contact.phone.startsWith("+") ? contact.phone : `+91${contact.phone}`) : "+917057357240"}`}
              className="btn-luxe gradient-gold text-ink font-bold shadow-luxe py-3 px-6 sm:px-8 text-xs tracking-wider uppercase w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>{cta.buttonText || "Book Your Free Consultation"}</span>
            </a>

            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="btn-luxe bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-secondary hover:text-secondary transition-all py-3 px-6 text-xs font-semibold flex items-center justify-center gap-2.5 backdrop-blur-md shadow-md group w-full sm:w-auto"
              >
                <Phone className="h-4 w-4 text-secondary group-hover:scale-110 transition-transform shrink-0" />
                <span className="tracking-wide">Call +91 {contact.phone}</span>
              </a>
            )}
          </div>

          {cta.notice && (
            <span className="text-[0.65rem] sm:text-[0.7rem] text-background/60 block mt-5 sm:mt-6 font-light">
              {cta.notice}
            </span>
          )}
        </div>
      </section>

      {/* 7. Detailed Popup Modal with Whole Description Text in Slider/Scrollable Container */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="modal-dialog-luxury bg-card max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 border border-border shadow-luxe relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="inline-block text-[0.65rem] font-bold uppercase tracking-widest text-secondary font-mono mb-1">
                  {selectedDetailItem.itemType || "Service"} Details
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-ink font-semibold leading-tight">
                  {selectedDetailItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailItem(null)}
                className="p-2 rounded-full bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer shrink-0"
                aria-label="Close details popup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body: Displays the whole text in a scrollable slider container */}
            <div className="space-y-3 max-h-64 sm:max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
                <p className="text-xs sm:text-sm font-normal text-foreground/90 leading-relaxed whitespace-pre-line">
                  {selectedDetailItem.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedDetailItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-ink hover:bg-muted transition cursor-pointer"
              >
                Close
              </button>

              <a
                href={`tel:${contact?.phone ? (contact.phone.startsWith("+") ? contact.phone : `+91${contact.phone}`) : "+917057357240"}`}
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call to Inquire About This {selectedDetailItem.itemType || "Service"}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
