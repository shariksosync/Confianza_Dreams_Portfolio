import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const oldConf = {
  cloud_name: "tridevsosync",
  api_key: "524682898685858",
  api_secret: "qfF4MNyLFJjU8tOnu2SWVfRqLMw",
  secure: true,
};

const newConf = {
  cloud_name: "kipl0jjw",
  api_key: "854869939992178",
  api_secret: "qc7VyjcJ-awe7isKbgR5AJ8_lvM",
  secure: true,
};

async function migrateAllCloudinaryImages() {
  console.log("=== PHASE 1: MIGRATING CLOUDINARY IMAGES (tridevsosync -> kipl0jjw) ===");
  const mapPath = path.join(process.cwd(), "scripts", "cloudinary_migration_map.json");
  let urlMap = {};
  if (fs.existsSync(mapPath)) {
    try {
      urlMap = JSON.parse(fs.readFileSync(mapPath, "utf8"));
    } catch (e) {
      urlMap = {};
    }
  }

  // STEP 1: Fetch ALL Confianza resources from old account
  console.log("Connecting to old Cloudinary account to list all Confianza resources...");
  cloudinary.config(oldConf);

  let next_cursor = null;
  const allResources = [];
  do {
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix: "confianza",
      max_results: 500,
      next_cursor,
    });
    for (const r of res.resources) {
      allResources.push(r);
    }
    next_cursor = res.next_cursor;
  } while (next_cursor);

  console.log(`✓ Fetched ${allResources.length} total Confianza resources from old account.`);

  // STEP 2: Configure target new Cloudinary account and upload
  console.log("Switching configuration to new Cloudinary account (kipl0jjw)...");
  cloudinary.config(newConf);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < allResources.length; i++) {
    const r = allResources[i];
    const oldUrl = r.secure_url;
    const publicId = r.public_id;

    if (urlMap[oldUrl]) {
      skipCount++;
      continue;
    }

    try {
      const uploadRes = await cloudinary.uploader.upload(oldUrl, {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      });

      urlMap[oldUrl] = uploadRes.secure_url;
      successCount++;

      if (successCount % 10 === 0 || i === allResources.length - 1) {
        console.log(`[${i + 1}/${allResources.length}] Transferred: ${publicId} -> ${uploadRes.secure_url}`);
        fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2));
      }
    } catch (err) {
      console.error(`Failed to transfer ${publicId} (${oldUrl}):`, err.message || err);
      failCount++;
    }
  }

  fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2));
  console.log("\n=== Cloudinary Migration Complete ===");
  console.log(`Total items: ${allResources.length}`);
  console.log(`Successfully transferred: ${successCount}`);
  console.log(`Already in map (skipped): ${skipCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Mapping saved to: ${mapPath}`);
}

migrateAllCloudinaryImages().catch(console.error);
