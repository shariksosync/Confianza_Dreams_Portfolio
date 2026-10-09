"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Eye, X, ChevronRight } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

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

export default function ServicesSection() {
  const { typeOfServices, typeOfEvents } = useSite();
  const [activeTab, setActiveTab] = useState("services");
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const servicesList =
    Array.isArray(typeOfServices) && typeOfServices.length > 0
      ? typeOfServices
      : defaultTypeOfServices;

  const eventsList =
    Array.isArray(typeOfEvents) && typeOfEvents.length > 0
      ? typeOfEvents
      : defaultTypeOfEvents;

  const currentItems = activeTab === "services" ? servicesList : eventsList;

  return (
    <section id="services" className="section-pad relative bg-accent/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Our Services &amp; Events"
          title="Complete Planning for Every Celebration"
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

        {/* Cards Grid: Uniform Line Clamp and Single Description Field */}
        <div className="mt-10 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300">
          {currentItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="group glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-luxe flex flex-col justify-between"
            >
              <div>
                {/* Top Bar: Eye Action */}
                <div className="flex items-center justify-end mb-3.5">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedDetailItem({
                        ...item,
                        itemType: activeTab === "services" ? "Service" : "Event",
                      })
                    }
                    className="p-1.5 rounded-full bg-accent/60 hover:bg-secondary/20 text-muted-foreground hover:text-secondary transition-colors cursor-pointer border border-border/60 hover:border-secondary/40"
                    title="View Details"
                    aria-label={`View full details for ${item.title}`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Heading */}
                <h3 className="font-display text-lg sm:text-xl text-ink group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Description with Uniform Line Clamp & Height */}
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3 min-h-[3.6rem]">
                  {item.description}
                </p>
              </div>

              {/* Bottom Inquire Action */}
              <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-end">
                <Link
                  href={`/contact?service=${encodeURIComponent(item.title)}`}
                  className="inline-flex items-center gap-1 text-[0.7rem] sm:text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors"
                >
                  <span>Inquire</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Teaser for Type of Events when Type of Services is Default Active */}
        {activeTab === "services" && (
          <div className="mt-14 sm:mt-18 pt-10 sm:pt-14 border-t border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <span className="text-[0.65rem] uppercase tracking-[0.25em] text-secondary font-bold block mb-1">
                  CELEBRATIONS &amp; OCCASIONS
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-ink font-normal">
                  Type of Events We Plan & Manage
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("events");
                  const sec = document.getElementById("services");
                  if (sec) sec.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-luxe gradient-gold text-ink text-xs font-bold py-2 px-5 self-start sm:self-auto cursor-pointer"
              >
                <span>View All Events ({eventsList.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventsList.map((event, eIdx) => (
                <div
                  key={event.id || eIdx}
                  className="group glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-luxe flex flex-col justify-between"
                >
                  <div>
                    {/* Top Bar: Eye Action */}
                    <div className="flex items-center justify-end mb-3.5">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDetailItem({
                            ...event,
                            itemType: "Event",
                          })
                        }
                        className="p-1.5 rounded-full bg-accent/60 hover:bg-secondary/20 text-muted-foreground hover:text-secondary transition-colors cursor-pointer border border-border/60 hover:border-secondary/40"
                        title="View Details"
                        aria-label={`View full details for ${event.title}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Heading */}
                    <h3 className="font-display text-lg sm:text-xl text-ink group-hover:text-primary transition-colors leading-snug">
                      {event.title}
                    </h3>

                    {/* Description with Uniform Line Clamp & Height */}
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3 min-h-[3.6rem]">
                      {event.description}
                    </p>
                  </div>

                  {/* Bottom Inquire Action */}
                  <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-end">
                    <Link
                      href={`/contact?service=${encodeURIComponent(event.title)}`}
                      className="inline-flex items-center gap-1 text-[0.7rem] sm:text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Popup Modal with Full Description */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="modal-dialog-luxury bg-card max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 border border-border shadow-luxe relative">
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
                aria-label="Close details modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-64 sm:max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
                <p className="text-xs sm:text-sm font-normal text-foreground/90 leading-relaxed whitespace-pre-line">
                  {selectedDetailItem.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedDetailItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-ink hover:bg-muted transition cursor-pointer"
              >
                Close
              </button>

              <Link
                href={`/contact?service=${encodeURIComponent(selectedDetailItem.title)}`}
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <span>Inquire About This {selectedDetailItem.itemType || "Service"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
