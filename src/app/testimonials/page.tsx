"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Star,
  Quote,
  MapPin,
  Calendar,
  ArrowRight,
  Plus,
  Play,
  X,
  Sparkles,
  CheckCircle2,
  Users,
  Layers,
  Award,
  Search,
  ChevronDown,
  Upload,
  Loader2,
  HelpCircle,
  Phone,
  MessageCircle,
} from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageUploadField from "@/components/ImageUploadField";
import CategoryFilterBar from "@/components/ui/CategoryFilterBar";
import { useSite } from "@/context/SiteContext";

const normalizeCategory = (str: string) =>
  (str || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "")
    .trim();

const isAllCategory = (cat: any) => {
  if (!cat) return true;
  const str = typeof cat === "string" ? cat : cat?.name || cat?.label || cat?.id || "";
  const norm = normalizeCategory(str);
  return norm === "all" || norm === "allstories" || norm === "alltestimonials" || norm === "";
};

const isCategoryMatch = (itemCategory: string, targetCategory: any) => {
  if (isAllCategory(targetCategory)) return true;
  const norm1 = normalizeCategory(itemCategory);
  const norm2 = normalizeCategory(
    typeof targetCategory === "string"
      ? targetCategory
      : targetCategory?.name || targetCategory?.label || targetCategory?.id || ""
  );
  return Boolean(norm1 && norm2 && norm1 === norm2);
};

