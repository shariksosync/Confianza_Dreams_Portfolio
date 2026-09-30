import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "tridevsosync",
  api_key: process.env.CLOUDINARY_API_KEY || "524682898685858",
  api_secret: process.env.CLOUDINARY_API_SECRET || "qfF4MNyLFJjU8tOnu2SWVfRqLMw",
  secure: true,
});

const srcDir = path.join(process.cwd(), "public/images/services");
const mapFile = path.join(process.cwd(), "scripts/cloudinary_service_images.json");

async function uploadAll() {
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".jpg") || f.endsWith(".png"));
  console.log(`Found ${files.length} images to upload to Cloudinary...`);

  let uploadedMap = {};
  if (fs.existsSync(mapFile)) {
    try {
      uploadedMap = JSON.parse(fs.readFileSync(mapFile, "utf-8"));
    } catch {
      uploadedMap = {};
    }
  }

  // Upload in chunks of 5
  const chunkSize = 5;
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (file) => {
        if (uploadedMap[file]) {
          return;
        }
        const filePath = path.join(srcDir, file);
        try {
          const res = await cloudinary.uploader.upload(filePath, {
            folder: "confianza_services",
            resource_type: "image",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          });
          uploadedMap[file] = res.secure_url;
          console.log(`[${Object.keys(uploadedMap).length}/${files.length}] Uploaded: ${file} -> ${res.secure_url}`);
        } catch (err) {
          console.error(`Failed to upload ${file}:`, err.message);
        }
      })
    );

    // Save incremental map
    fs.writeFileSync(mapFile, JSON.stringify(uploadedMap, null, 2));
  }

  console.log(`All uploads finished. Total Cloudinary URLs mapped: ${Object.keys(uploadedMap).length}`);
}

uploadAll().catch(console.error);
