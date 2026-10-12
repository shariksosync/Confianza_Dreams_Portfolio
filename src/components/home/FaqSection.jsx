"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageCircle, Phone } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function FaqSection() {
  const { faq, contact } = useSite();
  const [openId, setOpenId] = useState(1);

  const items = faq || [];

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="faq" className="py-10 sm:py-16 lg:py-24 relative bg-accent/30 overflow-hidden">
      <div className="mx-auto max-w-5xl px-3.5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Everything You Need to Know"
          subtitle="Clear answers to common questions about booking timelines, destination weddings, budgets, vendors, and backup plans."
        />

        {/* Accordion List */}
        {items.length === 0 ? (
          <div className="reveal mt-8 sm:mt-12 glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center text-muted-foreground border border-border">
            <HelpCircle className="h-9 w-9 sm:h-10 sm:w-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-display text-base sm:text-lg text-ink font-semibold">No FAQs Available</h3>
            <p className="text-xs text-muted-foreground mt-1">Frequently asked questions will appear here once added in the admin panel.</p>
          </div>
        ) : (
          <div className="reveal mt-8 sm:mt-12 space-y-3 sm:space-y-4">
            {items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="glass-card rounded-xl sm:rounded-2xl border border-border overflow-hidden transition-all duration-300 shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-3.5 sm:p-5 sm:p-6 text-left transition hover:text-primary cursor-pointer gap-2"
                  >
                    <span className="font-display text-sm sm:text-base md:text-lg text-ink pr-2 font-medium leading-snug">
                      {item.question}
                    </span>
                    <div
                      className={`grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full border border-border text-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-primary text-primary-foreground border-primary" : ""
                      }`}
                    >
                      <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="animate-slide-up px-3.5 sm:px-6 pb-4 sm:pb-6 pt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/40">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still have questions prompt */}
        <div className="reveal mt-8 sm:mt-12 glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 sm:p-8 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-soft">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h4 className="font-display text-base sm:text-xl text-ink font-bold">
              Have a specific question about your wedding?
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Talk directly with Ashish and our wedding team.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`https://wa.me/${contact?.whatsapp || "917057357240"}`}
              target="_blank"
              rel="noreferrer"
              className="btn-luxe gradient-gold text-ink text-xs font-semibold py-2.5 px-4 flex items-center justify-center gap-1.5 w-full sm:w-auto text-center"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={`tel:${contact?.phone ? (contact.phone.startsWith("+") ? contact.phone : `+91${contact.phone}`) : "+917057357240"}`}
              className="btn-luxe gradient-royal text-primary-foreground text-xs font-semibold py-2.5 px-4 flex items-center justify-center gap-1.5 w-full sm:w-auto text-center cursor-pointer"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>Direct Call</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
