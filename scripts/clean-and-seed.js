import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://shazadeahmad638_db_user:qzNsl4Vuzkrc8jgo@ac-vh39hfv-shard-00-00.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-01.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-02.nhtzofv.mongodb.net:27017/wsf_db?ssl=true&replicaSet=atlas-wvwfw0-shard-0&authSource=admin&retryWrites=true&w=majority";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "confianzaevents@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Initial Confianza Master Data
const initialSiteContent = {
  key: "confianza_main",
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
      { id: "hero", label: "Hero Slider", enabled: true },
      { id: "about", label: "About & Story", enabled: true },
      { id: "services", label: "Services", enabled: true },
      { id: "why", label: "Why Choose Us", enabled: true },
      { id: "beforeAfter", label: "Decor Transformation", enabled: true },
      { id: "portfolio", label: "Portfolio", enabled: true },
      { id: "process", label: "Wedding Process", enabled: true },
      { id: "stats", label: "Statistics Counter", enabled: true },
      { id: "packages", label: "Packages & Pricing", enabled: true },
      { id: "calculator", label: "Budget Calculator", enabled: true },
      { id: "partners", label: "Hotel Partners", enabled: true },
      { id: "testimonials", label: "Testimonials", enabled: true },
      { id: "team", label: "Team & Founders", enabled: true },
      { id: "gallery", label: "Pinterest Gallery", enabled: true },
      { id: "faq", label: "FAQ", enabled: true },
      { id: "blog", label: "Blog & Guides", enabled: true },
      { id: "instagram", label: "Instagram Feed", enabled: true },
      { id: "contact", label: "Contact & Map", enabled: true },
    ],
  },
  hero: {
    eyebrow: "Luxury Wedding Planners • Pune",
    headline: "Where Weddings Become Stories",
    subtitle:
      "From the first consultation to the final celebration, Confianza crafts personalised, flawlessly executed weddings that your guests will talk about for years.",
    primaryCta: { label: "Book Consultation", href: "/contact" },
    secondaryCta: { label: "View Portfolio", href: "/portfolio" },
    images: ["/images/hero-1.jpg", "/images/hero-2.jpg", "/images/hero-3.jpg"],
    floatingStats: [
      { value: "500+", label: "Wedding Stories Created" },
      { value: "350+", label: "Happy Couples" },
      { value: "40+", label: "Destination Weddings" },
      { value: "7+", label: "Years Experience" },
    ],
  },
  about: {
    heading: "A Pune studio devoted to weddings that feel personal",
    story:
      "Confianza began in 2018 with one belief — a wedding should sound like the couple, not like a catalogue. What started as a two-person decor team in Warje is now a full-service house planning, designing and executing weddings across India.",
    mission:
      "To take the weight of planning off a family's shoulders and hand back a celebration they can be fully present for.",
    vision:
      "To be the most trusted name in personalised luxury weddings across Maharashtra and every destination we travel to.",
    values: [
      { title: "Consultation", text: "We start by listening. Your story shapes every decision that follows." },
      { title: "Planning", text: "Budgets, vendors and timelines documented so nothing lives in someone's head." },
      { title: "Execution", text: "Crews on site before dawn, calm coordination until the last guest leaves." },
    ],
    timeline: [
      { year: "2018", text: "Founded in Warje, Pune with a two-person decor team." },
      { year: "2020", text: "First destination wedding produced in Udaipur." },
      { year: "2022", text: "Entertainment and corporate events division launched." },
      { year: "2024", text: "300th wedding delivered; in-house production crew formed." },
      { year: "2026", text: "500+ events, 40+ destination weddings and counting." },
    ],
  },
  contact: {
    business: "Confianza Event's and Entertainment",
    owner: "Ashish Wankhede",
    phone: "9850983389",
    whatsapp: "919850983389",
    email: "Confianza@supportgmail.com",
    instagram: "https://www.instagram.com/confianza_events",
    address: {
      line1: "Indrayani Complex",
      line2: "Near Mr DIY, Warje Jakat Naka",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411052",
    },
    mapEmbed:
      "https://www.google.com/maps?q=Warje%20Jakat%20Naka%2C%20Pune%2C%20Maharashtra%20411052&output=embed",
    hours: [
      { day: "Monday – Friday", time: "10:00 AM – 8:00 PM" },
      { day: "Saturday", time: "10:00 AM – 9:00 PM" },
      { day: "Sunday", time: "By appointment" },
    ],
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/confianza_events" },
      { label: "Facebook", href: "https://www.facebook.com" },
      { label: "YouTube", href: "https://www.youtube.com" },
    ],
  },
  stats: [
    { id: 1, value: 500, suffix: "+", label: "Events" },
    { id: 2, value: 350, suffix: "+", label: "Happy Couples" },
    { id: 3, value: 40, suffix: "+", label: "Destination Weddings" },
    { id: 4, value: 7, suffix: "+", label: "Years" },
  ],
  why: [
    { icon: "Users", title: "Experienced Team", text: "Seven years and 500+ events of on-ground expertise." },
    { icon: "Heart", title: "Personalized Planning", text: "Every wedding designed around your story, never a template." },
    { icon: "Sparkles", title: "Creative Designs", text: "Original concepts, mood boards and 3D decor previews." },
    { icon: "Wallet", title: "Budget Friendly", text: "Transparent costing with options at every price point." },
    { icon: "Clock", title: "On-time Execution", text: "Detailed run sheets and crews that start before sunrise." },
    { icon: "Crown", title: "Premium Vendors", text: "A vetted network of India's finest partners." },
    { icon: "Plane", title: "Destination Expertise", text: "Travel, stays and permissions handled end to end." },
  ],
  process: [
    { id: 1, title: "Consultation", text: "We listen to your story, guest list, budget and non-negotiables." },
    { id: 2, title: "Planning", text: "Venues, vendors, budgets and a master timeline you can actually read." },
    { id: 3, title: "Design", text: "Mood boards, colour palettes and decor layouts approved before we build." },
    { id: 4, title: "Execution", text: "Our crews take over the venue while you get ready in peace." },
    { id: 5, title: "Celebration", text: "You stay a guest at your own wedding. We handle everything else." },
  ],
  beforeAfter: {
    before: "/images/corporate.jpg",
    after: "/images/stage.jpg",
    title: "Empty banquet to lavender ballroom",
    text: "Eleven hours of build, 4,000 stems and a hall nobody recognised.",
  },
  instagram: [
    { id: 1, image: "/images/hero-1.jpg", likes: 842 },
    { id: 2, image: "/images/mehendi.jpg", likes: 611 },
    { id: 3, image: "/images/stage.jpg", likes: 730 },
    { id: 4, image: "/images/floral.jpg", likes: 522 },
    { id: 5, image: "/images/outdoor.jpg", likes: 468 },
    { id: 6, image: "/images/hero-2.jpg", likes: 905 },
  ],
};

