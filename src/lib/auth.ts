import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  (process.env.NODE_ENV === "production"
    ? (() => {
        throw new Error("Missing ADMIN_SESSION_SECRET in production environment variables");
      })()
    : "dev_fallback_secret_jwt_key_local_only");

const TOKEN_COOKIE_NAME = "confianza_admin_token";

export interface AdminPayload {
  email: string;
  role: string;
  name?: string;
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, ADMIN_SESSION_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, ADMIN_SESSION_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyAdminToken(token);
  } catch {
    return null;
  }
}

export { TOKEN_COOKIE_NAME };
