import { NextResponse } from "next/server";
import { hasDatabase, sql } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const ticketId = String(body?.ticketId || "").trim();
  const message = String(body?.body || "").trim().slice(0, 4000);
  const status = String(body?.status || "").trim();

  if (!ticketId) {
    return NextResponse.json({ error: "ticketId is required." }, { status: 400 });
  }

  const db = sql();
  const tickets = await db`SELECT id FROM tickets WHERE id = ${ticketId} LIMIT 1`;
  if (!tickets[0]) return NextResponse.json({ error: "Ticket not found." }, { status: 404 });

  if (message) {
    await db`
      INSERT INTO ticket_messages (ticket_id, user_id, role, body)
      VALUES (${ticketId}, ${auth.user.id}, ${"desk"}, ${message})
    `;
  }

  if (status === "open" || status === "resolved") {
    await db`UPDATE tickets SET status = ${status} WHERE id = ${ticketId}`;
  }

  const updated = await db`SELECT * FROM tickets WHERE id = ${ticketId} LIMIT 1`;
  return NextResponse.json({ ticket: updated[0] });
}