const initialServices = [
  {
    id: "wedding-planning",
    title: "Wedding Planning",
    description: "End-to-end planning with budgets, timelines, vendors and a dedicated planner who never lets a detail slip.",
    image: "/images/hero-1.jpg",
    order: 1,
  },
  {
    id: "wedding-decor",
    title: "Wedding Decor",
    description: "Bespoke floral, drape and light design that turns any venue into your own signature world.",
    image: "/images/floral.jpg",
    order: 2,
  },
  {
    id: "destination-wedding",
    title: "Destination Wedding",
    description: "Beaches, palaces and hill retreats — logistics, stays and rituals handled across India and abroad.",
    image: "/images/hero-2.jpg",
    order: 3,
  },
  {
    id: "wedding-execution",
    title: "Wedding Execution",
    description: "On-ground crews, minute-by-minute run sheets and calm coordination on the day that matters most.",
    image: "/images/stage.jpg",
    order: 4,
  },
  {
    id: "corporate-events",
    title: "Corporate Events",
    description: "Conferences, award nights and product launches produced with brand-perfect precision.",
    image: "/images/corporate.jpg",
    order: 5,
  },
  {
    id: "entertainment",
    title: "Entertainment",
    description: "Live bands, DJs, dancers, anchors and celebrity artist management for unforgettable nights.",
    image: "/images/hero-3.jpg",
    order: 6,
  },
  {
    id: "haldi",
    title: "Haldi",
    description: "Sun-drenched marigold setups, playful props and joyful family moments.",
    image: "/images/haldi.jpg",
    order: 7,
  },
  {
    id: "mehendi",
    title: "Mehendi",
    description: "Colourful boho styling, swings, artists and curated live music.",
    image: "/images/mehendi.jpg",
    order: 8,
  },
  {
    id: "reception",
    title: "Reception",
    description: "Grand stages, cinematic lighting and elegant seating design.",
    image: "/images/hero-3.jpg",
    order: 9,
  },
  {
    id: "engagement",
    title: "Engagement",
    description: "Intimate, romantic setups designed around your love story.",
    image: "/images/couple.jpg",
    order: 10,
  },
  {
    id: "anniversary",
    title: "Anniversary",
    description: "Milestone celebrations with nostalgic touches and refined decor.",
    image: "/images/outdoor.jpg",
    order: 11,
  },
  {
    id: "birthday",
    title: "Birthday & Luxury Events",
    description: "Themed private parties with premium production and catering partners.",
    image: "/images/corporate.jpg",
    order: 12,
  },
];

