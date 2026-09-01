import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { mapAccount, mapPayout, mapTrade, nextPayoutLabel } from "@/lib/desk";
import { ANNOUNCEMENTS } from "@/lib/dashboard";
import { requireUser } from "@/lib/session";

export async function GET(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;

  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const db = sql();
  const [meRows, accountRows, tradeRows, payoutRows, ticketRows, certRows] = await Promise.all([
    db`
      SELECT id, name, email, COALESCE(role, 'trader') AS role, country, phone,
             COALESCE(kyc_status, 'unverified') AS kyc_status, wallet_trc20, created_at
      FROM users WHERE id = ${auth.user.id} LIMIT 1
    `,
    db`SELECT * FROM accounts WHERE user_id = ${auth.user.id} ORDER BY created_at DESC`,
    db`SELECT * FROM trades WHERE user_id = ${auth.user.id} ORDER BY opened_at DESC LIMIT 40`,
    db`SELECT * FROM payouts WHERE user_id = ${auth.user.id} ORDER BY created_at DESC`,
    db`SELECT id, subject, status, created_at FROM tickets WHERE user_id = ${auth.user.id} ORDER BY created_at DESC`,
    db`SELECT id, title, account_label, created_at FROM certificates WHERE user_id = ${auth.user.id} ORDER BY created_at DESC`,
  ]);

  const me = meRows[0];
  if (!me) {
    return NextResponse.json({ error: "Account not found." }, { status: 401 });
  }

  return NextResponse.json({
    me: {
      id: String(me.id),
      name: String(me.name),
      email: String(me.email),
      role: String(me.role || "trader"),
      country: String(me.country || ""),
      phone: String(me.phone || ""),
      kyc_status: String(me.kyc_status || "unverified"),
      wallet_trc20: String(me.wallet_trc20 || ""),
      joined: me.created_at
        ? new Date(String(me.created_at)).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "",
      nextPayout: nextPayoutLabel(),
    },
    accounts: accountRows.map((row) => mapAccount(row as Record<string, unknown>)),
    trades: tradeRows.map((row) => mapTrade(row as Record<string, unknown>)),
    payouts: payoutRows.map((row) => mapPayout(row as Record<string, unknown>)),
    tickets: ticketRows,
    certificates: certRows.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      account: String(row.account_label),
      date: new Date(String(row.created_at)).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    })),
    announcements: ANNOUNCEMENTS,
  });
}
