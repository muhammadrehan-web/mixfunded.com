import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { mapPayout } from "@/lib/desk";
import { requireUser } from "@/lib/session";

export async function GET(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const db = sql();
  const rows = await db`SELECT * FROM payouts WHERE user_id = ${auth.user.id} ORDER BY created_at DESC`;
  return NextResponse.json({ payouts: rows.map((row) => mapPayout(row as Record<string, unknown>)) });
}

export async function POST(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const accountId = String(body?.accountId || "").trim();

  const db = sql();
  const users = await db`
    SELECT kyc_status, wallet_trc20 FROM users WHERE id = ${auth.user.id} LIMIT 1
  `;
  const profile = users[0];
  if (String(profile?.kyc_status) !== "verified") {
    return NextResponse.json({ error: "KYC must be verified before a payout request." }, { status: 400 });
  }
  if (!profile?.wallet_trc20) {
    return NextResponse.json({ error: "Add a USDT TRC-20 wallet on Profile first." }, { status: 400 });
  }

  const accounts = accountId
    ? await db`SELECT * FROM accounts WHERE id = ${accountId} AND user_id = ${auth.user.id} LIMIT 1`
    : await db`
        SELECT * FROM accounts
        WHERE user_id = ${auth.user.id} AND status = 'funded'
        ORDER BY profit DESC
        LIMIT 1
      `;
  const account = accounts[0];
  if (!account || String(account.status) !== "funded") {
    return NextResponse.json({ error: "A funded account is required to request a payout." }, { status: 400 });
  }

  const pending = await db`
    SELECT id FROM payouts
    WHERE user_id = ${auth.user.id} AND account_id = ${account.id} AND status = 'processing'
    LIMIT 1
  `;
  if (pending.length > 0) {
    return NextResponse.json({ error: "A payout is already processing for this account." }, { status: 409 });
  }

  const profit = Number(account.profit) || 0;
  const amount = Math.round(profit * 0.8 * 100) / 100;
  if (amount < 50) {
    return NextResponse.json(
      { error: "Need at least $50 profit share (80% of open profit) before requesting." },
      { status: 400 },
    );
  }

  const inserted = await db`
    INSERT INTO payouts (user_id, account_id, amount, status)
    VALUES (${auth.user.id}, ${account.id}, ${amount}, ${"processing"})
    RETURNING *
  `;

  return NextResponse.json({ payout: mapPayout(inserted[0] as Record<string, unknown>) });
}
