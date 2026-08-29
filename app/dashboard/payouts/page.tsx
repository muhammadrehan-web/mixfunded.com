"use client";

import { useState } from "react";
import { PAYOUTS, TRADER, money } from "@/lib/dashboard";

export default function PayoutsPage() {
  const [requested, setRequested] = useState(false);
  const eligible = PAYOUTS.find((p) => p.status === "eligible");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payouts</h1>
        <p className="mt-1 text-sm text-muted-foreground">USDT (TRC-20) every Monday. Every paid row publishes a TXID.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-[6px] border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--gold)]">Eligible now</p>
          <p className="mt-2 font-mono-nums text-3xl">${money(eligible?.amount ?? 0)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Wallet {TRADER.wallet} · next window {TRADER.nextPayout}</p>
          <button
            type="button"
            onClick={() => setRequested(true)}
            disabled={requested}
            className="mt-5 inline-flex h-10 items-center rounded-[6px] bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-foreground)] disabled:opacity-60"
          >
            {requested ? "Request queued for Monday" : "Request payout"}
          </button>
        </section>
        <section className="rounded-[6px] border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">How Monday works</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
            <li>Request before Sunday 18:00 UTC from a funded account.</li>
            <li>We settle USDT on TRC-20 the next Monday.</li>
            <li>The TXID is posted on your row and on the public ledger.</li>
          </ol>
        </section>
      </div>

      <section className="rounded-[6px] border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">History</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-2 font-medium">Date</th>
                <th className="px-5 py-2 font-medium">Amount</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">TXID</th>
              </tr>
            </thead>
            <tbody>
              {PAYOUTS.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-5 py-3">{p.date}</td>
                  <td className="px-5 py-3 font-mono-nums">${money(p.amount)}</td>
                  <td className="px-5 py-3 capitalize text-muted-foreground">{p.status}</td>
                  <td className="px-5 py-3 font-mono-nums text-xs text-[color:var(--accent)]">{p.tx ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
