import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://shazadeahmad638_db_user:qzNsl4Vuzkrc8jgo@ac-vh39hfv-shard-00-00.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-01.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-02.nhtzofv.mongodb.net:27017/wsf_db?ssl=true&replicaSet=atlas-wvwfw0-shard-0&authSource=admin&retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const siteColl = db.collection("sitecontents");

  await siteColl.updateOne(
    { key: "confianza_main" },
    {
      $set: {
        "contact.phone": "7057357240",
        "contact.secondaryPhone": "9850983389",
        "contact.whatsapp": "917057357240",
        "contact.email": "confianzaevents2024@gmail.com",
        "contact.owner": "Ashish Wankhede",
        "contact.partner": "Rutik Pund",
        "about.founderAddress.quote":
          "We believe that every couple's love story is unique, and that's what inspires us to create truly personalized weddings.",
        "about.founderAddress.story":
          "At Confianza, we're the romantic and elegant wedding experts who bring love stories to life with passion and precision. We are a dedicated team obsessed with love, laughter, and happily ever afters.\n\nFor us, your event is no less than our own. From sacred heritage rituals to grand multi-day luxury weddings across India, we shoulder all logistics, hospitality, vendor coordination, and minute-by-minute show running so your family can celebrate as honored guests.\n\nWe pledge our continuous devotion to crafting not just flawless weddings, but heartfelt lifelong memories that outlast generations.",
        "about.founderAddress.signatureName": "Ashish Wankhede",
        "about.founderAddress.signatureTitle": "Founder & Principal Director, Confianza Events",
      },
    },
    { upsert: true }
  );

  console.log("MongoDB synchronization complete with official business dossier.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Sync error:", err);
  process.exit(1);
});
