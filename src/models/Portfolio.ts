import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IPortfolio extends Document {
  id: number;
  title: string;
  category: string;
  image: string;
  location: string;
  order: number;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, default: "Pune" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Portfolio: Model<IPortfolio> =
  models.Portfolio || model<IPortfolio>("Portfolio", PortfolioSchema);
export default Portfolio;
