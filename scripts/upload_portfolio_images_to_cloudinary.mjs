import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Load .env.local
let mongoUri = process.env.MONGODB_URI;
let cloudName = process.env.CLOUDINARY_CLOUD_NAME || "tridevsosync";
let apiKey = process.env.CLOUDINARY_API_KEY || "524682898685858";
let apiSecret = process.env.CLOUDINARY_API_SECRET || "qfF4MNyLFJjU8tOnu2SWVfRqLMw";

if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  const mUri = envContent.match(/MONGODB_URI=(.*)/);
  if (mUri) mongoUri = mUri[1].trim();

  const mName = envContent.match(/CLOUDINARY_CLOUD_NAME=(.*)/);
  if (mName) cloudName = mName[1].trim();

  const mKey = envContent.match(/CLOUDINARY_API_KEY=(.*)/);
  if (mKey) apiKey = mKey[1].trim();

  const mSec = envContent.match(/CLOUDINARY_API_SECRET=(.*)/);
  if (mSec) apiSecret = mSec[1].trim();
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

async function uploadLocalFileToCloudinary(localRelPath, publicId) {
  const absPath = path.resolve("public", localRelPath.replace(/^\//, ""));
  if (!fs.existsSync(absPath)) {
    console.warn(`Local file not found: ${absPath}`);
    return null;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      absPath,
      {
        folder: "confianza_portfolio",
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          console.error(`Upload error for ${localRelPath}:`, error);
          reject(error);
        } else {
          console.log(`✓ Uploaded ${localRelPath} -> ${result.secure_url}`);
          resolve(result.secure_url);
        }
      }
    );
  });
}

