"use client";

import { useEffect, useState } from "react";

/** Branded loading screen shown once per session. */
export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-200 grid place-items-center bg-background transition-opacity duration-700 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative animate-zoom-in h-20 w-auto flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Confianza Logo"
            className="h-full w-auto object-contain select-none"
          />
        </div>
        <span className="font-display text-lg tracking-[0.3em] text-ink">CONFIANZA</span>
        <span className="skeleton h-0.5 w-40 rounded-full" />
      </div>
    </div>
  );
}
