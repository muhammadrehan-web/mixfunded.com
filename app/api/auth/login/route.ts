import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!isEmail(email) || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const db = sql();
  const rows = await db`SELECT id, name, email, password_hash FROM users WHERE email = ${email} LIMIT 1`;
  const user = rows[0];
  if (!user || !(await verifyPassword(password, String(user.password_hash)))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  return NextResponse.json({ name: user.name, email: user.email });
}
