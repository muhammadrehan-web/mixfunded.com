import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

const STATUSES = new Set(["unverified", "pending", "verified", "rejected"]);

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const userId = String(body?.userId || "").trim();
  const kycStatus = String(body?.kyc_status || "").trim();
  if (!userId || !STATUSES.has(kycStatus)) {
    return NextResponse.json({ error: "userId and a valid kyc_status are required." }, { status: 400 });
  }

  const db = sql();
  const rows = await db`
    UPDATE users SET kyc_status = ${kycStatus}
    WHERE id = ${userId}
    RETURNING id, email, kyc_status
  `;
  if (!rows[0]) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({ user: rows[0] });
}
