import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IGallery extends Document {
  id: number;
  image: string;
  caption: string;
  category: string;
  order: number;
}

const GallerySchema = new Schema<IGallery>(
  {
    id: { type: Number, required: true, unique: true },
    image: { type: String, required: true },
    caption: { type: String, default: "" },
    category: { type: String, default: "Wedding" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Gallery: Model<IGallery> =
  models.Gallery || model<IGallery>("Gallery", GallerySchema);
export default Gallery;
