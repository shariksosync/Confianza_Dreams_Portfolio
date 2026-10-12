"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle } from "lucide-react";

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

/** Modern luxury navbar styled with dedicated desktop and mobile layouts. */
export default function Navbar() {
  const { settings, contact } = useSite();
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

  // Sleek #fefefe bar with backdrop blur
  const headerClass = scrolled
    ? "bg-[#fefefe]/98 backdrop-blur-2xl border-b border-border/80 shadow-md py-2 sm:py-2.5"
    : "bg-[#fefefe] backdrop-blur-xl border-b border-border/60 shadow-xs py-2.5 sm:py-3.5";

  const phoneNumberDisplay = contact?.phone
    ? (contact.phone.startsWith("+") ? contact.phone : `+91 ${contact.phone}`)
    : "+91 7057357240";

  const brandName =
    settings?.brand?.name &&
    settings.brand.name !== "Confianza Events" &&
    settings.brand.name !== "Confianza"
      ? settings.brand.name
      : "Confianza Events & Entertainment";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerClass}`}>
        {/* ======================================================== */}
        {/* 1. DESKTOP NAVBAR (100% Preserved & Untouched for xl+)   */}
        {/* ======================================================== */}
        <nav className="mx-auto hidden xl:flex w-full max-w-[1700px] items-center justify-between gap-3 2xl:gap-4 px-4 sm:px-5 lg:px-6 2xl:px-10">
          {/* Brand Logo & Title - Compact & Balanced */}
          <Link
            href="/"
            className="flex items-center gap-2.5 2xl:gap-3 shrink-0 whitespace-nowrap group"
            aria-label="Confianza Events & Entertainment home"
          >
            {/* Clean Frameless Logo Container */}
            <div className="relative h-14 w-auto sm:h-16 xl:h-16 2xl:h-14 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src={settings?.brand?.logo || "/logo.png"}
                alt="Confianza Events & Entertainment Logo"
                className="h-full w-auto object-contain select-none"
              />
            </div>

            {/* Brand Title & Dynamic Tagline */}
            <div className="shrink-0 leading-tight">
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="font-display text-base xl:text-[1.05rem] 2xl:text-xl font-bold tracking-tight text-ink">
                  {brandName}
                </span>
              </div>
              {settings?.brand?.tagline ? (
                <span className="block text-[0.52rem] xl:text-[0.56rem] 2xl:text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-0.5">
                  {settings.brand.tagline}
                </span>
              ) : null}
            </div>
          </Link>

          {/* Center Navigation Links with Pill Active State */}
          <ul className="flex items-center gap-1 xl:gap-1.5 2xl:gap-2 shrink-0 bg-black/[0.03] rounded-full p-1 2xl:p-1.5 border border-black/[0.06] backdrop-blur-md">
            {LINKS.map((l) => {
              const isActive = l.to === "/" ? pathname === "/" : pathname?.startsWith(l.to);
              return (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    className={`text-xs 2xl:text-sm font-medium tracking-wide transition-all duration-200 px-3 2xl:px-4 py-1.5 rounded-full block whitespace-nowrap ${
                      isActive
                        ? "gradient-royal text-white font-semibold shadow-xs"
                        : "text-ink/80 hover:text-primary hover:bg-black/5"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Actions: Phone Number Button (Direct Call) */}
          <div className="flex items-center gap-2.5 2xl:gap-3 shrink-0">
            <a
              href={`tel:${contact?.phone ? (contact.phone.startsWith("+") ? contact.phone : `+91${contact.phone}`) : "+917057357240"}`}
              className="inline-flex items-center gap-2 rounded-full gradient-gold text-ink font-bold text-xs 2xl:text-[0.82rem] tracking-wider uppercase px-4 xl:px-4.5 2xl:px-6 py-2 2xl:py-2.5 shadow-md hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 whitespace-nowrap cursor-pointer ring-1 ring-border/40"
            >
              <span className="h-2 w-2 rounded-full bg-ink animate-pulse" />
              <span>{phoneNumberDisplay}</span>
            </a>
          </div>
        </nav>

        {/* ======================================================== */}
        {/* 2. DEDICATED MOBILE NAVBAR (Engineered for Mobile/Tablet) */}
        {/* ======================================================== */}
        <div className="flex xl:hidden items-center justify-between px-3 sm:px-5 w-full gap-3">
          {/* Mobile Brand Section - Full Width for Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 flex-1 group py-0.5"
            aria-label="Confianza Events & Entertainment home"
            onClick={() => setOpen(false)}
          >
            {/* Mobile Transparent Logo */}
            <div className="relative h-11 w-auto sm:h-12 shrink-0 flex items-center justify-center">
              <img
                src={settings?.brand?.logo || "/logo.png"}
                alt="Confianza Events & Entertainment Logo"
                className="h-full w-auto object-contain select-none"
              />
            </div>

            {/* Mobile Brand Name & Tagline - Full Visibility */}
            <div className="min-w-0 flex-1 leading-tight">
              <span className="font-display text-xs xs:text-sm sm:text-base font-bold text-ink tracking-tight block">
                {brandName}
              </span>
              {settings?.brand?.tagline ? (
                <span className="text-[0.52rem] sm:text-[0.58rem] uppercase tracking-wider text-muted-foreground font-semibold block mt-0.5 truncate">
                  {settings.brand.tagline}
                </span>
              ) : null}
            </div>
          </Link>

          {/* Mobile Right Controls: Hamburger Menu Toggle */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-black/5 text-ink hover:bg-black/10 active:scale-95 transition cursor-pointer"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. MOBILE MENU DROPDOWN DRAWER                           */}
        {/* ======================================================== */}
        {open && (
          <div className="animate-slide-up mx-3 sm:mx-6 mt-3 rounded-3xl p-5 sm:p-6 xl:hidden bg-[#fefefe] text-foreground border border-border shadow-2xl backdrop-blur-2xl">
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
                          ? "gradient-royal text-white font-bold shadow-md"
                          : "text-ink hover:bg-black/5 hover:text-primary"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Phone Number Button (Direct Call) */}
            <a
              href={`tel:${contact?.phone ? (contact.phone.startsWith("+") ? contact.phone : `+91${contact.phone}`) : "+917057357240"}`}
              onClick={() => setOpen(false)}
              className="gradient-gold mt-5 w-full text-ink font-bold text-xs sm:text-sm py-3 px-4 rounded-full shadow-md flex items-center justify-center gap-2 tracking-wider uppercase cursor-pointer active:scale-98 transition"
            >
              <span className="h-2 w-2 rounded-full bg-ink animate-pulse" />
              <span>{phoneNumberDisplay}</span>
            </a>

            {contact?.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2.5 w-full bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-700 border border-emerald-500/30 text-xs sm:text-sm py-2.5 px-4 rounded-full flex items-center justify-center gap-2 font-semibold tracking-wide transition cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </a>
            )}

            {settings?.brand?.tagline ? (
              <p className="mt-4 text-center text-xs text-muted-foreground font-light">
                {settings.brand.tagline}
              </p>
            ) : null}
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