const initialPortfolio = [
  { id: 1, title: "Lakeside Mandap, Udaipur", category: "Destination", image: "/images/hero-1.jpg", location: "Udaipur", order: 1 },
  { id: 2, title: "Sunset Vows by the Sea", category: "Wedding", image: "/images/hero-2.jpg", location: "Goa", order: 2 },
  { id: 3, title: "Amethyst Ballroom Reception", category: "Reception", image: "/images/hero-3.jpg", location: "Pune", order: 3 },
  { id: 4, title: "Marigold Haldi Morning", category: "Haldi", image: "/images/haldi.jpg", location: "Nashik", order: 4 },
  { id: 5, title: "Garden Mehendi Affair", category: "Mehendi", image: "/images/mehendi.jpg", location: "Lonavala", order: 5 },
  { id: 6, title: "Lavender & Gold Stage", category: "Luxury Stage", image: "/images/stage.jpg", location: "Pune", order: 6 },
  { id: 7, title: "Orchid Tablescape", category: "Floral Decor", image: "/images/floral.jpg", location: "Mumbai", order: 7 },
  { id: 8, title: "Fairy-Lit Garden Dinner", category: "Outdoor", image: "/images/outdoor.jpg", location: "Panchgani", order: 8 },
  { id: 9, title: "Ballroom Sangeet Night", category: "Indoor", image: "/images/corporate.jpg", location: "Pune", order: 9 },
  { id: 10, title: "Ivory Drapes & Chandeliers", category: "Decor", image: "/images/stage.jpg", location: "Pune", order: 10 },
  { id: 11, title: "The Wankhede Wedding", category: "Wedding", image: "/images/couple.jpg", location: "Pune", order: 11 },
  { id: 12, title: "Beach Baraat", category: "Destination", image: "/images/hero-2.jpg", location: "Alibaug", order: 12 },
];

const initialGallery = [
  { id: 1, image: "/images/hero-1.jpg", caption: "Candlelit mandap", category: "Mandap", order: 1 },
  { id: 2, image: "/images/floral.jpg", caption: "Orchid centrepieces", category: "Floral", order: 2 },
  { id: 3, image: "/images/mehendi.jpg", caption: "Mehendi swings", category: "Mehendi", order: 3 },
  { id: 4, image: "/images/hero-3.jpg", caption: "Ballroom glow", category: "Reception", order: 4 },
  { id: 5, image: "/images/outdoor.jpg", caption: "Garden dinner", category: "Outdoor", order: 5 },
  { id: 6, image: "/images/haldi.jpg", caption: "Haldi joy", category: "Haldi", order: 6 },
  { id: 7, image: "/images/stage.jpg", caption: "Lavender stage", category: "Stage", order: 7 },
  { id: 8, image: "/images/couple.jpg", caption: "The couple", category: "Portraits", order: 8 },
  { id: 9, image: "/images/hero-2.jpg", caption: "Seaside vows", category: "Destination", order: 9 },
];

