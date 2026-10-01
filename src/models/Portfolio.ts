import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IPortfolio extends Document {
  id: any;
  title: string;
  category: string;
  image: string;
  location: string;
  description?: string;
  featured?: boolean;
  order: number;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    id: { type: Schema.Types.Mixed, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, default: "Pune" },
    description: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

export const Portfolio: Model<IPortfolio> =
  models.Portfolio || model<IPortfolio>("Portfolio", PortfolioSchema);
export default Portfolio;
