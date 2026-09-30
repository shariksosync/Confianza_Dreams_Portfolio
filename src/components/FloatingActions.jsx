"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, ArrowUp } from "lucide-react";

import { useSite } from "../context/SiteContext";

/** WhatsApp, call, consultation and back-to-top floating controls. */
export default function FloatingActions() {
  const { contact } = useSite();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-6">
      <Link
        href="/contact"
        className="btn-luxe gradient-gold hidden text-ink sm:inline-flex"
      >
        Book Consultation
      </Link>

      <div className="flex gap-3">
        <a
          href={`tel:${contact?.phone}`}
          aria-label="Call now"
          className="grid h-12 w-12 place-items-center rounded-full bg-ink text-background shadow-luxe transition hover:scale-105"
        >
          <Phone className="h-5 w-5" />
        </a>
        <a
          href={`https://wa.me/${contact?.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid h-12 w-12 place-items-center rounded-full bg-[oklch(0.72_0.17_150)] text-white shadow-luxe transition hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
        {showTop && (
          <button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="animate-zoom-in gradient-royal grid h-12 w-12 place-items-center rounded-full text-primary-foreground shadow-luxe transition hover:scale-105"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