async function run() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB!");

    const db = mongoose.connection.db;

    // 1. Upload Portfolio Hero Image
    console.log("\n1. Uploading Portfolio Header Hero Image...");
    const headerCloudUrl = await uploadLocalFileToCloudinary(
      "images/confianza_photos/photo_page6_1_177.jpeg",
      "portfolio_hero_banner"
    );

    if (headerCloudUrl) {
      await db.collection("sitecontents").updateOne(
        { key: "main" },
        {
          $set: {
            "portfolioHeader.image": headerCloudUrl,
            updatedAt: new Date(),
          },
        }
      );
      console.log(`Updated portfolioHeader.image in MongoDB -> ${headerCloudUrl}`);
    }

    // 2. Portfolio Projects
    console.log("\n2. Uploading Portfolio Projects Images...");
    const rawPortfolios = [
      {
        id: "portfolio-1",
        title: "Lakeside Royal Mandap & Sunset Reflection",
        category: "Mandap & Rituals",
        location: "Udaipur, Rajasthan",
        localImage: "images/confianza_photos/photo_page30_1_409.jpeg",
        publicId: "portfolio_lakeside_royal_mandap",
        description: "Vedic mandap engineering with floating floral arches and atmospheric sunset reflection over Lake Pichola.",
        featured: true,
        order: 1,
      },
      {
        id: "portfolio-2",
        title: "Royal Fort Heritage Nuptials & Grand Entry",
        category: "Destination Weddings",
        location: "Jaipur, Rajasthan",
        localImage: "images/confianza_photos/photo_page28_1_395.jpeg",
        publicId: "portfolio_royal_fort_heritage_nuptials",
        description: "Heritage palace courtyard with regal elephant procession, mashaal fire torches, and custom gold carved pillars.",
        featured: true,
        order: 2,
      },
      {
        id: "portfolio-3",
        title: "Crystal Grandeur Ballroom Reception",
        category: "Opulent Receptions",
        location: "JW Marriott, Pune",
        localImage: "images/confianza_photos/photo_page25_1_368.jpeg",
        publicId: "portfolio_crystal_grandeur_reception",
        description: "Chandelier-lit luxury stage featuring geometric 3D mirror arches, LED warm washes, and live orchestra.",
        featured: true,
        order: 3,
      },
      {
        id: "portfolio-4",
        title: "Neon Starlight Sangeet & Live Concert Stage",
        category: "Sangeet & Stage",
        location: "The Westin, Pune",
        localImage: "images/confianza_photos/photo_page23_4_354.jpeg",
        publicId: "portfolio_neon_starlight_sangeet",
        description: "High-energy concert stage with curved LED screens, pyrotechnic cold sparks, and intelligent beam arrays.",
        featured: true,
        order: 4,
      },
      {
        id: "portfolio-5",
        title: "Sunset Beach Vows & Coastal Floral Canopy",
        category: "Destination Weddings",
        location: "South Goa",
        localImage: "images/confianza_photos/photo_page10_1_223.jpeg",
        publicId: "portfolio_sunset_beach_vows",
        description: "Boho-chic beachside canopy with pampas grass, custom wooden boardwalk, and live acoustic violinists.",
        featured: false,
        order: 5,
      },
      {
        id: "portfolio-6",
        title: "Botanical Canopy & Spatial Floral Archway",
        category: "Floral & Spatial Decor",
        location: "Vedic Village, Kolkata",
        localImage: "images/confianza_photos/photo_page9_1_214.jpeg",
        publicId: "portfolio_botanical_canopy_floral_arch",
        description: "Cascading tuberose (rajnigandha) and Dutch carnation floral ceilings with amber mood lanterns.",
        featured: false,
        order: 6,
      },
      {
        id: "portfolio-7",
        title: "Regal Royal Mandap with Velvet Drapes",
        category: "Mandap & Rituals",
        location: "Royal Orchid, Pune",
        localImage: "images/confianza_photos/photo_page13_1_256.jpeg",
        publicId: "portfolio_regal_royal_mandap_velvet",
        description: "Sacred havan kund setup with soundproof acoustical baffle design and seamless ritual management.",
        featured: false,
        order: 7,
      },
      {
        id: "portfolio-8",
        title: "Marigold Sunburst Haldi Courtyard",
        category: "Haldi & Mehendi",
        location: "Warje, Pune",
        localImage: "images/confianza_photos/photo_page20_1_315.jpeg",
        publicId: "portfolio_marigold_sunburst_haldi",
        description: "Vibrant yellow marigold canopies, traditional brass urlis with rose petals, and artisanal mehendi lounges.",
        featured: false,
        order: 8,
      },
      {
        id: "portfolio-9",
        title: "Grand Couple Royal Walkway & Varmala Stage",
        category: "Opulent Receptions",
        location: "Conrad Hotel, Pune",
        localImage: "images/confianza_photos/photo_page32_1_426.jpeg",
        publicId: "portfolio_grand_couple_royal_walkway",
        description: "Dramatic hydraulic varmala stage with synchronized dry-ice clouds and petal cannons.",
        featured: true,
        order: 9,
      },
      {
        id: "portfolio-10",
        title: "VIP Executive Hospitality Lounge & Concierge",
        category: "Hospitality & Suites",
        location: "Ritz-Carlton, Pune",
        localImage: "images/confianza_photos/photo_page14_1_263.jpeg",
        publicId: "portfolio_vip_executive_hospitality",
        description: "Bespoke welcome desk with traditional tikka ceremonies, customized guest itineraries, and luxury hampers.",
        featured: false,
        order: 10,
      },
    ];

    const updatedPortfolios = [];
    for (const item of rawPortfolios) {
      const cUrl = await uploadLocalFileToCloudinary(item.localImage, item.publicId);
      updatedPortfolios.push({
        id: item.id,
        title: item.title,
        category: item.category,
        location: item.location,
        image: cUrl || `/${item.localImage}`,
        description: item.description,
        featured: item.featured,
        order: item.order,
        createdAt: new Date(),
      });
    }

    await db.collection("portfolios").deleteMany({});
    const resP = await db.collection("portfolios").insertMany(updatedPortfolios);
    console.log(`\nUpdated ${resP.insertedCount} portfolio projects in MongoDB with Cloudinary URLs.`);

    // 3. Testimonials / Words of Gratitude
    console.log("\n3. Uploading Words of Gratitude Couple Photos...");
    const rawTestimonials = [
      {
        id: "review-1",
        name: "Ananya & Rohit Roy",
        location: "Udaipur Destination Wedding",
        date: "November 2025",
        rating: 5,
        localImage: "images/confianza_photos/photo_page33_3_441.jpeg",
        publicId: "testimonial_ananya_rohit_roy",
        text: "Ashish and Rutik transformed our 3-day royal palace wedding into pure magic. From managing our 250 guest transfers to the breath-taking lakeside mandap, their shadow management team took care of every minute detail seamlessly!",
        featured: true,
      },
      {
        id: "review-2",
        name: "Pooja & Shounak Banerjee",
        location: "JW Marriott, Pune",
        date: "December 2025",
        rating: 5,
        localImage: "images/confianza_photos/photo_page7_1_195.jpeg",
        publicId: "testimonial_pooja_shounak_banerjee",
        text: "The decor execution was identical to the 3D CAD design they presented during our consultation. Confianza's show runner handled timeline cues with absolute poise. Truly the best wedding decision we made.",
        featured: true,
      },
      {
        id: "review-3",
        name: "Rhea & Vikramaditya Sen",
        location: "Jaipur Heritage Fort Nuptials",
        date: "January 2026",
        rating: 5,
        localImage: "images/confianza_photos/photo_page32_1_426.jpeg",
        publicId: "testimonial_rhea_vikramaditya_sen",
        text: "Ritual management and artist coordination were world-class! Every priest requirement, sangeet cue, and guest hospitality need was handled with immense warmth and professionalism.",
        featured: true,
      },
      {
        id: "review-4",
        name: "Devika & Arpan Mukherjee",
        location: "Warje, Pune",
        date: "February 2026",
        rating: 5,
        localImage: "images/confianza_photos/photo_page11_1_230.jpeg",
        publicId: "testimonial_devika_arpan_mukherjee",
        text: "From our sunny yellow Haldi to our candlelit Sufi night, Ashish was personally on-ground making sure my parents didn't have to worry about a single vendor. Unmatched dedication!",
        featured: true,
      },
    ];

    const updatedTestimonials = [];
    for (const t of rawTestimonials) {
      const cUrl = await uploadLocalFileToCloudinary(t.localImage, t.publicId);
      updatedTestimonials.push({
        id: t.id,
        name: t.name,
        location: t.location,
        date: t.date,
        rating: t.rating,
        image: cUrl || `/${t.localImage}`,
        text: t.text,
        featured: t.featured,
        createdAt: new Date(),
      });
    }

    await db.collection("testimonials").deleteMany({});
    const resT = await db.collection("testimonials").insertMany(updatedTestimonials);
    console.log(`\nUpdated ${resT.insertedCount} testimonials in MongoDB with Cloudinary URLs.`);

    console.log("\n=======================================================");
    console.log("✓ ALL PORTFOLIO MODULE IMAGES UPLOADED TO CLOUDINARY!");
    console.log("✓ MONGODB ATLAS UPDATED WITH CLOUDINARY SECURE URLS!");
    console.log("=======================================================\n");

    console.log("Cloudinary URLs sample:");
    console.log("- Header Banner:", headerCloudUrl);
    console.log("- Portfolio 1:", updatedPortfolios[0]?.image);
    console.log("- Testimonial 1:", updatedTestimonials[0]?.image);
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

run();
