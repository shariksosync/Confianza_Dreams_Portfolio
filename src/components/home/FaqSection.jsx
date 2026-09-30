"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function FaqSection() {
  const { faq, contact } = useSite();
  const [openId, setOpenId] = useState(1);

  const items = faq?.length
    ? faq
    : [
        {
          id: 1,
          question: "How far in advance should we book Confianza?",
          answer:
            "Six to twelve months is ideal for a full wedding, and three months for a single function. We do take on shorter timelines when our calendar allows.",
        },
        {
          id: 2,
          question: "Do you handle destination weddings outside Maharashtra?",
          answer:
            "Yes. We regularly produce weddings in Udaipur, Jaipur, Goa, Alibaug and Kerala, and we handle guest travel, stays and local permissions.",
        },
        {
          id: 3,
          question: "Can we book only decor or only execution?",
          answer:
            "Absolutely. Our services are modular â€” planning, decor, execution and entertainment can be booked individually or together.",
        },
        {
          id: 4,
          question: "How is your pricing structured?",
          answer:
            "Planning is charged as a percentage of the event budget or a flat fee, while decor and production are quoted per design. You receive one transparent sheet with no hidden costs.",
        },
        {
          id: 5,
          question: "Do you work with our existing vendors?",
          answer:
            "Happily. We coordinate with family-preferred caterers, priests and photographers, and fill any gaps from our vetted network.",
        },
        {
          id: 6,
          question: "What happens if it rains?",
          answer:
            "Every outdoor plan we build ships with a covered contingency layout, standby crews and a weather call schedule 72 hours before the function.",
        },
      ];

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="faq" className="section-pad relative bg-accent/30 overflow-hidden">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Everything You Need to Know"
          subtitle="Clear answers to common questions about booking timelines, destination coordination, budgets, vendor partnerships, and rainy day contingency."
        />

        {/* Accordion List */}
        <div className="reveal mt-14 space-y-4">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl border border-border overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition hover:text-primary"
                >
                  <span className="font-display text-base sm:text-lg text-ink pr-4">
                    {item.question}
                  </span>
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-primary text-primary-foreground border-primary" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="animate-slide-up px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/40">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions prompt */}
        <div className="reveal mt-12 glass-card rounded-3xl p-6 sm:p-8 text-center border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="font-display text-lg sm:text-xl text-ink">
              Have a unique question or custom venue requirement?
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Speak directly with Ashish and our planning directors.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn-luxe gradient-gold text-ink text-xs font-semibold"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Us</span>
            </a>
            <Link
              href="/contact"
              className="btn-luxe gradient-royal text-primary-foreground text-xs"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

