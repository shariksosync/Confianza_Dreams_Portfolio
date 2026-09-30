import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "tridevsosync",
  api_key: process.env.CLOUDINARY_API_KEY || "524682898685858",
  api_secret: process.env.CLOUDINARY_API_SECRET || "qfF4MNyLFJjU8tOnu2SWVfRqLMw",
  secure: true,
});

async function testUpload() {
  const testImg = path.join(process.cwd(), "public/images/services", "page_10_img_2_X50.jpg");
  if (!fs.existsSync(testImg)) {
    console.error("Image does not exist:", testImg);
    return;
  }

  console.log("Uploading test image to Cloudinary...");
  const res = await cloudinary.uploader.upload(testImg, {
    folder: "confianza_services",
    resource_type: "image",
  });

  console.log("Success! Cloudinary Secure URL:", res.secure_url);
}

testUpload().catch(console.error);
