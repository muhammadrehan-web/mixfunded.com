"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { writeSession } from "@/lib/auth";
import { TRADER } from "@/lib/dashboard";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    const name = email.toLowerCase() === TRADER.email ? TRADER.name : email.split("@")[0];
    writeSession({ email, name: name.replace(/\b\w/g, (c) => c.toUpperCase()) });
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-[6px] border border-border bg-card p-6">
        <a href="/" className="inline-flex items-center gap-2">
          <Logo />
          <span className="text-lg font-bold">
            Mix<span className="text-[color:var(--accent)]">Funded</span>
          </span>
        </a>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Log in to the desk</h1>
        <p className="mt-2 text-sm text-muted-foreground">Demo login — any password works. Prefill uses the sample trader.</p>
        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input
            name="email"
            type="email"
            defaultValue={TRADER.email}
            className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm"
            placeholder="Email"
            required
          />
          <input
            name="password"
            type="password"
            defaultValue="mixfunded"
            className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm"
            placeholder="Password"
            required
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-[6px] bg-[color:var(--accent)] text-sm font-semibold text-[color:var(--accent-foreground)]">
            Enter dashboard
          </button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          New here?{" "}
          <a href="/register" className="text-[color:var(--accent)]">
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
}
