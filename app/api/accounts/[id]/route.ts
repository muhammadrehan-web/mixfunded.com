import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { mapAccount, mapTrade } from "@/lib/desk";
import { requireUser } from "@/lib/session";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const { id } = await params;
  const db = sql();
  const rows = await db`SELECT * FROM accounts WHERE id = ${id} AND user_id = ${auth.user.id} LIMIT 1`;
  const account = rows[0];
  if (!account) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const trades = await db`
    SELECT * FROM trades WHERE account_id = ${id} AND user_id = ${auth.user.id} ORDER BY opened_at DESC
  `;

  return NextResponse.json({
    account: mapAccount(account as Record<string, unknown>),
    trades: trades.map((row) => mapTrade(row as Record<string, unknown>)),
  });
}
