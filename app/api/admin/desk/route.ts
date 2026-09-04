import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const db = sql();
  const [users, accounts, payouts, tickets, commissions] = await Promise.all([
    db`
      SELECT id, name, email, COALESCE(role, 'trader') AS role,
             COALESCE(kyc_status, 'unverified') AS kyc_status, wallet_trc20, country,
             affiliate_code, COALESCE(affiliate_rate, 0.10) AS affiliate_rate, created_at
      FROM users
      ORDER BY created_at DESC
    `,
    db`
      SELECT a.*, u.email, u.name
      FROM accounts a
      JOIN users u ON u.id = a.user_id
      ORDER BY a.created_at DESC
    `,
    db`
      SELECT p.*, u.email, u.name, a.login
      FROM payouts p
      JOIN users u ON u.id = p.user_id
      JOIN accounts a ON a.id = p.account_id
      ORDER BY p.created_at DESC
    `,
    db`
      SELECT t.*, u.email, u.name
      FROM tickets t
      JOIN users u ON u.id = t.user_id
      ORDER BY t.created_at DESC
    `,
    db`
      SELECT c.id, c.amount, c.rate, c.fee_usdt, c.status, c.created_at,
             a.name AS affiliate_name, a.email AS affiliate_email, a.affiliate_code,
             r.email AS trader_email, o.program_label, o.account_size
      FROM affiliate_commissions c
      JOIN users a ON a.id = c.affiliate_id
      JOIN users r ON r.id = c.referred_user_id
      JOIN orders o ON o.id = c.order_id
      ORDER BY c.created_at DESC
    `,
  ]);

  return NextResponse.json({ users, accounts, payouts, tickets, commissions });
}
