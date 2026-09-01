import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { kycLabel, nextPayoutLabel } from "@/lib/desk";
import { requireUser } from "@/lib/session";

export async function GET(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;

  if (!hasDatabase()) {
    return NextResponse.json({
      id: auth.user.id,
      name: auth.user.name,
      email: auth.user.email,
      role: auth.user.role,
      country: "",
      phone: "",
      kyc_status: "unverified",
      kyc_label: kycLabel("unverified"),
      wallet_trc20: "",
      joined: "",
      nextPayout: nextPayoutLabel(),
    });
  }

  const db = sql();
  const rows = await db`
    SELECT id, name, email, COALESCE(role, 'trader') AS role, country, phone,
           COALESCE(kyc_status, 'unverified') AS kyc_status, wallet_trc20, created_at
    FROM users
    WHERE id = ${auth.user.id}
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: "Account not found." }, { status: 401 });
  }

  const joined = row.created_at
    ? new Date(String(row.created_at)).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "";

  return NextResponse.json({
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    role: String(row.role || "trader"),
    country: String(row.country || ""),
    phone: String(row.phone || ""),
    kyc_status: String(row.kyc_status || "unverified"),
    kyc_label: kycLabel(String(row.kyc_status || "unverified")),
    wallet_trc20: String(row.wallet_trc20 || ""),
    joined,
    nextPayout: nextPayoutLabel(),
  });
}
