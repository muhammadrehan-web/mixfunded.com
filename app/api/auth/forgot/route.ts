import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { hasMailer, sendPasswordResetEmail } from "@/lib/mail";
import { hashToken, newResetToken } from "@/lib/password";

export const runtime = "nodejs";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function appOrigin() {
  return String(process.env.NEXT_PUBLIC_SITE_URL || "https://mixfundedcom.vercel.app").replace(/\/$/, "");
}

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }
  if (!hasMailer()) {
    return NextResponse.json({ error: "Gmail is not configured for reset mail." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const db = sql();
  const users = await db`SELECT id, name, email FROM users WHERE email = ${email} LIMIT 1`;
  const user = users[0];

  if (user) {
    const token = newResetToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await db`DELETE FROM password_reset_tokens WHERE user_id = ${user.id} AND used_at IS NULL`;
    await db`
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
      VALUES (${user.id}, ${tokenHash}, ${expiresAt})
    `;
    try {
      await sendPasswordResetEmail({
        name: String(user.name),
        email: String(user.email),
        resetUrl: `${appOrigin()}/reset-password?token=${token}`,
      });
    } catch (error) {
      console.error("Reset email failed", error instanceof Error ? error.message : "unknown");
      return NextResponse.json({ error: "Could not send the reset mail." }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    message: "If that email has a MixFunded desk, a reset link is on the way.",
  });
}
