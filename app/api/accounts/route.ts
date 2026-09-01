import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { mapAccount } from "@/lib/desk";
import { requireUser } from "@/lib/session";

export async function GET(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const db = sql();
  const rows = await db`SELECT * FROM accounts WHERE user_id = ${auth.user.id} ORDER BY created_at DESC`;
  return NextResponse.json({ accounts: rows.map((row) => mapAccount(row as Record<string, unknown>)) });
}
