export const REF_COOKIE = "mf_ref";
export const DEFAULT_AFFILIATE_RATE = 0.1;
const REF_MAX_AGE = 60 * 60 * 24 * 60;

export function normalizeCode(raw: string) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 32);
}

export function isAffiliateCode(raw: string) {
  const code = normalizeCode(raw);
  return /^[a-z0-9][a-z0-9_-]{2,31}$/.test(code);
}

export function refCookieAttrs() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: REF_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  };
}

export function refFromRequest(request: Request) {
  const header = request.headers.get("cookie") || "";
  const part = header
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${REF_COOKIE}=`));
  if (!part) return "";
  return normalizeCode(decodeURIComponent(part.slice(REF_COOKIE.length + 1)));
}
