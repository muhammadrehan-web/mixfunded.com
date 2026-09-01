"use client";

import { useParams } from "next/navigation";
import EquityChart from "@/components/dashboard/EquityChart";
import StatCard from "@/components/dashboard/StatCard";
import { useApi } from "@/components/dashboard/useApi";
import { accountProgress, money, pct, type Trade, type TradingAccount } from "@/lib/dashboard";
import { equitySeriesFor } from "@/lib/desk";

export default function AccountDetailPage() {
  const params = useParams<{ id: string }>();
  const id = String(params.id || "");
  const { data, error, loading } = useApi<{ account: TradingAccount; trades: Trade[] }>(
    id ? `/api/accounts/${id}` : "/api/accounts",
  );

  if (loading) return <p className="text-sm text-muted-foreground">Loading account…</p>;
  if (error || !data?.account) {
    return <p className="text-sm text-red-400">{error || "Account not found."}</p>;
  }

  const { account, trades } = data;
  const progress = accountProgress(account);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <a href="/dashboard/accounts" className="text-xs text-muted-foreground hover:text-foreground">
          ← Accounts
        </a>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          ${money(account.size, 0)} {account.program}
        </h1>
        <p className="text-sm text-muted-foreground">
          {account.phase} · started {account.started}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Balance" value={`$${money(account.balance)}`} />
        <StatCard label="Equity" value={`$${money(account.equity)}`} />
        <StatCard label="Daily DD" value={`${pct(account.dailyDdUsed)} / ${pct(account.dailyDdLimit, 0)}`} />
        <StatCard label="Max DD" value={`${pct(account.maxDdUsed)} / ${pct(account.maxDdLimit, 0)}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[6px] border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Progress to target</h2>
          {account.profitTarget > 0 ? (
            <>
              <p className="mt-3 font-mono-nums text-3xl">
                ${money(account.profit)} <span className="text-base text-muted-foreground">/ ${money(account.profitTarget, 0)}</span>
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-[color:var(--accent)]" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Trading days {account.tradingDays} / min {account.minTradingDays}
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Funded — no profit target. Payouts every Monday.</p>
          )}
          <div className="mt-6 h-40">
            <EquityChart series={equitySeriesFor(account)} />
          </div>
        </section>

        <section className="rounded-[6px] border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Platform credentials</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Platform" value={account.platform} />
            <Row label="Server" value={account.server} />
            <Row label="Login" value={account.login} mono />
            <Row label="Password" value={account.password} mono />
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">Demo credentials for this desk — not a live broker login.</p>
        </section>
      </div>

      <section className="rounded-[6px] border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">Recent trades</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-2 font-medium">Symbol</th>
                <th className="px-5 py-2 font-medium">Side</th>
                <th className="px-5 py-2 font-medium">Lots</th>
                <th className="px-5 py-2 font-medium">Time</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">PnL</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-muted-foreground" colSpan={6}>
                    No trades yet. Live MT4/MT5 fills are not connected on this demo desk.
                  </td>
                </tr>
              ) : (
                trades.map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-5 py-3 font-medium">{t.symbol}</td>
                    <td className="px-5 py-3 uppercase text-muted-foreground">{t.side}</td>
                    <td className="px-5 py-3 font-mono-nums">{t.lots.toFixed(2)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{t.open}</td>
                    <td className="px-5 py-3 text-muted-foreground">{t.status}</td>
                    <td className={`px-5 py-3 font-mono-nums ${t.pnl >= 0 ? "text-[color:var(--accent)]" : "text-red-400"}`}>
                      {t.pnl >= 0 ? "+" : ""}
                      {money(t.pnl)}
                    </td>
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

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono-nums" : "font-medium"}>{value}</dd>
    </div>
  );
}
