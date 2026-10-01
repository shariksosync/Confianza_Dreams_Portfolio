import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IGallery extends Document {
  id: any;
  image: string;
  caption: string;
  category: string;
  location?: string;
  order: number;
}

const GallerySchema = new Schema<IGallery>(
  {
    id: { type: Schema.Types.Mixed, required: true },
    image: { type: String, required: true },
    caption: { type: String, default: "" },
    category: { type: String, default: "Mandap Architecture" },
    location: { type: String, default: "Pune" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

export const Gallery: Model<IGallery> =
  models.Gallery || model<IGallery>("Gallery", GallerySchema);
export default Gallery;
