import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, id, data } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing testimonial ID" }, { status: 400 });
    }

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ id: id }, { _id: new mongoose.Types.ObjectId(id) }] }
      : { id: id };

    if (action === "approve") {
      const updated = await Testimonial.findOneAndUpdate(
        query,
        { $set: { status: "approved", updatedAt: new Date() } },
        { returnDocument: "after", new: true }
      );
      return NextResponse.json({ success: true, message: "Review approved and published!", data: updated });
    }

    if (action === "reject") {
      const updated = await Testimonial.findOneAndUpdate(
        query,
        { $set: { status: "rejected", updatedAt: new Date() } },
        { returnDocument: "after", new: true }
      );
      return NextResponse.json({ success: true, message: "Review rejected.", data: updated });
    }

    if (action === "delete") {
      await Testimonial.deleteOne(query);
      return NextResponse.json({ success: true, message: "Review deleted permanently." });
    }

    if (action === "update" && data) {
      const updated = await Testimonial.findOneAndUpdate(
        query,
        { $set: { ...data, updatedAt: new Date() } },
        { returnDocument: "after", new: true }
      );
      return NextResponse.json({ success: true, message: "Review updated successfully!", data: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/testimonials/moderate error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Moderation failed" },
      { status: 500 }
    );
  }
}
