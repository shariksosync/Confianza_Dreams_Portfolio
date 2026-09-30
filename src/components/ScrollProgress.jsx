"use client";

import { useEffect, useState } from "react";

/** Thin gold progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-60 h-0.5 bg-transparent">
      <div className="gradient-gold h-full transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}
