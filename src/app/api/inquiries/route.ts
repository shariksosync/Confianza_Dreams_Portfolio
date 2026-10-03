import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { sendInquiryEmails } from "@/lib/email";
import { validatePhoneNumber } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      data: inquiries.map((i: any) => ({
        ...i,
        id: i._id.toString(),
        _id: i._id.toString(),
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
    const { name, phone, email, eventDate, service, budget, message, source, priority, notes } = body;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { success: false, error: "Name, phone and email are required" },
        { status: 400 }
      );
    }

    // Server-side strict validation for mobile & telephone numbers
    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error || "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    const cleanPhone = phoneValidation.cleanNumber || phone.trim();
    const leadSource = source || "Wedding Inquiry Form";
    const resolvedBudget =
      budget || (leadSource === "Enquiry Now" ? "To Be Tailored" : "Flexible");

    const doc = await Inquiry.create({
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim().toLowerCase(),
      eventDate: eventDate || "",
      service: service || "Full Wedding Planning",
      budget: resolvedBudget,
      message: message || "",
      source: leadSource,
      priority: priority || "normal",
      notes: notes || "",
      status: "unread",
    });

    // Send confirmation to client and notification to admin asynchronously
    sendInquiryEmails({
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim().toLowerCase(),
      eventDate,
      service,
      budget: resolvedBudget,
      message,
      source: leadSource,
    }).catch((err) => console.error("Background email dispatch error:", err));

    return NextResponse.json({
      success: true,
      data: {
        ...doc.toObject(),
        id: doc._id.toString(),
        _id: doc._id.toString(),
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

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, status, priority, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing inquiry ID" }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (status !== undefined) updateFields.status = status;
    if (priority !== undefined) updateFields.priority = priority;
    if (notes !== undefined) updateFields.notes = notes;

    const updated = await Inquiry.findByIdAndUpdate(id, { $set: updateFields }, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        id: (updated as any)._id.toString(),
        _id: (updated as any)._id.toString(),
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/inquiries error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  return PATCH(req);
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
