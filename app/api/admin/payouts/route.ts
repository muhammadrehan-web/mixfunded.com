import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { fakeTxid, mapPayout } from "@/lib/desk";
import { ensureCertificate } from "@/lib/provision";
import { requireAdmin } from "@/lib/session";

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const payoutId = String(body?.payoutId || "").trim();
  const status = String(body?.status || "paid").trim();
  if (!payoutId || !["paid", "processing", "eligible"].includes(status)) {
    return NextResponse.json({ error: "payoutId and a valid status are required." }, { status: 400 });
  }

  const db = sql();
  const current = await db`
    SELECT p.*, a.size, a.program
    FROM payouts p
    JOIN accounts a ON a.id = p.account_id
    WHERE p.id = ${payoutId}
    LIMIT 1
  `;
  const row = current[0];
  if (!row) return NextResponse.json({ error: "Payout not found." }, { status: 404 });

  const tx = status === "paid" ? String(body?.tx || row.tx || fakeTxid()) : row.tx || null;
  const updated = await db`
    UPDATE payouts
    SET status = ${status}, tx = ${tx}, paid_at = ${status === "paid" ? new Date().toISOString() : null}
    WHERE id = ${payoutId}
    RETURNING *
  `;

  if (status === "paid") {
    await ensureCertificate(db, {
      userId: String(row.user_id),
      accountId: String(row.account_id),
      title: "Payout — USDT TRC-20",
      accountLabel: `$${Number(row.size).toLocaleString("en-US")} funded`,
    });
  }

  return NextResponse.json({ payout: mapPayout(updated[0] as Record<string, unknown>) });
}
