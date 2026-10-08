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
    sections: [
      { id: "hero", label: "Hero Banner", enabled: true },
      { id: "partners", label: "Preferred Venues Marquee", enabled: true },
      { id: "about", label: "About Confianza", enabled: true },
      { id: "services", label: "Our Services", enabled: true },
      { id: "portfolio", label: "Our Work / Portfolio", enabled: true },
      { id: "beforeAfter", label: "Venue Transformations (Before / After)", enabled: true },
      { id: "process", label: "The 4-Step Journey", enabled: true },
      { id: "testimonials", label: "Love Stories & Testimonials", enabled: true },
      { id: "instagram", label: "Instagram Live Showcase", enabled: true },
      { id: "cta", label: "Free Consultation CTA", enabled: true },
    ],
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
    eyebrow: "LET'S PLAN YOUR SPECIAL DAY",
    headline: "Ready to Plan Your Wedding?",
    subtitle:
      "Book a free 60–90 minute consultation with Ashish Wankhede in Warje, Pune, or via video call.",
    buttonText: "Book Free Consultation",
    buttonLink: "/contact",
    notice: "Free Consultation • No Commitment Required",
    perks: [
      "60–90 Min Planning Session",
      "In-Person (Pune) or Video Call",
      "Clear Budget Planning",
      "3D Decor Design Previews",
    ],
  },
  why: [],
  portfolio: [],
  portfolioHeader: {
    badge: "500+ Happy Weddings",
    eyebrow: "OUR WORK",
    title: "Our Work",
    subtitle:
      "A photo gallery of our mandap setups, flower decor, beach weddings, and grand reception stages across India.",
    image: "/images/hero-2.jpg",
    stats: ["500+ Weddings", "15+ Cities Across India", "100% On-Time Events"],
  },
  portfolioSection: {
    eyebrow: "Our Work",
    title: "Moments of Joy & Celebration",
    subtitle:
      "Explore our portfolio of mandap setups, reception stages, cheerful haldi events, and destination weddings across India.",
  },
  portfolioCategories: [
    { id: "destination", name: "Destination Weddings", slug: "destination", order: 1 },
    { id: "mandap", name: "Mandap & Rituals", slug: "mandap", order: 2 },
    { id: "haldi", name: "Haldi & Mehendi", slug: "haldi", order: 3 },
    { id: "reception", name: "Grand Receptions", slug: "reception", order: 4 },
    { id: "floral", name: "Floral & Stage Decor", slug: "floral", order: 5 },
    { id: "sangeet", name: "Sangeet & Stage", slug: "sangeet", order: 6 },
    { id: "hospitality", name: "Hospitality & Suites", slug: "hospitality", order: 7 },
  ],
  portfolioCta: {
    eyebrow: "LET'S PLAN YOUR SPECIAL DAY",
    headline: "Ready to Plan Your Dream Wedding?",
    subtitle:
      "Connect directly with founders Ashish Wankhede and Rutik Pund to discuss your venue options, custom 3D decor ideas, and event timeline.",
    buttonText: "Book Free Consultation",
    buttonLink: "/contact",
    notice: "Free Consultation • No Obligation",
    perks: [
      "1-on-1 Planning Meeting",
      "Talk Directly with Founders (Ashish & Rutik)",
      "Realistic 3D Decor Previews",
      "Clear & Honest Cost Estimates",
    ],
  },
  gallery: [],
  galleryHeader: {
    badge: "Wedding Photo Gallery",
    eyebrow: "OUR PHOTOS",
    title: "Wedding Photo Gallery",
    subtitle:
      "Photos of our mandap decor, flower arrangements, bridal entries, and grand wedding stages.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790881511/confianza_heroes/gallery_hero_banner.jpg",
    stats: [
      "500+ Happy Weddings Across India",
      "15+ Cities Across India",
      "100% Custom 3D Decor Designs",
      "Smooth On-Ground Execution",
    ],
  },
  galleryCategories: [
    { id: "all", name: "All Photos", slug: "all", order: 1 },
    { id: "mandap", name: "Mandap & Decor", slug: "mandap", order: 2 },
    { id: "reception", name: "Receptions", slug: "reception", order: 3 },
    { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet", order: 4 },
    { id: "bridal-entries", name: "Bridal Entries & Portraits", slug: "bridal-entries", order: 5 },
    { id: "destination", name: "Destination Weddings", slug: "destination", order: 6 },
    { id: "spatial-decor", name: "Mandap & Flower Decor", slug: "spatial-decor", order: 7 },
  ],
  galleryHighlights: [
    {
      id: "mandap-sanctum",
      title: "Mandap & Traditional Ritual Setups",
      subtitle: "Sacred Setups & Floral Art",
      description:
        "From temple pillars to lotus pools, our mandaps blend traditional Vedic rituals with fresh seasonal flowers.",
      icon: "Sparkles",
      badge: "Traditional Mandap",
    },
    {
      id: "stage-production",
      title: "Stage, Lighting & Special Effects",
      subtitle: "3D Design-to-Reality Execution",
      description:
        "Moving light setups, LED screens, cold pyro fireworks, and stages managed with precise timing.",
      icon: "Layers",
      badge: "Stage & Lights",
    },
    {
      id: "haldi-carnival",
      title: "Themed Haldi & Mehendi Setups",
      subtitle: "Bright Yellow Blooms & Traditional Art",
      description:
        "Phoolon ki Holi setups, marigold canopies, brass urlis, mehendi cabanas, and energetic dhol tasha groups.",
      icon: "Award",
      badge: "Haldi & Mehendi",
    },
    {
      id: "luxe-tablescapes",
      title: "Guest Tables & Welcome Hampers",
      subtitle: "Warm Hospitality & Personal Touches",
      description:
        "Chandeliers, candlelit centerpieces, personalized luggage tags, itinerary cards, and dedicated guest hospitality.",
      icon: "Users",
      badge: "Guest Hospitality",
    },
  ],
  galleryCta: {
    eyebrow: "LET'S PLAN YOUR SPECIAL DAY",
    headline: "Let Us Plan Your Dream Wedding",
    subtitle:
      "Connect directly with founders Ashish Wankhede and Rutik Pund in Warje, Pune to plan your wedding decor.",
    buttonText: "Book Free Consultation",
    buttonLink: "/contact",
    notice: "Free 1-on-1 Consultation • Direct Founder Interaction",
    perks: [
      "60–90 Min Planning Session",
      "Talk Directly with Founders (Ashish & Rutik)",
      "3D Decor Design Previews",
      "Clear & Honest Cost Estimates",
    ],
  },
  instagram: [],
  instagramHeader: {
    eyebrow: "Follow Our Journey",
    title: "@confianza_events on Instagram",
    subtitle:
      "Behind-the-scenes reels, live setups in Udaipur, Pune, and Goa, and daily wedding decor inspiration.",
    handle: "@confianza_events",
    followerCount: "10K+ Followers",
    url: "https://www.instagram.com/confianza_events",
  },
  testimonials: [],
  allTestimonials: [],
  testimonialsPendingCount: 0,
  testimonialsHeader: {
    badge: "Couples & Families",
    eyebrow: "Client Reviews",
    title: "What Couples & Families Say",
    subtitle:
      "Read honest feedback and reviews from couples and families whose weddings we planned.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/portfolio_hero_banner.jpg",
    stats: [
      "5.0 Average Couple Rating ★",
      "500+ Happy Weddings Across India",
      "100% On-Time Event Flow",
      "Zero Day-Of Stress for Families",
    ],
  },
  testimonialsCategories: [
    { id: "royal-destination", name: "Royal & Destination Weddings", slug: "royal-destination", order: 1 },
    { id: "mandap-rituals", name: "Mandap & Rituals", slug: "mandap-rituals", order: 2 },
    { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet", order: 3 },
    { id: "receptions", name: "Grand Receptions", slug: "receptions", order: 4 },
    { id: "video-reviews", name: "Video Reviews & Reels", slug: "video-reviews", order: 5 },
    { id: "corporate-events", name: "Corporate Celebrations", slug: "corporate-events", order: 6 },
  ],
  testimonialsExperience: [
    {
      id: "shadow-mgmt",
      title: "Personal Helpers",
      subtitle: "Dedicated Support for Bride & Groom",
      description: "A dedicated helper assists with every personal need, dress touch-ups, snacks, and water behind the scenes.",
      icon: "Users",
      badge: "Personal Care",
    },
    {
      id: "ritual-mgmt",
      title: "Smooth Pooja Coordination",
      subtitle: "Complete Pandit & Pooja Item Setup",
      description: "Complete management of traditional poojas (Baraat, Milni, Pheras, Havan) ensuring all rituals happen at the right time.",
      icon: "Sparkles",
      badge: "Traditional Rituals",
    },
    {
      id: "production-decor",
      title: "3D Decor Design & Setup",
      subtitle: "Exact Real-Life Match to 3D Previews",
      description: "From custom stage backdrops to fresh flower arrangements and lighting, everything matches your 3D design preview.",
      icon: "Layers",
      badge: "Custom 3D Decor",
    },
    {
      id: "show-runner",
      title: "On-Ground Event Direction",
      subtitle: "Smooth On-Time Stage Coordination",
      description: "Our ground team coordinates artists, DJs, sound engineers, and couple entries with clear timing.",
      icon: "Award",
      badge: "Event Direction",
    },
  ],
  testimonialsFaq: [
    {
      question: "How do I share our wedding review and photos?",
      answer: "Click the 'Share Your Story' button on this page. You can write your review, select your star rating, and upload your wedding photos directly.",
    },
    {
      question: "Can we include a video link or Instagram Reel?",
      answer: "Yes! You can paste your YouTube, Vimeo, Google Drive, or Instagram Reel link. Our team will include the video player with your review.",
    },
    {
      question: "Why does my review say 'Waiting for Approval'?",
      answer: "To ensure all reviews are genuine and appropriate, our team checks all submissions before publishing them on the website.",
    },
    {
      question: "How long does review verification take?",
      answer: "Our team usually checks and publishes new reviews within 12 to 24 hours.",
    },
  ],
  testimonialsCta: {
    badge: "Share Your Review",
    headline: "Did We Plan Your Wedding?",
    subtitle: "We would love to hear your feedback, memories, and experience with our team.",
    buttonText: "Submit Your Review",
    secondaryButtonText: "Book A Consultation",
  },
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

  const [refreshing, setRefreshing] = useState(false);

  // Fetch live site data (with fresh dynamic timestamp)
  const refreshData = useCallback(async (opts = {}) => {
    try {
      setRefreshing(true);
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
      return { success: true };
    } catch (err) {
      console.error("Failed to load site data from MongoDB API:", err);
      return { success: false, error: err };
    } finally {
      setRefreshing(false);
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
      const updatedData = {
        ...prev,
        [key]: nextVal,
      };

      // Keep both testimonials arrays in sync
      if (key === "testimonials" && Array.isArray(nextVal)) {
        updatedData.testimonials = nextVal.filter((t) => t.status === "approved" || !t.status);
        updatedData.allTestimonials = nextVal;
        updatedData.testimonialsPendingCount = nextVal.filter((t) => t.status === "pending").length;
      }

      return updatedData;
    });

    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: nextVal }),
      });
      const resJson = await res.json();

      // Trigger background synchronization so all components reflect authoritative server state
      setTimeout(() => {
        refreshData({ fresh: true, includeInquiries: true });
      }, 50);

      return resJson;
    } catch (err) {
      console.error(`Failed to persist slice ${key} to MongoDB:`, err);
      throw err;
    }
  }, [refreshData]);

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

  /** Update inquiry (status, priority, notes) in MongoDB */
  const updateMessage = useCallback(async (id, updates) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id || m._id === id) {
          return { ...m, ...updates };
        }
        return m;
      })
    );
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const resJson = await res.json();
      return resJson;
    } catch (err) {
      console.error(`Failed to update inquiry ${id}:`, err);
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
      refreshing,
      refresh: refreshData,
      refreshData,
      refreshInquiries,
      update,
      messages,
      addMessage,
      updateMessage,
      updateInquiry: updateMessage,
      removeMessage,
      theme,
      setTheme,
    }),
    [data, ready, loading, refreshing, refreshData, refreshInquiries, update, messages, addMessage, updateMessage, removeMessage, theme]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
