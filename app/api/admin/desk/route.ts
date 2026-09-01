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
  const [users, accounts, payouts, tickets] = await Promise.all([
    db`
      SELECT id, name, email, COALESCE(role, 'trader') AS role,
             COALESCE(kyc_status, 'unverified') AS kyc_status, wallet_trc20, country, created_at
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
  ]);

  return NextResponse.json({ users, accounts, payouts, tickets });
}
