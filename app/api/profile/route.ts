import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { isTrc20, kycLabel, nextPayoutLabel } from "@/lib/desk";
import { requireUser } from "@/lib/session";

function profilePayload(row: Record<string, unknown>) {
  const kyc = String(row.kyc_status || "unverified");
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    role: String(row.role || "trader"),
    country: String(row.country || ""),
    phone: String(row.phone || ""),
    kyc_status: kyc,
    kyc_label: kycLabel(kyc),
    wallet_trc20: String(row.wallet_trc20 || ""),
    joined: row.created_at
      ? new Date(String(row.created_at)).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "",
    nextPayout: nextPayoutLabel(),
  };
}

export async function GET(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const db = sql();
  const rows = await db`
    SELECT id, name, email, COALESCE(role, 'trader') AS role, country, phone,
           COALESCE(kyc_status, 'unverified') AS kyc_status, wallet_trc20, created_at
    FROM users WHERE id = ${auth.user.id} LIMIT 1
  `;
  if (!rows[0]) return NextResponse.json({ error: "Account not found." }, { status: 401 });
  return NextResponse.json(profilePayload(rows[0] as Record<string, unknown>));
}

export async function PATCH(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const country = String(body?.country ?? "").trim().slice(0, 80);
  const phone = String(body?.phone ?? "").trim().slice(0, 40);
  const wallet = String(body?.wallet_trc20 ?? "").trim();
  const submitKyc = Boolean(body?.submitKyc);

  if (wallet && !isTrc20(wallet)) {
    return NextResponse.json({ error: "Enter a valid USDT TRC-20 address (starts with T)." }, { status: 400 });
  }

  const db = sql();
  const current = await db`SELECT kyc_status FROM users WHERE id = ${auth.user.id} LIMIT 1`;
  const currentKyc = String(current[0]?.kyc_status || "unverified");
  let nextKyc = currentKyc;
  if (submitKyc && currentKyc !== "verified") {
    if (!country) {
      return NextResponse.json({ error: "Country is required before KYC review." }, { status: 400 });
    }
    nextKyc = "pending";
  }

  const rows = await db`
    UPDATE users
    SET
      country = ${country || null},
      phone = ${phone || null},
      wallet_trc20 = ${wallet || null},
      kyc_status = ${nextKyc}
    WHERE id = ${auth.user.id}
    RETURNING id, name, email, COALESCE(role, 'trader') AS role, country, phone, kyc_status, wallet_trc20, created_at
  `;

  return NextResponse.json(profilePayload(rows[0] as Record<string, unknown>));
}
