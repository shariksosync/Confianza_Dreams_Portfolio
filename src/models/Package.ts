import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IPackage extends Document {
  id: number;
  name: string;
  price: string;
  tag: string;
  features: string[];
  featured: boolean;
  order: number;
}

const PackageSchema = new Schema<IPackage>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    tag: { type: String, default: "" },
    features: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Package: Model<IPackage> =
  models.Package || model<IPackage>("Package", PackageSchema);
export default Package;
