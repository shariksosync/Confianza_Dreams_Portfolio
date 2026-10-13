"use client";

import { useSite } from "../../context/SiteContext";

const DEFAULT_BRAND_IMAGE =
  "https://res.cloudinary.com/tridevsosync/image/upload/v1791533413/confianza_events/o7afgfqbzmoju31zki1x.jpg";

export default function LogoRepresentationSection() {
  const { about } = useSite();
  const brandImage =
    (about?.brandImage && about.brandImage.trim()) ||
    (about?.brandIdentityImage && about.brandIdentityImage.trim()) ||
    DEFAULT_BRAND_IMAGE;

  return (
    <section className="relative w-full overflow-hidden bg-ink border-y border-border/40">
      <div className="relative w-full h-[55vh] sm:h-[70vh] lg:h-[80vh] min-h-[420px] max-h-[950px] overflow-hidden">
        <img
          src={brandImage}
          alt="Confianza Brand Identity"
          className="h-full w-full object-cover object-center select-none transition-all duration-700"
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== DEFAULT_BRAND_IMAGE) {
              e.currentTarget.src = DEFAULT_BRAND_IMAGE;
            } else {
              e.currentTarget.src = "/images/hero-1.jpg";
            }
          }}
        />
        {/* Subtle cinematic gradient overlay for luxury depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/20 pointer-events-none" />
      </div>
    </section>
  );
}
