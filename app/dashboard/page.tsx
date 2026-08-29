import AccountCard from "@/components/dashboard/AccountCard";
import EquityChart from "@/components/dashboard/EquityChart";
import StatCard from "@/components/dashboard/StatCard";
import { ACCOUNTS, ANNOUNCEMENTS, TRADER, TRADES, money, pct } from "@/lib/dashboard";

export default function DashboardHome() {
  const primary = ACCOUNTS[0];
  const funded = ACCOUNTS.filter((a) => a.status === "funded");
  const openTrades = TRADES.filter((t) => t.status === "open");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">Trader desk</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Welcome back, {TRADER.name.split(" ")[1]}.</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Next payout window: {TRADER.nextPayout} · USDT TRC-20
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active equity" value={`$${money(primary.equity)}`} hint={`$100k 1-Phase · ${primary.platform}`} />
        <StatCard label="Open profit" value={`+$${money(primary.profit)}`} hint={`${pct((primary.profit / primary.size) * 100)} of starting balance`} />
        <StatCard label="Daily drawdown used" value={pct(primary.dailyDdUsed)} hint={`Limit ${pct(primary.dailyDdLimit, 0)}`} />
        <StatCard label="Funded accounts" value={String(funded.length)} hint="Eligible for Monday payouts" gold />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-[6px] border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Equity — {primary.login}</h2>
            <span className="font-mono-nums text-xs text-[color:var(--accent)]">+{pct((primary.profit / primary.size) * 100)}</span>
          </div>
          <div className="h-44">
            <EquityChart />
          </div>
        </section>
        <section className="rounded-[6px] border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Desk notes</h2>
          <ul className="mt-4 space-y-4">
            {ANNOUNCEMENTS.map((note) => (
              <li key={note.title}>
                <p className="text-sm font-medium">{note.title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{note.body}</p>
              </li>
            ))}
          </ul>
          <a href="/dashboard/challenges" className="mt-6 inline-flex h-9 items-center rounded-[6px] bg-[color:var(--accent)] px-3 text-xs font-semibold text-[color:var(--accent-foreground)]">
            Start another challenge
          </a>
        </section>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Accounts</h2>
          <a href="/dashboard/accounts" className="text-xs text-[color:var(--accent)]">
            View all
          </a>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {ACCOUNTS.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>

      <section className="rounded-[6px] border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">Open positions</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-2 font-medium">Symbol</th>
                <th className="px-5 py-2 font-medium">Side</th>
                <th className="px-5 py-2 font-medium">Lots</th>
                <th className="px-5 py-2 font-medium">Opened</th>
                <th className="px-5 py-2 font-medium">PnL</th>
              </tr>
            </thead>
            <tbody>
              {openTrades.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{t.symbol}</td>
                  <td className="px-5 py-3 uppercase text-muted-foreground">{t.side}</td>
                  <td className="px-5 py-3 font-mono-nums">{t.lots.toFixed(2)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{t.open}</td>
                  <td className={`px-5 py-3 font-mono-nums ${t.pnl >= 0 ? "text-[color:var(--accent)]" : "text-red-400"}`}>
                    {t.pnl >= 0 ? "+" : ""}
                    {money(t.pnl)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
