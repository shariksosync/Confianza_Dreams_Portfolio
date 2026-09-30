"use client";

import { useEffect, useState } from "react";
import { X, Mail, Sparkles, Award, Check, Copy, ShieldCheck } from "lucide-react";

export default function TeamDetailModal({ member, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  if (!isOpen || !member) return null;

  const email = member.email || "contact@confianzaevents.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const specialties = Array.isArray(member.specialties) && member.specialties.length > 0
    ? member.specialties
    : ["Luxury Decor", "Floral Architecture", "Event Production"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-member-name"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-4 sm:p-6 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-dark relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8 border border-white/20 shadow-luxe animate-zoom-in text-background"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close details"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 hover:text-secondary z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-6 sm:grid-cols-12 sm:items-center">
          {/* Member Photo */}
          <div className="sm:col-span-5 relative">
            <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl ring-2 ring-secondary/70 shadow-luxe bg-ink">
              <img
                src={member.image || "/images/couple.jpg"}
                alt={member.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full gradient-gold px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink shadow-md">
                <Sparkles className="h-3 w-3" />
                {member.role}
              </span>
            </div>
          </div>

          {/* Member Details */}
          <div className="sm:col-span-7 space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.25em] text-secondary font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Confianza Leadership &amp; Creative Team</span>
              </span>
              <h2 id="team-member-name" className="font-display text-2xl sm:text-3xl text-white font-bold mt-1">
                {member.name}
              </h2>
              <p className="text-xs text-champagne/80 uppercase tracking-wider font-medium mt-0.5">
                {member.role} {member.experience ? `• ${member.experience}` : ""}
              </p>
            </div>

            {/* Email Contact (NO Phone number) */}
            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/20 text-secondary">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[0.62rem] uppercase tracking-wider text-champagne/70 block font-medium">
                    Official Email
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-xs sm:text-sm text-white font-medium hover:text-secondary transition truncate block"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="shrink-0 p-2 rounded-xl border border-white/20 hover:border-secondary hover:text-secondary text-white/80 transition"
                title="Copy email address"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* Specialties Badges */}
            <div>
              <span className="text-[0.65rem] uppercase tracking-wider text-champagne/70 block mb-2 font-medium">
                Key Specialties &amp; Domain:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {specialties.map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="rounded-full bg-primary/25 border border-primary/40 text-secondary text-[0.68rem] px-3 py-1 font-medium tracking-wide"
                  >
                    ✦ {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Full Bio */}
            <div>
              <span className="text-[0.65rem] uppercase tracking-wider text-champagne/70 block mb-1 font-medium">
                About {member.name}:
              </span>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-light">
                {member.bio || "Dedicated luxury wedding coordinator bringing artistic mastery and calm execution to every couple's milestone celebration."}
              </p>
            </div>

            {/* Modal Bottom Close */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="btn-luxe gradient-gold text-ink text-xs font-bold px-5 py-2"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
