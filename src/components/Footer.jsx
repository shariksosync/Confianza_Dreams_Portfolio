"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";

import { useSite } from "../context/SiteContext";

const ICONS = { Instagram, Facebook, YouTube: Youtube };

/** Luxury footer with quick links, hours and the discreet admin entry. */
export default function Footer() {
  const { contact, services, settings } = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-background/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-4 lg:px-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="gradient-gold grid h-11 w-11 place-items-center rounded-full font-display text-lg text-ink">
              C
            </span>
            <span className="font-display text-xl text-background">Confianza</span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-background/65">
            {settings?.brand?.tagline}. Luxury wedding planning, decor and execution from Pune to
            every destination you dream of.
          </p>
          <div className="mt-6 flex gap-3">
            {(contact?.socials || []).map((s) => {
              const Icon = ICONS[s.label] || Instagram;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-background/20 transition hover:border-secondary hover:text-secondary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg text-background">Quick Links</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              { to: "/about", label: "About" },
              { to: "/services", label: "Services" },
              { to: "/portfolio", label: "Portfolio" },
              { to: "/gallery", label: "Gallery" },
              { to: "/packages", label: "Packages & Pricing" },
              { to: "/testimonials", label: "Testimonials" },
              { to: "/blog", label: "Blog & Guides" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link href={l.to} className="transition hover:text-secondary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-background">Services</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {(services || []).slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link href="/services" className="transition hover:text-secondary">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-background">Get in Touch</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <a href={`tel:${contact?.phone}`} className="hover:text-secondary">
                {contact?.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <a href={`mailto:${contact?.email}`} className="break-all hover:text-secondary">
                {contact?.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <span>
                {contact?.address?.line1}, {contact?.address?.line2}, {contact?.address?.city}{" "}
                {contact?.address?.pincode}
              </span>
            </li>
          </ul>

          <h4 className="mt-7 text-[0.7rem] uppercase tracking-[0.28em] text-secondary">
            Business Hours
          </h4>
          <ul className="mt-3 space-y-1.5 text-sm text-background/70">
            {(contact?.hours || []).map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span className="text-background/55">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-background/55 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>
            © {year} {contact?.business || "Confianza Events"}. All rights reserved.
          </p>
          <Link href="/admin" className="text-right text-background/40 transition hover:text-secondary">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