export default function TestimonialsPage() {
  const {
    testimonials,
    testimonialsCategories,
    testimonialsHeader,
    testimonialsExperience,
    testimonialsFaq,
    testimonialsCta,
    contact,
  } = useSite() as any;

  // Header content
  const header = testimonialsHeader || {
    badge: "Couples & Families",
    eyebrow: "Client Reviews",
    title: "What Couples & Families Say",
    subtitle:
      "Read honest feedback and reviews from couples and families whose weddings we planned.",
    image:
      "https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/portfolio_hero_banner.jpg",
    stats: [
      "5.0 Average Couple Rating ★",
      "500+ Happy Weddings Across India",
      "100% On-Time Event Flow",
      "Zero Day-Of Stress for Families",
    ],
  };

  // Categories (Dynamic from MongoDB)
  const categories = Array.isArray(testimonialsCategories) && testimonialsCategories.length > 0
    ? testimonialsCategories
    : [
        { id: "royal-destination", name: "Royal & Destination Weddings" },
        { id: "mandap-rituals", name: "Mandap & Rituals" },
        { id: "haldi-sangeet", name: "Haldi & Sangeet" },
        { id: "receptions", name: "Grand Receptions" },
        { id: "video-reviews", name: "Video Reviews & Reels" },
        { id: "corporate-events", name: "Corporate Celebrations" },
      ];

  // Experience Pillars from PDF
  const experiencePillars = Array.isArray(testimonialsExperience) && testimonialsExperience.length > 0
    ? testimonialsExperience
    : [
        {
          id: "shadow-mgmt",
          title: "Personal Helpers",
          subtitle: "Dedicated Support for Bride & Groom",
          description:
            "A dedicated helper assists with every personal need, dress touch-ups, snacks, and water behind the scenes.",
          icon: "Users",
          badge: "Personal Care",
        },
        {
          id: "ritual-mgmt",
          title: "Smooth Pooja Coordination",
          subtitle: "Complete Pandit & Pooja Item Setup",
          description:
            "Complete management of traditional poojas (Baraat, Milni, Pheras, Havan) ensuring all rituals happen at the right time.",
          icon: "Sparkles",
          badge: "Traditional Rituals",
        },
        {
          id: "production-decor",
          title: "3D Decor Design & Setup",
          subtitle: "Exact Real-Life Match to 3D Previews",
          description:
            "From custom stage backdrops to fresh flower arrangements and lighting, everything matches your 3D design preview.",
          icon: "Layers",
          badge: "Custom 3D Decor",
        },
        {
          id: "show-runner",
          title: "On-Ground Event Direction",
          subtitle: "Smooth On-Time Stage Coordination",
          description:
            "Our ground team coordinates artists, DJs, sound engineers, and couple entries with clear timing.",
          icon: "Award",
          badge: "Event Direction",
        },
      ];

  // FAQ
  const faqs = Array.isArray(testimonialsFaq) && testimonialsFaq.length > 0
    ? testimonialsFaq
    : [
        {
          question: "How do I share our wedding review and photos?",
          answer:
            "Click the 'Share Your Story' button on this page. You can write your review, select your star rating, and upload your wedding photos directly.",
        },
        {
          question: "Can we include a video link or Instagram Reel?",
          answer:
            "Yes! You can paste your YouTube, Vimeo, Google Drive, or Instagram Reel link. Our team will include the video player with your review.",
        },
        {
          question: "Why does my review say 'Waiting for Approval'?",
          answer:
            "To ensure all reviews are genuine and appropriate, our team checks all submissions before publishing them on the website.",
        },
        {
          question: "How long does review verification take?",
          answer: "Our team usually checks and publishes new reviews within 12 to 24 hours.",
        },
      ];

  // CTA
  const cta = testimonialsCta || {
    badge: "Share Your Review",
    headline: "Did We Plan Your Wedding?",
    subtitle:
      "We would love to hear your feedback, memories, and experience with our team.",
    buttonText: "Submit Your Review",
    secondaryButtonText: "Call For Enquiry",
  };

  // State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Video Lightbox Modal
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Review Submission Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [relationshipSelect, setRelationshipSelect] = useState("Bride & Groom");
  const [customRelationship, setCustomRelationship] = useState("");
  const [categorySelect, setCategorySelect] = useState("Royal & Destination Weddings");
  const [customCategory, setCustomCategory] = useState("");

  const [submitForm, setSubmitForm] = useState({
    name: "",
    partnerName: "",
    rating: 5,
    location: "",
    date: "",
    text: "",
    image: "",
    videoUrl: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Filtered Testimonials
  const allApproved = useMemo(() => {
    return (testimonials || []).filter(
      (t: any) => t.status === "approved" || !t.status
    );
  }, [testimonials]);

  const filteredReviews = useMemo(() => {
    return allApproved.filter((t: any) => {
      // Category filter
      if (selectedCategory === "Video Reviews & Reels") {
        if (!t.videoUrl) return false;
      } else if (!isAllCategory(selectedCategory)) {
        if (!isCategoryMatch(t.category, selectedCategory)) {
          return false;
        }
      }

      // Rating filter
      if (selectedRating === "5-star" && (t.rating || 5) < 5) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (t.name || "").toLowerCase().includes(q);
        const locMatch = (t.location || "").toLowerCase().includes(q);
        const textMatch = (t.text || "").toLowerCase().includes(q);
        const catMatch = (t.category || "").toLowerCase().includes(q);
        if (!nameMatch && !locMatch && !textMatch && !catMatch) return false;
      }

      return true;
    });
  }, [allApproved, selectedCategory, selectedRating, searchQuery]);

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const finalRelationship =
        relationshipSelect === "Other"
          ? customRelationship.trim() || "Guest"
          : relationshipSelect;

      const finalCategory =
        categorySelect === "Other"
          ? customCategory.trim() || "Celebration"
          : categorySelect;

      const payload = {
        ...submitForm,
        relationship: finalRelationship,
        category: finalCategory,
      };

      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSubmitSuccess(true);
      setSubmitForm({
        name: "",
        partnerName: "",
        rating: 5,
        location: "",
        date: "",
        text: "",
        image: "",
        videoUrl: "",
        email: "",
      });
      setRelationshipSelect("Bride & Groom");
      setCustomRelationship("");
      setCategorySelect(categories[0]?.name || "Royal & Destination Weddings");
      setCustomCategory("");
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSubmissionModal = () => {
    setSubmitSuccess(false);
    setSubmitError("");
    setRelationshipSelect("Bride & Groom");
    setCustomRelationship("");
    setCategorySelect(categories[0]?.name || "Royal & Destination Weddings");
    setCustomCategory("");
    setIsSubmitModalOpen(true);
  };

  // Helper for Rating Sentiment
  const getRatingSentiment = (r: number) => {
    switch (r) {
      case 5:
        return "⭐ 5.0 — Absolute Perfection & Magic!";
      case 4:
        return "⭐ 4.0 — Wonderful & Memorable Experience";
      case 3:
        return "⭐ 3.0 — Great Celebration";
      case 2:
        return "⭐ 2.0 — Satisfactory";
      case 1:
        return "⭐ 1.0 — Needs Improvement";
      default:
        return "Select your star rating";
    }
  };

  // Helper to extract YouTube/Vimeo embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch")) {
      const v = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${v}?autoplay=1`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("vimeo.com/")) {
      const id = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <SiteLayout revealKey="testimonials-page">
      {/* 1. Dynamic Hero Banner */}
      <section className="relative bg-ink pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-24 text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={header.image || "https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/portfolio_hero_banner.jpg"}
            alt="Confianza Couple Stories"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-[0.65rem] sm:text-[0.68rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-secondary font-semibold backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-secondary" />
            <span>{header.badge || "Couples & Families"}</span>
          </span>

          <h1 className="mt-2.5 sm:mt-4 font-display text-3xl sm:text-5xl lg:text-6xl text-background font-normal leading-tight">
            {header.title || "Testimonials & Love Stories"}
          </h1>

          <div className="rule-gold mx-auto my-4 sm:my-5" />

          <p className="mx-auto max-w-2xl text-xs sm:text-sm lg:text-base text-background/85 font-light leading-relaxed px-2">
            {header.subtitle ||
              "Read honest feedback and reviews from couples and families whose weddings we planned."}
          </p>

          {/* Dual Action CTA Buttons in Hero */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={openSubmissionModal}
              className="btn-luxe gradient-gold text-ink font-bold shadow-luxe py-2.5 sm:py-3 px-6 sm:px-7 text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition hover:scale-105 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Share Your Story</span>
            </button>

            <a
              href={`tel:+91${contact?.phone || "7057357240"}`}
              className="btn-luxe bg-white/10 text-white border border-white/25 hover:bg-white/20 text-xs py-2.5 sm:py-3 px-6 sm:px-7 uppercase tracking-wider font-semibold transition flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
            >
              <Phone className="h-4 w-4 shrink-0 text-secondary" />
              <span>Call For Enquiry</span>
            </a>
          </div>

          {/* Dynamic Trust Metric Tags */}
          {Array.isArray(header.stats) && header.stats.length > 0 && (
            <div className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-2xl mx-auto">
              {header.stats.map((stat: string, sIdx: number) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[0.7rem] sm:text-xs text-champagne backdrop-blur-md border border-white/15 shadow-sm font-medium text-center"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                  <span>{stat}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. Trust Metrics Highlight Strip */}
      <section className="bg-primary/5 border-y border-border/80 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/60 shadow-sm">
              <div className="flex items-center justify-center gap-0.5 sm:gap-1 text-secondary mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <div className="font-display text-xl sm:text-2xl font-bold text-ink">5.0 / 5.0</div>
              <div className="text-[0.65rem] sm:text-[0.72rem] text-muted-foreground uppercase tracking-wider font-medium mt-1">
                Couple Satisfaction
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/60 shadow-sm">
              <div className="font-display text-xl sm:text-2xl font-bold text-secondary">500+</div>
              <div className="text-[0.65rem] sm:text-[0.72rem] text-muted-foreground uppercase tracking-wider font-medium mt-1">
                Weddings Managed
              </div>
              <div className="text-[0.62rem] sm:text-[0.65rem] text-primary font-medium mt-0.5">Across 15+ Cities</div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/60 shadow-sm">
              <div className="font-display text-xl sm:text-2xl font-bold text-ink">100%</div>
              <div className="text-[0.65rem] sm:text-[0.72rem] text-muted-foreground uppercase tracking-wider font-medium mt-1">
                On-Time Show Runner
              </div>
              <div className="text-[0.62rem] sm:text-[0.65rem] text-secondary font-medium mt-0.5">Live Cue Execution</div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/60 shadow-sm">
              <div className="font-display text-xl sm:text-2xl font-bold text-secondary">0%</div>
              <div className="text-[0.65rem] sm:text-[0.72rem] text-muted-foreground uppercase tracking-wider font-medium mt-1">
                Day-Of Family Stress
              </div>
              <div className="text-[0.62rem] sm:text-[0.65rem] text-primary font-medium mt-0.5">Shadow Management</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Testimonials Showcase & Filters */}
      <section className="section-pad relative bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow={header.eyebrow || "Heartfelt Reviews"}
            title="Real Weddings. Lasting Memories."
            subtitle="Discover how founders Ashish Wankhede, Rutik Pund, and our team managed every ceremony and celebration smoothly."
          />

          {/* Filter Bar & Search Toolbar */}
          <div className="mt-8 sm:mt-12 space-y-5 sm:space-y-6">
            {/* 1. Centered Search & Rating Filter Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 max-w-xl mx-auto">
              <div className="relative flex-1 min-w-[240px] sm:min-w-[280px]">
                <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search couples, venues, ceremonies..."
                  className="w-full rounded-full border border-border bg-card/70 pl-9 sm:pl-11 pr-8 py-2 sm:py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur-md shadow-xs transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="rounded-full border border-border bg-card/70 px-4 py-2 sm:py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary cursor-pointer backdrop-blur-md shadow-xs transition"
              >
                <option value="All">All Ratings (5.0 ★)</option>
                <option value="5-star">5-Star Reviews Only ★</option>
              </select>
            </div>

            {/* 2. Centered Dynamic Category Filter Bar (4 Front Pills + Luxury Dropdown) */}
            <div className="w-full">
              <CategoryFilterBar
                items={allApproved}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat: string) => setSelectedCategory(cat)}
                allLabel="All Stories"
                maxFrontCategories={3}
                dropdownLabel="More Categories"
                className="justify-center"
                getItemCount={(cat: any, itms: any[]) => {
                  if (isAllCategory(cat)) return itms.length;
                  const catName = typeof cat === "string" ? cat : cat.name || cat.label || cat.id || "";
                  if (catName === "Video Reviews & Reels") {
                    return itms.filter((t: any) => t.videoUrl).length;
                  }
                  return itms.filter((t: any) => isCategoryMatch(t.category, catName)).length;
                }}
              />
            </div>
          </div>

          {/* Testimonials Grid */}
          {filteredReviews.length > 0 ? (
            <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredReviews.map((rev: any, idx: number) => {
                const hasVideo = Boolean(rev.videoUrl);

                return (
                  <div
                    key={rev.id || idx}
                    className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-border flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe group relative overflow-hidden"
                  >
                    {/* Top Section */}
                    <div>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-secondary text-secondary transition-transform group-hover:scale-110"
                            />
                          ))}
                        </div>

                        {hasVideo ? (
                          <button
                            type="button"
                            onClick={() => setActiveVideoUrl(rev.videoUrl)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full gradient-gold text-ink text-[0.62rem] sm:text-[0.65rem] font-bold shadow-sm hover:scale-105 transition cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-ink" />
                            <span>Video Story</span>
                          </button>
                        ) : (
                          <Quote className="h-6 w-6 sm:h-7 sm:w-7 text-primary/20" />
                        )}
                      </div>

                      {rev.category && (
                        <span className="inline-block text-[0.62rem] sm:text-[0.65rem] uppercase tracking-wider text-primary font-semibold mb-2 bg-primary/10 px-2.5 py-0.5 rounded-md">
                          {rev.category}
                        </span>
                      )}

                      <p className="text-xs sm:text-sm lg:text-base leading-relaxed text-foreground/85 italic">
                        "{rev.text}"
                      </p>
                    </div>

                    {/* Bottom Reviewer Footer */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 sm:gap-3.5">
                        <div className="relative">
                          <img
                            src={rev.image || "https://res.cloudinary.com/tridevsosync/image/upload/v1790838237/confianza_portfolio/testimonial_ananya_rohit_roy.jpg"}
                            alt={rev.name}
                            className="h-11 w-11 sm:h-13 sm:w-13 rounded-full object-cover ring-2 ring-secondary/60 shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://res.cloudinary.com/tridevsosync/image/upload/v1790838237/confianza_portfolio/testimonial_ananya_rohit_roy.jpg";
                            }}
                          />
                          {hasVideo && (
                            <button
                              type="button"
                              onClick={() => setActiveVideoUrl(rev.videoUrl)}
                              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full gradient-gold flex items-center justify-center shadow-md text-ink hover:scale-110 transition"
                              title="Play Video"
                            >
                              <Play className="h-2.5 w-2.5 fill-ink" />
                            </button>
                          )}
                        </div>

                        <div>
                          <h4 className="font-display text-sm sm:text-base font-bold text-ink leading-tight">
                            {rev.name}
                          </h4>
                          <span className="text-[0.65rem] sm:text-[0.68rem] text-primary font-medium block">
                            {rev.relationship || "Bride & Groom"}
                          </span>
                          <div className="flex items-center gap-2 text-[0.62rem] sm:text-[0.65rem] text-muted-foreground mt-0.5">
                            {rev.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-secondary" />
                                {rev.location}
                              </span>
                            )}
                            {rev.date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {rev.date}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-12 sm:mt-16 text-center py-12 sm:py-16 px-4 sm:px-6 rounded-2xl sm:rounded-3xl bg-card/40 border border-dashed border-border max-w-xl mx-auto space-y-4">
              <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-secondary/40 mx-auto" />
              <h3 className="font-display text-lg sm:text-xl text-ink font-semibold">
                {allApproved.length === 0 ? "0 Testimonials in Database" : "No Matching Stories"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {allApproved.length === 0
                  ? "Be the first couple or guest to share your magical celebration with Confianza!"
                  : "No testimonials matched the selected category or search filters."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {(!isAllCategory(selectedCategory) || selectedRating !== "All" || searchQuery.trim()) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedRating("All");
                      setSearchQuery("");
                    }}
                    className="px-4 sm:px-5 py-2 rounded-full border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={openSubmissionModal}
                  className="btn-luxe gradient-gold text-ink text-xs font-bold py-2.5 px-5 sm:px-6 rounded-full cursor-pointer shadow-sm"
                >
                  + Submit Your Love Story
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. "The Confianza Care Experience" Service Pillars (From PDF) */}
      <section className="section-pad bg-ink text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-ink to-ink pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-secondary font-bold">
              Why Couples Choose Confianza
            </span>
            <h2 className="mt-2.5 sm:mt-3 font-display text-2xl sm:text-3xl lg:text-4xl text-background font-normal leading-tight">
              Our Wedding Day Care
            </h2>
            <div className="rule-gold mx-auto my-3 sm:my-4" />
            <p className="text-xs sm:text-sm text-background/80 font-light leading-relaxed px-2">
              Here is how our team makes sure your celebration is smooth and stress-free for your entire family.
            </p>
          </div>

          <div className="mt-10 sm:mt-14 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {experiencePillars.map((pillar: any, pIdx: number) => {
              const IconComp =
                pillar.icon === "Users"
                  ? Users
                  : pillar.icon === "Sparkles"
                  ? Sparkles
                  : pillar.icon === "Layers"
                  ? Layers
                  : Award;

              return (
                <div
                  key={pillar.id || pIdx}
                  className="rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:border-secondary/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                        <IconComp className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                      </div>
                      <span className="text-[0.62rem] sm:text-[0.65rem] text-secondary font-mono uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                        {pillar.badge || "Core Standard"}
                      </span>
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-white pt-1">
                      {pillar.title}
                    </h3>
                    <p className="text-[0.68rem] sm:text-[0.72rem] text-secondary/90 font-medium">
                      {pillar.subtitle}
                    </p>
                    <p className="text-xs text-background/75 leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Review Submission FAQ Accordion */}
      <section className="section-pad bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="Review Guidelines"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about sharing your love story, wedding teaser video, and memories."
          />

          <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
            {faqs.map((faq: any, fIdx: number) => {
              const isOpen = activeFaq === fIdx;

              return (
                <div
                  key={fIdx}
                  className="rounded-xl sm:rounded-2xl border border-border bg-card overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : fIdx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 sm:gap-4 cursor-pointer"
                  >
                    <span className="font-display text-sm sm:text-base font-semibold text-ink leading-snug">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-primary shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-secondary" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Bottom Consultation & Submission CTA */}
      <section className="bg-ink py-14 sm:py-20 text-center text-background relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-primary/30 via-ink to-ink pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 space-y-4 sm:space-y-5">
          <span className="text-[0.65rem] sm:text-[0.68rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-secondary font-bold">
            {cta.badge || "Share Your Love Story"}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-background font-normal leading-tight">
            {cta.headline || "Were You A Confianza Couple or Guest?"}
          </h2>
          <div className="rule-gold mx-auto my-3" />
          <p className="text-xs sm:text-sm text-background/80 font-light leading-relaxed max-w-xl mx-auto px-2">
            {cta.subtitle ||
              "We would love to hear your memories, candid moments, and reflections of your celebration."}
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={openSubmissionModal}
              className="btn-luxe gradient-gold text-ink font-bold shadow-luxe py-2.5 sm:py-3 px-6 sm:px-8 text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition hover:scale-105 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>{cta.buttonText || "Submit Your Love Story"}</span>
            </button>

            <a
              href={`tel:+91${contact?.phone || "7057357240"}`}
              className="btn-luxe bg-white/10 text-white border border-white/25 hover:bg-white/20 text-xs py-2.5 sm:py-3 px-6 sm:px-8 uppercase tracking-wider font-semibold flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
            >
              <Phone className="h-4 w-4 shrink-0 text-secondary" />
              <span>
                {(!cta.secondaryButtonText || cta.secondaryButtonText.toLowerCase().includes("consultation") || cta.secondaryButtonText.toLowerCase().includes("book"))
                  ? "Call For Enquiry"
                  : cta.secondaryButtonText}
              </span>
            </a>
          </div>

          {/* Direct Founders Contact Strip */}
          <div className="pt-5 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-champagne/80 font-light text-center">
            <a
              href="tel:7057357240"
              className="flex items-center justify-center gap-1.5 hover:text-secondary transition"
            >
              <Phone className="h-3.5 w-3.5 text-secondary shrink-0" />
              <span>Ashish Wankhede: +91 7057357240</span>
            </a>
            <a
              href="https://wa.me/917057357240"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 hover:text-secondary transition text-[#25D366]"
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
              <span>WhatsApp Us Directly</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* 8. INTERACTIVE REVIEW SUBMISSION MODAL */}
      {/* ============================================================= */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
          <div className="glass-card max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-border shadow-2xl space-y-4 bg-card">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[0.62rem] sm:text-[0.65rem] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-secondary font-bold flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-secondary shrink-0" /> Confianza Couple Community
                </span>
                <h3 className="font-display text-lg sm:text-xl text-ink font-bold mt-0.5">
                  Share Your Wedding Story
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-muted cursor-pointer transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-6 sm:py-8 text-center space-y-3 sm:space-y-4">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full gradient-royal mx-auto flex items-center justify-center shadow-luxe">
                  <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-secondary" />
                </div>
                <h4 className="font-display text-xl sm:text-2xl text-ink font-bold">
                  Thank You for Sharing Your Story!
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Your heartfelt review has been sent to our editorial team for verification. Once approved, your review, photo, and video will be featured proudly on the Confianza website!
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-8 rounded-full cursor-pointer shadow-md"
                >
                  Close &amp; Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3.5 sm:space-y-4">
                {submitError && (
                  <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-xs text-destructive text-center font-medium">
                    {submitError}
                  </div>
                )}

                {/* Interactive Star Rating Selector with Effects */}
                <div className="rounded-2xl bg-muted/40 p-3.5 sm:p-4 border border-border text-center space-y-1.5 sm:space-y-2">
                  <label className="text-xs font-semibold text-foreground block">
                    Your Overall Experience Rating (0 to 5 Stars)
                  </label>

                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const activeVal = hoverRating !== null ? hoverRating : submitForm.rating;
                      const isFilled = star <= activeVal;

                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setSubmitForm({ ...submitForm, rating: star })}
                          className="p-1 cursor-pointer transition-all duration-200 transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 sm:h-8 sm:w-8 transition-colors ${
                              isFilled
                                ? "fill-secondary text-secondary drop-shadow-[0_0_8px_rgba(201,162,39,0.5)]"
                                : "text-muted-foreground/40"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[0.7rem] sm:text-xs font-semibold text-primary transition-all">
                    {getRatingSentiment(hoverRating !== null ? hoverRating : submitForm.rating)}
                  </p>
                </div>

                {/* Reviewer Details */}
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Your Name / Couple Names *
                    </label>
                    <input
                      type="text"
                      required
                      value={submitForm.name}
                      onChange={(e) => setSubmitForm({ ...submitForm, name: e.target.value })}
                      placeholder="e.g. Ananya &amp; Rohit Roy"
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Relationship / Role
                    </label>
                    <select
                      value={relationshipSelect}
                      onChange={(e) => setRelationshipSelect(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs cursor-pointer"
                    >
                      <option value="Bride &amp; Groom">Bride &amp; Groom</option>
                      <option value="Parents of the Bride">Parents of the Bride</option>
                      <option value="Parents of the Groom">Parents of the Groom</option>
                      <option value="Family Member / Relative">Family Member / Relative</option>
                      <option value="Wedding Guest">Wedding Guest</option>
                      <option value="Corporate Host">Corporate Host</option>
                      <option value="Other">Other</option>
                    </select>
                    {relationshipSelect === "Other" && (
                      <div className="mt-2 animate-fade-in">
                        <input
                          type="text"
                          required
                          value={customRelationship}
                          onChange={(e) => setCustomRelationship(e.target.value)}
                          placeholder="e.g. Sister of the Bride, Family Friend, Groom's Cousin"
                          className="w-full rounded-xl border border-secondary/60 bg-card px-3.5 py-2 text-xs focus:border-secondary focus:outline-none ring-1 ring-secondary/20"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Event Category
                    </label>
                    <select
                      value={categorySelect}
                      onChange={(e) => setCategorySelect(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs cursor-pointer"
                    >
                      {categories.map((c: any) => {
                        const name = typeof c === "string" ? c : c.name;
                        return (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Venue / Destination City
                    </label>
                    <input
                      type="text"
                      value={submitForm.location}
                      onChange={(e) => setSubmitForm({ ...submitForm, location: e.target.value })}
                      placeholder="e.g. Udaipur, Rajasthan"
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* Love Story Text */}
                <div className="text-xs">
                  <label className="font-semibold text-foreground block mb-1">
                    Your Love Story &amp; Confianza Experience *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={submitForm.text}
                    onChange={(e) => setSubmitForm({ ...submitForm, text: e.target.value })}
                    placeholder="Tell us about the decor, ritual management, shadow coordinator, music, or overall vibe..."
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs leading-relaxed"
                  />
                </div>

                {/* Photo Upload to Cloudinary */}
                <ImageUploadField
                  label="Couple / Celebration Photograph"
                  description="Upload a photo of you and your partner or the wedding decor."
                  value={submitForm.image}
                  onChange={(url) => setSubmitForm({ ...submitForm, image: url })}
                />

                {/* Video Link Option */}
                <div className="text-xs">
                  <label className="font-semibold text-foreground block mb-1">
                    Video Testimonial / Reel Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={submitForm.videoUrl}
                    onChange={(e) => setSubmitForm({ ...submitForm, videoUrl: e.target.value })}
                    placeholder="e.g. https://www.youtube.com/watch?v=... or Vimeo/Reel link"
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-mono"
                  />
                  <span className="text-[0.62rem] sm:text-[0.65rem] text-muted-foreground mt-0.5 block">
                    Supported: YouTube, Vimeo, Instagram Reels, Google Drive video.
                  </span>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-full border text-xs cursor-pointer hover:bg-muted text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-6 rounded-full cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                        <span>Submitting Story...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-secondary" />
                        <span>Submit for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 9. VIDEO LIGHTBOX MODAL */}
      {/* ============================================================= */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-3 sm:p-4 animate-fade-in">
          <div className="relative max-w-3xl w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <button
              type="button"
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-ink/80 text-white flex items-center justify-center hover:bg-ink transition cursor-pointer"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {activeVideoUrl.includes("youtube.com") ||
            activeVideoUrl.includes("youtu.be") ||
            activeVideoUrl.includes("vimeo.com") ? (
              <iframe
                src={getEmbedUrl(activeVideoUrl) || ""}
                title="Wedding Story Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ) : (
              <video
                src={activeVideoUrl}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
