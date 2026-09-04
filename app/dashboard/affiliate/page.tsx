"use client";

import { useState } from "react";
import { useApi } from "@/components/dashboard/useApi";
import { money } from "@/lib/dashboard";

type AffiliatePayload = {
  code: string;
  rate: number;
  clicks: number;
  referrals: number;
  pending: number;
  paid: number;
  commissions: {
    id: string;
    trader: string;
    program: string;
    size: string;
    fee: number;
    rate: number;
    amount: number;
    status: string;
    date: string;
  }[];
};

export default function AffiliatePage() {
  const { data, error, loading } = useApi<AffiliatePayload>("/api/affiliate");
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = data?.code ? `${origin}/?ref=${data.code}` : "";

  async function copyLink() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading affiliate desk…</p>;
  if (error || !data) return <p className="text-sm text-red-400">{error || "Could not load affiliates."}</p>;

  const pct = Math.round(data.rate * 100);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Affiliate</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your link. When someone registers and buys a challenge, you earn {pct}% of the fee.
        </p>
      </div>

      <section className="rounded-[6px] border border-border bg-card p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--gold)]">Your link</p>
        <p className="mt-3 break-all font-mono-nums text-sm">{link}</p>
        <button
          type="button"
          onClick={() => void copyLink()}
          className="mt-4 inline-flex h-10 items-center rounded-[6px] bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-foreground)]"
        >
          {copied ? "Copied" : "Copy affiliate link"}
        </button>
        <p className="mt-3 text-xs text-muted-foreground">
          Short link also works: {origin}/r/{data.code}
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Clicks" value={String(data.clicks)} />
        <Stat label="Referrals" value={String(data.referrals)} />
        <Stat label="Pending" value={`$${money(data.pending)}`} />
        <Stat label="Paid" value={`$${money(data.paid)}`} gold />
      </div>

      <section className="rounded-[6px] border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">Commissions</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-2 font-medium">Date</th>
                <th className="px-5 py-2 font-medium">Trader</th>
                <th className="px-5 py-2 font-medium">Order</th>
                <th className="px-5 py-2 font-medium">Fee</th>
                <th className="px-5 py-2 font-medium">Your cut</th>
                <th className="px-5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.commissions.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-muted-foreground" colSpan={6}>
                    No referred orders yet. Share the link above.
                  </td>
                </tr>
              ) : (
                data.commissions.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="px-5 py-3">{row.date}</td>
                    <td className="px-5 py-3">{row.trader}</td>
                    <td className="px-5 py-3">
                      {row.program} · {row.size}
                    </td>
                    <td className="px-5 py-3 font-mono-nums">${money(row.fee, 0)}</td>
                    <td className="px-5 py-3 font-mono-nums text-[color:var(--accent)]">
                      ${money(row.amount)} · {Math.round(row.rate * 100)}%
                    </td>
                    <td className="px-5 py-3 capitalize text-muted-foreground">{row.status}</td>
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

function Stat({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="rounded-[6px] border border-border bg-card p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className={`mt-2 font-mono-nums text-2xl font-semibold ${gold ? "text-[color:var(--gold)]" : ""}`}>{value}</p>
    </div>
  );
}
