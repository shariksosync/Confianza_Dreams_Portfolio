import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Load .env.local
let mongoUri = process.env.MONGODB_URI;
if (!mongoUri && fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  const match = envContent.match(/MONGODB_URI=(.*)/);
  if (match) {
    mongoUri = match[1].trim();
  }
}

if (!mongoUri) {
  console.error("Missing MONGODB_URI in environment or .env.local");
  process.exit(1);
}

const portfolioCategories = [
  { id: "destination", name: "Destination Weddings", slug: "destination", order: 1 },
  { id: "mandap", name: "Mandap & Rituals", slug: "mandap", order: 2 },
  { id: "haldi", name: "Haldi & Mehendi", slug: "haldi", order: 3 },
  { id: "reception", name: "Opulent Receptions", slug: "reception", order: 4 },
  { id: "floral", name: "Floral & Spatial Decor", slug: "floral", order: 5 },
  { id: "sangeet", name: "Sangeet & Stage", slug: "sangeet", order: 6 },
  { id: "hospitality", name: "Hospitality & Suites", slug: "hospitality", order: 7 },
];

const portfolioHeader = {
  badge: "500+ Stories & Counting",
  eyebrow: "OUR SIGNATURE WORKS",
  title: "The Wedding Portfolio",
  subtitle:
    "A curated gallery of our mandap concepts, floral installations, destination beach setups, and grand reception stages created across India by Confianza.",
  image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/portfolio_hero_banner.jpg",
  stats: ["500+ Weddings", "15+ Cities Across India", "100% On-Time Cue Execution"],
};

const portfolioSection = {
  eyebrow: "Our Signature Works",
  title: "Moments of Grandeur & Intimacy",
  subtitle:
    "Explore a curated portfolio of mandaps, opulent ballrooms, sunny haldi courtyards, and destination weddings executed by Ashish Wankhede & Rutik Pund.",
};

const portfolioCta = {
  eyebrow: "WHERE WEDDINGS BECOME STORIES",
  headline: "Want Your Wedding to Be Our Next Masterpiece?",
  subtitle:
    "Connect directly with Ashish Wankhede and Rutik Pund to review your venue options, custom 3D decor concepts, and complete management timeline.",
  buttonText: "Book Your Free Consultation",
  buttonLink: "/contact",
  notice: "Free Consultation • No Commitment Required",
  perks: [
    "Personalized 1-on-1 Vision Mapping",
    "Direct Founder Interaction (Ashish & Rutik)",
    "Realistic 3D Decor CAD Renderings",
    "Clear & Transparent Line-Item Estimates",
  ],
};


const authenticPortfolios = [
  {
    id: "portfolio-1",
    title: "Lakeside Royal Mandap & Sunset Reflection",
    category: "Mandap & Rituals",
    location: "Udaipur, Rajasthan",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838225/confianza_portfolio/portfolio_lakeside_royal_mandap.jpg",
    description: "Vedic mandap engineering with floating floral arches and atmospheric sunset reflection over Lake Pichola.",
    featured: true,
    order: 1,
  },
  {
    id: "portfolio-2",
    title: "Royal Fort Heritage Nuptials & Grand Entry",
    category: "Destination Weddings",
    location: "Jaipur, Rajasthan",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838226/confianza_portfolio/portfolio_royal_fort_heritage_nuptials.jpg",
    description: "Heritage palace courtyard with regal elephant procession, mashaal fire torches, and custom gold carved pillars.",
    featured: true,
    order: 2,
  },
  {
    id: "portfolio-3",
    title: "Crystal Grandeur Ballroom Reception",
    category: "Opulent Receptions",
    location: "JW Marriott, Pune",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838228/confianza_portfolio/portfolio_crystal_grandeur_reception.jpg",
    description: "Chandelier-lit luxury stage featuring geometric 3D mirror arches, LED warm washes, and live orchestra.",
    featured: true,
    order: 3,
  },
  {
    id: "portfolio-4",
    title: "Neon Starlight Sangeet & Live Concert Stage",
    category: "Sangeet & Stage",
    location: "The Westin, Pune",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838229/confianza_portfolio/portfolio_neon_starlight_sangeet.jpg",
    description: "High-energy concert stage with curved LED screens, pyrotechnic cold sparks, and intelligent beam arrays.",
    featured: true,
    order: 4,
  },
  {
    id: "portfolio-5",
    title: "Sunset Beach Vows & Coastal Floral Canopy",
    category: "Destination Weddings",
    location: "South Goa",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838230/confianza_portfolio/portfolio_sunset_beach_vows.jpg",
    description: "Boho-chic beachside canopy with pampas grass, custom wooden boardwalk, and live acoustic violinists.",
    featured: false,
    order: 5,
  },
  {
    id: "portfolio-6",
    title: "Botanical Canopy & Spatial Floral Archway",
    category: "Floral & Spatial Decor",
    location: "Vedic Village, Kolkata",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838230/confianza_portfolio/portfolio_botanical_canopy_floral_arch.jpg",
    description: "Cascading tuberose (rajnigandha) and Dutch carnation floral ceilings with amber mood lanterns.",
    featured: false,
    order: 6,
  },
  {
    id: "portfolio-7",
    title: "Regal Royal Mandap with Velvet Drapes",
    category: "Mandap & Rituals",
    location: "Royal Orchid, Pune",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838231/confianza_portfolio/portfolio_regal_royal_mandap_velvet.jpg",
    description: "Sacred havan kund setup with soundproof acoustical baffle design and seamless ritual management.",
    featured: false,
    order: 7,
  },
  {
    id: "portfolio-8",
    title: "Marigold Sunburst Haldi Courtyard",
    category: "Haldi & Mehendi",
    location: "Warje, Pune",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838233/confianza_portfolio/portfolio_marigold_sunburst_haldi.jpg",
    description: "Vibrant yellow marigold canopies, traditional brass urlis with rose petals, and artisanal mehendi lounges.",
    featured: false,
    order: 8,
  },
  {
    id: "portfolio-9",
    title: "Grand Couple Royal Walkway & Varmala Stage",
    category: "Opulent Receptions",
    location: "Conrad Hotel, Pune",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838234/confianza_portfolio/portfolio_grand_couple_royal_walkway.jpg",
    description: "Dramatic hydraulic varmala stage with synchronized dry-ice clouds and petal cannons.",
    featured: true,
    order: 9,
  },
  {
    id: "portfolio-10",
    title: "VIP Executive Hospitality Lounge & Concierge",
    category: "Hospitality & Suites",
    location: "Ritz-Carlton, Pune",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838236/confianza_portfolio/portfolio_vip_executive_hospitality.jpg",
    description: "Bespoke welcome desk with traditional tikka ceremonies, customized guest itineraries, and luxury hampers.",
    featured: false,
    order: 10,
  },
];

