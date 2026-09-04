import { NextResponse } from "next/server";
import { SUPPORT_SYSTEM_PROMPT } from "@/lib/support-prompt";

export const runtime = "nodejs";

type ChatTurn = { role: "user" | "assistant"; content: string };

function isTurn(value: unknown): value is ChatTurn {
  if (!value || typeof value !== "object") return false;
  const turn = value as ChatTurn;
  return (turn.role === "user" || turn.role === "assistant") && typeof turn.content === "string";
}

export async function POST(request: Request) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Groq is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const incoming = Array.isArray(body?.messages) ? body.messages.filter(isTurn) : [];
  const messages: ChatTurn[] = incoming
    .map((turn: ChatTurn) => ({ role: turn.role, content: turn.content.trim().slice(0, 2000) }))
    .filter((turn: ChatTurn) => Boolean(turn.content))
    .slice(-12);

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "Send a question first." }, { status: 400 });
  }

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 400,
      messages: [{ role: "system", content: SUPPORT_SYSTEM_PROMPT }, ...messages],
    }),
  });

  const payload = (await res.json().catch(() => null)) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  } | null;

  if (!res.ok) {
    console.error("Groq chat failed", payload?.error?.message || res.status);
    return NextResponse.json(
      { error: "Desk is busy. Email support@mixfunded.com or open Dashboard → Support." },
      { status: 502 },
    );
  }

  const reply = String(payload?.choices?.[0]?.message?.content || "").trim();
  if (!reply) {
    return NextResponse.json(
      { error: "No reply came back. Try again or open Dashboard → Support." },
      { status: 502 },
    );
  }

  return NextResponse.json({ reply });
}
