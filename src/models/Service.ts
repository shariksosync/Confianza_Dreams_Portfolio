import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IService extends Document {
  id: any;
  title: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  badge?: string;
  order: number;
}

const ServiceSchema = new Schema<IService>(
  {
    id: { type: Schema.Types.Mixed, required: true },
    title: { type: String, required: true },
    category: { type: String, default: "Signature Planning & Direction" },
    description: { type: String, required: true },
    image: { type: String, required: true },
    features: { type: [String], default: [] },
    badge: { type: String, default: "Specialized Craft" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

export const Service: Model<IService> =
  models.Service || model<IService>("Service", ServiceSchema);
export default Service;
