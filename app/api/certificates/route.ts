import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { requireUser } from "@/lib/session";

export async function GET(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const db = sql();
  const rows = await db`
    SELECT id, title, account_label, created_at
    FROM certificates
    WHERE user_id = ${auth.user.id}
    ORDER BY created_at DESC
  `;

  return NextResponse.json({
    certificates: rows.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      account: String(row.account_label),
      date: new Date(String(row.created_at)).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    })),
  });
}
