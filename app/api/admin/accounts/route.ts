import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { ensureCertificate } from "@/lib/provision";
import { requireAdmin } from "@/lib/session";

const STATUSES = new Set(["evaluation", "funded", "failed", "passed"]);

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const accountId = String(body?.accountId || "").trim();
  const status = String(body?.status || "").trim();
  if (!accountId || !STATUSES.has(status)) {
    return NextResponse.json({ error: "accountId and a valid status are required." }, { status: 400 });
  }

  const phase =
    status === "funded" ? "Funded" : status === "failed" ? "Failed" : status === "passed" ? "Passed" : "Evaluation";

  const db = sql();
  const current = await db`SELECT * FROM accounts WHERE id = ${accountId} LIMIT 1`;
  const account = current[0];
  if (!account) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const nextTarget = status === "funded" ? 0 : Number(account.profit_target) || 0;
  let profit = Number(account.profit) || 0;
  let balance = Number(account.balance) || Number(account.size) || 0;
  let equity = Number(account.equity) || balance;
  if (status === "funded" && profit <= 0) {
    profit = Math.round(Number(account.size) * 0.05 * 100) / 100;
    balance = Number(account.size) + profit;
    equity = balance;
  }

  const rows = await db`
    UPDATE accounts
    SET status = ${status}, phase = ${phase}, profit_target = ${nextTarget},
        profit = ${profit}, balance = ${balance}, equity = ${equity}
    WHERE id = ${accountId}
    RETURNING *
  `;

  const sizeLabel = `$${Number(account.size).toLocaleString("en-US")}`;
  if (status === "funded") {
    await ensureCertificate(db, {
      userId: String(account.user_id),
      accountId,
      title: `${account.program} — Funded`,
      accountLabel: `${sizeLabel} funded`,
    });
  }
  if (status === "passed") {
    await ensureCertificate(db, {
      userId: String(account.user_id),
      accountId,
      title: `${account.program} evaluation passed`,
      accountLabel: sizeLabel,
    });
  }

  return NextResponse.json({ account: rows[0] });
}
