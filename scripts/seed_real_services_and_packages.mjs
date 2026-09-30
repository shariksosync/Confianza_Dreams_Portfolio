import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://shazadeahmad638_db_user:qzNsl4Vuzkrc8jgo@ac-vh39hfv-shard-00-00.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-01.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-02.nhtzofv.mongodb.net:27017/wsf_db?ssl=true&replicaSet=atlas-wvwfw0-shard-0&authSource=admin&retryWrites=true&w=majority";

const realServices = [
  {
    id: "service-1",
    title: "Full-Service Luxury Wedding Planning",
    description:
      "Comprehensive end-to-end wedding architecture. From initial concept discovery, budgeting, 3D CAD spatial design, vendor curation, to minute-by-minute execution on the ground.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790796438/confianza_services/ythsmvidhxqsz8zkymdp.jpg",
    badge: "Specialized Craft",
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

const realPackages = [
  {
    id: 1,
    name: "The Signature Celebration",
    price: "₹3,50,000",
    tag: "Design & Production",
    featured: false,
    features: [
      "Spatial Decor & Floral Fabrication",
      "Vendor Contracts & Procurement",
      "Sound & Ambient Lighting Schematics",
      "Ritual Samagri & Pandit Coordination",
      "Ground Direction & Setup Rehearsals",
    ],
    order: 1,
  },
  {
    id: 2,
    name: "The Royal Heritage Experience",
    price: "₹5,50,000",
    tag: "Complete 360° Luxury",
    featured: true,
    features: [
      "End-to-End Wedding Management",
      "Custom 3D Mandap & Stage Renders",
      "Dedicated Bride & Groom Shadow Managers",
      "Complete Hospitality Desk & Room Allocations",
      "F&B Supervision & Catering Flow",
      "Master Show Running & Minute-by-Minute Cue Sheet",
    ],
    order: 2,
  },
  {
    id: 3,
    name: "The Flawless Finale",
    price: "₹1,75,000",
    tag: "On-Ground Show Running",
    featured: false,
    features: [
      "Final 30-Day Transition Handover",
      "Minute-by-Minute Master Run Sheet",
      "Bridal Personal Shadowing",
      "Vendor Arrival & Rehearsal Direction",
      "Real-Time Trouble-Shooting",
    ],
    order: 3,
  },
];

async function seed() {
  console.log("1. Connecting to MongoDB Atlas cluster...");
  const startTime = Date.now();
  await mongoose.connect(MONGODB_URI, {
    family: 4,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 20000,
  });
  console.log(`2. Successfully connected to MongoDB Atlas in ${Date.now() - startTime}ms.`);

  const db = mongoose.connection.db;
  const servicesColl = db.collection("services");
  const packagesColl = db.collection("packages");

  console.log("3. Clearing old services and inserting 8 real services with Cloudinary URLs...");
  await servicesColl.deleteMany({});
  const sRes = await servicesColl.insertMany(realServices);
  console.log(`4. Successfully inserted ${sRes.insertedCount} services.`);

  console.log("5. Clearing old packages and inserting 3 official packages...");
  await packagesColl.deleteMany({});
  const pRes = await packagesColl.insertMany(realPackages);
  console.log(`6. Successfully inserted ${pRes.insertedCount} packages.`);

  console.log("7. Disconnecting cleanly...");
  await mongoose.disconnect();
  console.log("8. ALL DONE! Database is 100% updated with real Cloudinary services & packages.");
}

seed().catch((err) => {
  console.error("Seed execution error:", err);
  process.exit(1);
});
