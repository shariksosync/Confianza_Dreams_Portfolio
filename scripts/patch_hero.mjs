import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import { MongoClient } from "mongodb";
import fs from "fs";

const newUri =
  "mongodb+srv://confianzaevents2024_db_user:cy7ZRvW8okRAjNKk@cluster0.rllxgeo.mongodb.net/confianza?appName=Cluster0";
const map = JSON.parse(fs.readFileSync("scripts/cloudinary_migration_map.json", "utf8"));

async function patchHero() {
  const client = new MongoClient(newUri);
  await client.connect();
  const db = client.db("confianza");
  const doc = await db.collection("sitecontents").findOne({ key: "confianza_main" });
  const updatedImages = (doc.hero.images || []).map(
    (img) => map[img] || img.replace("tridevsosync", "kipl0jjw")
  );
  await db.collection("sitecontents").updateOne(
    { _id: doc._id },
    { $set: { "hero.images": updatedImages } }
  );
  console.log("Updated hero images successfully:", updatedImages);
  await client.close();
}

patchHero().catch(console.error);
