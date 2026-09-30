"use client";

import { useEffect, useRef } from "react";

/** Soft lavender glow that trails the pointer (desktop only, CSS driven). */
export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      el.style.transform = `translate3d(${e.clientX - 160}px, ${e.clientY - 160}px, 0)`;
      el.style.opacity = "1";
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 hidden h-80 w-80 rounded-full opacity-0 transition-opacity duration-500 lg:block"
      style={{
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--primary) 16%, transparent) 0%, transparent 65%)",
      }}
    />
  );
}
