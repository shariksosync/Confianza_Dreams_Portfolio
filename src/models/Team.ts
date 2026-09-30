import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface ITeam extends Document {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  email?: string;
  specialties?: string[];
  experience?: string;
  order: number;
}

const TeamSchema = new Schema<ITeam>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String, default: "" },
    email: { type: String, default: "contact@confianzaevents.com" },
    specialties: [{ type: String }],
    experience: { type: String, default: "5+ Years" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Team: Model<ITeam> =
  models.Team || model<ITeam>("Team", TeamSchema);
export default Team;
