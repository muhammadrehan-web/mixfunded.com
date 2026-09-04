"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { SITE } from "@/lib/site";

type Msg = { id: string; from: "desk" | "you"; text: string };

const STORAGE = "mf-support-chat-v2";

const STARTER: Msg[] = [
  {
    id: "m0",
    from: "desk",
    text: "Hi — MixFunded desk here. Challenges, payouts, KYC, affiliates, or the rulebook — ask away. Account-specific issues can go to Dashboard → Support.",
  },
];

const QUICK = [
  { label: "Challenges", prompt: "How do challenges work?" },
  { label: "Payouts", prompt: "When do payouts land?" },
  { label: "Rules", prompt: "What are the trading rules?" },
  { label: "KYC", prompt: "Do I need KYC?" },
];

function historyFrom(messages: Msg[], extra: string) {
  const turns = messages
    .filter((m) => m.id !== "m0")
    .map((m) => ({
      role: m.from === "you" ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));
  turns.push({ role: "user", content: extra });
  return turns.slice(-12);
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const [unread, setUnread] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>(STARTER);
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    const openChat = () => {
      openRef.current = true;
      setOpen(true);
      setUnread(false);
    };
    window.addEventListener("mf-open-chat", openChat);
    return () => window.removeEventListener("mf-open-chat", openChat);
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const history = historyFrom(messages, trimmed);
    setMessages((prev) => [...prev, { id: `y-${Date.now()}`, from: "you", text: trimmed }]);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const payload = (await res.json().catch(() => null)) as { reply?: string; error?: string } | null;
      const reply =
        payload?.reply ||
        payload?.error ||
        "Desk is busy. Email support@mixfunded.com or open Dashboard → Support.";
      setMessages((prev) => [...prev, { id: `d-${Date.now()}`, from: "desk", text: reply }]);
      if (!openRef.current) setUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `d-${Date.now()}`,
          from: "desk",
          text: "Could not reach the desk. Email support@mixfunded.com or open Dashboard → Support.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3">
      {open && (
        <section
          className="mf-chat-window flex h-[min(560px,calc(100vh-7rem))] w-[min(100vw-1.5rem,380px)] flex-col overflow-hidden rounded-[6px] border border-border bg-card shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          role="dialog"
          aria-label="MixFunded support chat"
        >
          <header className="flex items-center gap-3 border-b border-border bg-[#141917] px-4 py-3">
            <Logo className="h-8 w-8 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-none text-foreground">MixFunded Support</p>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                AI desk · Groq
              </p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => {
                openRef.current = false;
                setOpen(false);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-[6px] px-3 py-2 text-[13px] leading-5 ${
                    m.from === "you"
                      ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                      : "border border-border bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-[6px] border border-border bg-muted px-3 py-2 text-[13px] text-muted-foreground">
                Desk is typing…
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => send(item.prompt)}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-[color:var(--accent)]/50 hover:text-foreground"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} className="border-t border-border bg-[#141917] p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Ask about payouts, rules, KYC…"
                className="max-h-24 min-h-10 flex-1 resize-none rounded-[6px] border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]/50"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <a href={`mailto:${SITE.email}`} className="mt-2 block text-center text-[10px] text-muted-foreground hover:text-[color:var(--accent)]">
              Or email {SITE.email}
            </a>
          </form>
        </section>
      )}

      <button
        type="button"
        aria-label={open ? "Close support chat" : "Open support chat"}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => {
            const next = !v;
            openRef.current = next;
            return next;
          });
          setUnread(false);
        }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--accent)]/40 bg-background/90 text-[color:var(--accent)] shadow-[0_8px_32px_rgba(63,182,139,0.25)] backdrop-blur transition hover:scale-105"
      >
        {unread && !open && (
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[color:var(--gold)]" />
        )}
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
          </svg>
        )}
      </button>
    </div>
  );
}
