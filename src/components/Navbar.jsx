"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Sparkles } from "lucide-react";

import { useSite } from "../context/SiteContext";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/gallery", label: "Gallery" },
  { to: "/packages", label: "Packages" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

/** Sticky luxury glass navigation with crisp typography, fixed logo dimensions, and smooth transitions. */
export default function Navbar() {
  const { settings, theme, setTheme } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDarkTheme = theme === "luxury";

  // Dynamic header styles
  const headerClass = scrolled
    ? isDarkTheme
      ? "bg-ink/95 backdrop-blur-2xl border-b border-white/15 shadow-luxe py-2.5"
      : "bg-background/95 backdrop-blur-2xl border-b border-border shadow-md py-2.5"
    : "bg-ink/80 backdrop-blur-xl border-b border-white/15 shadow-[0_4px_30px_rgba(0,0,0,0.35)] py-3";

  const brandTitleClass = scrolled
    ? isDarkTheme
      ? "text-white"
      : "text-ink"
    : "text-white";

  const brandSubClass = scrolled
    ? isDarkTheme
      ? "text-secondary font-medium"
      : "text-primary font-medium"
    : "text-secondary font-medium";

  const navLinkClass = scrolled
    ? isDarkTheme
      ? "text-white/85 hover:text-secondary"
      : "text-foreground/90 hover:text-primary"
    : "text-white/90 hover:text-secondary";

  const navActiveClass = scrolled
    ? isDarkTheme
      ? "text-secondary font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-0.5 after:bg-secondary after:rounded-full"
      : "text-primary font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-0.5 after:bg-primary after:rounded-full"
    : "text-secondary font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-0.5 after:bg-secondary after:rounded-full";

  const themeBtnClass = scrolled
    ? isDarkTheme
      ? "border-white/25 bg-white/10 text-white hover:border-secondary hover:text-secondary"
      : "border-border bg-card/80 text-foreground hover:border-primary hover:text-primary"
    : "border-white/25 bg-white/10 text-white hover:border-secondary hover:text-secondary";

  const mobileBtnClass = scrolled
    ? isDarkTheme
      ? "border-white/25 bg-white/10 text-white"
    : "border-border bg-card text-foreground"
    : "border-white/25 bg-white/10 text-white";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerClass}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Fixed size, no truncate, never shrinks */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 whitespace-nowrap group"
          aria-label="Confianza home"
        >
          <span className="gradient-royal ring-2 ring-secondary/60 grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-full font-display text-lg text-primary-foreground shadow-luxe transition-transform duration-300 group-hover:scale-105">
            C
          </span>
          <div className="shrink-0 leading-tight">
            <span className={`block font-display text-lg sm:text-xl font-medium tracking-wide transition-colors ${brandTitleClass}`}>
              Confianza
            </span>
            <span className={`block text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.24em] transition-colors ${brandSubClass}`}>
              Events &amp; Entertainment
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <ul className="hidden xl:flex items-center gap-3.5 2xl:gap-5 shrink-0">
          {LINKS.map((l) => {
            const isActive = l.to === "/" ? pathname === "/" : pathname?.startsWith(l.to);
            return (
              <li key={l.to}>
                <Link
                  href={l.to}
                  className={`text-[0.72rem] 2xl:text-[0.76rem] font-medium uppercase tracking-[0.12em] transition-all px-1 py-1 block ${navLinkClass} ${
                    isActive ? navActiveClass : ""
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Actions (Theme Toggle & CTA) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Theme Toggle */}
          <button
            type="button"
            aria-label="Toggle luxury theme"
            onClick={() => setTheme(theme === "luxury" ? "light" : "luxury")}
            className={`grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-full border transition backdrop-blur-md ${themeBtnClass}`}
            title={theme === "luxury" ? "Switch to Light Ivory Theme" : "Switch to Dark Royale Theme"}
          >
            {theme === "luxury" ? (
              <Sun className="h-4 w-4 text-secondary" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Book Consultation Button */}
          <Link
            href="/contact"
            className="btn-luxe gradient-royal hidden lg:inline-flex text-primary-foreground shadow-luxe text-[0.72rem] font-semibold py-2 px-4.5 ring-1 ring-secondary/40 hover:scale-105 shrink-0 whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5 text-secondary shrink-0" />
            <span>Book Consultation</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-full border transition xl:hidden ${mobileBtnClass}`}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="animate-slide-up mx-3 sm:mx-6 mt-3 rounded-3xl p-6 xl:hidden bg-ink/95 text-background border border-white/15 shadow-luxe backdrop-blur-2xl">
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
                        ? "bg-white/15 text-secondary font-bold"
                        : "text-white/90 hover:bg-white/10 hover:text-secondary"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn-luxe gradient-gold mt-5 w-full text-ink font-bold text-xs py-3 text-center flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Book Consultation</span>
          </Link>

          <p className="mt-4 text-center text-xs text-champagne/80 font-light">
            {settings.brand.tagline}
          </p>
        </div>
      )}
    </header>
  );
}
