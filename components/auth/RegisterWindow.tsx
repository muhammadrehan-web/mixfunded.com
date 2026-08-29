"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { writeSession } from "@/lib/auth";

const field =
  "h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none transition focus:border-[color:var(--accent)]/55";

export default function RegisterWindow() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    const terms = data.get("terms") === "on";

    if (!terms) {
      setError("Accept the terms to open a desk.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
          acceptedTerms: true,
        }),
      });
      const payload = (await res.json().catch(() => null)) as { name?: string; email?: string; error?: string } | null;
      if (!res.ok) {
        setError(payload?.error || "Could not create the account.");
        return;
      }
      writeSession({ name: payload?.name || `${firstName} ${lastName}`.trim(), email: payload?.email || email });
      router.push("/dashboard");
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
              Open a MixFunded account.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Register is stored in Neon Postgres. After this window you land on the desk — challenges, payouts, and Monday USDT.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-[color:var(--accent)]">01</span> Challenges from $5
              </li>
              <li className="flex gap-2">
                <span className="text-[color:var(--accent)]">02</span> Payouts every Monday in USDT
              </li>
              <li className="flex gap-2">
                <span className="text-[color:var(--gold)]">03</span> Every TXID on the public ledger
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
          <h1 className="mt-4 text-2xl font-semibold tracking-tight md:mt-0">Create your desk</h1>
          <p className="mt-2 text-sm text-muted-foreground">Backend register — Neon saves this login.</p>

          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs text-muted-foreground">
                First name
                <input name="firstName" className={`${field} mt-1`} autoComplete="given-name" required />
              </label>
              <label className="block text-xs text-muted-foreground">
                Last name
                <input name="lastName" className={`${field} mt-1`} autoComplete="family-name" required />
              </label>
            </div>
            <label className="block text-xs text-muted-foreground">
              Email
              <input name="email" type="email" className={`${field} mt-1`} autoComplete="email" required />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs text-muted-foreground">
                Password
                <input name="password" type="password" className={`${field} mt-1`} autoComplete="new-password" minLength={6} required />
              </label>
              <label className="block text-xs text-muted-foreground">
                Confirm password
                <input name="confirm" type="password" className={`${field} mt-1`} autoComplete="new-password" minLength={6} required />
              </label>
            </div>
            <label className="flex items-start gap-2 pt-1 text-xs leading-5 text-muted-foreground">
              <input name="terms" type="checkbox" className="mt-0.5 accent-[color:var(--accent)]" required />
              <span>
                I am 18+, I accept MixFunded terms, and I understand this is a simulated evaluation desk.
              </span>
            </label>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 w-full items-center justify-center rounded-[6px] bg-[color:var(--accent)] text-sm font-semibold text-[color:var(--accent-foreground)] disabled:opacity-60"
            >
              {pending ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-sm text-muted-foreground">
            Already have a desk?{" "}
            <a href="/login" className="text-[color:var(--accent)]">
              Log in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
