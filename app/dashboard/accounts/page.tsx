"use client";

import AccountCard from "@/components/dashboard/AccountCard";
import { useApi } from "@/components/dashboard/useApi";
import type { TradingAccount } from "@/lib/dashboard";

export default function AccountsPage() {
  const { data, error, loading } = useApi<{ accounts: TradingAccount[] }>("/api/accounts");

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every evaluation and funded account on this login.</p>
      {loading && <p className="mt-6 text-sm text-muted-foreground">Loading accounts…</p>}
      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      {!loading && !error && (data?.accounts.length ?? 0) === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No accounts yet.{" "}
          <a href="/dashboard/challenges" className="text-[color:var(--accent)]">
            Start a challenge
          </a>
          .
        </p>
      )}
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {data?.accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
