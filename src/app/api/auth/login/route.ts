import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { signAdminToken, TOKEN_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username/email and password required" },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const isEmail = cleanUsername.includes("@");

    let admin: any = null;
    if (isEmail) {
      admin = await Admin.findOne({ email: cleanUsername }).exec();
    } else {
      admin = await Admin.findOne({
        $or: [{ email: "confianzaevents@gmail.com" }, { email: cleanUsername }],
      }).exec();
    }

    // Fallback seed if admin doesn't exist yet in the database
    if (!admin) {
      const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);
      admin = await Admin.create({
        email: (process.env.ADMIN_EMAIL || "confianzaevents@gmail.com").toLowerCase(),
        password: hashedPassword,
        name: "Ashish Wankhede",
        role: "superadmin",
      });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Please check username/password." },
        { status: 401 }
      );
    }

    const payload = {
      email: admin.email,
      role: admin.role || "superadmin",
      name: admin.name || "Ashish Wankhede",
    };

    const token = signAdminToken(payload);

    const response = NextResponse.json({
      success: true,
      user: {
        username: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
