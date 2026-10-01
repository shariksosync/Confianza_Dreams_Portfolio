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
  portfolioHeader: {
    badge: "500+ Stories & Counting",
    eyebrow: "OUR SIGNATURE WORKS",
    title: "The Wedding Portfolio",
    subtitle:
      "A curated gallery of our mandap concepts, floral installations, destination beach setups, and grand reception stages created across India.",
    image: "/images/hero-2.jpg",
    stats: ["500+ Weddings", "15+ Cities Across India", "100% On-Time Cue Execution"],
  },
  portfolioSection: {
    eyebrow: "Our Signature Works",
    title: "Moments of Grandeur & Intimacy",
    subtitle:
      "Explore a curated portfolio of mandaps, opulent ballrooms, sunny haldi courtyards, and destination weddings executed across India.",
  },
  portfolioCategories: [
    { id: "destination", name: "Destination Weddings", slug: "destination", order: 1 },
    { id: "mandap", name: "Mandap & Rituals", slug: "mandap", order: 2 },
    { id: "haldi", name: "Haldi & Mehendi", slug: "haldi", order: 3 },
    { id: "reception", name: "Opulent Receptions", slug: "reception", order: 4 },
    { id: "floral", name: "Floral & Spatial Decor", slug: "floral", order: 5 },
    { id: "sangeet", name: "Sangeet & Stage", slug: "sangeet", order: 6 },
    { id: "hospitality", name: "Hospitality & Suites", slug: "hospitality", order: 7 },
  ],
  portfolioCta: {
    eyebrow: "WHERE WEDDINGS BECOME STORIES",
    headline: "Want Your Wedding to Be Our Next Masterpiece?",
    subtitle:
      "Connect directly with Ashish Wankhede and Rutik Pund to review your venue options, custom 3D decor concepts, and complete management timeline.",
    buttonText: "Book Your Free Consultation",
    buttonLink: "/contact",
    notice: "Free Consultation • No Obligation",
    perks: [
      "Personalized 1-on-1 Vision Mapping",
      "Direct Founder Interaction (Ashish & Rutik)",
      "Realistic 3D Decor CAD Renderings",
      "Clear & Transparent Line-Item Estimates",
    ],
  },
  gallery: [],
  galleryHeader: {
    badge: "Curated Visual Archive",
    eyebrow: "VISUAL INSPIRATIONS",
    title: "The Wedding Gallery",
    subtitle:
      "Immerse yourself in close-up details of floral centerpieces, bridal entries, fairy-lit courtyards, and grand lavender stages.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790881511/confianza_heroes/gallery_hero_banner.jpg",
    stats: [
      "500+ Celebrations Across India",
      "15+ Landmark Destination Cities",
      "100% 3D CAD-to-Reality Fidelity",
      "Zero-Glitch Stage Execution",
    ],
  },
  galleryCategories: [
    { id: "all", name: "All Archives", slug: "all", order: 1 },
    { id: "mandap", name: "Mandap Architecture", slug: "mandap", order: 2 },
    { id: "reception", name: "Opulent Receptions", slug: "reception", order: 3 },
    { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet", order: 4 },
    { id: "bridal-entries", name: "Bridal Entries & Portraits", slug: "bridal-entries", order: 5 },
    { id: "destination", name: "Destination Venues", slug: "destination", order: 6 },
    { id: "spatial-decor", name: "Spatial Decor & Floral Art", slug: "spatial-decor", order: 7 },
  ],
  galleryHighlights: [
    {
      id: "mandap-sanctum",
      title: "Mandap Architecture & Vedic Sanctums",
      subtitle: "Auspicious Engineering & Floral Art",
      description:
        "From custom temple pillars to floating lotus pools, our mandaps blend sacred Vedic geometry with opulent seasonal florals.",
      icon: "Sparkles",
      badge: "Vedic Precision",
    },
    {
      id: "stage-production",
      title: "Stage, Lighting & SFX Production",
      subtitle: "3D CAD-to-Reality Fidelity",
      description:
        "Intelligent moving beam arrays, high-resolution curved LED walls, cold pyrotechnics, and hydraulic stages managed with millisecond cues.",
      icon: "Layers",
      badge: "Show Runner Direct",
    },
    {
      id: "haldi-carnival",
      title: "Themed Haldi & Mehendi Carnivals",
      subtitle: "Joyous Yellow Blooms & Folk Artistry",
      description:
        "Phoolon ki Holi setups, handcrafted marigold canopies, brass urlis, artisanal mehendi cabanas, and energetic dhol tasha troupes.",
      icon: "Award",
      badge: "Cultural Extravaganza",
    },
    {
      id: "luxe-tablescapes",
      title: "Luxe Tablescapes & Hospitality Styling",
      subtitle: "Intimate Ambiance & Event Branding",
      description:
        "Crystal chandeliers, candlelit floral centerpieces, customized luggage tags, itinerary jackets, and dedicated guest concierge suites.",
      icon: "Users",
      badge: "Concierge Elegance",
    },
  ],
  galleryCta: {
    eyebrow: "WHERE WEDDINGS BECOME STORIES",
    headline: "Envision Your Wedding in Our Visual Chronicle",
    subtitle:
      "Connect directly with founders Ashish Wankhede and Rutik Pund in Warje, Pune to design your bespoke 3D CAD wedding decor.",
    buttonText: "Book Your Free Consultation",
    buttonLink: "/contact",
    notice: "Free 1-on-1 Consultation • Direct Founder Interaction",
    perks: [
      "60–90 Min Vision & Budget Mapping",
      "Direct Founder Interaction (Ashish & Rutik)",
      "3D Spatial CAD Concept Previews",
      "Clear Line-Item Vendor Estimates",
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
    eyebrow: "Words of Gratitude",
    title: "Stories of Love, Captured Forever",
    subtitle:
      "Read first-hand accounts of couples and families who entrusted their most sacred wedding milestones to Confianza's aesthetic vision and care.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/portfolio_hero_banner.jpg",
    stats: [
      "5.0 Average Couple Rating ★",
      "500+ Celebrations Across India",
      "100% On-Time Cue Execution",
      "0% Day-Of Stress with Shadow Management",
    ],
  },
  testimonialsCategories: [
    { id: "royal-destination", name: "Royal & Destination Weddings", slug: "royal-destination", order: 1 },
    { id: "mandap-rituals", name: "Mandap & Rituals", slug: "mandap-rituals", order: 2 },
    { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet", order: 3 },
    { id: "receptions", name: "Opulent Receptions", slug: "receptions", order: 4 },
    { id: "video-reviews", name: "Video Reviews & Reels", slug: "video-reviews", order: 5 },
    { id: "corporate-events", name: "Corporate Celebrations", slug: "corporate-events", order: 6 },
  ],
  testimonialsExperience: [
    {
      id: "shadow-mgmt",
      title: "Shadow Management",
      subtitle: "Dedicated Bride & Groom Liaison",
      description: "A personal shadow coordinator attends to every personal need, attire touch-up, refreshment, and family coordination behind the scenes.",
      icon: "Users",
      badge: "Signature Care",
    },
    {
      id: "ritual-mgmt",
      title: "Sacred Ritual Coordination",
      subtitle: "Flawless Pandit & Samagri Prep",
      description: "Complete management of traditional Vedic rituals (Baraat, Milni, Saptapadi, Havan) ensuring exact customs and priest requirements are honored.",
      icon: "Sparkles",
      badge: "Cultural Precision",
    },
    {
      id: "production-decor",
      title: "3D CAD Decor & Production",
      subtitle: "100% Design-to-Reality Fidelity",
      description: "From custom stage carpentry to imported floral conditioning and ambient warm lighting, every spatial element matches the 3D CAD design.",
      icon: "Layers",
      badge: "Spatial Artistry",
    },
    {
      id: "show-runner",
      title: "Show Runner Timeline Execution",
      subtitle: "Zero-Glitch Stage Management",
      description: "The Show Runner acts as the single point-of-contact for artists, DJs, sound technicians, and entry pyrotechnics with millisecond timing.",
      icon: "Award",
      badge: "Live Direction",
    },
  ],
  testimonialsFaq: [
    {
      question: "How do I submit our wedding review and photographs?",
      answer: "Click the 'Share Your Love Story' button on this page. You can share your story, select your star rating, and upload your high-resolution wedding photos directly from your phone or computer.",
    },
    {
      question: "Can we include our cinematic wedding teaser or Instagram Reel?",
      answer: "Yes! You can paste your YouTube, Vimeo, Google Drive, or Instagram Reel link in the video link field. Our team will feature the interactive video player on your review card.",
    },
    {
      question: "Why does my review say 'Awaiting Admin Moderation'?",
      answer: "To protect client privacy and ensure genuine testimonials, all public submissions are reviewed and verified by Ashish Wankhede & the Confianza editorial team before going live.",
    },
    {
      question: "How long does review verification take?",
      answer: "Our team typically verifies and publishes new couple stories within 12 to 24 hours.",
    },
  ],
  testimonialsCta: {
    badge: "Share Your Love Story",
    headline: "Were You A Confianza Couple or Guest?",
    subtitle: "We would love to hear your memories, candid moments, and reflections of your celebration.",
    buttonText: "Submit Your Love Story",
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
      removeMessage,
      theme,
      setTheme,
    }),
    [data, ready, loading, refreshing, refreshData, refreshInquiries, update, messages, addMessage, removeMessage, theme]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
