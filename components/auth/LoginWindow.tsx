"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { writeSession } from "@/lib/auth";
import { safeNextPath } from "@/lib/safe-path";

const field =
  "h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none transition focus:border-[color:var(--accent)]/55";

export default function LoginWindow() {
  const router = useRouter();
  const search = useSearchParams();
  const next = safeNextPath(search.get("next"));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await res.json().catch(() => null)) as { name?: string; email?: string; error?: string } | null;
      if (!res.ok) {
        setError(payload?.error || "Could not log in.");
        return;
      }
      writeSession({ name: payload?.name || email, email: payload?.email || email });
      router.push(next);
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
              Welcome back to MixFunded.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Login checks Neon Postgres. Wrong password stays out. After this window you land on accounts, payouts, and Monday USDT.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-[color:var(--accent)]">01</span> Email + hashed password
              </li>
              <li className="flex gap-2">
                <span className="text-[color:var(--accent)]">02</span> Same desk as register
              </li>
              <li className="flex gap-2">
                <span className="text-[color:var(--gold)]">03</span> Session opens the dashboard
              </li>
            </ul>
          </div>
        </aside>

        <div className="p-6 md:p-8">
          <a href="/" className="inline-flex items-center gap-2 md:hidden">
            <Logo />
            <span className="text-lg font-bold">
              Mix<span className="text-[color:var(--accent)]">Funded</span>
            </span>
          </a>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight md:mt-0">Log in to your desk</h1>
          <p className="mt-2 text-sm text-muted-foreground">Backend login — Neon verifies this account.</p>

          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <label className="block text-xs text-muted-foreground">
              Email
              <input name="email" type="email" className={`${field} mt-1`} autoComplete="email" required />
            </label>
            <label className="block text-xs text-muted-foreground">
              Password
              <input name="password" type="password" className={`${field} mt-1`} autoComplete="current-password" required />
            </label>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 w-full items-center justify-center rounded-[6px] bg-[color:var(--accent)] text-sm font-semibold text-[color:var(--accent-foreground)] disabled:opacity-60"
            >
              {pending ? "Checking…" : "Enter dashboard"}
            </button>
          </form>

          <p className="mt-5 text-sm text-muted-foreground">
            New here?{" "}
            <a href={next !== "/dashboard" ? `/register?next=${encodeURIComponent(next)}` : "/register"} className="text-[color:var(--accent)]">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