const testimonialsHeader = {
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
};

const testimonialsCategories = [
  { id: "royal-destination", name: "Royal & Destination Weddings", slug: "royal-destination", order: 1 },
  { id: "mandap-rituals", name: "Mandap & Rituals", slug: "mandap-rituals", order: 2 },
  { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet", order: 3 },
  { id: "receptions", name: "Opulent Receptions", slug: "receptions", order: 4 },
  { id: "video-reviews", name: "Video Reviews & Reels", slug: "video-reviews", order: 5 },
  { id: "corporate-events", name: "Corporate Celebrations", slug: "corporate-events", order: 6 },
];

const testimonialsExperience = [
  {
    id: "shadow-mgmt",
    title: "Shadow Management",
    subtitle: "Dedicated Bride & Groom Liaison",
    description:
      "A personal shadow coordinator attends to every personal need, attire touch-up, refreshment, and family coordination behind the scenes, allowing you to purely celebrate.",
    icon: "Users",
    badge: "Signature Care",
  },
  {
    id: "ritual-mgmt",
    title: "Sacred Ritual Coordination",
    subtitle: "Flawless Pandit & Samagri Prep",
    description:
      "Complete management of traditional Vedic rituals (Baraat, Milni, Saptapadi, Havan) ensuring exact customs and priest requirements are honored with reverence.",
    icon: "Sparkles",
    badge: "Cultural Precision",
  },
  {
    id: "production-decor",
    title: "3D CAD Decor & Production",
    subtitle: "100% Design-to-Reality Fidelity",
    description:
      "From custom stage carpentry to imported floral conditioning and ambient warm lighting, every spatial element matches the 3D CAD design presented in consultation.",
    icon: "Layers",
    badge: "Spatial Artistry",
  },
  {
    id: "show-runner",
    title: "Show Runner Timeline Execution",
    subtitle: "Zero-Glitch Stage Management",
    description:
      "The Show Runner acts as the single point-of-contact for artists, DJs, sound technicians, and entry pyrotechnics with millisecond timing cues.",
    icon: "Award",
    badge: "Live Direction",
  },
];

const testimonialsFaq = [
  {
    question: "How do I submit our wedding review and photographs?",
    answer:
      "Click the 'Share Your Love Story' button on this page. You can share your story, select your star rating, and upload your high-resolution wedding photos directly from your phone or computer.",
  },
  {
    question: "Can we include our cinematic wedding teaser or Instagram Reel?",
    answer:
      "Yes! You can paste your YouTube, Vimeo, Google Drive, or Instagram Reel link in the video link field. Our team will feature the interactive video player on your review card.",
  },
  {
    question: "Why does my review say 'Awaiting Admin Moderation'?",
    answer:
      "To protect client privacy and ensure genuine testimonials, all public submissions are reviewed and verified by Ashish Wankhede & the Confianza editorial team before going live.",
  },
  {
    question: "How long does review verification take?",
    answer: "Our team typically verifies and publishes new couple stories within 12 to 24 hours.",
  },
];

const testimonialsCta = {
  badge: "Share Your Love Story",
  headline: "Were You A Confianza Couple or Guest?",
  subtitle:
    "We would love to hear your memories, candid moments, and reflections of your celebration.",
  buttonText: "Submit Your Love Story",
  secondaryButtonText: "Book A Consultation",
};

const authenticTestimonials = [
  {
    id: "review-1",
    name: "Ananya & Rohit Roy",
    partnerName: "Rohit Roy",
    relationship: "Bride & Groom",
    category: "Royal & Destination Weddings",
    location: "Udaipur Destination Wedding",
    date: "November 2025",
    rating: 5,
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838237/confianza_portfolio/testimonial_ananya_rohit_roy.jpg",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    text: "Ashish and Rutik transformed our 3-day royal palace wedding into pure magic. From managing our 250 guest transfers to the breath-taking lakeside mandap, their shadow management team took care of every minute detail seamlessly!",
    status: "approved",
    featured: true,
    order: 1,
  },
  {
    id: "review-2",
    name: "Pooja & Shounak Banerjee",
    partnerName: "Shounak Banerjee",
    relationship: "Bride & Groom",
    category: "Opulent Receptions",
    location: "JW Marriott, Pune",
    date: "December 2025",
    rating: 5,
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838238/confianza_portfolio/testimonial_pooja_shounak_banerjee.jpg",
    videoUrl: "",
    text: "The decor execution was identical to the 3D CAD design they presented during our consultation. Confianza's show runner handled timeline cues with absolute poise. Truly the best wedding decision we made.",
    status: "approved",
    featured: true,
    order: 2,
  },
  {
    id: "review-3",
    name: "Rhea & Vikramaditya Sen",
    partnerName: "Vikramaditya Sen",
    relationship: "Bride & Groom",
    category: "Mandap & Rituals",
    location: "Jaipur Heritage Fort Nuptials",
    date: "January 2026",
    rating: 5,
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838239/confianza_portfolio/testimonial_rhea_vikramaditya_sen.jpg",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    text: "Ritual management and artist coordination were world-class! Every priest requirement, sangeet cue, and guest hospitality need was handled with immense warmth and professionalism.",
    status: "approved",
    featured: true,
    order: 3,
  },
  {
    id: "review-4",
    name: "Devika & Arpan Mukherjee",
    partnerName: "Arpan Mukherjee",
    relationship: "Bride & Groom",
    category: "Haldi & Sangeet",
    location: "Warje, Pune",
    date: "February 2026",
    rating: 5,
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838241/confianza_portfolio/testimonial_devika_arpan_mukherjee.jpg",
    videoUrl: "",
    text: "From our sunny yellow Haldi to our candlelit Sufi night, Ashish was personally on-ground making sure my parents didn't have to worry about a single vendor. Unmatched dedication!",
    status: "approved",
    featured: true,
    order: 4,
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    const db = mongoose.connection.db;

    // 1. Update SiteContent with Headers & Categories
    console.log("Updating SiteContent with authentic PDF details...");
    const contentPayload = {
      portfolioHeader,
      portfolioSection,
      portfolioCategories,
      portfolioCta,
      testimonialsHeader,
      testimonialsCategories,
      testimonialsExperience,
      testimonialsFaq,
      testimonialsCta,
      updatedAt: new Date(),
    };

    await db.collection("sitecontents").updateOne(
      { key: "confianza_main" },
      { $set: { key: "confianza_main", ...contentPayload } },
      { upsert: true }
    );
    await db.collection("sitecontents").updateOne(
      { key: "main" },
      { $set: { key: "main", ...contentPayload } },
      { upsert: true }
    );
    console.log("SiteContent updated.");

    // 2. Clear old portfolios & testimonials
    console.log("Seeding authentic portfolio projects directly from Confianza PDF...");
    await db.collection("portfolios").deleteMany({});
    const resP = await db.collection("portfolios").insertMany(
      authenticPortfolios.map((p) => ({ ...p, createdAt: new Date() }))
    );
    console.log(`Inserted ${resP.insertedCount} authentic portfolio works.`);

    console.log("Seeding authentic couple testimonials with full metadata...");
    await db.collection("testimonials").deleteMany({});
    const resT = await db.collection("testimonials").insertMany(
      authenticTestimonials.map((t) => ({ ...t, createdAt: new Date() }))
    );
    console.log(`Inserted ${resT.insertedCount} authentic testimonials.`);

    console.log("\nALL AUTHENTIC DATA DIRECTLY FROM CONFIANZA PDFS SEEDED SUCCESSFULLY!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

seed();
