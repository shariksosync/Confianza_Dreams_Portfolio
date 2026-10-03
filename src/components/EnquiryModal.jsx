"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, Send, CheckCircle2, Phone, Calendar, Mail, User, AlertCircle } from "lucide-react";
import { useSite } from "../context/SiteContext";
import { validatePhoneNumber } from "../lib/validation";

const SERVICES_LIST = [
  "Full Wedding Planning",
  "Wedding Decor & Floral Styling",
  "Destination Wedding Coordination",
  "On-Day Wedding Execution",
  "Haldi & Mehendi Rituals",
  "Grand Reception Production",
  "Corporate & Entertainment Events",
];

export default function EnquiryModal({ isOpen, open, onClose }) {
  const isModalOpen = isOpen ?? open;
  const { addMessage } = useSite();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    service: "Full Wedding Planning",
    budget: "To Be Tailored",
    message: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneValidation = validatePhoneNumber(formData.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || "Please enter a valid phone number.");
      return;
    }
    setPhoneError("");
    setLoading(true);
    try {
      await addMessage({
        ...formData,
        budget: "To Be Tailored",
        source: "Enquiry Now",
        priority: "normal",
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setPhoneError("");
    } catch (err) {
      console.error("Enquiry submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setPhoneError("");
    setFormData({
      name: "",
      phone: "",
      email: "",
      eventDate: "",
      service: "Full Wedding Planning",
      budget: "To Be Tailored",
      message: "",
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(37,27,49,0.38)] p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="modal-dialog-luxury bg-[#FFFDFB] relative max-h-[88vh] w-full max-w-lg overflow-y-auto no-scrollbar rounded-3xl p-6 sm:p-8 border border-[#E8E2EE] shadow-luxe text-[#4C4555]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close enquiry popup"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-[#E8E2EE] bg-[#F4F1F7] text-[#2B2138] transition hover:bg-[#EAE4F0] hover:text-[#6A439E] cursor-pointer z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center animate-fade-in">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#6A439E] to-[#854EB8] text-white shadow-luxe ring-4 ring-[#C2A438]/40">
              <CheckCircle2 className="h-8 w-8 text-[#E4CA72]" />
            </div>
            <span className="mt-4 block text-[0.68rem] uppercase tracking-[0.25em] text-[#C2A438] font-bold">
              Inquiry Received
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl text-[#2B2138] font-bold">
              Thank You for Reaching Out!
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#7E7688] leading-relaxed max-w-sm mx-auto">
              We have received your celebration details. A confirmation email has been dispatched to <strong className="text-[#2B2138]">{formData.email}</strong>. Founders Ashish &amp; Rutik will connect with you shortly over phone/WhatsApp.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="btn-modal-primary text-xs font-semibold px-6 py-2.5"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center pb-4 border-b border-[#E8E2EE]">
              <span className="inline-flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.25em] text-[#C2A438] font-bold">
                <Sparkles className="h-3.5 w-3.5 text-[#C2A438]" />
                <span>Confianza Concierge</span>
              </span>
              <h2
                id="enquiry-modal-title"
                className="mt-1 font-display text-2xl sm:text-3xl text-[#2B2138] font-bold"
              >
                Quick Wedding Enquiry
              </h2>
              <p className="mt-1 text-xs text-[#7E7688]">
                Share your dates and vision. We will prepare custom mood boards and pricing for your event.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-left">
              <div>
                <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                  Full Name <span className="text-[#6A439E]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7E7688]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sneha Deshmukh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white pl-10 pr-4 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:border-[#6A439E] focus:outline-none focus:ring-2 focus:ring-[#6A439E]/15 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                    Phone / WhatsApp <span className="text-[#6A439E]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7E7688]" />
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
                      className={`w-full rounded-xl border bg-white pl-10 pr-4 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:ring-2 transition ${
                        phoneError
                          ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                          : "border-[#E8E2EE] focus:border-[#6A439E] focus:ring-[#6A439E]/15"
                      }`}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-[0.68rem] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 shrink-0 inline" />
                      <span>{phoneError}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                    Email Address <span className="text-[#6A439E]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7E7688]" />
                    <input
                      type="email"
                      required
                      placeholder="sneha@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white pl-10 pr-4 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:border-[#6A439E] focus:outline-none focus:ring-2 focus:ring-[#6A439E]/15 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                    Tentative Event Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7E7688]" />
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white pl-10 pr-4 py-2 text-xs text-[#2B2138] focus:border-[#6A439E] focus:outline-none focus:ring-2 focus:ring-[#6A439E]/15 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                    Preferred Service
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3 py-2 text-xs text-[#2B2138] focus:border-[#6A439E] focus:outline-none focus:ring-2 focus:ring-[#6A439E]/15 transition cursor-pointer"
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
                <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                  Message / Special Wishes
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your estimated guest count, preferred venue, or any specific theme ideas..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-4 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:border-[#6A439E] focus:outline-none focus:ring-2 focus:ring-[#6A439E]/15 transition resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-modal-primary w-full py-3 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 text-[#E4CA72]" />
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
