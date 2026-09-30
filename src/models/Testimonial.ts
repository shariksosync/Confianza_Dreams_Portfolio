import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface ITestimonial extends Document {
  id: number;
  name: string;
  image: string;
  rating: number;
  date: string;
  location: string;
  text: string;
  featured: boolean;
  order: number;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, default: "/images/couple.jpg" },
    rating: { type: Number, default: 5 },
    date: { type: String, default: "" },
    location: { type: String, default: "Pune" },
    text: { type: String, required: true },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Testimonial: Model<ITestimonial> =
  models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);
export default Testimonial;
