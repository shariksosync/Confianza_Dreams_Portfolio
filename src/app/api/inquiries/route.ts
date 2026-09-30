import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { sendInquiryEmails } from "@/lib/email";

export async function GET() {
  try {
    await connectDB();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      data: inquiries.map((i: any) => ({
        ...i,
        id: i._id.toString(),
      })),
    });
  } catch (error: any) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, phone, email, eventDate, service, budget, message } = body;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { success: false, error: "Name, phone and email are required" },
        { status: 400 }
      );
    }

    const doc = await Inquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      eventDate: eventDate || "",
      service: service || "Full Wedding Planning",
      budget: budget || "Flexible",
      message: message || "",
      status: "unread",
    });

    // Send confirmation and admin emails in background
    sendInquiryEmails({
      name,
      phone,
      email,
      eventDate,
      service,
      budget,
      message,
    }).catch((err) => console.error("Background email dispatch error:", err));

    return NextResponse.json({
      success: true,
      data: {
        ...doc.toObject(),
        id: doc._id.toString(),
      },
    });
  } catch (error: any) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing inquiry ID" }, { status: 400 });
    }

    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/inquiries error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
