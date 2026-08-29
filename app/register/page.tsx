"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { writeSession } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "Trader").trim();
    const email = String(data.get("email") || "").trim();
    writeSession({ name, email });
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
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Create your desk</h1>
        <p className="mt-2 text-sm text-muted-foreground">Demo registration — stored only in this browser.</p>
        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input name="name" className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm" placeholder="Full name" required />
          <input name="email" type="email" className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm" placeholder="Email" required />
          <input name="password" type="password" className="h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm" placeholder="Password" required />
          <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-[6px] bg-[color:var(--accent)] text-sm font-semibold text-[color:var(--accent-foreground)]">
            Create account
          </button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already trading?{" "}
          <a href="/login" className="text-[color:var(--accent)]">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
