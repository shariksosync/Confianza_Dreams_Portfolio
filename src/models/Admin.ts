import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
}

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, default: "Ashish Wankhede" },
    role: { type: String, default: "superadmin" },
  },
  { timestamps: true }
);

export const Admin: Model<IAdmin> = models.Admin || model<IAdmin>("Admin", AdminSchema);
export default Admin;
