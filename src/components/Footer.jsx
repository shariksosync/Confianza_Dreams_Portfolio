"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";

import { useSite } from "../context/SiteContext";

const ICONS = { Instagram, Facebook, YouTube: Youtube };

/** Luxury footer with quick links, hours, clean single-line contact, and the discreet admin entry. */
export default function Footer() {
  const { contact, services, settings } = useSite();
  const year = new Date().getFullYear();

  const emailAddress = contact?.email || "confianzaevents2024@gmail.com";
  const phoneNumber = contact?.phone || "7057357240";

  return (
    <footer className="bg-ink text-background/80 overflow-hidden select-none">
      <div className="mx-auto grid max-w-7xl gap-8 sm:gap-10 lg:gap-8 px-4 sm:px-6 lg:px-10 py-12 sm:py-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12">
        {/* Brand Column (4 cols on desktop) */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden ring-2 ring-secondary/60 shadow-md bg-ink flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Confianza Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-display text-xl text-background font-bold">Confianza</span>
          </div>
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-background/65 max-w-sm">
            {settings?.brand?.tagline || "Where Weddings Become Stories"}. Complete wedding planning, decor, and event management from Pune to any destination across India.
          </p>
          <div className="mt-5 flex gap-2.5">
            {(contact?.socials || []).map((s) => {
              const Icon = ICONS[s.label] || Instagram;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-background/20 transition hover:border-secondary hover:text-secondary text-background/80"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links (2.5 cols on desktop) */}
        <div className="lg:col-span-2">
          <h3 className="font-display text-base sm:text-lg text-background font-bold">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm">
            {[
              { to: "/about", label: "About Us" },
              { to: "/services", label: "Services" },
              { to: "/portfolio", label: "Portfolio" },
              { to: "/gallery", label: "Gallery" },
              { to: "/packages", label: "Packages & Pricing" },
              { to: "/testimonials", label: "Testimonials" },
              { to: "/blog", label: "Blog & Guides" },
              { to: "/contact", label: "Contact Us" },
            ].map((l) => (
              <li key={l.to}>
                <Link href={l.to} className="transition hover:text-secondary text-background/75">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services (2.5 cols on desktop) */}
        <div className="lg:col-span-2">
          <h3 className="font-display text-base sm:text-lg text-background font-bold">Services</h3>
          <ul className="mt-4 space-y-2 text-xs sm:text-sm">
            {(services || []).slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link href="/services" className="transition hover:text-secondary text-background/75 truncate block">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get in Touch & Hours (3 cols on desktop) */}
        <div className="lg:col-span-4 min-w-0">
          <h3 className="font-display text-base sm:text-lg text-background font-bold">Get in Touch</h3>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-secondary" />
              <a href={`tel:${phoneNumber}`} className="hover:text-secondary text-background/85 font-medium transition whitespace-nowrap">
                {phoneNumber}
              </a>
            </li>
            <li className="flex items-center gap-2.5 min-w-0">
              <Mail className="h-4 w-4 shrink-0 text-secondary" />
              <a
                href={`mailto:${emailAddress}`}
                className="hover:text-secondary text-background/85 font-medium transition text-xs sm:text-sm whitespace-nowrap block truncate"
                title={emailAddress}
              >
                {emailAddress}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <span className="text-background/75 text-xs leading-relaxed break-words">
                {contact?.address?.line1}, {contact?.address?.line2}, {contact?.address?.city} {contact?.address?.pincode}
              </span>
            </li>
          </ul>

          <h4 className="mt-6 text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] text-secondary font-bold">
            Business Hours
          </h4>
          <ul className="mt-2.5 space-y-1.5 text-xs text-background/70">
            {(contact?.hours || []).map((h) => (
              <li key={h.day} className="flex justify-between gap-2 border-b border-white/5 pb-1 last:border-0">
                <span className="font-medium text-background/80">{h.day}</span>
                <span className="text-background/60 font-semibold">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 sm:px-6 py-4 sm:py-5 text-xs text-background/55 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>
            © {year} {contact?.business || "Confianza Events"}. All rights reserved.
          </p>
          <Link href="/admin" className="text-left sm:text-right text-background/40 transition hover:text-secondary">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
