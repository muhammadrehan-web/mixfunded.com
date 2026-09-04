import { NextResponse } from "next/server";
import { isAffiliateCode, normalizeCode, REF_COOKIE, refCookieAttrs } from "@/lib/affiliate";
import { hasDatabase, sql } from "@/lib/db";

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const code = normalizeCode(String(body?.code || ""));
  if (!isAffiliateCode(code)) {
    return NextResponse.json({ error: "That affiliate link is invalid." }, { status: 400 });
  }

  const db = sql();
  const affiliates = await db`SELECT id FROM users WHERE affiliate_code = ${code} LIMIT 1`;
  const affiliate = affiliates[0];
  if (!affiliate) {
    return NextResponse.json({ error: "That affiliate link was not found." }, { status: 404 });
  }

  await db`
    INSERT INTO affiliate_clicks (affiliate_id, code)
    VALUES (${affiliate.id}, ${code})
  `;

  const res = NextResponse.json({ ok: true, code });
  res.cookies.set(REF_COOKIE, code, refCookieAttrs());
  return res;
}
