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
    : ["Wedding Decor", "Flower Arrangements", "Event Management"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-member-name"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(37,27,49,0.5)] p-3 sm:p-6 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="modal-dialog-luxury bg-[#FFFDFB] relative max-h-[90vh] w-full max-w-2xl overflow-y-auto no-scrollbar rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-[#E8E2EE] shadow-luxe text-[#4C4555]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close details"
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-[#E8E2EE] bg-[#F4F1F7] text-[#2B2138] transition hover:bg-[#EAE4F0] hover:text-[#6A439E] z-10 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-5 sm:gap-6 sm:grid-cols-12 sm:items-center">
          {/* Member Photo */}
          <div className="sm:col-span-5 relative">
            <div className="relative h-52 sm:h-72 lg:h-80 w-full overflow-hidden rounded-xl sm:rounded-2xl ring-2 ring-[#C2A438]/50 shadow-md bg-[#FAF8FC]">
              <img
                src={member.image || "/images/couple.jpg"}
                alt={member.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2138]/70 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C2A438] to-[#E4CA72] px-2.5 py-0.5 sm:px-3 sm:py-1 text-[0.62rem] sm:text-[0.68rem] font-bold uppercase tracking-wider text-[#2B2138] shadow-md">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {member.role}
              </span>
            </div>
          </div>

          {/* Member Details */}
          <div className="sm:col-span-7 space-y-3.5 sm:space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#C2A438] font-bold">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>Confianza Leadership &amp; Creative Team</span>
              </span>
              <h2 id="team-member-name" className="font-display text-xl sm:text-2xl lg:text-3xl text-[#2B2138] font-bold mt-1">
                {member.name}
              </h2>
              <p className="text-[0.68rem] sm:text-xs text-[#7E7688] uppercase tracking-wider font-semibold mt-0.5">
                {member.role} {member.experience ? `• ${member.experience}` : ""}
              </p>
            </div>

            {/* Email Contact */}
            <div className="rounded-xl sm:rounded-2xl bg-[#FCFBFE] p-3 sm:p-3.5 border border-[#E8E2EE] flex items-center justify-between gap-2.5 sm:gap-3 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-xl bg-[#6A439E]/10 text-[#6A439E]">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[0.6rem] sm:text-[0.62rem] uppercase tracking-wider text-[#7E7688] block font-semibold">
                    Official Email
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-xs sm:text-sm text-[#2B2138] font-medium hover:text-[#6A439E] transition truncate block"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="shrink-0 p-1.5 sm:p-2 rounded-xl border border-[#E8E2EE] hover:border-[#6A439E] hover:text-[#6A439E] text-[#7E7688] transition cursor-pointer"
                title="Copy email address"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* Specialties Badges */}
            <div>
              <span className="text-[0.62rem] sm:text-[0.65rem] uppercase tracking-wider text-[#7E7688] block mb-1.5 font-semibold">
                Key Specialties:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {specialties.map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="rounded-full bg-[#FAF8FC] border border-[#6A439E]/25 text-[#6A439E] text-[0.62rem] sm:text-[0.68rem] px-2.5 sm:px-3 py-0.5 sm:py-1 font-semibold tracking-wide"
                  >
                    ✦ {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Full Bio */}
            <div>
              <span className="text-[0.62rem] sm:text-[0.65rem] uppercase tracking-wider text-[#7E7688] block mb-1 font-semibold">
                About {member.name}:
              </span>
              <p className="text-xs sm:text-sm text-[#4C4555] leading-relaxed font-light">
                {member.bio || "Dedicated wedding planner bringing creative design and smooth on-ground management to every celebration."}
              </p>
            </div>

            {/* Modal Bottom Close */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="btn-modal-primary text-xs w-full sm:w-auto"
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
