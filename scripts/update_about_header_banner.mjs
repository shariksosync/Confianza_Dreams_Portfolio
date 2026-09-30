import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://shazadeahmad638_db_user:qzNsl4Vuzkrc8jgo@ac-vh39hfv-shard-00-00.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-01.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-02.nhtzofv.mongodb.net:27017/wsf_db?ssl=true&replicaSet=atlas-wvwfw0-shard-0&authSource=admin&retryWrites=true&w=majority";

async function main() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);

  const col = mongoose.connection.collection("sitecontents");
  const updateRes = await col.updateOne(
    { key: "confianza_main" },
    {
      $set: {
        "about.headerBanner": {
          badge: "Since 2018 • Warje, Pune",
          title: "Where Weddings Become Stories",
          subtitle:
            "At Confianza, we're the romantic and elegant wedding experts who bring love stories to life with passion and precision. For us, your event is no less than our own.",
          image: "/images/hero-1.jpg",
        },
        "about.heading": "Where Weddings Become Stories",
        "about.homepageHeading": "A Pune Studio Devoted to Weddings That Feel Personal",
        "about.homepageStory":
          "Confianza began in 2018 with one belief — a wedding should sound like the couple, not like a catalogue. What started as a two-person decor team in Warje is now a full-service house planning, designing and executing weddings across India.",
      },
    }
  );

  console.log("Update result:", updateRes);

  const updatedDoc = await col.findOne({ key: "confianza_main" });
  console.log("Successfully verified about.headerBanner in MongoDB:", updatedDoc?.about?.headerBanner);

  await mongoose.disconnect();
  console.log("Done!");
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
