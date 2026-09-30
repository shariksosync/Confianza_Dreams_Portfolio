"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const initialEmptyState = {
  settings: {
    brand: {
      name: "Confianza Event's and Entertainment",
      short: "Confianza",
      initials: "C",
      tagline: "Where Weddings Become Stories",
      logo: "/logo.png",
    },
    seo: {
      title: "Confianza Events — Luxury Wedding Planner in Pune",
      description:
        "Confianza Event's and Entertainment plans, designs and executes luxury weddings, destination weddings and premium events across India.",
    },
    theme: {
      primary: "#6D4C9B",
      secondary: "#C9A227",
      dark: "#2B2138",
    },
    sections: [],
  },
  hero: {
    eyebrow: "",
    headline: "",
    subtitle: "",
    primaryCta: { label: "Book Consultation", href: "/contact" },
    secondaryCta: { label: "View Portfolio", href: "/portfolio" },
    images: [],
    floatingStats: [],
  },
  about: {
    heading: "",
    story: "",
    mission: "",
    vision: "",
    values: [],
    timeline: [],
  },
  services: [],
  serviceCategories: [],
  ceremonies: [],
  stationery: [],
  servicesCta: {
    eyebrow: "WHERE WEDDINGS BECOME STORIES",
    headline: "Ready to Begin Curating Your Wedding?",
    subtitle:
      "Book a private 60–90 minute consultation with Ashish Wankhede in Warje, Pune, or via virtual video call.",
    buttonText: "Book Your Free Consultation",
    buttonLink: "/contact",
    notice: "Free Consultation • No Commitment Required",
    perks: [
      "60–90 Min Vision Mapping",
      "In-Person (Pune) or Virtual Call",
      "Detailed Budget Allocations",
      "3D Spatial Concept Previews",
    ],
  },
  why: [],
  portfolio: [],
  gallery: [],
  instagram: [],
  testimonials: [],
  blogs: [],
  faq: [],
  team: [],
  stats: [],
  process: [],
  packages: [],
  contact: {
    business: "Confianza Event's and Entertainment",
    owner: "Ashish Wankhede",
    partner: "Rutik Pund",
    phone: "7057357240",
    secondaryPhone: "9850983389",
    whatsapp: "917057357240",
    email: "confianzaevents2024@gmail.com",
    instagram: "https://www.instagram.com/confianza_events",
    address: {
      line1: "Indrayani Complex",
      line2: "Near Mr DIY, Warje Jakat Naka, Warje",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411052",
    },
    mapEmbed: "",
    hours: [],
    socials: [],
  },
  beforeAfter: {
    before: "",
    after: "",
    title: "",
    text: "",
  },
};

const THEME_KEY = "confianza:theme:v1";

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [data, setData] = useState(initialEmptyState);
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState("light");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch live site data (with fresh dynamic timestamp)
  const refreshData = useCallback(async (opts = {}) => {
    try {
      setLoading(true);
      const url = `/api/site?t=${Date.now()}${opts.fresh ? "&fresh=true" : ""}`;
      const siteRes = await fetch(url, { cache: "no-store" });

      if (siteRes.ok) {
        const siteJson = await siteRes.json();
        if (siteJson.success && siteJson.data) {
          setData((prev) => ({
            ...prev,
            ...siteJson.data,
            settings: { ...prev.settings, ...(siteJson.data.settings || {}) },
            contact: { ...prev.contact, ...(siteJson.data.contact || {}) },
          }));
        }
      }

      // Fetch inquiries only if explicitly requested (e.g. from Admin panel)
      if (opts.includeInquiries) {
        try {
          const inqRes = await fetch(`/api/inquiries?t=${Date.now()}`, { cache: "no-store" });
          if (inqRes.ok) {
            const inqJson = await inqRes.json();
            if (inqJson.success && Array.isArray(inqJson.data)) {
              setMessages(inqJson.data);
            }
          }
        } catch (inqErr) {
          console.warn("Could not fetch inquiries:", inqErr);
        }
      }
    } catch (err) {
      console.error("Failed to load site data from MongoDB API:", err);
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  // Dedicated inquiries loader for Admin panel
  const refreshInquiries = useCallback(async () => {
    try {
      const inqRes = await fetch(`/api/inquiries?t=${Date.now()}`, { cache: "no-store" });
      if (inqRes.ok) {
        const inqJson = await inqRes.json();
        if (inqJson.success && Array.isArray(inqJson.data)) {
          setMessages(inqJson.data);
          return inqJson.data;
        }
      }
    } catch (err) {
      console.error("Failed to refresh inquiries:", err);
    }
    return [];
  }, []);

  useEffect(() => {
    refreshData();
    try {
      const t = window.localStorage.getItem(THEME_KEY);
      if (t) setTheme(t);
    } catch {
      /* ignore */
    }
  }, [refreshData]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(THEME_KEY, theme);
      document.documentElement.classList.toggle("dark", theme === "luxury");
    } catch {
      /* ignore */
    }
  }, [theme, ready]);

  /** Update slice in MongoDB and update local state optimistically */
  const update = useCallback(async (key, value) => {
    let nextVal;
    setData((prev) => {
      nextVal = typeof value === "function" ? value(prev[key]) : value;
      return {
        ...prev,
        [key]: nextVal,
      };
    });

    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: nextVal }),
      });
      const resJson = await res.json();
      return resJson;
    } catch (err) {
      console.error(`Failed to persist slice ${key} to MongoDB:`, err);
      throw err;
    }
  }, []);

  /** Submit new client inquiry to MongoDB and trigger Nodemailer */
  const addMessage = useCallback(async (msg) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        setMessages((prev) => [resJson.data, ...prev]);
        return resJson.data;
      }
    } catch (err) {
      console.error("Failed to submit inquiry to MongoDB:", err);
      // Fallback local append
      setMessages((prev) => [{ ...msg, id: Date.now(), createdAt: new Date().toISOString() }, ...prev]);
    }
  }, []);

  /** Remove inquiry from MongoDB */
  const removeMessage = useCallback(async (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id && m._id !== id));
    try {
      await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(`Failed to delete inquiry ${id}:`, err);
    }
  }, []);

  const value = useMemo(
    () => ({
      ...data,
      data,
      ready,
      loading,
      refreshData,
      refreshInquiries,
      update,
      messages,
      addMessage,
      removeMessage,
      theme,
      setTheme,
    }),
    [data, ready, loading, refreshData, refreshInquiries, update, messages, addMessage, removeMessage, theme]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
