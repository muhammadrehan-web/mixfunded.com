"use client";

import { FormEvent, useState } from "react";
import { useApi } from "@/components/dashboard/useApi";
import { apiJson } from "@/lib/api-client";
import { timeAgo } from "@/lib/desk";

type Ticket = { id: string; subject: string; status: string; created_at: string };
type Message = { id: string; ticket_id: string; role: string; body: string; created_at: string };

export default function SupportPage() {
  const { data, error, loading, reload } = useApi<{ tickets: Ticket[]; messages: Message[] }>("/api/tickets");
  const [sentError, setSentError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = new FormData(form);
    setPending(true);
    setSentError("");
    const result = await apiJson<{ ticket: Ticket }>("/api/tickets", {
      method: "POST",
      body: JSON.stringify({
        subject: String(payload.get("subject") || ""),
        body: String(payload.get("body") || ""),
      }),
    });
    setPending(false);
    if (!result.ok) {
      setSentError(result.error);
      return;
    }
    form.reset();
    await reload();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tickets are stored in Neon. Direct line still works: vladyslav@mixfunded.com
        </p>
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
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <input name="subject" className="h-10 w-full rounded-[6px] border border-border bg-background px-3 text-sm" placeholder="Subject" required />
          <textarea name="body" className="min-h-28 w-full rounded-[6px] border border-border bg-background px-3 py-2 text-sm" placeholder="What happened on the account?" required />
          {sentError && <p className="text-xs text-red-400">{sentError}</p>}
          <button type="submit" disabled={pending} className="inline-flex h-10 items-center rounded-[6px] bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-foreground)] disabled:opacity-60">
            {pending ? "Sending…" : "Send to desk"}
          </button>
        </form>
      </section>
      <section className="rounded-[6px] border border-border bg-card">
        <div className="border-b border-border px-5 py-3 text-sm font-semibold">Your tickets</div>
        {loading && <p className="px-5 py-4 text-sm text-muted-foreground">Loading tickets…</p>}
        {error && <p className="px-5 py-4 text-sm text-red-400">{error}</p>}
        <ul>
          {(data?.tickets.length ?? 0) === 0 && !loading ? (
            <li className="px-5 py-6 text-sm text-muted-foreground">No tickets yet.</li>
          ) : (
            data?.tickets.map((t) => {
              const thread = data.messages.filter((m) => m.ticket_id === t.id);
              return (
                <li key={t.id} className="border-t border-border px-5 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span>{t.subject}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.status} · {timeAgo(t.created_at)}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {thread.map((m) => (
                      <p key={m.id}>
                        <span className="font-medium text-foreground">{m.role}:</span> {m.body}
                      </p>
                    ))}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}
