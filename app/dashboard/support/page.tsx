"use client";

import { useState } from "react";

const existing = [
  { id: "s1", title: "MT5 password reset — 8842103", status: "Open", ago: "2h ago" },
  { id: "s2", title: "Payout TXID for 10 Aug", status: "Resolved", ago: "18 Aug" },
];

export default function SupportPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">Human desk, every session. Direct line still works: vladyslav@mixfunded.com</p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("mf-open-chat"))}
          className="mt-3 inline-flex h-9 items-center rounded-[6px] bg-[color:var(--accent)] px-3 text-xs font-semibold text-[color:var(--accent-foreground)]"
        >
          Open live chat
        </button>
      </div>
      <section className="rounded-[6px] border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">New ticket</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input className="h-10 w-full rounded-[6px] border border-border bg-background px-3 text-sm" placeholder="Subject" required />
          <textarea className="min-h-28 w-full rounded-[6px] border border-border bg-background px-3 py-2 text-sm" placeholder="What happened on the account?" required />
          <button type="submit" className="inline-flex h-10 items-center rounded-[6px] bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-foreground)]">
            {sent ? "Ticket sent" : "Send to desk"}
          </button>
        </form>
      </section>
      <section className="rounded-[6px] border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">Your tickets</div>
        <ul>
          {existing.map((t) => (
            <li key={t.id} className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
              <span>{t.title}</span>
              <span className="text-xs text-muted-foreground">
                {t.status} · {t.ago}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
