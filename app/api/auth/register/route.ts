import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/mail";
import { hashPassword } from "@/lib/password";
import { withSession } from "@/lib/session";

export const runtime = "nodejs";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const firstName = String(body?.firstName || "").trim();
  const lastName = String(body?.lastName || "").trim();
  const name = String(body?.name || `${firstName} ${lastName}`).trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const acceptedTerms = Boolean(body?.acceptedTerms);

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }
  if (!acceptedTerms) {
    return NextResponse.json({ error: "Accept the terms to register." }, { status: 400 });
  }

  const db = sql();
  const existing = await db`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (existing.length > 0) {
    return NextResponse.json({ error: "That email already has an account." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const inserted = await db`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email}, ${passwordHash})
    RETURNING id, name, email, COALESCE(role, 'trader') AS role
  `;

  const user = inserted[0];
  let emailSent = false;
  try {
    const mail = await sendWelcomeEmail({ name: String(user.name), email: String(user.email) });
    emailSent = mail.sent;
  } catch (error) {
    console.error("Welcome email failed", error instanceof Error ? error.message : "unknown");
  }

  const auth = {
    id: String(user.id),
    name: String(user.name),
    email: String(user.email),
    role: String(user.role || "trader"),
  };

  try {
    return withSession(NextResponse.json({ name: auth.name, email: auth.email, role: auth.role, emailSent }), auth);
  } catch {
    return NextResponse.json({ error: "Session is not configured. Set SESSION_SECRET." }, { status: 500 });
  }
}