const initialPackages = [
  {
    id: 1,
    name: "Intimate",
    price: "₹1.5L",
    tag: "Up to 100 guests",
    features: ["Single function", "Decor & floral design", "Vendor coordination", "On-day execution team"],
    featured: false,
    order: 1,
  },
  {
    id: 2,
    name: "Signature",
    price: "₹4.5L",
    tag: "Most chosen",
    features: ["Up to 3 functions", "Full planning & design", "Entertainment curation", "Dedicated planner", "Guest management"],
    featured: true,
    order: 2,
  },
  {
    id: 3,
    name: "Destination",
    price: "On request",
    tag: "Anywhere in India",
    features: ["Venue scouting trips", "Travel & stay logistics", "Multi-day production", "Permissions & licensing", "Full crew on site"],
    featured: false,
    order: 3,
  },
];

const initialTestimonials = [
  {
    id: 1,
    name: "Sneha & Rohan",
    image: "/images/couple.jpg",
    rating: 5,
    date: "12 Feb 2025",
    location: "Udaipur",
    text: "Confianza turned a three-day wedding into a film we get to relive forever. Ashish and his team were calm, warm and unbelievably organised.",
    featured: true,
    order: 1,
  },
  {
    id: 2,
    name: "Priya & Aditya",
    image: "/images/hero-2.jpg",
    rating: 5,
    date: "08 Dec 2024",
    location: "Goa",
    text: "Our destination wedding had 220 guests flying in. Not one thing went wrong. The decor was beyond our mood board.",
    featured: true,
    order: 2,
  },
  {
    id: 3,
    name: "Meera & Karan",
    image: "/images/hero-3.jpg",
    rating: 5,
    date: "22 Nov 2024",
    location: "Pune",
    text: "They respected our budget completely and still delivered a reception that looked like a palace evening.",
    featured: true,
    order: 3,
  },
  {
    id: 4,
    name: "Anjali & Vivek",
    image: "/images/stage.jpg",
    rating: 5,
    date: "03 May 2024",
    location: "Lonavala",
    text: "The haldi and mehendi setups were the most photographed part of our wedding. Every guest asked who planned it.",
    featured: true,
    order: 4,
  },
];

const initialTeam = [
  { id: 1, name: "Ashish Wankhede", role: "Founder", image: "/images/couple.jpg", bio: "Seven years of building weddings that feel personal, not produced.", order: 1 },
  { id: 2, name: "Rutuja Deshmukh", role: "Creative Director", image: "/images/floral.jpg", bio: "Leads concept, colour and every mood board that leaves our studio.", order: 2 },
  { id: 3, name: "Sagar Patil", role: "Event Manager", image: "/images/corporate.jpg", bio: "Runs the ground crew and the minute-by-minute run sheet.", order: 3 },
  { id: 4, name: "Decor Team", role: "Decor & Production", image: "/images/stage.jpg", bio: "Florists, carpenters and light technicians who build through the night.", order: 4 },
  { id: 5, name: "Neha Kulkarni", role: "Wedding Planner", image: "/images/mehendi.jpg", bio: "Your single point of contact from consultation to farewell brunch.", order: 5 },
  { id: 6, name: "Omkar Jadhav", role: "Coordinator", image: "/images/outdoor.jpg", bio: "Keeps guests, vendors and timelines moving in the same direction.", order: 6 },
];

