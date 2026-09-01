"use client";

import { useMemo, useState } from "react";
import { useApi } from "@/components/dashboard/useApi";
import { apiJson } from "@/lib/api-client";
import { money, type Payout, type TradingAccount } from "@/lib/dashboard";
import { nextPayoutLabel, type DeskMe } from "@/lib/desk";

export default function PayoutsPage() {
  const desk = useApi<{ me: DeskMe; accounts: TradingAccount[]; payouts: Payout[] }>("/api/desk");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const funded = useMemo(
    () => desk.data?.accounts.filter((a) => a.status === "funded") ?? [],
    [desk.data],
  );
  const eligibleAmount = useMemo(() => {
    const best = [...funded].sort((a, b) => b.profit - a.profit)[0];
    return best ? Math.round(best.profit * 0.8 * 100) / 100 : 0;
  }, [funded]);
  const processing = desk.data?.payouts.some((p) => p.status === "processing");

  async function requestPayout() {
    setPending(true);
    setError("");
    const best = [...funded].sort((a, b) => b.profit - a.profit)[0];
    const result = await apiJson<{ payout: Payout }>("/api/payouts", {
      method: "POST",
      body: JSON.stringify({ accountId: best?.id }),
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await desk.reload();
  }

  if (desk.loading) return <p className="text-sm text-muted-foreground">Loading payouts…</p>;

  const me = desk.data?.me;
  const wallet = me?.wallet_trc20 ? `${me.wallet_trc20.slice(0, 6)}…${me.wallet_trc20.slice(-4)}` : "not set";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payouts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Demo USDT (TRC-20) requests. An admin marks them paid — no on-chain transfer yet.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-[6px] border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--gold)]">Eligible now</p>
          <p className="mt-2 font-mono-nums text-3xl">${money(Math.max(0, eligibleAmount))}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Wallet {wallet} · next window {me?.nextPayout || nextPayoutLabel()}
          </p>
          {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
          <button
            type="button"
            onClick={() => void requestPayout()}
            disabled={pending || processing || eligibleAmount < 50}
            className="mt-5 inline-flex h-10 items-center rounded-[6px] bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-foreground)] disabled:opacity-60"
          >
            {processing ? "Request already queued" : pending ? "Requesting…" : "Request payout"}
          </button>
        </section>
        <section className="rounded-[6px] border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">How Monday works</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
            <li>KYC verified + TRC-20 wallet on Profile.</li>
            <li>Funded account with at least $50 profit share (80%).</li>
            <li>Admin marks the row paid and posts a demo TXID.</li>
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
              {(desk.data?.payouts.length ?? 0) === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-muted-foreground" colSpan={4}>
                    No payout requests yet.
                  </td>
                </tr>
              ) : (
                desk.data?.payouts.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-5 py-3">{p.date}</td>
                    <td className="px-5 py-3 font-mono-nums">${money(p.amount)}</td>
                    <td className="px-5 py-3 capitalize text-muted-foreground">{p.status}</td>
                    <td className="px-5 py-3 font-mono-nums text-xs text-[color:var(--accent)]">{p.tx ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
