"use client";

import { useEffect } from "react";

/**
 * Adds `.is-visible` to every `.reveal` element as it scrolls into view or loads dynamically.
 * Features:
 * 1. IntersectionObserver for smooth scroll-triggered animations.
 * 2. MutationObserver to automatically detect and animate dynamically loaded items (e.g. from MongoDB).
 * 3. Immediate viewport visibility check.
 * 4. Safety fallback sweep so elements never remain stuck at opacity: 0.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((n) => {
        n.classList.add("is-visible");
      });
      return;
    }

    const observedNodes = new WeakSet();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 50px 0px" }
    );

    const observeNewNodes = () => {
      const nodes = document.querySelectorAll(".reveal:not(.is-visible)");
      nodes.forEach((node) => {
        if (!observedNodes.has(node)) {
          observedNodes.add(node);
          const rect = node.getBoundingClientRect();
          // If in or near the viewport, or already scrolled past, make visible immediately
          if (rect.top < window.innerHeight + 150) {
            node.classList.add("is-visible");
          } else {
            io.observe(node);
          }
        }
      });
    };

    // Initial observe
    observeNewNodes();

    // Watch for dynamic DOM changes (e.g. async data loaded from MongoDB)
    let mo = null;
    if ("MutationObserver" in window && document.body) {
      mo = new MutationObserver(() => {
        observeNewNodes();
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    // Safety sweep after delays to guarantee no element is left invisible
    const timer1 = setTimeout(observeNewNodes, 400);
    const timer2 = setTimeout(observeNewNodes, 1200);
    const timer3 = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200) {
          node.classList.add("is-visible");
        }
      });
    }, 2500);

    return () => {
      io.disconnect();
      if (mo) mo.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, deps);
}

