"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { apiJson } from "@/lib/api-client";
import { readSession, type Session } from "@/lib/auth";
import { findPlan, PLATFORMS, PROGRAMS, type Platform } from "@/lib/data";

const field =
  "h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none transition focus:border-[color:var(--accent)]/55";

export default function CheckoutWindow() {
  const router = useRouter();
  const search = useSearchParams();
  const programId = search.get("program") || "";
  const size = search.get("size") || "";
  const matched = useMemo(() => findPlan(programId, size), [programId, size]);

  const [session, setSession] = useState<Session | null>(null);
  const [platform, setPlatform] = useState<Platform>("MT5");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const current = readSession();
    if (current) {
      setSession(current);
      return;
    }
    apiJson<{ name: string; email: string }>("/api/me").then((result) => {
      if (!result.ok) {
        const next = `${window.location.pathname}${window.location.search}`;
        router.replace(`/login?next=${encodeURIComponent(next)}`);
        return;
      }
      setSession({ name: result.data.name, email: result.data.email });
    });
  }, [router]);

  async function onPay(e: FormEvent) {
    e.preventDefault();
    if (!session || !matched) return;
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId: matched.program.id,
          size: matched.plan.size,
          platform,
        }),
      });
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(payload?.error || "Could not create the order.");
        return;
      }
      router.push("/dashboard/orders?placed=1");
    } catch {
      setError("Could not reach the MixFunded backend.");
    } finally {
      setPending(false);
    }
  }

  if (!session) {
    return (
      <section className="mx-auto w-full max-w-md rounded-[6px] border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Opening checkout…
      </section>
    );
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
              Challenge order
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Create a MixFunded order.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Demo USDT checkout. No crypto leaves your wallet. The order is stored in Neon and listed on the desk.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-[color:var(--accent)]">01</span> Pick program + size
              </li>
              <li className="flex gap-2">
                <span className="text-[color:var(--accent)]">02</span> Choose MT4 or MT5
              </li>
              <li className="flex gap-2">
                <span className="text-[color:var(--gold)]">03</span> Pay (demo) — order is paid
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
          <h1 className="mt-4 text-2xl font-semibold tracking-tight md:mt-0">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Logged in as {session.email}. Demo USDT — no on-chain transfer.
          </p>

          {!matched ? (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Select a challenge to continue.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {PROGRAMS.map((program) => (
                  <div key={program.id} className="rounded-[6px] border border-border p-3">
                    <p className="text-sm font-semibold">{program.label}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {program.plans.map((plan) => (
                        <a
                          key={plan.size}
                          href={plan.href}
                          className="rounded-[6px] border border-border px-2 py-1 text-[11px] text-muted-foreground hover:border-[color:var(--accent)] hover:text-foreground"
                        >
                          {plan.size} · ${plan.fee}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={onPay}>
              <div className="rounded-[6px] border border-border bg-background p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  {matched.program.label}
                </p>
                <p className="mt-2 font-mono-nums text-2xl font-semibold">{matched.plan.size}</p>
                <p className="mt-1 font-mono-nums text-xl text-[color:var(--accent)]">
                  ${matched.plan.fee} <span className="text-xs text-muted-foreground">USDT</span>
                </p>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <li>Leverage {matched.plan.leverage}</li>
                  <li>Profit target {matched.plan.profitTarget}</li>
                  <li>Daily DD {matched.plan.dailyDrawdown}</li>
                  <li>Max DD {matched.plan.maxDrawdown}</li>
                  <li>Split {matched.plan.split}</li>
                </ul>
              </div>

              <label className="block text-xs text-muted-foreground">
                Platform
                <select
                  className={`${field} mt-1`}
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                >
                  {PLATFORMS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-11 w-full items-center justify-center rounded-[6px] bg-[color:var(--accent)] text-sm font-semibold text-[color:var(--accent-foreground)] disabled:opacity-60"
              >
                {pending ? "Creating order…" : `Pay $${matched.plan.fee} USDT (demo)`}
              </button>
              <p className="text-xs text-muted-foreground">
                This does not send real USDT. The order is marked paid in Neon.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