const initialFaq = [
  {
    id: 1,
    question: "How far in advance should we book Confianza?",
    answer: "Six to twelve months is ideal for a full wedding, and three months for a single function. We do take on shorter timelines when our calendar allows.",
    category: "Booking",
    order: 1,
  },
  {
    id: 2,
    question: "Do you handle destination weddings outside Maharashtra?",
    answer: "Yes. We regularly produce weddings in Udaipur, Jaipur, Goa, Alibaug and Kerala, and we handle guest travel, stays and local permissions.",
    category: "Destinations",
    order: 2,
  },
  {
    id: 3,
    question: "Can we book only decor or only execution?",
    answer: "Absolutely. Our services are modular — planning, decor, execution and entertainment can be booked individually or together.",
    category: "Services",
    order: 3,
  },
  {
    id: 4,
    question: "How is your pricing structured?",
    answer: "Planning is charged as a percentage of the event budget or a flat fee, while decor and production are quoted per design. You receive one transparent sheet with no hidden costs.",
    category: "Pricing",
    order: 4,
  },
  {
    id: 5,
    question: "Do you work with our existing vendors?",
    answer: "Happily. We coordinate with family-preferred caterers, priests and photographers, and fill any gaps from our vetted network.",
    category: "Coordination",
    order: 5,
  },
  {
    id: 6,
    question: "What happens if it rains?",
    answer: "Every outdoor plan we build ships with a covered contingency layout, standby crews and a weather call schedule 72 hours before the function.",
    category: "Logistics",
    order: 6,
  },
];

const initialBlogs = [
  {
    id: 1,
    slug: "12-months-to-i-do-wedding-planning-timeline",
    title: "12 Months to 'I Do': A Realistic Wedding Planning Timeline",
    category: "Planning Guides",
    date: "18 Aug 2025",
    image: "/images/hero-1.jpg",
    excerpt: "What to lock in at 12, 6, 3 and 1 month out so the final week feels calm instead of chaotic.",
    content:
      "A wedding is a hundred small decisions stacked into one day. Start with the date, guest count and budget — everything else follows. At twelve months, secure the venue and planner. At six, finalise decor direction, photography and catering tastings. At three, send invitations and confirm travel for outstation guests. In the final month, freeze the run sheet, share it with every vendor, and let your planner take the phone calls.",
  },
  {
    id: 2,
    slug: "lavender-and-gold-decor-palette-of-the-season",
    title: "Lavender & Gold: The Decor Palette of the Season",
    category: "Decor Ideas",
    date: "02 Sep 2025",
    image: "/images/floral.jpg",
    excerpt: "Soft royal lavender with warm gold reads romantic in daylight and regal after dark.",
    content:
      "Pair lavender roses and white orchids with brushed gold candle stands. Keep drapes ivory so the flowers stay the hero, and add amber uplights for the evening switch. The palette photographs beautifully in both natural and tungsten light.",
  },
  {
    id: 3,
    slug: "choosing-a-destination-wedding-venue-in-india",
    title: "Choosing a Destination Wedding Venue in India",
    category: "Destination Ideas",
    date: "27 Jul 2025",
    image: "/images/hero-2.jpg",
    excerpt: "Udaipur, Goa, Jaipur or Alibaug — how to match your guest list and season to the right place.",
    content:
      "Consider three things before falling in love with a photograph: flight and road access for your oldest guests, room inventory on site, and the weather window. A palace in May and a beach in July will both test your guests' patience. We scout every venue before recommending it.",
  },
  {
    id: 4,
    slug: "seven-wedding-tips-couples-always-thank-us-for",
    title: "Seven Wedding Tips Couples Always Thank Us For",
    category: "Wedding Tips",
    date: "11 Jun 2025",
    image: "/images/outdoor.jpg",
    excerpt: "Small decisions that quietly protect your budget, your timeline and your sanity.",
    content:
      "Eat before the ceremony. Build a fifteen-minute buffer into every block. Assign one family member per vendor. Keep a bridal emergency kit. Book the photographer for a first-look session. Confirm generator backup. And do a private five-minute pause together after the pheras.",
  },
];

