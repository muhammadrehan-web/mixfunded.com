"use client";

import { FormEvent, useState } from "react";
import { useApi } from "@/components/dashboard/useApi";
import { apiJson } from "@/lib/api-client";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  kyc_status: string;
  wallet_trc20: string | null;
  country: string | null;
};
type AdminAccount = {
  id: string;
  login: string;
  email: string;
  name: string;
  program: string;
  size: string | number;
  status: string;
  profit: string | number;
};
type AdminPayout = {
  id: string;
  email: string;
  name: string;
  login: string;
  amount: string | number;
  status: string;
  tx: string | null;
};
type AdminTicket = {
  id: string;
  email: string;
  name: string;
  subject: string;
  status: string;
};

export default function AdminPage() {
  const { data, error, loading, reload } = useApi<{
    users: AdminUser[];
    accounts: AdminAccount[];
    payouts: AdminPayout[];
    tickets: AdminTicket[];
  }>("/api/admin/desk");
  const [notice, setNotice] = useState("");

  async function patch(url: string, body: Record<string, unknown>) {
    setNotice("");
    const result = await apiJson(url, { method: "PATCH", body: JSON.stringify(body) });
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    await reload();
  }

  async function replyTicket(e: FormEvent<HTMLFormElement>, ticketId: string) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = String(new FormData(form).get("body") || "");
    await patch("/api/admin/tickets", { ticketId, body, status: "open" });
    form.reset();
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading admin desk…</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--gold)]">Operations</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Admin desk</h1>
        <p className="mt-1 text-sm text-muted-foreground">KYC, pass/fail, payouts, and support — stored in Neon.</p>
      </div>
      {notice && <p className="text-sm text-red-400">{notice}</p>}

      <section className="rounded-[6px] border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">KYC</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-2 font-medium">Trader</th>
                <th className="px-5 py-2 font-medium">Country</th>
                <th className="px-5 py-2 font-medium">Wallet</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-5 py-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{user.country || "—"}</td>
                  <td className="px-5 py-3 font-mono-nums text-xs">{user.wallet_trc20 || "—"}</td>
                  <td className="px-5 py-3 capitalize">{user.kyc_status}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {["verified", "pending", "rejected"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => void patch("/api/admin/kyc", { userId: user.id, kyc_status: status })}
                          className="rounded-[6px] border border-border px-2 py-1 text-[11px] capitalize hover:border-[color:var(--accent)]/50"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[6px] border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">Accounts</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-2 font-medium">Login</th>
                <th className="px-5 py-2 font-medium">Trader</th>
                <th className="px-5 py-2 font-medium">Program</th>
                <th className="px-5 py-2 font-medium">Profit</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">Set</th>
              </tr>
            </thead>
            <tbody>
              {data?.accounts.map((account) => (
                <tr key={account.id} className="border-t border-border">
                  <td className="px-5 py-3 font-mono-nums">{account.login}</td>
                  <td className="px-5 py-3">
                    {account.name}
                    <span className="block text-xs text-muted-foreground">{account.email}</span>
                  </td>
                  <td className="px-5 py-3">
                    {account.program} · ${Number(account.size).toLocaleString("en-US")}
                  </td>
                  <td className="px-5 py-3 font-mono-nums">${Number(account.profit)}</td>
                  <td className="px-5 py-3 capitalize">{account.status}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {["evaluation", "passed", "funded", "failed"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => void patch("/api/admin/accounts", { accountId: account.id, status })}
                          className="rounded-[6px] border border-border px-2 py-1 text-[11px] capitalize hover:border-[color:var(--accent)]/50"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[6px] border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">Payouts</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-2 font-medium">Trader</th>
                <th className="px-5 py-2 font-medium">Login</th>
                <th className="px-5 py-2 font-medium">Amount</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {(data?.payouts.length ?? 0) === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-muted-foreground" colSpan={5}>
                    No payout requests.
                  </td>
                </tr>
              ) : (
                data?.payouts.map((payout) => (
                  <tr key={payout.id} className="border-t border-border">
                    <td className="px-5 py-3">
                      {payout.name}
                      <span className="block text-xs text-muted-foreground">{payout.email}</span>
                    </td>
                    <td className="px-5 py-3 font-mono-nums">{payout.login}</td>
                    <td className="px-5 py-3 font-mono-nums">${Number(payout.amount)}</td>
                    <td className="px-5 py-3 capitalize">{payout.status}</td>
                    <td className="px-5 py-3">
                      {payout.status !== "paid" && (
                        <button
                          type="button"
                          onClick={() => void patch("/api/admin/payouts", { payoutId: payout.id, status: "paid" })}
                          className="rounded-[6px] border border-border px-2 py-1 text-[11px] hover:border-[color:var(--accent)]/50"
                        >
                          Mark paid
                        </button>
                      )}
                      {payout.tx && <p className="mt-1 font-mono-nums text-[11px] text-[color:var(--accent)]">{payout.tx}</p>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[6px] border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">Tickets</div>
        <ul>
          {(data?.tickets.length ?? 0) === 0 ? (
            <li className="px-5 py-6 text-sm text-muted-foreground">No tickets.</li>
          ) : (
            data?.tickets.map((ticket) => (
              <li key={ticket.id} className="border-t border-border px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.name} · {ticket.email} · {ticket.status}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void patch("/api/admin/tickets", { ticketId: ticket.id, status: "resolved" })}
                    className="rounded-[6px] border border-border px-2 py-1 text-[11px]"
                  >
                    Resolve
                  </button>
                </div>
                <form className="mt-3 flex gap-2" onSubmit={(e) => void replyTicket(e, ticket.id)}>
                  <input
                    name="body"
                    className="h-9 flex-1 rounded-[6px] border border-border bg-background px-3 text-sm"
                    placeholder="Reply from desk"
                  />
                  <button type="submit" className="rounded-[6px] bg-[color:var(--accent)] px-3 text-xs font-semibold text-[color:var(--accent-foreground)]">
                    Reply
                  </button>
                </form>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
