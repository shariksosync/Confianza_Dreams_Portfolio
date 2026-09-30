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
        <span className="gradient-royal animate-zoom-in grid h-20 w-20 place-items-center rounded-full font-display text-3xl text-primary-foreground shadow-luxe">
          C
        </span>
        <span className="font-display text-lg tracking-[0.3em] text-ink">CONFIANZA</span>
        <span className="skeleton h-0.5 w-40 rounded-full" />
      </div>
    </div>
  );
}
