import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IService extends Document {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  badge?: string;
  order: number;
}

const ServiceSchema = new Schema<IService>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    features: { type: [String], default: [] },
    badge: { type: String, default: "Specialized Craft" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Service: Model<IService> =
  models.Service || model<IService>("Service", ServiceSchema);
export default Service;
