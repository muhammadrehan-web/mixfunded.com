import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { findPlan, PLATFORMS } from "@/lib/data";
import { sendOrderEmail } from "@/lib/mail";

export const runtime = "nodejs";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const email = String(new URL(request.url).searchParams.get("email") || "")
    .trim()
    .toLowerCase();
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const db = sql();
  const rows = await db`
    SELECT id, program_id, program_label, account_size, fee_usdt, platform, status, payment_method, created_at
    FROM orders
    WHERE email = ${email}
    ORDER BY created_at DESC
  `;

  return NextResponse.json({ orders: rows });
}

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const programId = String(body?.programId || "").trim();
  const size = String(body?.size || "").trim();
  const platform = String(body?.platform || "MT5").trim().toUpperCase();

  if (!isEmail(email)) {
    return NextResponse.json({ error: "Log in to place an order." }, { status: 401 });
  }
  if (!PLATFORMS.includes(platform as (typeof PLATFORMS)[number])) {
    return NextResponse.json({ error: "Choose MT4 or MT5." }, { status: 400 });
  }

  const matched = findPlan(programId, size);
  if (!matched) {
    return NextResponse.json({ error: "That challenge plan was not found." }, { status: 400 });
  }

  const db = sql();
  const users = await db`SELECT id, name, email FROM users WHERE email = ${email} LIMIT 1`;
  const user = users[0];
  if (!user) {
    return NextResponse.json({ error: "No MixFunded account for that email." }, { status: 401 });
  }

  const fee = Number(matched.plan.fee);
  const inserted = await db`
    INSERT INTO orders (
      user_id, email, program_id, program_label, account_size, fee_usdt, platform, status, payment_method
    )
    VALUES (
      ${user.id},
      ${user.email},
      ${matched.program.id},
      ${matched.program.label},
      ${matched.plan.size},
      ${fee},
      ${platform},
      ${"paid"},
      ${"demo_usdt"}
    )
    RETURNING id, program_label, account_size, fee_usdt, platform, status, created_at
  `;

  const order = inserted[0];
  try {
    await sendOrderEmail({
      name: String(user.name),
      email: String(user.email),
      program: matched.program.label,
      size: matched.plan.size,
      fee: matched.plan.fee,
      platform,
    });
  } catch (error) {
    console.error("Order email failed", error instanceof Error ? error.message : "unknown");
  }

  return NextResponse.json({ order });
}
