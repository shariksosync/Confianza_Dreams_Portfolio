import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IFaq extends Document {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
}

const FaqSchema = new Schema<IFaq>(
  {
    id: { type: Number, required: true, unique: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Faq: Model<IFaq> =
  models.Faq || model<IFaq>("Faq", FaqSchema);
export default Faq;
