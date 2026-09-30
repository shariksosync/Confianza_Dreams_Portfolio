import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://shazadeahmad638_db_user:qzNsl4Vuzkrc8jgo@ac-vh39hfv-shard-00-00.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-01.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-02.nhtzofv.mongodb.net:27017/wsf_db?ssl=true&replicaSet=atlas-wvwfw0-shard-0&authSource=admin&retryWrites=true&w=majority";

const serviceCategories = [
  { id: "planning", label: "Signature Planning & Direction" },
  { id: "decor", label: "Mandap & Spatial Decor" },
  { id: "hospitality", label: "Royal Hospitality & Shadows" },
  { id: "rituals", label: "Rituals, Artists & F&B" },
];

const realServices = [
  {
    id: "service-1",
    title: "Full-Service Luxury Wedding Planning",
    category: "planning",
    description:
      "Comprehensive end-to-end wedding architecture. From initial concept discovery, budgeting, 3D CAD spatial design, vendor curation, to minute-by-minute execution on the ground.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796438/confianza_services/ythsmvidhxqsz8zkymdp.jpg",
    badge: "Signature Planning",
    features: [
      "Dedicated on-site coordinator",
      "Custom 3D visual preview",
      "Transparent vendor sheets",
    ],
    order: 1,
  },
  {
    id: "service-2",
    title: "Hospitality & Guest Concierge Management",
    category: "hospitality",
    description:
      "Royal guest welcomes with traditional aarti, personalized check-in desk, luggage tags, key jackets, bespoke welcome hampers, and 24/7 guest transit coordination.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796438/confianza_services/bmer2uw3igkqpytr99is.jpg",
    badge: "Guest Experience",
    features: [
      "Royal aarti & dhol guest arrival welcome",
      "Custom room hampers & itinerary cards",
      "24/7 guest concierge & transit desks",
    ],
    order: 2,
  },
  {
    id: "service-3",
    title: "Bespoke Mandap & Spatial Production",
    category: "decor",
    description:
      "Architectural floral mandaps, thematic stage fabrication, atmospheric lighting, acoustic design, 2D/3D CAD layouts, and overnight venue build-outs with structural safety.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796444/confianza_services/gvetogmtablwnkbnafjm.jpg",
    badge: "Design & Decor",
    features: [
      "Architectural floral mandap engineering",
      "Thematic stage lighting & acoustic zoning",
      "Structural safety & overnight fabrication",
    ],
    order: 3,
  },
  {
    id: "service-4",
    title: "Ritual & Cultural Ceremony Direction",
    category: "rituals",
    description:
      "Reverent and punctual coordination of Baraat, Milni, Varmala, Saptapadi, and Pheras with complete pandit coordination and authentic pooja samagri readiness.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796447/confianza_services/l2kervwvklxhpyrvoxvw.jpg",
    badge: "Ritual Mastery",
    features: [
      "Pooja samagri & pandit alignment",
      "Synchronized Baraat, Milni & Varmala",
      "Vedic ritual timeline management",
    ],
    order: 4,
  },
  {
    id: "service-5",
    title: "Dedicated Shadow Management (Bride & Groom)",
    category: "hospitality",
    description:
      "Discreet personal coordinators assigned to the bride and groom for schedule tracking, bridal wardrobe steaming, emergency makeup touch-ups, hydration, and calm reassurance.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796458/confianza_services/jul86yn3zphtggtziaek.jpg",
    badge: "VIP Concierge",
    features: [
      "1-on-1 shadow manager for Bride & Groom",
      "Bridal attire steaming & emergency touch-ups",
      "Continuous schedule tracking & hydration",
    ],
    order: 5,
  },
  {
    id: "service-6",
    title: "Food & Beverage (F&B) Orchestration",
    category: "rituals",
    description:
      "Master menu curation, live food counter pacing, signature beverage & bar management, strict hygiene and food temperature monitoring, and guest dining excellence.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796447/confianza_services/ieiwwkxjpwpcgwxzq0oh.jpg",
    badge: "Culinary Curation",
    features: [
      "Master menu curation & food tasting trials",
      "Live counter pacing & crowd dispersal",
      "Strict hygiene & temperature quality audits",
    ],
    order: 6,
  },
  {
    id: "service-7",
    title: "Artist, Sufi Band & Celebrity Management",
    category: "rituals",
    description:
      "Booking and stage coordination for Sufi singers, Bollywood artists, DJs, emcees, folk performers, choreographers, green rooms, and technical sound riders.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796456/confianza_services/cnzfli48v3ghvxfaomf4.jpg",
    badge: "Entertainment",
    features: [
      "Sufi, Bollywood & folk artist bookings",
      "Acoustic sound rider & green room setup",
      "Emcee, DJ & choreographer stage sync",
    ],
    order: 7,
  },
  {
    id: "service-8",
    title: "Master Show Running & Ground Direction",
    category: "planning",
    description:
      "Central show running by ground directors controlling the minute-by-minute master cue sheet, real-time intercom sync, and flawless transitions across all functions.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796488/confianza_services/p52nwlxatjgkii98ibda.jpg",
    badge: "Show Running",
    features: [
      "Minute-by-minute master run sheet",
      "Headset intercom ground control sync",
      "Seamless vendor handover & transitions",
    ],
    order: 8,
  },
];

