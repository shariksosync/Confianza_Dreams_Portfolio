"use client";

import { useEffect, useState } from "react";
import { Phone, ArrowUp } from "lucide-react";
import { useSite } from "../context/SiteContext";

/** WhatsApp, call, and back-to-top floating controls. */
export default function FloatingActions() {
  const { contact } = useSite();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center gap-2 sm:gap-2.5 select-none">
      {/* Back to Top */}
      {showTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="animate-zoom-in gradient-royal grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer mb-0.5"
          title="Scroll to Top"
        >
          <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
        </button>
      )}

      {/* Direct Phone Call Button */}
      <a
        href={`tel:${contact?.phone || "+917057357240"}`}
        aria-label="Call now"
        className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-ink text-background shadow-lg transition-transform hover:scale-105 active:scale-95 border border-white/15"
        title="Call Us"
      >
        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-champagne" />
      </a>

      {/* Official WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${contact?.whatsapp || "917057357240"}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ring-2 ring-white/20"
        title="Chat with us on WhatsApp"
      >
        <svg
          className="h-5 w-5 sm:h-6 sm:w-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 3.67C14.24 3.67 16.31 4.53 17.87 6.09C19.42 7.64 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.11L7.75 18.9L4.63 19.72L5.47 16.68L5.23 16.3C4.46 15.07 4.05 13.51 4.05 11.91C4.05 7.37 7.75 3.67 12.04 3.67ZM8.83 7.35C8.65 7.35 8.44 7.42 8.27 7.6C8.09 7.79 7.58 8.27 7.58 9.27C7.58 10.27 8.31 11.23 8.41 11.37C8.52 11.51 9.81 13.59 11.83 14.41C13.52 15.09 13.86 14.96 14.22 14.92C14.58 14.89 15.38 14.45 15.54 13.99C15.71 13.53 15.71 13.14 15.66 13.05C15.61 12.97 15.48 12.92 15.29 12.82C15.11 12.73 14.21 12.29 14.04 12.23C13.88 12.16 13.76 12.13 13.63 12.31C13.51 12.49 13.15 12.92 13.04 13.05C12.93 13.18 12.82 13.2 12.63 13.11C12.45 13.02 11.86 12.82 11.16 12.2C10.62 11.71 10.25 11.12 10.14 10.93C10.03 10.75 10.13 10.65 10.22 10.56C10.3 10.48 10.41 10.35 10.51 10.23C10.62 10.12 10.65 10.03 10.71 9.91C10.78 9.79 10.74 9.68 10.69 9.58C10.65 9.49 10.22 8.44 10.04 8.01C9.87 7.59 9.69 7.65 9.56 7.64C9.43 7.64 9.29 7.63 9.15 7.63C9.01 7.63 8.83 7.35 8.83 7.35Z" />
        </svg>
      </a>
    </div>
  );
}
