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
  const tickets = await db`
    SELECT id, subject, status, created_at FROM tickets
    WHERE user_id = ${auth.user.id}
    ORDER BY created_at DESC
  `;

  const messages = await db`
    SELECT m.id, m.ticket_id, m.role, m.body, m.created_at
    FROM ticket_messages m
    JOIN tickets t ON t.id = m.ticket_id
    WHERE t.user_id = ${auth.user.id}
    ORDER BY m.created_at ASC
  `;

  return NextResponse.json({ tickets, messages });
}

export async function POST(request: Request) {
  const auth = requireUser(request);
  if (auth.error) return auth.error;
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Neon database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const subject = String(body?.subject || "").trim().slice(0, 140);
  const message = String(body?.body || "").trim().slice(0, 4000);

  if (subject.length < 4) {
    return NextResponse.json({ error: "Subject needs at least 4 characters." }, { status: 400 });
  }
  if (message.length < 8) {
    return NextResponse.json({ error: "Describe the issue in a bit more detail." }, { status: 400 });
  }

  const db = sql();
  const ticket = await db`
    INSERT INTO tickets (user_id, subject, status)
    VALUES (${auth.user.id}, ${subject}, ${"open"})
    RETURNING id, subject, status, created_at
  `;
  await db`
    INSERT INTO ticket_messages (ticket_id, user_id, role, body)
    VALUES (${ticket[0].id}, ${auth.user.id}, ${"trader"}, ${message})
  `;
  await db`
    INSERT INTO support_messages (email, role, body)
    VALUES (${auth.user.email}, ${"trader"}, ${`${subject}: ${message}`})
  `;

  return NextResponse.json({ ticket: ticket[0] });
}
