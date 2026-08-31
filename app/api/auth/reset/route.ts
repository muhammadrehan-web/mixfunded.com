import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { hashPassword, hashToken } from "@/lib/password";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const token = String(body?.token || "").trim();
  const password = String(body?.password || "");

  if (!token || token.length < 32) {
    return NextResponse.json({ error: "This reset link is invalid." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const db = sql();
  const tokenHash = hashToken(token);
  const rows = await db`
    SELECT id, user_id
    FROM password_reset_tokens
    WHERE token_hash = ${tokenHash}
      AND used_at IS NULL
      AND expires_at > now()
    LIMIT 1
  `;
  const reset = rows[0];
  if (!reset) {
    return NextResponse.json({ error: "This reset link is invalid or expired." }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  await db`UPDATE users SET password_hash = ${passwordHash} WHERE id = ${reset.user_id}`;
  await db`UPDATE password_reset_tokens SET used_at = now() WHERE id = ${reset.id}`;
  await db`DELETE FROM password_reset_tokens WHERE user_id = ${reset.user_id} AND used_at IS NULL`;

  return NextResponse.json({ ok: true });
}
