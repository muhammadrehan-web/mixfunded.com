"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";

const field =
  "h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none transition focus:border-[color:var(--accent)]/55";

export default function ResetPasswordWindow() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token") || "";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("This reset link is missing a token.");
      return;
    }

    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(payload?.error || "Could not reset the password.");
        return;
      }
      router.push("/login");
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
              Choose a new password.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              After this window you log in with the new password. The reset link works once.
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
          <h1 className="mt-4 text-2xl font-semibold tracking-tight md:mt-0">Set a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">At least 6 characters. Then you land on login.</p>

          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <label className="block text-xs text-muted-foreground">
              New password
              <input name="password" type="password" className={`${field} mt-1`} autoComplete="new-password" minLength={6} required />
            </label>
            <label className="block text-xs text-muted-foreground">
              Confirm password
              <input name="confirm" type="password" className={`${field} mt-1`} autoComplete="new-password" minLength={6} required />
            </label>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={pending || !token}
              className="inline-flex h-11 w-full items-center justify-center rounded-[6px] bg-[color:var(--accent)] text-sm font-semibold text-[color:var(--accent-foreground)] disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save password"}
            </button>
          </form>

          <p className="mt-5 text-sm text-muted-foreground">
            Back to{" "}
            <a href="/login" className="text-[color:var(--accent)]">
              log in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
