import { hasDatabase, sql } from "@/lib/db";
import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "mf_auth";
const MAX_AGE = 60 * 60 * 24 * 30;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) {
    throw new Error("SESSION_SECRET is not set.");
  }
  return value;
}

export function signSession(user: AuthUser) {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = Buffer.from(JSON.stringify({ ...user, exp })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined | null): AuthUser | null {
  const key = process.env.SESSION_SECRET;
  if (!token || !key) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", key).update(payload).digest("base64url");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AuthUser & { exp?: number };
    if (!data.id || !data.email || !data.exp || data.exp < Date.now()) return null;
    return { id: data.id, email: data.email, name: data.name, role: data.role || "trader" };
  } catch {
    return null;
  }
}

export function cookieAttrs() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  };
}

export function withSession(res: NextResponse, user: AuthUser) {
  res.cookies.set(SESSION_COOKIE, signSession(user), cookieAttrs());
  return res;
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", { ...cookieAttrs(), maxAge: 0 });
  return res;
}

export function userFromRequest(request: Request): AuthUser | null {
  const header = request.headers.get("cookie") || "";
  const part = header.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${SESSION_COOKIE}=`));
  if (!part) return null;
  return verifySession(decodeURIComponent(part.slice(SESSION_COOKIE.length + 1)));
}

type AuthOk = { user: AuthUser; error: null };
type AuthFail = { user: null; error: NextResponse };

export function requireUser(request: Request): AuthOk | AuthFail {
  const user = userFromRequest(request);
  if (!user) {
    return { user: null, error: NextResponse.json({ error: "Log in required." }, { status: 401 }) };
  }
  return { user, error: null };
}

export async function requireAdmin(request: Request): Promise<AuthOk | AuthFail> {
  const result = requireUser(request);
  if (result.error) return result;
  if (hasDatabase()) {
    try {
      const db = sql();
      const rows = await db`
        SELECT COALESCE(role, 'trader') AS role FROM users WHERE id = ${result.user.id} LIMIT 1
      `;
      if (String(rows[0]?.role) !== "admin") {
        return { user: null, error: NextResponse.json({ error: "Admin only." }, { status: 403 }) };
      }
      return { user: { ...result.user, role: "admin" }, error: null };
    } catch {
      /* fall through to cookie role */
    }
  }
  if (result.user.role !== "admin") {
    return { user: null, error: NextResponse.json({ error: "Admin only." }, { status: 403 }) };
  }
  return result;
}
