import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface ITestimonial extends Document {
  id: any;
  name: string;
  partnerName?: string;
  relationship?: string;
  image: string;
  videoUrl?: string;
  rating: number;
  category?: string;
  location: string;
  date: string;
  text: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  showOnPortfolio?: boolean;
  order: number;
  email?: string;
  adminNotes?: string;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    id: { type: Schema.Types.Mixed, required: true },
    name: { type: String, required: true },
    partnerName: { type: String, default: "" },
    relationship: { type: String, default: "Bride & Groom" },
    image: { type: String, default: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838237/confianza_portfolio/testimonial_ananya_rohit_roy.jpg" },
    videoUrl: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    category: { type: String, default: "Royal & Destination Weddings" },
    location: { type: String, default: "Pune" },
    date: { type: String, default: "" },
    text: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
    featured: { type: Boolean, default: true },
    showOnPortfolio: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    email: { type: String, default: "" },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true, strict: false }
);

export const Testimonial: Model<ITestimonial> =
  models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);
export default Testimonial;
