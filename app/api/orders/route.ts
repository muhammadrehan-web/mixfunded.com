import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { findPlan, PLATFORMS } from "@/lib/data";
import { creditOrderCommission } from "@/lib/affiliate";
import { sendOrderEmail } from "@/lib/mail";
import { provisionAccount } from "@/lib/provision";
import { requireUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;

  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const db = sql();
  const rows = await db`
    SELECT id, program_id, program_label, account_size, fee_usdt, platform, status, payment_method, created_at
    FROM orders
    WHERE user_id = ${auth.user.id}
    ORDER BY created_at DESC
  `;

  return NextResponse.json({ orders: rows });
}

export async function POST(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;

  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const programId = String(body?.programId || "").trim();
  const size = String(body?.size || "").trim();
  const platform = String(body?.platform || "MT5").trim().toUpperCase();

  if (!PLATFORMS.includes(platform as (typeof PLATFORMS)[number])) {
    return NextResponse.json({ error: "Choose MT4 or MT5." }, { status: 400 });
  }

  const matched = findPlan(programId, size);
  if (!matched) {
    return NextResponse.json({ error: "That challenge plan was not found." }, { status: 400 });
  }

  const db = sql();
  const users = await db`SELECT id, name, email FROM users WHERE id = ${auth.user.id} LIMIT 1`;
  const user = users[0];
  if (!user) {
    return NextResponse.json({ error: "No MixFunded account for this login." }, { status: 401 });
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
  await provisionAccount(db, {
    userId: String(user.id),
    orderId: String(order.id),
    program: matched.program,
    plan: matched.plan,
    platform,
  });
  await creditOrderCommission(db, {
    orderId: String(order.id),
    buyerId: String(user.id),
    fee,
    request,
  });

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
