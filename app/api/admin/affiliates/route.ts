import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const commissionId = String(body?.commissionId || "").trim();
  const status = String(body?.status || "paid").trim();
  if (!commissionId || !["paid", "pending"].includes(status)) {
    return NextResponse.json({ error: "commissionId and a valid status are required." }, { status: 400 });
  }

  const db = sql();
  const rows = await db`
    UPDATE affiliate_commissions
    SET status = ${status}, paid_at = ${status === "paid" ? new Date().toISOString() : null}
    WHERE id = ${commissionId}
    RETURNING id, status, amount
  `;
  if (!rows[0]) return NextResponse.json({ error: "Commission not found." }, { status: 404 });
  return NextResponse.json({ commission: rows[0] });
}
