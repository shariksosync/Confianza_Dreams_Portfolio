"use client";

import { useSite } from "../../context/SiteContext";

export default function LogoRepresentationSection() {
  const { about } = useSite();
  const brandImage =
    about?.brandImage ||
    about?.brandIdentityImage ||
    "/images/hero-1.jpg";

  return (
    <section className="relative w-full overflow-hidden bg-ink border-y border-border/40">
      <div className="relative w-full h-[60vh] sm:h-[75vh] lg:h-[90vh] min-h-[480px] max-h-[1200px] overflow-hidden">
        <img
          src={brandImage}
          alt="Confianza Brand Identity"
          className="h-full w-full object-cover object-center select-none transition-all duration-700"
          loading="lazy"
        />
      </div>
    </section>
  );
}
