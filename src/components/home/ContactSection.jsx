"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";
import { validatePhoneNumber } from "../../lib/validation";

const BUDGET_TIERS = [
  "Below ₹5 Lakhs",
  "₹5L - ₹15 Lakhs",
  "₹15L - ₹30 Lakhs",
  "₹30L - ₹60 Lakhs",
  "₹60 Lakhs+ (Royal / Destination)",
];

export default function ContactSection({ isStandalone = false }) {
  const { contact, services, addMessage } = useSite();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    service: "",
    budget: BUDGET_TIERS[0],
    message: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultServicesList = [
    "Full Wedding Planning",
    "Guest Welcome & Room Management",
    "Custom Mandap & Stage Decor",
    "Pooja & Traditional Ritual Management",
    "Personal Helpers for Bride & Groom",
    "Catering & Food Management",
    "Live Artists, DJ & Band Management",
    "On-Ground Event Coordination",
  ];

  const availableServices =
    services && services.length > 0
      ? services.map((s) => s.title)
      : defaultServicesList;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryService = params.get("service");
      if (queryService) {
        setFormData((prev) => ({
          ...prev,
          service: queryService,
          message: prev.message || `I am interested in inquiring about ${queryService}.`,
        }));
        return;
      }
    }
    if (!formData.service && availableServices.length > 0) {
      setFormData((prev) => ({ ...prev, service: availableServices[0] }));
    }
  }, [services]);

  const budgetTiers = BUDGET_TIERS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneValidation = validatePhoneNumber(formData.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || "Please enter a valid contact phone number.");
      return;
    }
    setPhoneError("");
    setLoading(true);
    try {
      await addMessage({
        ...formData,
        service: formData.service || availableServices[0],
        budget: formData.budget || BUDGET_TIERS[0],
        source: "Wedding Inquiry Form",
        priority: "normal",
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        eventDate: "",
        service: availableServices[0] || "",
        budget: BUDGET_TIERS[0],
        message: "",
      });
      setPhoneError("");
    } catch (err) {
      console.error("Consultation form error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-10 sm:py-16 lg:py-24 relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Begin Your Story"
          title="Book Your Wedding Consultation"
          subtitle="Tell us about your wedding date, guest count, and ideas. We can meet in person in Pune or on a video call."
        />

        <div className="reveal mt-8 sm:mt-12 lg:mt-14 grid gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-12 items-start">
          {/* Contact Details & Office Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6 w-full">
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-border space-y-5 shadow-soft">
              <div>
                <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.25em] text-primary font-semibold block">
                  Direct Inquiries
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-ink mt-1 font-bold">
                  Confianza Studio Pune
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Led personally by Ashish Wankhede and our senior creative directors.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-border/60 text-xs sm:text-sm">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl bg-card/70 border border-border/70 hover:border-primary/40 transition group"
                >
                  <div className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-wider text-muted-foreground block">
                      Phone &amp; Direct Call
                    </span>
                    <span className="font-semibold text-foreground text-xs sm:text-sm group-hover:text-primary transition block truncate">
                      +91 {contact.phone}
                    </span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl bg-card/70 border border-border/70 hover:border-secondary/50 transition group"
                >
                  <div className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-secondary/15 text-secondary group-hover:bg-secondary group-hover:text-ink transition">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-wider text-muted-foreground block">
                      Instant WhatsApp Chat
                    </span>
                    <span className="font-semibold text-foreground text-xs sm:text-sm group-hover:text-secondary transition block truncate">
                      Chat with Planning Team
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl bg-card/70 border border-border/70 hover:border-primary/40 transition group"
                >
                  <div className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-wider text-muted-foreground block">
                      Email Address
                    </span>
                    <span className="font-semibold text-foreground text-xs sm:text-sm group-hover:text-primary transition block truncate">
                      {contact.email}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-xl sm:rounded-2xl bg-card/70 border border-border/70">
                  <div className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-wider text-muted-foreground block">
                      Studio Address
                    </span>
                    <span className="text-xs text-foreground/90 leading-relaxed block break-words">
                      {contact.address.line1}, {contact.address.line2}, {contact.address.city}, {contact.address.state} • {contact.address.pincode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Consultation Hours */}
              <div className="pt-3 border-t border-border/60">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary mb-2.5">
                  <Clock className="h-3.5 w-3.5 text-secondary shrink-0" />
                  <span>Consultation Hours</span>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {contact.hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex flex-wrap items-center justify-between gap-1 py-1 border-b border-border/30 last:border-0"
                    >
                      <span className="text-foreground/80 font-medium text-[0.75rem] sm:text-xs">{h.day}</span>
                      <span className="text-foreground font-semibold text-[0.75rem] sm:text-xs text-right">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Form (7 cols) */}
          <div className="lg:col-span-7 w-full">
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 border border-border shadow-luxe relative">
              {submitted ? (
                <div className="py-10 text-center space-y-4 animate-zoom-in">
                  <div className="gradient-royal mx-auto grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-full text-primary-foreground shadow-luxe ring-4 ring-secondary/30">
                    <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-secondary" />
                  </div>
                  <h3 className="font-display text-xl sm:text-3xl text-ink font-bold">
                    Consultation Request Received!
                  </h3>
                  <div className="rule-gold mx-auto" />
                  <p className="max-w-md mx-auto text-xs sm:text-sm text-muted-foreground leading-relaxed px-2">
                    Thank you! We have sent a confirmation email to your inbox. Ashish Wankhede, Rutik Pund, and our team will review your details and call you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn-luxe gradient-royal text-primary-foreground text-xs mt-3 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="border-b border-border/60 pb-3 mb-1">
                    <span className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.25em] text-secondary font-semibold block">
                      Wedding Inquiry Form
                    </span>
                    <h3 className="font-display text-lg sm:text-2xl text-ink mt-0.5 font-bold">
                      Tell Us About Your Celebration
                    </h3>
                  </div>

                  <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        Your Name / Couple Names *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sneha & Rohan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        Contact Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        inputMode="tel"
                        placeholder="e.g. 9850983389"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, phone: val });
                          if (phoneError) {
                            const res = validatePhoneNumber(val);
                            if (res.isValid) setPhoneError("");
                          }
                        }}
                        onBlur={() => {
                          if (formData.phone.trim()) {
                            const res = validatePhoneNumber(formData.phone);
                            if (!res.isValid) {
                              setPhoneError(res.error || "Please enter a valid phone number.");
                            } else {
                              setPhoneError("");
                            }
                          }
                        }}
                        className={`w-full rounded-xl border bg-card px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 shadow-xs ${
                          phoneError
                            ? "border-destructive focus:border-destructive focus:ring-destructive"
                            : "border-border focus:border-primary focus:ring-primary"
                        }`}
                      />
                      {phoneError && (
                        <p className="text-[0.68rem] text-destructive mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="h-3 w-3 shrink-0 inline" />
                          <span>{phoneError}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rohan@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        Tentative Wedding / Event Date
                      </label>
                      <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        Primary Service Needed
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                      >
                        {availableServices.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="min-w-0">
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        Estimated Budget Bracket
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                      >
                        {budgetTiers.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Tell Us About Your Vision &amp; Venue Preferences
                    </label>
                    <textarea
                      rows={4}
                      placeholder="e.g. We are planning a 3-day destination wedding in Udaipur with 200 guests. We want a royal lavender & gold theme for the sangeet and reception..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-luxe gradient-royal w-full text-primary-foreground font-semibold shadow-luxe py-3 sm:py-3.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-center whitespace-normal mt-2"
                  >
                    {loading ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4 shrink-0" />
                        <span>Book My Free Wedding Consultation</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Google Map Embed */}
        <div className="reveal mt-10 sm:mt-14 lg:mt-16 overflow-hidden rounded-2xl sm:rounded-3xl border border-border shadow-luxe">
          <div className="bg-ink p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-background">
            <div className="flex items-start sm:items-center gap-3">
              <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <h4 className="font-display text-sm sm:text-base text-background font-bold">
                  Confianza Events &amp; Entertainment Studio
                </h4>
                <p className="text-[0.7rem] sm:text-xs text-background/70 leading-relaxed mt-0.5">
                  Indrayani Complex, near Mr DIY, Warje Jakat Naka, Pune, Maharashtra 411052
                </p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Warje+Jakat+Naka,+Pune,+Maharashtra+411052"
              target="_blank"
              rel="noreferrer"
              className="btn-luxe gradient-gold text-ink text-[0.75rem] sm:text-xs font-semibold py-2 px-4 w-full sm:w-auto text-center shrink-0 justify-center cursor-pointer"
            >
              Open in Google Maps
            </a>
          </div>
          <iframe
            title="Confianza Studio Location"
            src={contact.mapEmbed || "https://www.google.com/maps?q=Warje%20Jakat%20Naka%2C%20Pune%2C%20Maharashtra%20411052&output=embed"}
            width="100%"
            height="340"
            className="w-full h-[260px] sm:h-[320px] md:h-[380px] border-0"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
