import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IBlog extends Document {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  order: number;
}

const BlogSchema = new Schema<IBlog>(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Blog: Model<IBlog> =
  models.Blog || model<IBlog>("Blog", BlogSchema);
export default Blog;
