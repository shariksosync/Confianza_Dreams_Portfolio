import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const oldUri =
  "mongodb://shazadeahmad638_db_user:qzNsl4Vuzkrc8jgo@ac-vh39hfv-shard-00-00.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-01.nhtzofv.mongodb.net:27017,ac-vh39hfv-shard-00-02.nhtzofv.mongodb.net:27017/wsf_db?ssl=true&replicaSet=atlas-wvwfw0-shard-0&authSource=admin&retryWrites=true&w=majority";

const newUri =
  "mongodb+srv://confianzaevents2024_db_user:cy7ZRvW8okRAjNKk@cluster0.rllxgeo.mongodb.net/confianza?appName=Cluster0";

// Confianza specific collections
const CONFIANZA_COLLECTIONS = [
  "sitecontents",
  "services",
  "portfolios",
  "galleries",
  "packages",
  "testimonials",
  "teams",
  "blogs",
  "faqs",
  "admins",
  "inquiries",
];

// Recursive helper to transform Cloudinary URLs in documents
function rewriteCloudinaryUrls(obj, map) {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => rewriteCloudinaryUrls(item, map));
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      let str = value;
      // If exact match in migration map
      if (map[str]) {
        str = map[str];
      } else if (str.includes("res.cloudinary.com/tridevsosync/")) {
        // Fallback domain pattern replacement
        str = str.replace(/res\.cloudinary\.com\/tridevsosync\//g, "res.cloudinary.com/kipl0jjw/");
      }
      result[key] = str;
    } else if (typeof value === "object" && value !== null) {
      result[key] = rewriteCloudinaryUrls(value, map);
    } else {
      result[key] = value;
    }
  }
  return result;
}

async function migrateMongo() {
  console.log("=== PHASE 2: MIGRATING MONGODB COLLECTIONS (wsf_db -> confianza) ===");

  const mapPath = path.join(process.cwd(), "scripts", "cloudinary_migration_map.json");
  let urlMap = {};
  if (fs.existsSync(mapPath)) {
    try {
      urlMap = JSON.parse(fs.readFileSync(mapPath, "utf8"));
      console.log(`Loaded ${Object.keys(urlMap).length} mapped Cloudinary URLs.`);
    } catch (e) {
      console.warn("Could not load urlMap, will use standard domain substitution:", e.message);
    }
  }

  console.log("Connecting to Source MongoDB (wsf_db)...");
  const oldClient = new MongoClient(oldUri, { serverSelectionTimeoutMS: 15000 });
  await oldClient.connect();
  const oldDb = oldClient.db("wsf_db");

  console.log("Connecting to Destination MongoDB (confianza)...");
  const newClient = new MongoClient(newUri, { serverSelectionTimeoutMS: 15000 });
  await newClient.connect();
  const newDb = newClient.db("confianza");

  const summary = [];

  for (const colName of CONFIANZA_COLLECTIONS) {
    const srcCol = oldDb.collection(colName);
    const destCol = newDb.collection(colName);

    const docs = await srcCol.find({}).toArray();
    console.log(`\nProcessing collection '${colName}' (${docs.length} documents)...`);

    if (docs.length === 0) {
      console.log(`  Collection '${colName}' is empty. Skipping.`);
      summary.push({ collection: colName, sourceCount: 0, destCount: 0, status: "Empty" });
      continue;
    }

    // Rewrite Cloudinary URLs
    const transformedDocs = docs.map((doc) => rewriteCloudinaryUrls(doc, urlMap));

    // Clear destination collection to prevent duplicate key collisions during re-run
    await destCol.deleteMany({});

    // Insert all documents
    const insertRes = await destCol.insertMany(transformedDocs);
    const destCount = await destCol.countDocuments();

    console.log(`  ✓ Inserted ${insertRes.insertedCount} docs into '${colName}'. Verified count: ${destCount}`);
    summary.push({
      collection: colName,
      sourceCount: docs.length,
      destCount: destCount,
      status: docs.length === destCount ? "Verified Match" : "COUNT MISMATCH",
    });
  }

  console.log("\n=== MongoDB Migration Summary ===");
  console.table(summary);

  await oldClient.close();
  await newClient.close();
  console.log("\nDatabase connections closed. Migration complete!");
}

migrateMongo().catch(console.error);
