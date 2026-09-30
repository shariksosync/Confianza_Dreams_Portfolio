import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  phone: string;
  email: string;
  eventDate?: string;
  service?: string;
  budget?: string;
  message?: string;
  status: "unread" | "contacted" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    eventDate: { type: String, default: "" },
    service: { type: String, default: "Full Wedding Planning" },
    budget: { type: String, default: "Flexible" },
    message: { type: String, default: "" },
    status: { type: String, enum: ["unread", "contacted", "archived"], default: "unread" },
  },
  { timestamps: true }
);

export const Inquiry: Model<IInquiry> =
  models.Inquiry || model<IInquiry>("Inquiry", InquirySchema);
export default Inquiry;
