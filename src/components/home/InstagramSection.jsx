"use client";

import { Instagram, Heart, ExternalLink } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function InstagramSection() {
  const { instagram, contact } = useSite();

  const posts = instagram?.length
    ? instagram
    : [
        { id: 1, image: "/images/hero-1.jpg", likes: 842 },
        { id: 2, image: "/images/mehendi.jpg", likes: 611 },
        { id: 3, image: "/images/stage.jpg", likes: 730 },
        { id: 4, image: "/images/floral.jpg", likes: 522 },
        { id: 5, image: "/images/outdoor.jpg", likes: 468 },
        { id: 6, image: "/images/hero-2.jpg", likes: 905 },
      ];

  const instaUrl = contact.instagram || "https://www.instagram.com/confianza_events";

  return (
    <section className="section-pad relative bg-accent/20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Follow Our Journey"
          title="@confianza_events on Instagram"
          subtitle="Behind-the-scenes reels, live setups in Udaipur, Pune, and Goa, and daily wedding decor inspiration."
        />

        {/* Instagram Grid */}
        <div className="reveal mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {posts.map((post) => (
            <a
              key={post.id}
              href={instaUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card shadow-soft block"
            >
              <img
                src={post.image}
                alt="Confianza Instagram Post"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink/75 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 text-background p-3 text-center">
                <Instagram className="h-6 w-6 text-secondary" />
                <div className="flex items-center gap-1.5 text-xs text-champagne font-medium">
                  <Heart className="h-3.5 w-3.5 fill-rose-gold text-rose-gold" />
                  <span>{post.likes}</span>
                </div>
                <span className="text-[0.62rem] uppercase tracking-wider text-background/80 mt-1 flex items-center gap-1">
                  <span>View Post</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="reveal mt-10 text-center">
          <a
            href={instaUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-luxe gradient-royal text-primary-foreground text-xs shadow-luxe inline-flex items-center gap-2"
          >
            <Instagram className="h-4 w-4 text-secondary" />
            <span>Follow on Instagram (@confianza_events)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

