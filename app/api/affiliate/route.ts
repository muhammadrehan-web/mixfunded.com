import { NextResponse } from "next/server";
import { DEFAULT_AFFILIATE_RATE, ensureAffiliateCode, maskEmail } from "@/lib/affiliate";
import { hasDatabase, sql } from "@/lib/db";
import { requireUser } from "@/lib/session";

export async function GET(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const db = sql();
  const code = await ensureAffiliateCode(db, auth.user.id, auth.user.name);
  const profile = await db`
    SELECT COALESCE(affiliate_rate, ${DEFAULT_AFFILIATE_RATE}) AS rate
    FROM users WHERE id = ${auth.user.id} LIMIT 1
  `;
  const rate = Number(profile[0]?.rate) || DEFAULT_AFFILIATE_RATE;

  const [clicks, referrals, commissions] = await Promise.all([
    db`SELECT count(*)::int AS n FROM affiliate_clicks WHERE affiliate_id = ${auth.user.id}`,
    db`SELECT count(*)::int AS n FROM users WHERE referred_by = ${auth.user.id}`,
    db`
      SELECT c.id, c.fee_usdt, c.rate, c.amount, c.status, c.created_at,
             u.email, o.program_label, o.account_size
      FROM affiliate_commissions c
      JOIN users u ON u.id = c.referred_user_id
      JOIN orders o ON o.id = c.order_id
      WHERE c.affiliate_id = ${auth.user.id}
      ORDER BY c.created_at DESC
    `,
  ]);

  const pending = commissions
    .filter((row) => String(row.status) === "pending")
    .reduce((sum, row) => sum + Number(row.amount), 0);
  const paid = commissions
    .filter((row) => String(row.status) === "paid")
    .reduce((sum, row) => sum + Number(row.amount), 0);

  return NextResponse.json({
    code,
    rate,
    clicks: Number(clicks[0]?.n) || 0,
    referrals: Number(referrals[0]?.n) || 0,
    pending: Math.round(pending * 100) / 100,
    paid: Math.round(paid * 100) / 100,
    commissions: commissions.map((row) => ({
      id: String(row.id),
      trader: maskEmail(String(row.email)),
      program: String(row.program_label),
      size: String(row.account_size),
      fee: Number(row.fee_usdt),
      rate: Number(row.rate),
      amount: Number(row.amount),
      status: String(row.status),
      date: new Date(String(row.created_at)).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    })),
  });
}