const ceremonies = [
  {
    id: "ceremony-1",
    name: "Mehendi & Sangeet Soirée",
    subtitle: "Rhythmic Celebrations & Bohemian Glitz",
    description:
      "A lively celebration featuring colorful Moroccan cabanas, bespoke photo corners, choreographed couple entries, and live Sufi/DJ stage entertainment.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796456/confianza_services/cnzfli48v3ghvxfaomf4.jpg",
    theme: "Bohemian & Musical Glamour",
    highlights: [
      "Choreographed couple & family entry sequencing",
      "Live DJ, sound riders & acoustic zoning",
      "Customised bridal mehendi seating cabana",
      "Signature mocktails & finger food live stations",
    ],
    order: 1,
  },
  {
    id: "ceremony-2",
    name: "Haldi & Phoolon Ki Holi",
    subtitle: "Sacred Turmeric & Floral Blessings",
    description:
      "Sunlit yellow festivities styled with brass urlis, marigold cascades, organic fragrant gulal, traditional dhol players, and floral showers.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796447/confianza_services/l2kervwvklxhpyrvoxvw.jpg",
    theme: "Traditional Marigold & Petals",
    highlights: [
      "Custom brass urlis & floral backdrops",
      "Organic gulal & rose petal shower guns",
      "Live folk dhol tasha coordination",
      "Special haldi attire shadow assistance",
    ],
    order: 2,
  },
  {
    id: "ceremony-3",
    name: "Royal Baraat & Grand Milni",
    subtitle: "Regal Procession & Warm Welcomes",
    description:
      "High-energy royal baraat procession with vintage convertibles, mobile sound systems, cold pyros, traditional safa tying, and coordinated floral milni greetings.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796438/confianza_services/bmer2uw3igkqpytr99is.jpg",
    theme: "Royal Heritage Procession",
    highlights: [
      "Vintage vehicle / royal entry permit sync",
      "Traditional pagdi & safa tying masters",
      "Hydraulic Varmala & cold pyrotechnics",
      "Bespoke floral garlands & petal showers",
    ],
    order: 3,
  },
  {
    id: "ceremony-4",
    name: "Sacred Vedic Pheras & Mandap",
    subtitle: "Timeless Vows & Spiritual Harmony",
    description:
      "The holy pinnacle of the wedding. Architectural floral mandap over tranquil water bodies or lawns, sacred havan setup, Vedic chanting ambience, and pandit coordination.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796444/confianza_services/gvetogmtablwnkbnafjm.jpg",
    theme: "Architectural Mandap Artistry",
    highlights: [
      "Custom 3D CAD engineered floral mandap",
      "Authentic Vedic samagri & pandit alignment",
      "Acoustic flute & sacred shloka zoning",
      "Bridal shadow coordination during pheras",
    ],
    order: 4,
  },
  {
    id: "ceremony-5",
    name: "Grand Reception & Cocktail Banquet",
    subtitle: "Contemporary Luxury & Royal Hospitality",
    description:
      "A black-tie formal gala with dramatic architectural lighting, grand cake-cutting, master chef multi-course banquet flow, and heartwarming speeches.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796447/confianza_services/ieiwwkxjpwpcgwxzq0oh.jpg",
    theme: "Black-Tie Royal Gala",
    highlights: [
      "Thematic royal stage fabrication",
      "Multi-course culinary & live bar pacing",
      "Dramatic stage spotlighting & ambient haze",
      "VIP family photo & hospitality concierge",
    ],
    order: 5,
  },
];

