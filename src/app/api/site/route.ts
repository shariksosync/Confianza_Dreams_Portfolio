import { NextResponse } from "next/server";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(req: Request) {
  try {
    await connectDB();

    const [siteDoc, services, portfolio, gallery, packages, testimonials, team, faq, blogs] =
      await Promise.all([
        SiteContent.findOne({ key: { $in: ["confianza_main", "main"] } }).lean(),
        Service.find({}).sort({ order: 1 }).lean(),
        Portfolio.find({}).sort({ order: 1 }).lean(),
        Gallery.find({}).sort({ order: 1 }).lean(),
        Package.find({}).sort({ order: 1 }).lean(),
        Testimonial.find({}).sort({ order: 1, createdAt: -1 }).lean(),
        Team.find({}).sort({ order: 1 }).lean(),
        Faq.find({}).sort({ order: 1 }).lean(),
        Blog.find({}).sort({ order: 1 }).lean(),
      ]);

    const base: any = siteDoc || {};
    const rawTestimonials = testimonials || [];
    const approvedTestimonials = rawTestimonials.filter(
      (t: any) => t.status === "approved" || !t.status
    );
    const pendingTestimonialsCount = rawTestimonials.filter(
      (t: any) => t.status === "pending"
    ).length;

    const aggregated = {
      settings: base.settings || {},
      hero: base.hero || {},
      about: base.about || {},
      contact: base.contact || {},
      stats: base.stats || [],
      why: base.why || [],
      process: base.process || [],
      beforeAfter: base.beforeAfter || {},
      instagram: base.instagram || [],
      services: services || [],
      serviceCategories: base.serviceCategories || [],
      ceremonies: base.ceremonies || [],
      stationery: base.stationery || [],
      servicesCta: base.servicesCta || {},
      portfolio: portfolio || [],
      portfolioHeader: base.portfolioHeader || {},
      portfolioSection: base.portfolioSection || {},
      portfolioCategories: base.portfolioCategories || [],
      gallery: gallery || [],
      galleryHeader: base.galleryHeader || {},
      galleryCategories: base.galleryCategories || [],
      galleryHighlights: base.galleryHighlights || [],
      galleryCta: base.galleryCta || {},
      packages: packages || [],
      testimonials: approvedTestimonials,
      allTestimonials: rawTestimonials,
      testimonialsPendingCount: pendingTestimonialsCount,
      testimonialsHeader: base.testimonialsHeader || {},
      testimonialsCategories: base.testimonialsCategories || [],
      testimonialsExperience: base.testimonialsExperience || [],
      testimonialsFaq: base.testimonialsFaq || [],
      testimonialsCta: base.testimonialsCta || {},
      instagramHeader: base.instagramHeader || {},
      team: team || [],
      faq: faq || [],
      blogs: blogs || [],
    };

    return NextResponse.json(
      { success: true, data: aggregated, cached: false },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
          "Surrogate-Control": "no-store",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/site error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch site data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: "Missing key" }, { status: 400 });
    }

    // Direct collection mutations
    if (key === "services" && Array.isArray(value)) {
      await Service.deleteMany({});
      if (value.length > 0) {
        await Service.insertMany(
          value.map((v, idx) => {
            const { _id, ...cleanV } = v;
            return {
              ...cleanV,
              id: String(cleanV.id || `service-${Date.now()}-${idx}`),
              order: idx + 1,
            };
          })
        );
      }
    } else if (key === "portfolio" && Array.isArray(value)) {
      await Portfolio.deleteMany({});
      if (value.length > 0) {
        await Portfolio.insertMany(
          value.map((v, idx) => {
            const { _id, ...cleanV } = v;
            return {
              ...cleanV,
              id: String(cleanV.id || `portfolio-${Date.now()}-${idx}`),
              order: idx + 1,
            };
          })
        );
      }
    } else if (key === "gallery" && Array.isArray(value)) {
      await Gallery.deleteMany({});
      if (value.length > 0) {
        await Gallery.insertMany(
          value.map((v, idx) => {
            const { _id, ...cleanV } = v;
            return {
              ...cleanV,
              id: String(cleanV.id || `gallery-${Date.now()}-${idx}`),
              order: idx + 1,
            };
          })
        );
      }
    } else if (key === "packages" && Array.isArray(value)) {
      await Package.deleteMany({});
      if (value.length > 0) {
        await Package.insertMany(
          value.map((v, idx) => {
            const { _id, ...cleanV } = v;
            return {
              ...cleanV,
              id: Number(cleanV.id) || idx + 1,
              order: idx + 1,
            };
          })
        );
      }
    } else if (key === "testimonials" && Array.isArray(value)) {
      await Testimonial.deleteMany({});
      if (value.length > 0) {
        await Testimonial.insertMany(
          value.map((v, idx) => {
            const { _id, ...cleanV } = v;
            return {
              ...cleanV,
              id: String(cleanV.id || Date.now() + idx),
              order: idx + 1,
            };
          })
        );
      }
    } else if (key === "team" && Array.isArray(value)) {
      await Team.deleteMany({});
      if (value.length > 0) {
        await Team.insertMany(
          value.map((v, idx) => {
            const { _id, ...cleanV } = v;
            return {
              ...cleanV,
              id: String(cleanV.id || `team-${Date.now()}-${idx}`),
              order: idx + 1,
            };
          })
        );
      }
    } else if (key === "faq" && Array.isArray(value)) {
      await Faq.deleteMany({});
      if (value.length > 0) {
        await Faq.insertMany(
          value.map((v, idx) => {
            const { _id, ...cleanV } = v;
            return {
              ...cleanV,
              id: Number(cleanV.id) || idx + 1,
              order: idx + 1,
            };
          })
        );
      }
    } else if (key === "blogs" && Array.isArray(value)) {
      await Blog.deleteMany({});
      if (value.length > 0) {
        await Blog.insertMany(
          value.map((v, idx) => {
            const { _id, ...cleanV } = v;
            return {
              ...cleanV,
              id: String(cleanV.id || `blog-${Date.now()}-${idx}`),
              order: idx + 1,
            };
          })
        );
      }
    } else {
      // Top-level SiteContent slice (hero, about, contact, settings, why, stats, process, galleryHeader, etc.)
      await SiteContent.findOneAndUpdate(
        { key: { $in: ["confianza_main", "main"] } },
        { $set: { [key]: value, updatedAt: new Date() }, $setOnInsert: { key: "confianza_main" } },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true, message: `Updated ${key} successfully` });
  } catch (error: any) {
    console.error("PUT /api/site error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update site data" },
      { status: 500 }
    );
  }
}
