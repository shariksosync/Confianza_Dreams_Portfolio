import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import Service from "@/models/Service";
import Portfolio from "@/models/Portfolio";
import Gallery from "@/models/Gallery";
import Package from "@/models/Package";
import Testimonial from "@/models/Testimonial";
import Team from "@/models/Team";
import Faq from "@/models/Faq";
import Blog from "@/models/Blog";
import Admin from "@/models/Admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;

    if (!db) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    // Wipe all collections
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      await db.collection(col.name).drop();
    }

    // Create default Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", salt);
    await Admin.create({
      email: (process.env.ADMIN_EMAIL || "confianzaevents@gmail.com").toLowerCase(),
      password: hashedPassword,
      name: "Ashish Wankhede",
      role: "superadmin",
    });

    return NextResponse.json({
      success: true,
      message: "Database wiped and initial admin created successfully",
    });
  } catch (error: any) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Seeding failed" },
      { status: 500 }
    );
  }
}