const stationery = [
  {
    id: "stat-1",
    title: "Bespoke Itinerary Cards",
    subtitle: "Room & Welcome Placements",
    description:
      "Beautifully printed gold-foiled cards placed in each guest room outlining event timings, venue dress codes, and shuttle transit schedules.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796438/confianza_services/bmer2uw3igkqpytr99is.jpg",
    badge: "Guest Itinerary",
    order: 1,
  },
  {
    id: "stat-2",
    title: "Personalized Luggage Tags",
    subtitle: "Airport & Transit Coordination",
    description:
      "Custom branded luggage tags matching the couple's wedding emblem for effortless airport baggage handling and direct-to-room delivery.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796458/confianza_services/jul86yn3zphtggtziaek.jpg",
    badge: "Luggage Tags",
    order: 2,
  },
  {
    id: "stat-3",
    title: "Monogrammed Key Jackets",
    subtitle: "Hotel Room Key Card Sleeves",
    description:
      "Luxurious card jackets stamped with the couple's monogram, Wi-Fi details, and concierge helpdesk hotline numbers.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796438/confianza_services/ythsmvidhxqsz8zkymdp.jpg",
    badge: "Key Jackets",
    order: 3,
  },
  {
    id: "stat-4",
    title: "Royal Welcome Hampers & Gift Boxes",
    subtitle: "Curated Arrival Luxury",
    description:
      "Artisanal Pune sweets, refreshing snacks, emergency survival kits, scented candles, and personalized handwritten welcome notes.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796488/confianza_services/p52nwlxatjgkii98ibda.jpg",
    badge: "Welcome Hampers",
    order: 4,
  },
];

const servicesCta = {
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
};

async function seed() {
  console.log("1. Connecting to MongoDB Atlas cluster...");
  const startTime = Date.now();
  await mongoose.connect(MONGODB_URI, {
    family: 4,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 5000,
  });
  console.log(`2. Connected in ${Date.now() - startTime}ms.`);

  const db = mongoose.connection.db;

  // Update Services
  console.log("3. Updating services with categories...");
  await db.collection("services").deleteMany({});
  await db.collection("services").insertMany(realServices);
  console.log("4. Inserted 8 categorized services.");

  // Update SiteContent with serviceCategories, ceremonies, stationery, servicesCta
  console.log("5. Updating SiteContent with dynamic categories, ceremonies, stationery & CTA...");
  await db.collection("sitecontents").updateOne(
    { key: "confianza_main" },
    {
      $set: {
        serviceCategories,
        ceremonies,
        stationery,
        servicesCta,
      },
    },
    { upsert: true }
  );
  console.log("6. Successfully updated SiteContent.");

  await mongoose.disconnect();
  console.log("7. ALL DONE! Services architecture data is 100% seeded in MongoDB Atlas.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
