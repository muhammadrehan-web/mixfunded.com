import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/session";

export async function POST() {
  return clearAuthCookie(NextResponse.json({ ok: true }));
}
