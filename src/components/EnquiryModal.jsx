"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, Send, CheckCircle2, Phone, Calendar, Mail, User } from "lucide-react";
import { useSite } from "../context/SiteContext";

const SERVICES_LIST = [
  "Full Wedding Planning",
  "Wedding Decor & Floral Styling",
  "Destination Wedding Coordination",
  "On-Day Wedding Execution",
  "Haldi & Mehendi Rituals",
  "Grand Reception Production",
  "Corporate & Entertainment Events",
];

export default function EnquiryModal({ isOpen, onClose }) {
  const { addMessage } = useSite();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    service: "Full Wedding Planning",
    budget: "₹5L - ₹15L",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMessage({
        ...formData,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Enquiry submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      eventDate: "",
      service: "Full Wedding Planning",
      budget: "₹5L - ₹15L",
      message: "",
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 sm:p-8 border border-border/80 shadow-luxe animate-zoom-in text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close enquiry popup"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center animate-fade-in">
            <div className="gradient-royal mx-auto grid h-16 w-16 place-items-center rounded-full text-primary-foreground shadow-luxe ring-4 ring-secondary/40">
              <CheckCircle2 className="h-8 w-8 text-secondary" />
            </div>
            <span className="mt-4 block text-[0.68rem] uppercase tracking-[0.25em] text-secondary font-semibold">
              Inquiry Received
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl text-ink">
              Thank You for Reaching Out!
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              We have received your celebration details. Ashish and our senior planning director will connect with you shortly over phone or WhatsApp.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="btn-luxe gradient-gold text-ink text-xs font-semibold px-6 py-2.5"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center pb-4 border-b border-border/60">
              <span className="inline-flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.25em] text-secondary font-bold">
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
                <span>Confianza Concierge</span>
              </span>
              <h2
                id="enquiry-modal-title"
                className="mt-1 font-display text-2xl sm:text-3xl text-ink"
              >
                Quick Wedding Enquiry
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Share your dates and vision. We will prepare custom mood boards and pricing for your event.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-left">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Full Name <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sneha Deshmukh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card/80 pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Phone / WhatsApp <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card/80 pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="sneha@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card/80 pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Tentative Event Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card/80 pl-10 pr-4 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Preferred Service
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card/80 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {SERVICES_LIST.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Message / Special Wishes
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your estimated guest count, preferred venue, or any specific theme ideas..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card/80 px-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-luxe gradient-royal w-full text-primary-foreground text-xs font-semibold py-2.5 shadow-luxe flex items-center justify-center gap-2"
                >
                  <Send className="h-3.5 w-3.5 text-secondary" />
                  <span>{loading ? "Sending Inquiry..." : "Submit Wedding Inquiry"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
