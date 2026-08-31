"use client";

import { FormEvent, useState } from "react";
import Logo from "@/components/Logo";

const field =
  "h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none transition focus:border-[color:var(--accent)]/55";

export default function ForgotPasswordWindow() {
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    if (!email) {
      setError("Email is required.");
      return;
    }

    setPending(true);
    setError("");
    setDone("");
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await res.json().catch(() => null)) as { message?: string; error?: string } | null;
      if (!res.ok) {
        setError(payload?.error || "Could not send the reset mail.");
        return;
      }
      setDone(payload?.message || "If that email has a MixFunded desk, a reset link is on the way.");
    } catch {
      setError("Could not reach the MixFunded backend.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="w-full max-w-[980px] overflow-hidden rounded-[6px] border border-border bg-card shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
      <div className="grid md:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden overflow-hidden border-b border-border bg-[#141917] p-8 md:block md:border-b-0 md:border-r">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[color:var(--accent)]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-52 w-52 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
          <div className="relative">
            <Logo className="h-10 w-10" />
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--accent)]">
              Trader desk
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Reset your MixFunded password.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              We send a one-hour Gmail link. The token is hashed in Neon. Your old password stays until you finish the reset.
            </p>
          </div>
        </aside>

        <div className="p-6 md:p-8">
          <a href="/" className="inline-flex items-center gap-2 md:hidden">
            <Logo />
            <span className="text-lg font-bold">
              Mix<span className="text-[color:var(--accent)]">Funded</span>
            </span>
          </a>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight md:mt-0">Forgot password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter the email you registered with.</p>

          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <label className="block text-xs text-muted-foreground">
              Email
              <input name="email" type="email" className={`${field} mt-1`} autoComplete="email" required />
            </label>
            {error && <p className="text-xs text-red-400">{error}</p>}
            {done && <p className="text-xs text-[color:var(--accent)]">{done}</p>}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 w-full items-center justify-center rounded-[6px] bg-[color:var(--accent)] text-sm font-semibold text-[color:var(--accent-foreground)] disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send reset link"}
            </button>
          </form>

          <p className="mt-5 text-sm text-muted-foreground">
            Remembered it?{" "}
            <a href="/login" className="text-[color:var(--accent)]">
              Log in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
