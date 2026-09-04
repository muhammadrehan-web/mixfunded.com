import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAffiliateCode, normalizeCode, REF_COOKIE, refCookieAttrs } from "@/lib/affiliate-cookie";

export function middleware(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("ref") || request.nextUrl.searchParams.get("aff") || "";
  const code = normalizeCode(raw);
  const response = NextResponse.next();
  if (isAffiliateCode(code)) {
    response.cookies.set(REF_COOKIE, code, refCookieAttrs());
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/|icon.svg).*)"],
};
