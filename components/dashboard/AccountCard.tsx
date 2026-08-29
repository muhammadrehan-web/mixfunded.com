import { accountProgress, money, pct, type TradingAccount } from "@/lib/dashboard";

export default function AccountCard({ account }: { account: TradingAccount }) {
  const progress = accountProgress(account);
  const statusLabel =
    account.status === "funded" ? "Funded" : account.status === "failed" ? "Failed" : account.phase;

  return (
    <a
      href={`/dashboard/accounts/${account.id}`}
      className="block rounded-[6px] border border-border bg-card p-5 transition hover:border-[color:var(--accent)]/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">
            {account.program} · {account.platform} {account.login}
          </p>
          <p className="mt-1 text-lg font-semibold">${money(account.size, 0)}</p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            account.status === "funded"
              ? "bg-[color:var(--accent)]/15 text-[color:var(--accent)]"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground">Equity</p>
          <p className="font-mono-nums text-xl">${money(account.equity)}</p>
        </div>
        <p className={`font-mono-nums text-sm ${account.profit >= 0 ? "text-[color:var(--accent)]" : "text-red-400"}`}>
          {account.profit >= 0 ? "+" : ""}${money(account.profit)}
        </p>
      </div>
      {account.profitTarget > 0 && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
            <span>Profit target</span>
            <span className="font-mono-nums">{pct(progress, 0)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </a>
  );
}
