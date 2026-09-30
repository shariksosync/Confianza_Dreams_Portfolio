"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";

import { useSite } from "../context/SiteContext";
import EnquiryModal from "./EnquiryModal";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact Us" },
];

/** Modern luxury navbar styled like reference with prominent large logo, active pill tabs, and glowing Enquire Now button. */
export default function Navbar() {
  const { settings, theme, setTheme } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDarkTheme = theme === "luxury";

  // Sleek dark bar with backdrop blur matching reference
  const headerClass = scrolled
    ? "bg-ink/95 backdrop-blur-2xl border-b border-white/15 shadow-2xl py-2 sm:py-2.5"
    : "bg-ink/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2.5 sm:py-3.5";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerClass}`}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Title - Prominent Large Logo Badge */}
          <Link
            href="/"
            className="flex items-center gap-3.5 shrink-0 whitespace-nowrap group"
            aria-label="Confianza home"
          >
            {/* Big Circular Logo Container */}
            <div className="relative h-15 w-15 sm:h-18 sm:w-18 lg:h-20 lg:w-20 shrink-0 rounded-full overflow-hidden bg-white p-1.5 ring-2 ring-secondary/90 shadow-[0_0_24px_rgba(201,162,39,0.4)] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Confianza Logo"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Brand Title & Subtitle */}
            <div className="shrink-0 leading-tight">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                  Confianza
                </span>
                <span className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-secondary drop-shadow-sm">
                  Events
                </span>
              </div>
              <span className="block text-[0.6rem] sm:text-[0.66rem] lg:text-[0.72rem] uppercase tracking-[0.24em] text-champagne/90 font-medium mt-0.5">
                ART • SKILL • SOUL
              </span>
            </div>
          </Link>

          {/* Center Navigation Links with Pill Active State */}
          <ul className="hidden xl:flex items-center gap-1.5 2xl:gap-2 shrink-0 bg-white/5 rounded-full p-1.5 border border-white/10 backdrop-blur-md">
            {LINKS.map((l) => {
              const isActive = l.to === "/" ? pathname === "/" : pathname?.startsWith(l.to);
              return (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    className={`text-xs 2xl:text-sm font-medium tracking-wide transition-all duration-200 px-4 py-1.5 rounded-full block whitespace-nowrap ${
                      isActive
                        ? "gradient-royal text-white font-semibold shadow-[0_2px_14px_rgba(109,76,155,0.5)] ring-1 ring-white/25"
                        : "text-white/85 hover:text-secondary hover:bg-white/10"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Actions: Enquire Now glowing button + Theme Toggle + Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              type="button"
              aria-label="Toggle luxury theme"
              onClick={() => setTheme(theme === "luxury" ? "light" : "luxury")}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:border-secondary hover:text-secondary transition backdrop-blur-md"
              title={theme === "luxury" ? "Switch to Light Ivory Theme" : "Switch to Dark Royale Theme"}
            >
              {theme === "luxury" ? (
                <Sun className="h-4 w-4 text-secondary" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Glowing • Enquire Now Pill Button (Opens Modal) */}
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="hidden lg:inline-flex items-center gap-2 rounded-full gradient-gold text-ink font-bold text-xs sm:text-[0.82rem] tracking-wider uppercase px-5 sm:px-6 py-2.5 shadow-[0_0_24px_rgba(201,162,39,0.5)] hover:shadow-[0_0_35px_rgba(201,162,39,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 whitespace-nowrap cursor-pointer ring-1 ring-white/40"
            >
              <span className="h-2 w-2 rounded-full bg-ink animate-pulse" />
              <span>Enquire Now</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white xl:hidden transition"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        {open && (
          <div className="animate-slide-up mx-3 sm:mx-6 mt-3 rounded-3xl p-6 xl:hidden bg-ink/95 text-background border border-white/15 shadow-2xl backdrop-blur-2xl">
            <ul className="flex flex-col gap-1.5">
              {LINKS.map((l) => {
                const isActive = l.to === "/" ? pathname === "/" : pathname?.startsWith(l.to);
                return (
                  <li key={l.to}>
                    <Link
                      href={l.to}
                      onClick={() => setOpen(false)}
                      className={`block rounded-xl px-4 py-2.5 text-sm uppercase tracking-[0.14em] transition font-medium ${
                        isActive
                          ? "gradient-royal text-white font-bold shadow-md ring-1 ring-white/20"
                          : "text-white/90 hover:bg-white/10 hover:text-secondary"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Enquire Now Button */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setEnquiryOpen(true);
              }}
              className="gradient-gold mt-5 w-full text-ink font-bold text-xs sm:text-sm py-3 px-4 rounded-full shadow-[0_0_20px_rgba(201,162,39,0.4)] flex items-center justify-center gap-2 tracking-wider uppercase cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-ink animate-pulse" />
              <span>Enquire Now</span>
            </button>

            <p className="mt-4 text-center text-xs text-champagne/80 font-light">
              {settings?.brand?.tagline}
            </p>
          </div>
        )}
      </header>

      {/* Interactive Enquiry Popup Modal */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />
    </>
  );
}
