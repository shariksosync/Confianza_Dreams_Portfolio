import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "tridevsosync",
  api_key: process.env.CLOUDINARY_API_KEY || "524682898685858",
  api_secret: process.env.CLOUDINARY_API_SECRET || "qfF4MNyLFJjU8tOnu2SWVfRqLMw",
  secure: true,
});

export async function uploadImageToCloudinary(fileBuffer: Buffer, folder = "confianza_events"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export default cloudinary;