async function main() {
  console.log("==================================================");
  console.log(" [1/5] Connecting to MongoDB Atlas Cluster...");
  console.log("==================================================");

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(">>> MongoDB Connected Successfully to Database: " + mongoose.connection.name);

    const db = mongoose.connection.db;

    // STEP 1: FETCH AND DROP ALL EXISTING COLLECTIONS
    console.log("\n==================================================");
    console.log(" [2/5] Wiping All Existing Collections in Database...");
    console.log("==================================================");

    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} existing collections in ${mongoose.connection.name}:`);

    for (const col of collections) {
      console.log(` -> Dropping collection: ${col.name}...`);
      await db.collection(col.name).drop();
    }
    console.log(">>> Database wiped completely! 0 leftover collections.\n");

    // STEP 2: CREATE ADMIN USER
    console.log("==================================================");
    console.log(" [3/5] Creating Default Admin User...");
    console.log("==================================================");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await db.collection("admins").insertOne({
      email: ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      name: "Ashish Wankhede",
      role: "superadmin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.collection("admins").createIndex({ email: 1 }, { unique: true });
    console.log(`>>> Created Admin: ${ADMIN_EMAIL}`);

    // STEP 3: SEED CONFIANZA ENTITIES
    console.log("\n==================================================");
    console.log(" [4/5] Seeding Confianza Events Data...");
    console.log("==================================================");

    // SiteContent
    await db.collection("sitecontents").insertOne({
      ...initialSiteContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.collection("sitecontents").createIndex({ key: 1 }, { unique: true });
    console.log(" -> Seeded SiteContent (Settings, Hero, About, Contact, etc.)");

    // Services
    if (initialServices.length > 0) {
      await db.collection("services").insertMany(initialServices);
      await db.collection("services").createIndex({ id: 1 }, { unique: true });
      await db.collection("services").createIndex({ order: 1 });
      console.log(` -> Seeded ${initialServices.length} Services`);
    }

    // Portfolio
    if (initialPortfolio.length > 0) {
      await db.collection("portfolios").insertMany(initialPortfolio);
      await db.collection("portfolios").createIndex({ id: 1 }, { unique: true });
      await db.collection("portfolios").createIndex({ category: 1 });
      console.log(` -> Seeded ${initialPortfolio.length} Portfolio Projects`);
    }

    // Gallery
    if (initialGallery.length > 0) {
      await db.collection("galleries").insertMany(initialGallery);
      await db.collection("galleries").createIndex({ id: 1 }, { unique: true });
      console.log(` -> Seeded ${initialGallery.length} Gallery Photos`);
    }

    // Packages
    if (initialPackages.length > 0) {
      await db.collection("packages").insertMany(initialPackages);
      await db.collection("packages").createIndex({ id: 1 }, { unique: true });
      console.log(` -> Seeded ${initialPackages.length} Pricing Packages`);
    }

    // Testimonials
    if (initialTestimonials.length > 0) {
      await db.collection("testimonials").insertMany(initialTestimonials);
      await db.collection("testimonials").createIndex({ id: 1 }, { unique: true });
      console.log(` -> Seeded ${initialTestimonials.length} Client Testimonials`);
    }

    // Team
    if (initialTeam.length > 0) {
      await db.collection("teams").insertMany(initialTeam);
      await db.collection("teams").createIndex({ id: 1 }, { unique: true });
      console.log(` -> Seeded ${initialTeam.length} Team Members`);
    }

    // FAQ
    if (initialFaq.length > 0) {
      await db.collection("faqs").insertMany(initialFaq);
      await db.collection("faqs").createIndex({ id: 1 }, { unique: true });
      console.log(` -> Seeded ${initialFaq.length} FAQs`);
    }

    // Blogs
    if (initialBlogs.length > 0) {
      await db.collection("blogs").insertMany(initialBlogs);
      await db.collection("blogs").createIndex({ slug: 1 }, { unique: true });
      console.log(` -> Seeded ${initialBlogs.length} Blog Articles`);
    }

    // Inquiries Collection with Index
    await db.collection("inquiries").createIndex({ createdAt: -1 });
    await db.collection("inquiries").createIndex({ status: 1 });
    console.log(" -> Created Inquiries Collection with Indexes");

    console.log("\n==================================================");
    console.log(" [5/5] Verification & Final Collection Count");
    console.log("==================================================");
    const finalCollections = await db.listCollections().toArray();
    console.log(`Total active collections in ${mongoose.connection.name}: ${finalCollections.length}`);
    for (const col of finalCollections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(` • ${col.name}: ${count} document(s)`);
    }

    console.log("\n>>> DATABASE CLEANUP AND MIGRATION COMPLETED SUCCESSFULLY! <<<");
    process.exit(0);
  } catch (error) {
    console.error(">>> Database migration error:", error);
    process.exit(1);
  }
}

main();
