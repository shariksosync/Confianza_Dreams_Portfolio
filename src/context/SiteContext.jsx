"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const initialEmptyState = {
  settings: {
    brand: {
      name: "Confianza Events & Entertainment",
      short: "Confianza",
      initials: "C",
      tagline: "",
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
      { id: "portfolio", label: "Our Works / Portfolio", enabled: true },
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
    primaryCta: { label: "Call For Enquiry", href: "/contact" },
    secondaryCta: { label: "View Portfolio", href: "/portfolio" },
    images: [
      "https://res.cloudinary.com/kipl0jjw/image/upload/v1791962054/confianza_heroes/home_hero_1.jpg",
      "https://res.cloudinary.com/kipl0jjw/image/upload/v1791962055/confianza_heroes/home_hero_2.jpg",
      "https://res.cloudinary.com/kipl0jjw/image/upload/v1791962056/confianza_heroes/home_hero_3.jpg",
    ],
    floatingStats: [],
  },
  homeStory: {
    eyebrow: "Our Story & Philosophy",
    title: "A Pune Studio Devoted to Weddings That Feel Personal",
    subtitle: "Where real emotions meet beautiful design. We create unforgettable weddings made specially for you.",
    badge: "Since 2018 • Warje, Pune",
    quote: '"Every love story deserves a stage as breathtaking as the journey itself."',
    quoteAuthor: "— Ashish Wankhede, Founder",
    image: "/images/hero-1.jpg",
    feature1Title: "Pan-India Destination",
    feature1Text: "From Udaipur palatial courtyards to Goa beachside mandaps.",
    feature1Icon: "Compass",
    feature2Title: "Zero Template Policy",
    feature2Text: "Every color theme, flower setup, and schedule is made specially for you.",
    feature2Icon: "HeartHandshake",
    storyHeading: "The Confianza Story",
    storyText: "Confianza began in 2018 with one belief — a wedding should sound like the couple, not like a catalogue. What started as a two-person decor team in Warje is now a full-service house planning, designing and executing weddings across India.",
    missionLabel: "Our Mission",
    missionText: "To take the weight of planning off a family's shoulders and hand back a celebration they can be fully present for.",
    visionLabel: "Our Vision",
    visionText: "To be the most trusted and admired name in personalised luxury weddings across Maharashtra and every landmark destination we travel to.",
    pillarsHeading: "Our Three Pillars of Excellence",
    pillars: [
      {
        title: "Authentic Heritage",
        text: "Respect for sacred Maharashtrian, Marwari, and pan-Indian rituals without superficial modern shortcuts.",
      },
      {
        title: "Calm Execution",
        text: "Direct founder oversight on-ground ensuring flawless timing with zero last-minute panic.",
      },
      {
        title: "Uncompromising Aesthetic",
        text: "Spatial styling, royal chandeliers, and imported floral installations tailored exclusively for you.",
      },
    ],
    ctaLabel: "Learn More About Us & Our Team",
    ctaLink: "/about",
  },
  about: {
    heading: "",
    story: "",
    mission: "",
    vision: "",
    brandImage: "https://res.cloudinary.com/tridevsosync/image/upload/v1791533413/confianza_events/o7afgfqbzmoju31zki1x.jpg",
    brandIdentityImage: "https://res.cloudinary.com/tridevsosync/image/upload/v1791533413/confianza_events/o7afgfqbzmoju31zki1x.jpg",
    values: [],
    timeline: [],
  },
  services: [],
  serviceCategories: [],
  servicesHeader: {
    badge: "Complete Wedding Planning & Decor",
    eyebrow: "COMPLETE WEDDING PLANNING & DECOR",
    title: "Our Wedding Services",
    subtitle:
      "From first design ideas to smooth execution on your big day, every service is delivered with care and quality.",
    image: "/images/hero-1.jpg",
  },
  typeOfServices: [
    {
      id: "tos-1",
      title: "Event Management",
      description:
        "Our complete event management ensures every part of your celebration runs smoothly. We manage on-ground setup, stage schedules, sound systems, guest hospitality, vendor coordination, and team management so your family can enjoy every moment stress-free.",
      order: 1,
    },
    {
      id: "tos-2",
      title: "Event Planning",
      description:
        "Good planning is the foundation of a memorable wedding. We create detailed event schedules, manage budgets, negotiate with vendors, and design creative themes to make your celebration special from start to finish.",
      order: 2,
    },
    {
      id: "tos-3",
      title: "Decor",
      description:
        "We transform event spaces into beautiful environments. From realistic 3D designs to on-ground setup, our team creates custom mandaps, entry gates, table centerpieces, mood lighting, and grand stage backdrops.",
      order: 3,
    },
    {
      id: "tos-4",
      title: "Venue",
      description:
        "Finding the right venue sets the perfect mood for your celebration. We help you explore and book top heritage palaces, beachside resorts, private lawns, and luxury banquet halls at the best rates.",
      order: 4,
    },
    {
      id: "tos-5",
      title: "Photograph/Videography",
      description:
        "Capture your most precious wedding memories with beautiful photos and videos. Our team records candid emotions, traditional ceremonies, drone views, and highlight reels for your family to cherish forever.",
      order: 5,
    },
    {
      id: "tos-6",
      title: "Catering",
      description:
        "Delight your guests with delicious food and drinks. We organize customized menus featuring traditional regional dishes, live food counters, fresh beverage bars, and warm hospitality.",
      order: 6,
    },
    {
      id: "tos-7",
      title: "Outfits",
      description:
        "Look your best for every function. Our styling team helps you with wedding dress selection, matching colors across ceremonies, jewelry pairing, and on-day outfit assistance.",
      order: 7,
    },
  ],
  typeOfEvents: [
    {
      id: "toe-1",
      title: "Wedding",
      description:
        "From traditional wedding pheras under beautiful mandaps to grand multi-day destination weddings, we manage every ceremony and tradition smoothly with care.",
      order: 1,
    },
    {
      id: "toe-2",
      title: "Social",
      description:
        "Celebrate life's meaningful milestones with style and warmth. We design memorable family events with themed decor, great food, lively entertainment, and smooth hosting.",
      order: 2,
    },
    {
      id: "toe-3",
      title: "Sports",
      description:
        "Energetic sports events delivered with precision. We manage ground branding, audio and scoreboards, prize distributions, and guest management.",
      order: 3,
    },
    {
      id: "toe-4",
      title: "Concert",
      description:
        "Exciting live shows with high-quality sound, concert lighting, stage setups, artist management, and smooth crowd entry.",
      order: 4,
    },
    {
      id: "toe-5",
      title: "Corporate",
      description:
        "Professional event management for your business. We deliver modern audio-visual setups, stage designs, executive hospitality, and corporate award functions.",
      order: 5,
    },
    {
      id: "toe-6",
      title: "Social Gathering",
      description:
        "Bring friends and families together in welcoming settings. We arrange delicious food, warm lighting, fun games, and photo booths for get-togethers of all sizes.",
      order: 6,
    },
  ],
  ceremonies: [],
  stationery: [],
  servicesCta: {
    eyebrow: "LET'S PLAN YOUR SPECIAL DAY",
    headline: "Ready to Plan Your Wedding?",
    subtitle:
      "Book a free 60–90 minute consultation with Ashish Wankhede in Warje, Pune, or via video call.",
    buttonText: "Call For Enquiry",
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
    eyebrow: "OUR WORKS",
    title: "Our Works",
    subtitle:
      "A photo gallery of our mandap setups, flower decor, beach weddings, and grand reception stages across India.",
    image: "/images/hero-2.jpg",
    stats: ["500+ Weddings", "15+ Cities Across India", "100% On-Time Events"],
  },
  portfolioSection: {
    eyebrow: "Our Works",
    title: "Memorable Moments, Big and Small",
    subtitle:
      "Look through photos of our past weddings, from colorful haldi setups and grand stages to beautiful destination celebrations planned by Ashish Wankhede and Rutik Pund.",
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
    headline: "Let’s Plan Your Dream Wedding",
    subtitle:
      "Talk directly with Ashish Wankhede and Rutik Pund. We will help you pick a venue, show you 3D decor designs, and handle every detail from start to finish.",
    buttonText: "Call For Enquiry",
    buttonLink: "/contact",
    notice: "100% Free Consultation • No Obligation",
    perks: [
      "1-on-1 Planning Meeting with Founders (Ashish & Rutik)",
      "Realistic 3D Decor Previews Before Your Event",
      "Clear, Honest & Transparent Cost Estimates",
      "Complete Day-by-Day Event Plan",
    ],
  },
  gallery: [],
  galleryHeader: {
    badge: "Wedding Photo Gallery",
    eyebrow: "OUR PHOTOS",
    title: "Wedding Photo Gallery",
    subtitle:
      "Photos of our mandap decor, flower arrangements, bridal entries, and grand wedding stages.",
    image: "https://res.cloudinary.com/kipl0jjw/image/upload/v1791962052/confianza_heroes/gallery_hero_banner.jpg",
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
    buttonText: "Call For Enquiry",
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
    eyebrow: "Words of Gratitude",
    title: "Real Stories from Happy Families",
    subtitle:
      "See what couples and their families say about trusting Confianza to design and manage their special day.",
    image: "https://res.cloudinary.com/kipl0jjw/image/upload/v1791962068/confianza_portfolio/portfolio_hero_banner.jpg",
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
    secondaryButtonText: "Call For Enquiry",
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

  // Fetch live site data (CDN-cached for visitors, bypassable with ?fresh=true for admin)
  const refreshData = useCallback(async (opts = {}) => {
    try {
      setRefreshing(true);
      const url = opts.fresh ? `/api/site?fresh=true&t=${Date.now()}` : `/api/site?t=${Date.now()}`;
      const siteRes = await fetch(url, { cache: "no-store" });

      if (siteRes.ok) {
        const siteJson = await siteRes.json();
        if (siteJson.success && siteJson.data) {
          const rawSettings = siteJson.data.settings || {};
          const brand = { ...(rawSettings.brand || {}) };
          if (!brand.logo || brand.logo.includes("brand_logo_gold") || brand.logo.includes("confianza_brand")) {
            brand.logo = "/logo.png";
          }
          const cleanSettings = { ...rawSettings, brand };

          setData((prev) => ({
            ...prev,
            ...siteJson.data,
            about: {
              ...prev.about,
              ...(siteJson.data.about || {}),
              brandImage:
                siteJson.data.about?.brandImage ||
                siteJson.data.about?.brandIdentityImage ||
                prev.about?.brandImage ||
                "https://res.cloudinary.com/tridevsosync/image/upload/v1791533413/confianza_events/o7afgfqbzmoju31zki1x.jpg",
              brandIdentityImage:
                siteJson.data.about?.brandIdentityImage ||
                siteJson.data.about?.brandImage ||
                prev.about?.brandIdentityImage ||
                "https://res.cloudinary.com/tridevsosync/image/upload/v1791533413/confianza_events/o7afgfqbzmoju31zki1x.jpg",
            },
            settings: { ...prev.settings, ...cleanSettings },
            homeStory: { ...initialEmptyState.homeStory, ...(siteJson.data.homeStory || {}) },
            contact: { ...prev.contact, ...(siteJson.data.contact || {}) },
            servicesHeader:
              siteJson.data.servicesHeader ||
              siteJson.data.settings?.servicesHeader ||
              prev.servicesHeader,
            typeOfServices:
              Array.isArray(siteJson.data.typeOfServices) && siteJson.data.typeOfServices.length > 0
                ? siteJson.data.typeOfServices
                : Array.isArray(siteJson.data.settings?.typeOfServices) &&
                  siteJson.data.settings.typeOfServices.length > 0
                ? siteJson.data.settings.typeOfServices
                : prev.typeOfServices,
            typeOfEvents:
              Array.isArray(siteJson.data.typeOfEvents) && siteJson.data.typeOfEvents.length > 0
                ? siteJson.data.typeOfEvents
                : Array.isArray(siteJson.data.settings?.typeOfEvents) &&
                  siteJson.data.settings.typeOfEvents.length > 0
                ? siteJson.data.settings.typeOfEvents
                : prev.typeOfEvents,
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
    let nextSettings;
    setData((prev) => {
      nextVal = typeof value === "function" ? value(prev[key]) : value;
      const updatedData = {
        ...prev,
        [key]: nextVal,
      };

      // Keep settings sub-document in sync for robust persistence through SiteContent.settings
      if (key === "typeOfServices" || key === "typeOfEvents" || key === "servicesHeader") {
        updatedData.settings = {
          ...updatedData.settings,
          [key]: nextVal,
        };
        nextSettings = updatedData.settings;
      }

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

      // If updating custom slices, also persist inside settings for guaranteed retrieval across API calls
      if (nextSettings && (key === "typeOfServices" || key === "typeOfEvents" || key === "servicesHeader")) {
        try {
          await fetch("/api/site", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: "settings", value: nextSettings }),
          });
        } catch (settingsErr) {
          console.warn("Background settings sync error:", settingsErr);
        }
      }

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
