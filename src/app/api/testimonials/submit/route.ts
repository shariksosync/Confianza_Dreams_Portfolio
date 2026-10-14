import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      partnerName,
      relationship,
      image,
      videoUrl,
      rating,
      category,
      location,
      date,
      text,
      email,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide your name or couple name." },
        { status: 400 }
      );
    }

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "Please share your review or love story." },
        { status: 400 }
      );
    }

    const numRating = typeof rating === "number" ? Math.max(0, Math.min(5, rating)) : 5;

    const newTestimonial = await Testimonial.create({
      id: `review-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      partnerName: partnerName ? partnerName.trim() : "",
      relationship: relationship || "Bride & Groom",
      image: image || "https://res.cloudinary.com/kipl0jjw/image/upload/v1791962075/confianza_portfolio/testimonial_ananya_rohit_roy.jpg",
      videoUrl: videoUrl ? videoUrl.trim() : "",
      rating: numRating,
      category: category || "Royal & Destination Weddings",
      location: location ? location.trim() : "Pune",
      date: date ? date.trim() : new Date().getFullYear().toString(),
      text: text.trim(),
      status: "pending", // ALWAYS pending for public submission
      featured: false,
      order: 999,
      email: email ? email.trim() : "",
      adminNotes: "Submitted via public Testimonials Page.",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your review has been submitted for admin approval and will appear once verified.",
        data: {
          id: newTestimonial.id,
          name: newTestimonial.name,
          status: newTestimonial.status,
        },
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("POST /api/testimonials/submit error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
