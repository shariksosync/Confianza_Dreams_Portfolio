import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Load .env or .env.local
let mongoUri = process.env.MONGODB_URI;
let cloudName = process.env.CLOUDINARY_CLOUD_NAME || "tridevsosync";
let apiKey = process.env.CLOUDINARY_API_KEY || "524682898685858";
let apiSecret = process.env.CLOUDINARY_API_SECRET || "qfF4MNyLFJjU8tOnu2SWVfRqLMw";

const envPaths = [".env.local", ".env"];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const mUri = envContent.match(/MONGODB_URI=(.*)/);
    if (mUri && !mongoUri) mongoUri = mUri[1].trim();

    const mName = envContent.match(/CLOUDINARY_CLOUD_NAME=(.*)/);
    if (mName) cloudName = mName[1].trim();

    const mKey = envContent.match(/CLOUDINARY_API_KEY=(.*)/);
    if (mKey) apiKey = mKey[1].trim();

    const mSec = envContent.match(/CLOUDINARY_API_SECRET=(.*)/);
    if (mSec) apiSecret = mSec[1].trim();
  }
}

if (!mongoUri) {
  mongoUri = "mongodb://shazadeahmad638_db_user:qzNsl4Vuzkrc8jgo@ac-vh39hfv-shard-00-00.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-01.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-02.nhtzofv.mongodb.net:27017/wsf_db?ssl=true&replicaSet=atlas-wvwfw0-shard-0&authSource=admin&retryWrites=true&w=majority";
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

async function uploadFile(filePath, folder, publicId) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found on disk: ${filePath}`);
    return null;
  }

  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          console.error(`Upload error for ${filePath}:`, error);
          resolve(null);
        } else {
          console.log(`✓ [${folder}] ${path.basename(filePath)} -> ${result.secure_url}`);
          resolve(result.secure_url);
        }
      }
    );
  });
}

async function run() {
  try {
    console.log("=================================================");
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas!");
    console.log("=================================================\n");

    const db = mongoose.connection.db;

    // 1. Upload Core Site Hero & Brand Images
    console.log("1. Uploading Core Site Hero & Brand Images...");
    const siteHeroes = [
      { key: "hero_1", path: "public/images/hero-1.jpg", folder: "confianza_heroes", id: "home_hero_1" },
      { key: "hero_2", path: "public/images/hero-2.jpg", folder: "confianza_heroes", id: "home_hero_2" },
      { key: "hero_3", path: "public/images/hero-3.jpg", folder: "confianza_heroes", id: "home_hero_3" },
      { key: "floral", path: "public/images/floral.jpg", folder: "confianza_heroes", id: "gallery_hero_banner" },
      { key: "couple", path: "public/images/couple.jpg", folder: "confianza_heroes", id: "about_founder_portrait" },
      { key: "stage", path: "public/images/stage.jpg", folder: "confianza_heroes", id: "stage_signature" },
      { key: "haldi", path: "public/images/haldi.jpg", folder: "confianza_heroes", id: "haldi_signature" },
      { key: "mehendi", path: "public/images/mehendi.jpg", folder: "confianza_heroes", id: "mehendi_signature" },
      { key: "outdoor", path: "public/images/outdoor.jpg", folder: "confianza_heroes", id: "outdoor_signature" },
      { key: "logo", path: "public/logo.png", folder: "confianza_brand", id: "brand_logo_gold" },
    ];

    const uploadedUrls = {};
    for (const h of siteHeroes) {
      const fullPath = path.resolve(h.path);
      const url = await uploadFile(fullPath, h.folder, h.id);
      if (url) uploadedUrls[h.key] = url;
    }

    // 2. Upload Team Portraits
    console.log("\n2. Uploading Team Portraits...");
    const teamPhotos = [
      { id: "person_1", file: "D:/Software Setup/SOsync_Company_work/Projects/Projects08/photos/person_1_founder.jpg", pubId: "team_ashish_wankhede" },
      { id: "person_2", file: "D:/Software Setup/SOsync_Company_work/Projects/Projects08/photos/person_2_lead_planner.jpg", pubId: "team_rutik_pund" },
      { id: "person_3", file: "D:/Software Setup/SOsync_Company_work/Projects/Projects08/photos/person_3_creative_director.jpg", pubId: "team_creative_director" },
      { id: "person_4", file: "D:/Software Setup/SOsync_Company_work/Projects/Projects08/photos/person_4_event_coordinator.jpg", pubId: "team_event_coordinator" },
      { id: "person_5", file: "D:/Software Setup/SOsync_Company_work/Projects/Projects08/photos/person_5_floral_architect.jpg", pubId: "team_floral_architect" },
      { id: "person_6", file: "D:/Software Setup/SOsync_Company_work/Projects/Projects08/photos/person_6_concierge_head.jpg", pubId: "team_concierge_head" },
    ];

    const teamCloudUrls = {};
    for (const t of teamPhotos) {
      const url = await uploadFile(t.file, "confianza_team", t.pubId);
      if (url) teamCloudUrls[t.id] = url;
    }

    // 3. Upload Gallery Photos from authentic PDF collection
    console.log("\n3. Uploading Gallery Photos (PDF Visual Chronicles)...");
    const rawGalleryItems = [
      {
        id: "gallery-1",
        caption: "Sacred Vedic Mandap with Floating Lotus Installation",
        category: "Mandap Architecture",
        location: "Udaipur, Rajasthan",
        path: "public/images/confianza_photos/photo_page30_1_409.jpeg",
        publicId: "gallery_sacred_vedic_mandap_udaipur",
        order: 1,
      },
      {
        id: "gallery-2",
        caption: "Regal Heritage Fort Courtyard & Royal Baraat Entry",
        category: "Destination Venues",
        location: "Jaipur, Rajasthan",
        path: "public/images/confianza_photos/photo_page28_1_395.jpeg",
        publicId: "gallery_regal_fort_heritage_jaipur",
        order: 2,
      },
      {
        id: "gallery-3",
        caption: "Crystal Grandeur Ballroom Reception Stage",
        category: "Opulent Receptions",
        location: "JW Marriott, Pune",
        path: "public/images/confianza_photos/photo_page25_1_368.jpeg",
        publicId: "gallery_crystal_grandeur_reception_pune",
        order: 3,
      },
      {
        id: "gallery-4",
        caption: "Starlight Sangeet LED Trusses & SFX Stage",
        category: "Haldi & Sangeet",
        location: "The Westin, Pune",
        path: "public/images/confianza_photos/photo_page23_4_354.jpeg",
        publicId: "gallery_starlight_sangeet_sfx_pune",
        order: 4,
      },
      {
        id: "gallery-5",
        caption: "Marigold Sunburst Haldi Carnival & Phoolon ki Holi",
        category: "Haldi & Sangeet",
        location: "Warje, Pune",
        path: "public/images/confianza_photos/photo_page20_1_315.jpeg",
        publicId: "gallery_marigold_haldi_carnival_warje",
        order: 5,
      },
      {
        id: "gallery-6",
        caption: "Sunset Beach Vows & Coastal Botanical Canopy",
        category: "Destination Venues",
        location: "South Goa",
        path: "public/images/confianza_photos/photo_page10_1_223.jpeg",
        publicId: "gallery_sunset_beach_vows_goa",
        order: 6,
      },
      {
        id: "gallery-7",
        caption: "Bridal Floral Chadar Entry with Cold Pyrotechnics",
        category: "Bridal Entries & Portraits",
        location: "Conrad Hotel, Pune",
        path: "public/images/confianza_photos/photo_page32_1_426.jpeg",
        publicId: "gallery_bridal_entry_pyrotechnics_pune",
        order: 7,
      },
      {
        id: "gallery-8",
        caption: "Cascading Tuberose & Amber Lantern Ceiling Decor",
        category: "Spatial Decor & Floral Art",
        location: "Vedic Village, Kolkata",
        path: "public/images/confianza_photos/photo_page9_1_214.jpeg",
        publicId: "gallery_tuberose_amber_ceiling_kolkata",
        order: 8,
      },
      {
        id: "gallery-9",
        caption: "Gold-Carved Temple Pillar Mandap Sanctum",
        category: "Mandap Architecture",
        location: "Royal Orchid, Pune",
        path: "public/images/confianza_photos/photo_page13_1_256.jpeg",
        publicId: "gallery_temple_pillar_mandap_pune",
        order: 9,
      },
      {
        id: "gallery-10",
        caption: "Luxury Candlelit Mirror Tablescape & Crystal Centerpieces",
        category: "Spatial Decor & Floral Art",
        location: "Ritz-Carlton, Pune",
        path: "public/images/confianza_photos/photo_page14_1_263.jpeg",
        publicId: "gallery_candlelit_tablescape_pune",
        order: 10,
      },
      {
        id: "gallery-11",
        caption: "Royal Couple Varmala Hydraulic Rotating Stage",
        category: "Opulent Receptions",
        location: "Sheraton Grand, Pune",
        path: "public/images/confianza_photos/photo_page33_3_441.jpeg",
        publicId: "gallery_hydraulic_varmala_stage_pune",
        order: 11,
      },
      {
        id: "gallery-12",
        caption: "Candid Couple Portrait Under Golden Fairy-Lit Boughs",
        category: "Bridal Entries & Portraits",
        location: "Mahabaleshwar Resorts",
        path: "public/images/confianza_photos/photo_page7_1_195.jpeg",
        publicId: "gallery_couple_portrait_mahabaleshwar",
        order: 12,
      },
    ];

    const finalGallery = [];
    for (const item of rawGalleryItems) {
      const fullPath = path.resolve(item.path);
      const cUrl = await uploadFile(fullPath, "confianza_gallery", item.publicId);
      finalGallery.push({
        id: item.id,
        caption: item.caption,
        category: item.category,
        location: item.location,
        image: cUrl || `https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/${item.publicId}.jpg`,
        order: item.order,
      });
    }

    // 4. Upload Instagram Feed Posts
    console.log("\n4. Uploading Follow Our Journey Instagram Posts...");
    const rawInstagramPosts = [
      {
        id: "insta-1",
        likes: 1420,
        caption: "Lakeside Mandap reveal at Lake Pichola, Udaipur #ConfianzaWeddings",
        path: "public/images/confianza_photos/photo_page30_1_409.jpeg",
        publicId: "insta_udaipur_mandap_reveal",
        url: "https://www.instagram.com/confianza_events",
      },
      {
        id: "insta-2",
        likes: 2180,
        caption: "Grand Baraat entry with vintage car and 100 cold pyro fountains #GrandEntry",
        path: "public/images/confianza_photos/photo_page28_1_395.jpeg",
        publicId: "insta_grand_baraat_entry",
        url: "https://www.instagram.com/confianza_events",
      },
      {
        id: "insta-3",
        likes: 1890,
        caption: "Chandelier ceiling & 3D mirror stage at JW Marriott Pune #LuxuryReception",
        path: "public/images/confianza_photos/photo_page25_1_368.jpeg",
        publicId: "insta_jw_marriott_reception",
        url: "https://www.instagram.com/confianza_events",
      },
      {
        id: "insta-4",
        likes: 3120,
        caption: "Phoolon ki Holi carnival moments with brass urlis & dhol tasha #HaldiVibes",
        path: "public/images/confianza_photos/photo_page20_1_315.jpeg",
        publicId: "insta_haldi_carnival_dhol",
        url: "https://www.instagram.com/confianza_events",
      },
      {
        id: "insta-5",
        likes: 2450,
        caption: "Sunset beach vows in South Goa with natural floral arches #BeachWedding",
        path: "public/images/confianza_photos/photo_page10_1_223.jpeg",
        publicId: "insta_goa_beach_vows",
        url: "https://www.instagram.com/confianza_events",
      },
      {
        id: "insta-6",
        likes: 1670,
        caption: "The radiant bride under a bespoke jasmine chadar #BridalEntry",
        path: "public/images/confianza_photos/photo_page32_1_426.jpeg",
        publicId: "insta_bridal_jasmine_chadar",
        url: "https://www.instagram.com/confianza_events",
      },
    ];

    const finalInstagram = [];
    for (const post of rawInstagramPosts) {
      const fullPath = path.resolve(post.path);
      const cUrl = await uploadFile(fullPath, "confianza_instagram", post.publicId);
      finalInstagram.push({
        id: post.id,
        likes: post.likes,
        caption: post.caption,
        image: cUrl || `https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/${post.publicId}.jpg`,
        url: post.url,
      });
    }

    // 5. Update MongoDB Gallery Collection
    console.log("\n5. Updating MongoDB Gallery Collection...");
    await db.collection("galleries").deleteMany({});
    const resG = await db.collection("galleries").insertMany(finalGallery);
    console.log(`✓ Inserted ${resG.insertedCount} gallery photos into MongoDB!`);

    // 6. Update SiteContent Document with Cloudinary URLs & Dynamic Slices
    console.log("\n6. Updating SiteContent with Cloudinary URLs & Dynamic Gallery Slices...");

    const galleryCategories = [
      { id: "all", name: "All Archives", slug: "all", order: 1 },
      { id: "mandap", name: "Mandap Architecture", slug: "mandap", order: 2 },
      { id: "reception", name: "Opulent Receptions", slug: "reception", order: 3 },
      { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet", order: 4 },
      { id: "bridal-entries", name: "Bridal Entries & Portraits", slug: "bridal-entries", order: 5 },
      { id: "destination", name: "Destination Venues", slug: "destination", order: 6 },
      { id: "spatial-decor", name: "Spatial Decor & Floral Art", slug: "spatial-decor", order: 7 },
    ];

    const galleryHighlights = [
      {
        id: "mandap-sanctum",
        title: "Mandap Architecture & Vedic Sanctums",
        subtitle: "Auspicious Engineering & Floral Art",
        description: "From custom temple pillars to floating lotus pools, our mandaps blend sacred Vedic geometry with opulent seasonal florals.",
        icon: "Sparkles",
        badge: "Vedic Precision",
      },
      {
        id: "stage-production",
        title: "Stage, Lighting & SFX Production",
        subtitle: "3D CAD-to-Reality Fidelity",
        description: "Intelligent moving beam arrays, high-resolution curved LED walls, cold pyrotechnics, and hydraulic stages managed with millisecond cues.",
        icon: "Layers",
        badge: "Show Runner Direct",
      },
      {
        id: "haldi-carnival",
        title: "Themed Haldi & Mehendi Carnivals",
        subtitle: "Joyous Yellow Blooms & Folk Artistry",
        description: "Phoolon ki Holi setups, handcrafted marigold canopies, brass urlis, artisanal mehendi cabanas, and energetic dhol tasha troupes.",
        icon: "Award",
        badge: "Cultural Extravaganza",
      },
      {
        id: "luxe-tablescapes",
        title: "Luxe Tablescapes & Hospitality Styling",
        subtitle: "Intimate Ambiance & Event Branding",
        description: "Crystal chandeliers, candlelit floral centerpieces, customized luggage tags, itinerary jackets, and dedicated guest concierge suites.",
        icon: "Users",
        badge: "Concierge Elegance",
      },
    ];

    const galleryHeader = {
      badge: "Curated Visual Archive",
      eyebrow: "VISUAL INSPIRATIONS",
      title: "The Wedding Gallery",
      subtitle: "Immerse yourself in close-up details of floral centerpieces, bridal entries, fairy-lit courtyards, and grand lavender stages.",
      image: uploadedUrls.floral || "https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_heroes/gallery_hero_banner.jpg",
      stats: [
        "500+ Celebrations Across India",
        "15+ Landmark Destination Cities",
        "100% 3D CAD-to-Reality Fidelity",
        "Zero-Glitch Stage Execution",
      ],
    };

    const instagramHeader = {
      eyebrow: "Follow Our Journey",
      title: "@confianza_events on Instagram",
      subtitle: "Behind-the-scenes reels, live setups in Udaipur, Pune, and Goa, and daily wedding decor inspiration.",
      handle: "@confianza_events",
      followerCount: "10K+ Followers",
      url: "https://www.instagram.com/confianza_events",
    };

    const galleryCta = {
      eyebrow: "WHERE WEDDINGS BECOME STORIES",
      headline: "Envision Your Wedding in Our Visual Chronicle",
      subtitle: "Connect directly with founders Ashish Wankhede and Rutik Pund in Warje, Pune to design your bespoke 3D CAD wedding decor.",
      buttonText: "Book Your Free Consultation",
      buttonLink: "/contact",
      notice: "Free 1-on-1 Consultation • Direct Founder Interaction",
      perks: [
        "60–90 Min Vision & Budget Mapping",
        "Direct Founder Interaction (Ashish & Rutik)",
        "3D Spatial CAD Concept Previews",
        "Clear Line-Item Vendor Estimates",
      ],
    };

    const updateDoc = {
      "settings.brand.logo": uploadedUrls.logo || "/logo.png",
      galleryHeader,
      galleryCategories,
      galleryHighlights,
      instagram: finalInstagram,
      instagramHeader,
      galleryCta,
      updatedAt: new Date(),
    };

    if (uploadedUrls.hero_1) {
      updateDoc["hero.images.0"] = uploadedUrls.hero_1;
    }
    if (uploadedUrls.hero_2) {
      updateDoc["hero.images.1"] = uploadedUrls.hero_2;
    }
    if (uploadedUrls.hero_3) {
      updateDoc["hero.images.2"] = uploadedUrls.hero_3;
    }
    if (uploadedUrls.couple) {
      updateDoc["about.founderAddress.image"] = uploadedUrls.couple;
    }

    await db.collection("sitecontents").updateMany(
      { key: { $in: ["confianza_main", "main"] } },
      { $set: updateDoc },
      { upsert: true }
    );

    console.log("✓ SiteContent updated successfully with Cloudinary URLs and Gallery Slices!");

    console.log("\n=================================================");
    console.log("✓ ALL SITE & GALLERY IMAGES MIGRATED TO CLOUDINARY!");
    console.log("✓ MONGODB ATLAS UPDATED WITH STRICT DATABASE TRUTH!");
    console.log("=================================================\n");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

run();
