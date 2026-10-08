"use client";

import { useState } from "react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";
import TeamDetailModal from "../TeamDetailModal";
import { Sparkles, ShieldCheck, Eye, Mail } from "lucide-react";

export default function TeamSection() {
  const { team, loading, ready } = useSite();
  const [selectedMember, setSelectedMember] = useState(null);

  const members = team || [];

  return (
    <section className="section-pad relative bg-accent/30 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Our Team"
          title="Meet Our Wedding Planners &amp; Coordinators"
          subtitle="Our experienced planners, decorators, and coordinators work together to make your wedding day smooth and stress-free. Click any member to view details."
        />

        {/* Loading skeleton placeholder */}
        {loading && !ready ? (
          <div className="mt-10 sm:mt-16 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-border/70 flex flex-col"
              >
                <div className="h-56 sm:h-64 lg:h-72 w-full skeleton" />
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="h-6 w-3/4 skeleton rounded-lg" />
                  <div className="h-4 w-full skeleton rounded-md" />
                  <div className="h-4 w-2/3 skeleton rounded-md" />
                  <div className="mt-4 pt-4 border-t border-border/50 h-4 w-1/2 skeleton rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="reveal is-visible mt-10 sm:mt-16 glass-card rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-muted-foreground border border-border max-w-2xl mx-auto">
            <ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-display text-lg sm:text-xl text-ink font-semibold">
              No Team Members Listed
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add team profiles in the Admin Panel under the About module to showcase them here.
            </p>
          </div>
        ) : (
          <div className="reveal is-visible mt-10 sm:mt-16 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((person, idx) => (
              <div
                key={person.id || person._id || idx}
                onClick={() => setSelectedMember(person)}
                className="group glass-card rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe border border-border/70 flex flex-col cursor-pointer"
              >
                <div className="relative h-56 sm:h-64 lg:h-72 w-full overflow-hidden bg-ink">
                  <img
                    src={person.image || "/images/couple.jpg"}
                    alt={person.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />

                  {/* Role Badge */}
                  <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 inline-flex items-center gap-1.5 rounded-full gradient-gold px-3 sm:px-3.5 py-0.5 sm:py-1 text-[0.62rem] sm:text-[0.68rem] font-bold uppercase tracking-wider text-ink shadow-md">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    {person.role}
                  </span>

                  {/* Hover Quick View Pill */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Eye className="h-4 w-4" />
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg sm:text-xl text-ink group-hover:text-primary transition-colors">
                      {person.name}
                    </h3>
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {person.bio}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-border/50 flex items-center justify-between text-[0.65rem] sm:text-[0.7rem] text-primary font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 hover:text-secondary transition">
                      <Mail className="h-3.5 w-3.5 text-secondary shrink-0" />
                      <span>Click to View Profile</span>
                    </span>
                    <span className="text-muted-foreground/60 font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Member Details Modal */}
      <TeamDetailModal
        member={selectedMember}
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}
